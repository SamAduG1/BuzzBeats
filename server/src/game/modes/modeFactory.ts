import { GameModeId } from '@shared/types/gameMode';
import { GameMode } from './GameMode';
import { ClassicMode } from './ClassicMode';
import { SpeedMode } from './SpeedMode';
import { SnippetMode } from './SnippetMode';
import { EliminationMode } from './EliminationMode';
import { NameThatLyricMode } from './NameThatLyricMode';

export function createGameMode(id: GameModeId): GameMode {
  switch (id) {
    case 'classic':
      return new ClassicMode();
    case 'speed':
      return new SpeedMode();
    case 'snippet':
      return new SnippetMode();
    case 'elimination':
      return new EliminationMode();
    case 'name-that-lyric':
      return new NameThatLyricMode();
    default:
      return new ClassicMode();
  }
}
