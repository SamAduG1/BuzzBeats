import { Player, RoomStatus } from './room';
import { GameSettings, ClientGameState } from './game';
import { Team, TeamAssignments } from './team';

// Client -> Server Events
export interface ClientToServerEvents {
  'room:create': (callback: (response: RoomCreatedResponse) => void) => void;
  'room:join': (data: JoinRoomPayload, callback: (response: JoinRoomResponse) => void) => void;
  'room:leave': () => void;
  'room:get-state': (data: GetRoomStatePayload, callback: (response: GetRoomStateResponse) => void) => void;
  'game:start': (data: GameStartPayload, callback: (response: GameStartResponse) => void) => void;
  'game:buzzer-press': (callback: (response: BuzzerPressResponse) => void) => void;
  'game:answer-submit': (data: AnswerSubmitPayload, callback: (response: AnswerSubmitResponse) => void) => void;
  'game:play-again': (callback: (response: GamePlayAgainResponse) => void) => void;
  'game:tiebreaker-vote': (data: TiebreakerVotePayload, callback: (response: TiebreakerVoteResponse) => void) => void;
  'game:tie-vote': (data: TieVotePayload, callback: (response: TieVoteResponse) => void) => void;
  'room:kick-player': (data: KickPlayerPayload, callback: (response: KickPlayerResponse) => void) => void;
  'room:set-team-mode': (data: SetTeamModePayload, callback: (response: SetTeamModeResponse) => void) => void;
  'room:shuffle-teams': (callback: (response: ShuffleTeamsResponse) => void) => void;
  'room:move-player-team': (data: MovePlayerTeamPayload, callback: (response: MovePlayerTeamResponse) => void) => void;
}

// Server -> Client Events
export interface ServerToClientEvents {
  'room:player-joined': (data: PlayerJoinedPayload) => void;
  'room:player-left': (data: PlayerLeftPayload) => void;
  'room:player-disconnected': (data: PlayerDisconnectedPayload) => void;
  'room:player-reconnected': (data: PlayerReconnectedPayload) => void;
  'room:state-sync': (data: RoomStateSyncPayload) => void;
  'room:closed': (data: RoomClosedPayload) => void;
  'room:kicked': (data: RoomKickedPayload) => void;
  'error': (data: ErrorPayload) => void;
  'game:state-update': (data: ClientGameState) => void;
  'game:play-song': (data: PlaySongPayload) => void;
  'game:buzzer-locked': (data: BuzzerLockedPayload) => void;
  'game:answer-result': (data: AnswerResultPayload) => void;
  'game:tick': (data: TickPayload) => void;
  'game:clip-info': (data: ClipInfoPayload) => void;
  'room:teams-updated': (data: TeamsUpdatedPayload) => void;
}

// Payloads
export interface JoinRoomPayload {
  roomCode: string;
  displayName: string;
}

export interface RoomCreatedResponse {
  success: boolean;
  roomCode?: string;
  error?: string;
}

export interface JoinRoomResponse {
  success: boolean;
  room?: {
    code: string;
    players: Player[];
    status: RoomStatus;
    teamMode?: boolean;
    teams?: Team[];
    teamAssignments?: TeamAssignments;
  };
  error?: string;
}

export interface PlayerJoinedPayload {
  player: Player;
  players: Player[];
}

export interface PlayerLeftPayload {
  playerId: string;
  players: Player[];
}

export interface PlayerDisconnectedPayload {
  playerId: string;
  displayName: string;
}

export interface PlayerReconnectedPayload {
  playerId: string;
  displayName: string;
}

export interface RoomStateSyncPayload {
  code: string;
  players: Player[];
  status: RoomStatus;
  teamMode?: boolean;
  teams?: Team[];
  teamAssignments?: TeamAssignments;
}

export interface RoomClosedPayload {
  reason: string;
}

export interface GetRoomStatePayload {
  roomCode: string;
}

export interface GetRoomStateResponse {
  success: boolean;
  room?: {
    code: string;
    players: Player[];
    status: RoomStatus;
    teamMode?: boolean;
    teams?: Team[];
    teamAssignments?: TeamAssignments;
  };
  isHost?: boolean;
  error?: string;
}

export interface ErrorPayload {
  message: string;
  code?: string;
}

// Game payloads

export interface GameStartPayload {
  settings: GameSettings;
}

export interface GameStartResponse {
  success: boolean;
  error?: string;
}

export interface BuzzerPressResponse {
  accepted: boolean;
  error?: string;
}

export interface AnswerSubmitPayload {
  artist: string;
  title: string;
}

export interface AnswerSubmitResponse {
  received: boolean;
  error?: string;
}

export interface PlaySongPayload {
  previewUrl: string;
}

export interface BuzzerLockedPayload {
  buzzedPlayerId: string;
  buzzedPlayerName: string;
}

export interface AnswerResultPayload {
  correct: boolean;
  pointsAwarded: number;
  artistCorrect: boolean;
  titleCorrect: boolean;
}

export interface TickPayload {
  timeRemaining: number;
}

export interface ClipInfoPayload {
  previewUrl: string;
  clipDuration: number;  // seconds to play before stopping
}

export interface GamePlayAgainResponse {
  success: boolean;
  error?: string;
}

export interface KickPlayerPayload {
  playerId: string;
}

export interface KickPlayerResponse {
  success: boolean;
  error?: string;
}

export interface RoomKickedPayload {
  reason: string;
}

// Team payloads

export interface SetTeamModePayload {
  enabled: boolean;
  teamCount?: number;  // 2-4, required when enabled=true
}

export interface SetTeamModeResponse {
  success: boolean;
  error?: string;
}

export interface ShuffleTeamsResponse {
  success: boolean;
  error?: string;
}

export interface MovePlayerTeamPayload {
  playerId: string;
  targetTeamId: number;
}

export interface TiebreakerVotePayload {
  votedForId: string;
}

export interface TieVotePayload {
  choice: 'sudden-death' | 'share';
}

export interface TieVoteResponse {
  accepted: boolean;
  error?: string;
}

export interface TiebreakerVoteResponse {
  accepted: boolean;
  error?: string;
}

export interface MovePlayerTeamResponse {
  success: boolean;
  error?: string;
}

export interface TeamsUpdatedPayload {
  teams: Team[];
  teamAssignments: TeamAssignments;
}
