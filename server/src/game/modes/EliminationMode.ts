import {
  GameMode,
  ModeConfig,
  ModeGameState,
  RoundStartResult,
  BuzzerResult,
  AnswerResult,
  TimeoutResult,
  AfterRevealResult,
  AfterScoreboardResult,
} from './GameMode';
import { GameSettings, RoundResult, ClientGameState } from '@shared/types/game';
import { GameModeId } from '@shared/types/gameMode';
import { EnrichedSong } from '../../services/itunesService';
import { verifyAnswer } from '../answerVerifier';
import { getRandomPrompt, getTeamPrompt, getEliminationPrompt } from '../../data/drinkingPrompts';
import { TEAM_NAMES } from '@shared/types/team';

export interface EliminationModeState {
  eliminatedIds: string[];       // permanently eliminated player IDs
  eliminatedTeamIds: number[];   // permanently eliminated team IDs
  lastChanceUsed: boolean;       // only one Last Chance per game
  isLastChanceRound: boolean;    // currently in a Last Chance round
  subMode: 'last-one-standing' | 'fixed-rounds';
}

export class EliminationMode implements GameMode {
  readonly id: GameModeId = 'elimination';
  readonly displayName: string = 'Elimination';
  readonly config: ModeConfig = {
    usesAudio: true,
    buzzingDuration: 30,
    preRoundDuration: 3,
    revealDuration: 5,
    scoreboardDuration: 5,
    minPlayers: 4,
    songsNeeded: (roundCount) => roundCount + 5, // extra songs for potential extra rounds
  };

  initialize(settings: GameSettings, _songs: EnrichedSong[], _playerIds: string[]): Record<string, unknown> {
    return {
      eliminatedIds: [],
      eliminatedTeamIds: [],
      lastChanceUsed: false,
      isLastChanceRound: false,
      subMode: settings.eliminationSubMode || 'last-one-standing',
    } satisfies EliminationModeState as unknown as Record<string, unknown>;
  }

  private getState(state: ModeGameState): EliminationModeState {
    return (state.modeState as unknown) as EliminationModeState;
  }

  private getAlivePlayerIds(state: ModeGameState): string[] {
    const elimState = this.getState(state);
    const connected = state.getConnectedPlayerIds();
    return connected.filter((id) => !elimState.eliminatedIds.includes(id));
  }

  private getAliveTeamIds(state: ModeGameState): number[] {
    const elimState = this.getState(state);
    const allTeamIds = new Set<number>();
    for (const [, teamId] of state.teamAssignments) {
      allTeamIds.add(teamId);
    }
    return Array.from(allTeamIds).filter((id) => !elimState.eliminatedTeamIds.includes(id));
  }

  onRoundStart(state: ModeGameState): RoundStartResult {
    const song = state.songs[state.currentRound];
    return {
      playingDuration: state.settings.timePerRound,
      previewUrl: song.previewUrl,
    };
  }

  onBuzzerPress(state: ModeGameState, playerId: string): BuzzerResult {
    if (state.phase !== 'playing') return { accepted: false, error: 'Buzzer not active' };
    if (state.disqualifiedIds.includes(playerId)) return { accepted: false, error: 'Already guessed wrong' };
    if (state.buzzedPlayerId) return { accepted: false, error: 'Someone already buzzed' };
    const playerScore = state.scores.get(playerId);
    if (!playerScore) return { accepted: false, error: 'Player not in game' };

    const elimState = this.getState(state);

    // During Last Chance, only eliminated players can buzz
    if (elimState.isLastChanceRound) {
      if (!elimState.eliminatedIds.includes(playerId)) {
        return { accepted: false, error: 'Only eliminated players can buzz during Last Chance' };
      }
      return { accepted: true };
    }

    // Normal round — eliminated players can't buzz
    if (elimState.eliminatedIds.includes(playerId)) {
      return { accepted: false, error: 'You have been eliminated' };
    }

    return { accepted: true };
  }

