import { GameModeId } from './gameMode';

export type GamePhase =
  | 'rules'                  // Pre-game rules screen (once per mode per session)
  | 'pre-round' | 'playing' | 'buzzing' | 'reveal' | 'scoreboard' | 'game-over'
  | 'sub-round-transition'   // Snippet: pause between sub-rounds
  | 'last-chance'            // Elimination: Last Chance Round
  | 'elimination-reveal'     // Elimination: who got eliminated
  | 'tie-vote'               // Players vote: sudden death vs share the win
  | 'tiebreaker';            // Sudden death for tied players

export interface GameSettings {
  gameMode?: GameModeId;   // defaults to 'classic'
  roundCount: number;      // 5, 10, 15, 20
  timePerRound: number;    // 15 or 30 (seconds)
  genres: string[];        // empty = all genres
  decades: string[];       // empty = all decades (values like "1970s", "2000s")
  adultMode?: boolean;     // enables drinking game prompts
  teamMode?: boolean;      // enables team play
  teamCount?: number;      // 2-4 teams
  eliminationSubMode?: 'last-one-standing' | 'fixed-rounds';
}

export const AVAILABLE_GENRES = [
  'Pop', 'Hip-Hop/Rap', 'Rock', 'R&B/Soul',
  'Country', 'EDM/Dance', 'Alternative/Indie', 'Latin', 'K-Pop',
] as const;

export const AVAILABLE_DECADES = [
  { label: '70s', value: '1970s', min: 1970, max: 1979 },
  { label: '80s', value: '1980s', min: 1980, max: 1989 },
  { label: '90s', value: '1990s', min: 1990, max: 1999 },
  { label: '2000s', value: '2000s', min: 2000, max: 2009 },
  { label: '2010s', value: '2010s', min: 2010, max: 2019 },
  { label: '2020s', value: '2020s', min: 2020, max: 2029 },
] as const;

export interface PlayerScore {
  playerId: string;
  displayName: string;
  score: number;
  correctAnswers: number;
}

export interface RoundResult {
  songTitle: string;
  songArtist: string;
  albumArtUrl: string;
  winnerId: string | null;
  winnerName: string | null;
  pointsAwarded: number;
  answerType: 'artist' | 'title' | 'both' | 'none';
}

export interface ClientGameState {
  phase: GamePhase;
  currentRound: number;
  totalRounds: number;
  scores: PlayerScore[];
  timeRemaining: number;
  buzzedPlayerId: string | null;
  buzzedPlayerName: string | null;
  roundResult: RoundResult | null;
  disqualifiedIds: string[];
  drinkingPrompt: string | null;
  quietCallout: string | null;   // adult mode: fired when a player is silent for 3+ consecutive rounds
  isTiebreaker?: boolean;                // currently in sudden death
  tieVoteCounts?: { suddenDeath: number; share: number }; // live vote tally
  tiebreakerIds?: string[];              // player IDs competing in sudden death
  tiebreakerVoteCounts?: Record<string, number>;  // votedForId → count (for host display)
  tiebreakerVotes?: Record<string, string>;        // voterId → votedForId (for player outcome)
  // Game mode fields
  gameMode?: GameModeId;
  maxPlayingTime?: number;    // for timer bar % calculation
  maxBuzzingTime?: number;    // for timer bar % calculation
  // Snippet Challenge fields
  subRound?: number;          // 1-4, current sub-round within a song
  totalSubRounds?: number;    // always 4 for Snippet
  clipDuration?: number;      // how long the current clip plays (seconds)
  maxPoints?: number;         // max points available this sub-round
  // Elimination fields
  eliminatedIds?: string[];   // permanently eliminated players
  isLastChanceRound?: boolean;
  alivePlayers?: number;      // count of non-eliminated players
  eliminationSubMode?: 'last-one-standing' | 'fixed-rounds';
  // Name That Lyric fields
  currentLyric?: string | null;   // the lyric snippet displayed this round
  // Team mode fields
  teamMode?: boolean;
  teams?: import('./team').Team[];
  teamScores?: import('./team').TeamScore[];
  disqualifiedTeamIds?: number[];
  winnerTeamId?: number | null;
}
