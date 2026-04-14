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
import { getRandomPrompt, getTeamPrompt } from '../../data/drinkingPrompts';
import { TEAM_NAMES } from '@shared/types/team';

const SUB_ROUND_DURATIONS = [5, 10, 15, 25];
const POINTS_MULTIPLIERS = [4, 3, 2, 1];
const TOTAL_SUB_ROUNDS = 4;

export interface SnippetModeState {
  currentSubRound: number; // 0-3
}

export class SnippetMode implements GameMode {
  readonly id: GameModeId = 'snippet';
  readonly displayName: string = 'Snippet Challenge';
  readonly config: ModeConfig = {
    usesAudio: true,
    buzzingDuration: 15,
    preRoundDuration: 3,
    revealDuration: 5,
    scoreboardDuration: 5,
    minPlayers: 2,
    songsNeeded: (roundCount) => roundCount + 3, // +3 for tiebreaker buffer
  };

  initialize(_settings: GameSettings, _songs: EnrichedSong[], _playerIds: string[]): Record<string, unknown> {
    return { currentSubRound: 0 } satisfies SnippetModeState;
  }

  private getSubRound(state: ModeGameState): number {
    return ((state.modeState as unknown) as SnippetModeState).currentSubRound ?? 0;
  }

  onRoundStart(state: ModeGameState): RoundStartResult {
    const song = state.songs[state.currentRound];
    const subRound = this.getSubRound(state);
    const clipDuration = SUB_ROUND_DURATIONS[subRound];

    return {
      playingDuration: clipDuration,
      previewUrl: song.previewUrl,
      clipDuration,
    };
  }

  onBuzzerPress(state: ModeGameState, playerId: string): BuzzerResult {
    if (state.phase !== 'playing') return { accepted: false, error: 'Buzzer not active' };
    if (state.disqualifiedIds.includes(playerId)) return { accepted: false, error: 'Already guessed wrong' };
    if (state.buzzedPlayerId) return { accepted: false, error: 'Someone already buzzed' };
    const playerScore = state.scores.get(playerId);
    if (!playerScore) return { accepted: false, error: 'Player not in game' };
    return { accepted: true };
  }

  onAnswerSubmit(
    state: ModeGameState,
    playerId: string,
    answer: { artist: string; title: string }
  ): AnswerResult {
    const currentSong = state.songs[state.currentRound];
    const subRound = this.getSubRound(state);
    const multiplier = POINTS_MULTIPLIERS[subRound];

    const result = verifyAnswer(answer, {
      artist: currentSong.artist,
      title: currentSong.title,
    });

    if (result.points > 0) {
      const points = multiplier; // flat points: 4, 3, 2, 1 per sub-round
      const playerScore = state.scores.get(playerId)!;
      const roundResult: RoundResult = {
        songTitle: currentSong.title,
        songArtist: currentSong.artist,
        albumArtUrl: currentSong.albumArtUrl,
        winnerId: playerId,
        winnerName: playerScore.displayName,
        pointsAwarded: points,
        answerType: result.artistCorrect && result.titleCorrect ? 'both'
          : result.titleCorrect ? 'title'
          : 'artist',
      };

      return {
        correct: true,
        points,
        artistCorrect: result.artistCorrect,
        titleCorrect: result.titleCorrect,
        nextAction: { type: 'reveal' },
        roundResult,
        drinkingPrompt: this.getDrinkingPrompt(state, true, playerScore.displayName, playerId),
      };
    }

    // Wrong answer — disqualify, check if anyone remains
    const disqualifiedIds = this.getDisqualifiedAfterWrong(state, playerId);
    const connectedIds = state.getConnectedPlayerIds();
    const remaining = connectedIds.filter((id) => !disqualifiedIds.includes(id));

    if (remaining.length === 0) {
      // All disqualified — advance sub-round or reveal
      if (subRound < TOTAL_SUB_ROUNDS - 1) {
        return {
          correct: false,
          points: 0,
          artistCorrect: result.artistCorrect,
          titleCorrect: result.titleCorrect,
          nextAction: { type: 'next-sub-round' },
        };
      }
      // Last sub-round, no one left — reveal with no winner
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

  onPlayingTimeout(state: ModeGameState): TimeoutResult {
    const subRound = this.getSubRound(state);

    if (subRound < TOTAL_SUB_ROUNDS - 1) {
      // Advance to next sub-round
      return { nextAction: { type: 'next-sub-round' } };
    }

    // Last sub-round — no winner
    return {
      nextAction: { type: 'reveal' },
      roundResult: this.buildNoWinnerResult(state),
      drinkingPrompt: this.getDrinkingPrompt(state, false),
    };
  }

  onBuzzerTimeout(state: ModeGameState): TimeoutResult {
    // Same as wrong answer: disqualify, check remaining
    const disqualifiedIds = this.getDisqualifiedAfterWrong(state, state.buzzedPlayerId!);
    const connectedIds = state.getConnectedPlayerIds();
    const remaining = connectedIds.filter((id) => !disqualifiedIds.includes(id));
    const subRound = this.getSubRound(state);

    if (remaining.length === 0) {
      if (subRound < TOTAL_SUB_ROUNDS - 1) {
        return { nextAction: { type: 'next-sub-round' } };
      }
      return {
        nextAction: { type: 'reveal' },
        roundResult: this.buildNoWinnerResult(state),
        drinkingPrompt: this.getDrinkingPrompt(state, false),
      };
    }

    return { nextAction: { type: 'play' } };
  }

  onAfterReveal(state: ModeGameState): AfterRevealResult {
    if (state.currentRound + 1 >= state.settings.roundCount) {
      return { nextAction: { type: 'game-over' } };
    }
    return { nextAction: { type: 'scoreboard' } };
  }

  onAfterScoreboard(state: ModeGameState): AfterScoreboardResult {
    // currentRound is already incremented by GameManager before this is called
    if (state.currentRound >= state.settings.roundCount) {
      return { nextAction: { type: 'game-over' } };
    }
    return { nextAction: { type: 'next-round' } };
  }

  isGameOver(state: ModeGameState): boolean {
    return state.currentRound >= state.settings.roundCount;
  }

  buildClientState(state: ModeGameState): Partial<ClientGameState> {
    const subRound = this.getSubRound(state);
    const clipDuration = SUB_ROUND_DURATIONS[subRound];
    const maxPoints = POINTS_MULTIPLIERS[subRound]; // flat points per sub-round

    return {
      gameMode: this.id,
      maxPlayingTime: clipDuration,
      maxBuzzingTime: this.config.buzzingDuration,
      subRound: subRound + 1,        // 1-indexed for display
      totalSubRounds: TOTAL_SUB_ROUNDS,
      clipDuration,
      maxPoints,
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
    return getRandomPrompt(hasWinner, winnerName);
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