  onAnswerSubmit(
    state: ModeGameState,
    playerId: string,
    answer: { artist: string; title: string }
  ): AnswerResult {
    const currentSong = state.songs[state.currentRound];
    const elimState = this.getState(state);

    const result = verifyAnswer(answer, {
      artist: currentSong.artist,
      title: currentSong.title,
    });

    if (result.points > 0) {
      const playerScore = state.scores.get(playerId)!;
      const roundResult: RoundResult = {
        songTitle: currentSong.title,
        songArtist: currentSong.artist,
        albumArtUrl: currentSong.albumArtUrl,
        winnerId: playerId,
        winnerName: playerScore.displayName,
        pointsAwarded: result.points,
        answerType: result.artistCorrect && result.titleCorrect ? 'both'
          : result.titleCorrect ? 'title'
          : 'artist',
      };

      // Last Chance: correct answer un-eliminates the player
      if (elimState.isLastChanceRound) {
        // The un-elimination is handled by GameManager when it processes this result
        return {
          correct: true,
          points: result.points,
          artistCorrect: result.artistCorrect,
          titleCorrect: result.titleCorrect,
          nextAction: { type: 'reveal' },
          roundResult,
          drinkingPrompt: this.getDrinkingPrompt(state, true, playerScore.displayName, playerId),
        };
      }

      return {
        correct: true,
        points: result.points,
        artistCorrect: result.artistCorrect,
        titleCorrect: result.titleCorrect,
        nextAction: { type: 'elimination-reveal' },
        roundResult,
        drinkingPrompt: this.getDrinkingPrompt(state, true, playerScore.displayName, playerId),
      };
    }

    // Wrong answer in elimination = permanent elimination
    // The actual elimination is applied by GameManager
    const disqualifiedIds = this.getDisqualifiedAfterWrong(state, playerId);
    const aliveIds = this.getAlivePlayerIds(state);
    const remainingAlive = aliveIds.filter((id) => !disqualifiedIds.includes(id));

    // Last Chance: wrong answer = stay eliminated, done
    if (elimState.isLastChanceRound) {
      if (remainingAlive.length === 0) {
        return {
          correct: false,
          points: 0,
          artistCorrect: result.artistCorrect,
          titleCorrect: result.titleCorrect,
          nextAction: { type: 'reveal' },
          roundResult: this.buildNoWinnerResult(state),
          drinkingPrompt: this.getDrinkingPrompt(state, false),
        };
      }
      return {
        correct: false,
        points: 0,
        artistCorrect: result.artistCorrect,
        titleCorrect: result.titleCorrect,
        nextAction: { type: 'play' },
      };
    }

    if (remainingAlive.length === 0) {
      return {
        correct: false,
        points: 0,
        artistCorrect: result.artistCorrect,
        titleCorrect: result.titleCorrect,
        nextAction: { type: 'elimination-reveal' },
        roundResult: this.buildNoWinnerResult(state),
        drinkingPrompt: this.getDrinkingPrompt(state, false),
      };
    }

    return {
      correct: false,
      points: 0,
      artistCorrect: result.artistCorrect,
      titleCorrect: result.titleCorrect,
      nextAction: { type: 'play' },
    };
  }

  onPlayingTimeout(state: ModeGameState): TimeoutResult {
    const elimState = this.getState(state);

    // Last Chance timeout — round over, no one un-eliminated
    if (elimState.isLastChanceRound) {
      return {
        nextAction: { type: 'reveal' },
        roundResult: this.buildNoWinnerResult(state),
        drinkingPrompt: this.getDrinkingPrompt(state, false),
      };
    }

    // Last One Standing: nobody buzzed → eliminate lowest scorer
    if (elimState.subMode === 'last-one-standing') {
      return {
        nextAction: { type: 'elimination-reveal' },
        roundResult: this.buildNoWinnerResult(state),
        drinkingPrompt: this.getDrinkingPrompt(state, false),
      };
    }

    // Fixed Rounds: if someone answered wrong this round, eliminate them now.
    // If nobody buzzed at all (clean timeout), no elimination — just reveal.
    if (state.disqualifiedIds.length > 0) {
      return {
        nextAction: { type: 'elimination-reveal' },
        roundResult: this.buildNoWinnerResult(state),
        drinkingPrompt: this.getDrinkingPrompt(state, false),
      };
    }
    return {
      nextAction: { type: 'reveal' },
      roundResult: this.buildNoWinnerResult(state),
      drinkingPrompt: this.getDrinkingPrompt(state, false),
    };
  }

