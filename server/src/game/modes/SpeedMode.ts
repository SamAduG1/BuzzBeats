import { ClassicMode } from './ClassicMode';
import { ModeConfig, ModeGameState, RoundStartResult } from './GameMode';
import { GameModeId } from '@shared/types/gameMode';
import { ClientGameState } from '@shared/types/game';

export class SpeedMode extends ClassicMode {
  readonly id: GameModeId = 'speed';
  readonly displayName = 'Speed Round';
  readonly config: ModeConfig = {
    usesAudio: true,
    buzzingDuration: 10,
    preRoundDuration: 2,
    revealDuration: 3,
    scoreboardDuration: 3,
    minPlayers: 2,
    songsNeeded: (roundCount) => roundCount + 3, // +3 for tiebreaker buffer
  };

  onRoundStart(state: ModeGameState): RoundStartResult {
    const song = state.songs[state.currentRound];
    return {
      playingDuration: 10,
      previewUrl: song.previewUrl,
      clipDuration: 10,
    };
  }

  buildClientState(state: ModeGameState): Partial<ClientGameState> {
    return {
      gameMode: this.id,
      maxPlayingTime: 10,
      maxBuzzingTime: this.config.buzzingDuration,
    };
  }
}
