export type GameModeId = 'classic' | 'speed' | 'snippet' | 'elimination' | 'name-that-lyric';

export interface GameModeInfo {
  id: GameModeId;
  name: string;
  description: string;
  tagline: string;
  rules: string[];
  scoring: string[];
  icon: string;
  color: string;       // primary accent hex
  minPlayers: number;
  usesAudio: boolean;
  available: boolean;
}

export const AVAILABLE_GAME_MODES: GameModeInfo[] = [
  {
    id: 'classic',
    name: 'Classic Buzz-In',
    description: 'Hear a song clip and race to identify it',
    tagline: 'First to know it wins it.',
    rules: [
      'A song clip plays. Buzz in when you know it!',
      'Name the song title and/or artist to score points',
      'Wrong answer locks you out for the rest of the round',
    ],
    scoring: ['Both title + artist: 3 pts', 'Title only: 2 pts', 'Artist only: 1 pt'],
    icon: '\u{1F3B5}',
    color: '#00f0ff',
    minPlayers: 2,
    usesAudio: true,
    available: true,
  },
  {
    id: 'speed',
    name: 'Speed Round',
    description: 'Short clips, fast timer, rapid-fire energy',
    tagline: 'Fastest fingers win.',
    rules: [
      '10-second clips with a 10-second buzzer window',
      'Same buzz-in rules as Classic, but at double the pace',
      'No time to think. Just buzz!',
    ],
    scoring: ['Both title + artist: 3 pts', 'Title only: 2 pts', 'Artist only: 1 pt'],
    icon: '\u26A1',
    color: '#ffe600',
    minPlayers: 2,
    usesAudio: true,
    available: true,
  },
  {
    id: 'snippet',
    name: 'Snippet Challenge',
    description: 'Clips grow longer each try. Guess early for more points!',
    tagline: 'The sooner you guess, the more you earn.',
    rules: [
      '4 clips per song: 2s then 5s then 10s then 20s',
      'Buzz in on any clip to answer',
      'Wrong answer locks you out for that clip only',
    ],
    scoring: ['Clip 1 (2s): 4 pts', 'Clip 2 (5s): 3 pts', 'Clip 3 (10s): 2 pts', 'Clip 4 (20s): 1 pt'],
    icon: '\u{1F50D}',
    color: '#39ff14',
    minPlayers: 2,
    usesAudio: true,
    available: true,
  },
  {
    id: 'elimination',
    name: 'Elimination',
    description: 'Wrong answer = eliminated. Last one standing wins',
    tagline: 'No mercy. One shot.',
    rules: [
      'Wrong answer = permanently eliminated from the game',
      'When half the players are out, a Last Chance round fires',
      'Get the Last Chance song right to rejoin the game',
    ],
    scoring: ['Correct answer: 3 pts', 'Last player standing wins', 'Fixed rounds: most points wins'],
    icon: '\u{1F480}',
    color: '#ff1744',
    minPlayers: 4,
    usesAudio: true,
    available: true,
  },
  {
    id: 'name-that-lyric',
    name: 'Name That Lyric',
    description: 'Read the lyric on screen and race to name the song',
    tagline: 'No music. Just words. Go.',
    rules: [
      'A real lyric snippet appears on screen. No audio!',
      'Buzz in and name the song title and/or the artist',
      'Wrong answer locks you out for the round',
    ],
    scoring: ['Both title + artist: 3 pts', 'Title only: 2 pts', 'Artist only: 1 pt'],
    icon: '\u{1F4DD}',
    color: '#ff00e5',
    minPlayers: 2,
    usesAudio: false,
    available: true,
  },
];
