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

export class ClassicMode implements GameMode {
  readonly id: GameModeId = 'classic';
  readonly displayName: string = 'Classic Buzz-In';
  readonly config: ModeConfig = {
    usesAudio: true,
    buzzingDuration: 30,
    preRoundDuration: 3,
    revealDuration: 5,
    scoreboardDuration: 5,
    minPlayers: 2,
    songsNeeded: (roundCount) => roundCount + 3, // +3 for tiebreaker buffer (up to 3 sudden death rounds)
  };

  initialize(_settings: GameSettings, _songs: EnrichedSong[], _playerIds: string[]): Record<string, unknown> {
    return {};
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
    return { accepted: true };
  }

  onAnswerSubmit(
    state: ModeGameState,
    playerId: string,
    answer: { artist: string; title: string }
  ): AnswerResult {
    const currentSong = state.songs[state.currentRound];
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

    // Wrong answer — disqualify, check if anyone remains
    const disqualifiedIds = this.getDisqualifiedAfterWrong(state, playerId);
    const connectedIds = state.getConnectedPlayerIds();
    const remaining = connectedIds.filter((id) => !disqualifiedIds.includes(id));

    if (remaining.length === 0) {
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
    return {
      nextAction: { type: 'reveal' },
      roundResult: this.buildNoWinnerResult(state),
      drinkingPrompt: this.getDrinkingPrompt(state, false),
    };
  }

  onBuzzerTimeout(state: ModeGameState): TimeoutResult {
    // Buzzer timeout = wrong answer. Check if anyone remains.
    const disqualifiedIds = this.getDisqualifiedAfterWrong(state, state.buzzedPlayerId!);
    const connectedIds = state.getConnectedPlayerIds();
    const remaining = connectedIds.filter((id) => !disqualifiedIds.includes(id));

    if (remaining.length === 0) {
      return {
        nextAction: { type: 'reveal' },
        roundResult: this.buildNoWinnerResult(state),
        drinkingPrompt: this.getDrinkingPrompt(state, false),
      };
    }

    return {
      nextAction: { type: 'play' },
    };
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
    return {
      gameMode: this.id,
      maxPlayingTime: state.settings.timePerRound,
      maxBuzzingTime: this.config.buzzingDuration,
    };
  }

  // --- Protected helpers (reusable by SpeedMode) ---

  protected getDrinkingPrompt(
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

  protected buildNoWinnerResult(state: ModeGameState): RoundResult {
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

  protected getDisqualifiedAfterWrong(state: ModeGameState, playerId: string): string[] {
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