  onBuzzerTimeout(state: ModeGameState): TimeoutResult {
    // Buzzer timeout = wrong answer (elimination applies)
    const disqualifiedIds = this.getDisqualifiedAfterWrong(state, state.buzzedPlayerId!);
    const aliveIds = this.getAlivePlayerIds(state);
    const remainingAlive = aliveIds.filter((id) => !disqualifiedIds.includes(id));
    const elimState = this.getState(state);

    if (elimState.isLastChanceRound) {
      if (remainingAlive.length === 0) {
        return {
          nextAction: { type: 'reveal' },
          roundResult: this.buildNoWinnerResult(state),
          drinkingPrompt: this.getDrinkingPrompt(state, false),
        };
      }
      return { nextAction: { type: 'play' } };
    }

    if (remainingAlive.length === 0) {
      return {
        nextAction: { type: 'elimination-reveal' },
        roundResult: this.buildNoWinnerResult(state),
        drinkingPrompt: this.getDrinkingPrompt(state, false),
      };
    }

    return { nextAction: { type: 'play' } };
  }

  onAfterReveal(state: ModeGameState): AfterRevealResult {
    const elimState = this.getState(state);

    // After Last Chance reveal, reset the flag and continue to scoreboard
    if (elimState.isLastChanceRound) {
      elimState.isLastChanceRound = false;
      return { nextAction: { type: 'scoreboard' } };
    }

    if (this.isGameOver(state)) {
      return { nextAction: { type: 'game-over' } };
    }
    return { nextAction: { type: 'scoreboard' } };
  }

  onAfterScoreboard(state: ModeGameState): AfterScoreboardResult {
    // currentRound is already incremented by GameManager before this is called,
    // so use >= (not +1 >=) for the round-count check.
    const elimState = this.getState(state);
    const aliveCount = state.teamMode
      ? this.getAliveTeamIds(state).length
      : this.getAlivePlayerIds(state).length;
    const roundsExhausted = elimState.subMode === 'fixed-rounds' && state.currentRound >= state.settings.roundCount;

    // Check Last Chance BEFORE game-over so it fires even with 2-player games.
    // Trigger when at least half the original players are eliminated (floor division
    // means 1 of 2, 1 of 3, 2 of 4, etc.) and Last Chance hasn't been used yet.
    if (!elimState.lastChanceUsed && elimState.eliminatedIds.length > 0) {
      const totalPlayers = state.getConnectedPlayerIds().length;
      if (elimState.eliminatedIds.length >= Math.floor(totalPlayers / 2)) {
        return { nextAction: { type: 'last-chance' } };
      }
    }

    if (aliveCount <= 1 || roundsExhausted) {
      return { nextAction: { type: 'game-over' } };
    }

    return { nextAction: { type: 'next-round' } };
  }

  isGameOver(state: ModeGameState): boolean {
    const elimState = this.getState(state);
    const aliveCount = state.teamMode
      ? this.getAliveTeamIds(state).length
      : this.getAlivePlayerIds(state).length;

    if (elimState.subMode === 'last-one-standing') {
      return aliveCount <= 1;
    }

    // Fixed Rounds
    if (state.currentRound + 1 >= state.settings.roundCount) {
      return true;
    }
    // Also end if only 1 alive
    return aliveCount <= 1;
  }

  /**
   * Called by GameManager after elimination-reveal to determine who gets eliminated.
   * Returns the player IDs to permanently eliminate this round.
   */
  getEliminationTargets(state: ModeGameState): string[] {
    const elimState = this.getState(state);

    // If someone buzzed wrong, they're already in disqualifiedIds — those are the elimination targets
    if (state.disqualifiedIds.length > 0) {
      // Return disqualified players who aren't already eliminated
      return state.disqualifiedIds.filter((id) => !elimState.eliminatedIds.includes(id));
    }

    // Last One Standing timeout: eliminate lowest cumulative scorer among alive players
    if (elimState.subMode === 'last-one-standing') {
      const aliveIds = this.getAlivePlayerIds(state);
      if (aliveIds.length <= 1) return [];

      if (state.teamMode) {
        // Eliminate lowest-scoring alive team
        const aliveTeamIds = this.getAliveTeamIds(state);
        if (aliveTeamIds.length <= 1) return [];

        let lowestTeamId = aliveTeamIds[0];
        let lowestScore = Infinity;
        for (const teamId of aliveTeamIds) {
          let teamScore = 0;
          for (const [pid, tid] of state.teamAssignments) {
            if (tid === teamId) {
              teamScore += state.scores.get(pid)?.score ?? 0;
            }
          }
          if (teamScore < lowestScore) {
            lowestScore = teamScore;
            lowestTeamId = teamId;
          }
        }

        // Return all players on that team
        const targets: string[] = [];
        for (const [pid, tid] of state.teamAssignments) {
          if (tid === lowestTeamId) targets.push(pid);
        }
        return targets;
      }

      // FFA: eliminate lowest scorer
      let lowestId = aliveIds[0];
      let lowestScore = Infinity;
      for (const id of aliveIds) {
        const score = state.scores.get(id)?.score ?? 0;
        if (score < lowestScore) {
          lowestScore = score;
          lowestId = id;
        }
      }
      return [lowestId];
    }

    return [];
  }

