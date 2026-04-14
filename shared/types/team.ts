export const TEAM_COLORS = ['cyan', 'magenta', 'yellow', 'green'] as const;
export type TeamColor = typeof TEAM_COLORS[number];
export const TEAM_NAMES = ['Cyan', 'Magenta', 'Gold', 'Green'] as const;

export interface Team {
  id: number;            // 0-3
  name: string;          // from TEAM_NAMES
  color: TeamColor;
  playerIds: string[];   // socket IDs
}

export interface TeamScore {
  teamId: number;
  teamName: string;
  teamColor: TeamColor;
  totalScore: number;
  totalCorrect: number;
  members: { playerId: string; displayName: string; score: number; correctAnswers: number }[];
}

export type TeamAssignments = Record<string, number>; // playerId -> teamId
