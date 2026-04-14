import { GameSettings, GamePhase, ClientGameState, PlayerScore, RoundResult } from '@shared/types/game';
import { GameModeId } from '@shared/types/gameMode';
import { EnrichedSong } from '../../services/itunesService';

// --- Result Types ---

export type NextAction =
  | { type: 'play' }
  | { type: 'reveal' }
  | { type: 'scoreboard' }
  | { type: 'next-round' }
  | { type: 'next-sub-round' }
  | { type: 'game-over' }
  | { type: 'last-chance' }
  | { type: 'elimination-reveal' };

export interface RoundStartResult {
  playingDuration: number;
  previewUrl: string | null;
  clipDuration?: number;
}

export interface BuzzerResult {
  accepted: boolean;
  error?: string;
}

export interface AnswerResult {
  correct: boolean;
  points: number;
  artistCorrect: boolean;
  titleCorrect: boolean;
  nextAction: NextAction;
  roundResult?: RoundResult;
  drinkingPrompt?: string | null;
}

export interface TimeoutResult {
  nextAction: NextAction;
  roundResult?: RoundResult;
  drinkingPrompt?: string | null;
}

export interface AfterRevealResult {
  nextAction: NextAction;
}

export interface AfterScoreboardResult {
  nextAction: NextAction;
}

// --- Mode Configuration ---

export interface ModeConfig {
  usesAudio: boolean;
  buzzingDuration: number;
  preRoundDuration: number;
  revealDuration: number;
  scoreboardDuration: number;
  minPlayers: number;
  songsNeeded(roundCount: number): number;
}

// --- Shared Game State (passed to mode methods) ---
// This mirrors ServerGameState but is the contract modes operate on.

export interface ModeGameState {
  roomCode: string;
  settings: GameSettings;
  songs: EnrichedSong[];
  currentRound: number;
  phase: GamePhase;
  scores: Map<string, PlayerScore>;
  buzzedPlayerId: string | null;
  buzzedPlayerName: string | null;
  disqualifiedIds: string[];
  roundResult: RoundResult | null;
  drinkingPrompt: string | null;
  timeRemaining: number;
  teamMode: boolean;
  teamCount: number;
  teamAssignments: Map<string, number>;
  modeState: Record<string, unknown>;
  getConnectedPlayerIds(): string[];
}

// --- GameMode Interface ---

export interface GameMode {
  readonly id: GameModeId;
  readonly displayName: string;
  readonly config: ModeConfig;

  initialize(settings: GameSettings, songs: EnrichedSong[], playerIds: string[]): Record<string, unknown>;

  onRoundStart(state: ModeGameState): RoundStartResult;

  onBuzzerPress(state: ModeGameState, playerId: string): BuzzerResult;

  onAnswerSubmit(
    state: ModeGameState,
    playerId: string,
    answer: { artist: string; title: string }
  ): AnswerResult;

  onPlayingTimeout(state: ModeGameState): TimeoutResult;

  onBuzzerTimeout(state: ModeGameState): TimeoutResult;

  onAfterReveal(state: ModeGameState): AfterRevealResult;

  onAfterScoreboard(state: ModeGameState): AfterScoreboardResult;

  isGameOver(state: ModeGameState): boolean;

  buildClientState(state: ModeGameState): Partial<ClientGameState>;
}