  /**
   * Apply permanent elimination to the mode state.
   */
  applyEliminations(state: ModeGameState, playerIds: string[]): void {
    const elimState = this.getState(state);
    for (const id of playerIds) {
      if (!elimState.eliminatedIds.includes(id)) {
        elimState.eliminatedIds.push(id);
      }
      if (state.teamMode) {
        const teamId = state.teamAssignments.get(id);
        if (teamId !== undefined && !elimState.eliminatedTeamIds.includes(teamId)) {
          // Check if all players on this team are eliminated
          const teamMembers: string[] = [];
          for (const [pid, tid] of state.teamAssignments) {
            if (tid === teamId) teamMembers.push(pid);
          }
          if (teamMembers.every((pid) => elimState.eliminatedIds.includes(pid))) {
            elimState.eliminatedTeamIds.push(teamId);
          }
        }
      }
    }
  }

  /**
   * Un-eliminate a player (Last Chance success).
   */
  unEliminate(state: ModeGameState, playerId: string): void {
    const elimState = this.getState(state);
    elimState.eliminatedIds = elimState.eliminatedIds.filter((id) => id !== playerId);
    if (state.teamMode) {
      const teamId = state.teamAssignments.get(playerId);
      if (teamId !== undefined) {
        elimState.eliminatedTeamIds = elimState.eliminatedTeamIds.filter((id) => id !== teamId);
      }
    }
  }

  buildClientState(state: ModeGameState): Partial<ClientGameState> {
    const elimState = this.getState(state);
    const aliveCount = state.teamMode
      ? this.getAliveTeamIds(state).length
      : this.getAlivePlayerIds(state).length;

    return {
      gameMode: this.id,
      maxPlayingTime: state.settings.timePerRound,
      maxBuzzingTime: this.config.buzzingDuration,
      eliminatedIds: elimState.eliminatedIds,
      isLastChanceRound: elimState.isLastChanceRound,
      alivePlayers: aliveCount,
      eliminationSubMode: elimState.subMode,
    };
  }

  // --- Helpers ---

  private getDrinkingPrompt(
    state: ModeGameState,
    hasWinner: boolean,
    winnerName?: string,
    winnerId?: string
  ): string | null {
    if (!state.settings.adultMode) return null;
    if (state.teamMode && winnerId) {
      const teamId = state.teamAssignments.get(winnerId);
      const teamName = teamId !== undefined ? TEAM_NAMES[teamId] : undefined;
      return getTeamPrompt(hasWinner, teamName, winnerName);
    }
    if (state.teamMode) {
      return getTeamPrompt(hasWinner);
    }
    return getEliminationPrompt(hasWinner, winnerName);
  }

  private buildNoWinnerResult(state: ModeGameState): RoundResult {
    const currentSong = state.songs[state.currentRound];
    return {
      songTitle: currentSong.title,
      songArtist: currentSong.artist,
      albumArtUrl: currentSong.albumArtUrl,
      winnerId: null,
      winnerName: null,
      pointsAwarded: 0,
      answerType: 'none',
    };
  }

  private getDisqualifiedAfterWrong(state: ModeGameState, playerId: string): string[] {
    const newDisqualified = [...state.disqualifiedIds];
    if (state.teamMode) {
      const teamId = state.teamAssignments.get(playerId);
      if (teamId !== undefined) {
        for (const [memberId, memberTeamId] of state.teamAssignments) {
          if (memberTeamId === teamId && !newDisqualified.includes(memberId)) {
            newDisqualified.push(memberId);
          }
        }
      } else if (!newDisqualified.includes(playerId)) {
        newDisqualified.push(playerId);
      }
    } else if (!newDisqualified.includes(playerId)) {
      newDisqualified.push(playerId);
    }
    return newDisqualified;
  }
}
