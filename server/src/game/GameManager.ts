import { Server } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents } from '@shared/types/socket-events';
import { GameSettings, GamePhase, ClientGameState, PlayerScore, RoundResult } from '@shared/types/game';
import { GameModeId } from '@shared/types/gameMode';
import { roomManager } from '../rooms/RoomManager';
import { EnrichedSong, fetchSongsForGame } from '../services/itunesService';
import { songDatabase } from '../data/songDatabase';
import { AVAILABLE_DECADES } from '@shared/types/game';
import { Song } from '@shared/types/music';
import { Team, TeamScore, TEAM_COLORS, TEAM_NAMES } from '@shared/types/team';
import { GameMode, ModeGameState, NextAction } from './modes/GameMode';
import { createGameMode } from './modes/modeFactory';
import { EliminationMode } from './modes/EliminationMode';
import { getQuietPlayerPrompt } from '../data/drinkingPrompts';
import { fetchSongsWithLyrics } from '../services/lyricsService';

type GameIO = Server<ClientToServerEvents, ServerToClientEvents>;

interface ServerGameState {
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
  savedPlayingTime: number | null;  // playing timer saved when a buzz interrupts
  phaseTimer: NodeJS.Timeout | null;
  tickTimer: NodeJS.Timeout | null;
  teamMode: boolean;
  teamCount: number;
  teamAssignments: Map<string, number>;
  quietCallout: string | null;         // adult mode callout shown on scoreboard
  quietStreaks: Map<string, number>;   // consecutive rounds each player hasn't buzzed
  isTiebreaker: boolean;               // currently in sudden death
  tiebreakerIds: string[];             // player IDs allowed to buzz in tiebreaker
  tiebreakerSongOffset: number;        // how many tiebreaker songs have been used
  tiebreakerVotes: Map<string, string>; // voterId → votedForId
  tieVotes: Map<string, 'sudden-death' | 'share'>; // playerId → choice during tie-vote phase
  // Strategy pattern
  mode: GameMode;
  modeState: Record<string, unknown>;
}

function filterSongs(pool: Song[], settings: GameSettings): Song[] {
  let filtered = pool;

  if (settings.genres.length > 0) {
    filtered = filtered.filter((s) => settings.genres.includes(s.genre));
  }

  if (settings.decades.length > 0) {
    const yearRanges = settings.decades.map((d) => {
      const decade = AVAILABLE_DECADES.find((ad) => ad.value === d);
      return decade ? { min: decade.min, max: decade.max } : null;
    }).filter(Boolean) as { min: number; max: number }[];

    filtered = filtered.filter((s) =>
      yearRanges.some((r) => s.releaseYear >= r.min && s.releaseYear <= r.max)
    );
  }

  return filtered;
}

class GameManager {
  private games: Map<string, ServerGameState> = new Map();
  private rulesShown: Map<string, Set<GameModeId>> = new Map();

  async startGame(
    roomCode: string,
    settings: GameSettings,
    io: GameIO,
    hostSocketId: string
  ): Promise<{ success: boolean; error?: string }> {
    if (this.games.has(roomCode)) {
      return { success: false, error: 'Game already in progress' };
    }

    const room = roomManager.getRoom(roomCode);
    if (!room) {
      return { success: false, error: 'Room not found' };
    }

    if (room.hostSocketId !== hostSocketId) {
      return { success: false, error: 'Only the host can start the game' };
    }

    const modeId: GameModeId = settings.gameMode || 'classic';
    const mode = createGameMode(modeId);

    const isTeamMode = settings.teamMode && roomManager.isTeamMode(roomCode);
    const minPlayers = Math.max(mode.config.minPlayers, isTeamMode ? 4 : 2);

    if (room.players.length < minPlayers) {
      return { success: false, error: `Need at least ${minPlayers} players` };
    }

    // Fetch songs — audio modes use iTunes, Name That Lyric fetches lyrics instead
    const songsNeeded = mode.config.songsNeeded(settings.roundCount);
    let songs: EnrichedSong[] = [];

    if (songsNeeded > 0) {
      const filteredPool = filterSongs(songDatabase, settings);
      console.log(`[Game] Pool: ${filteredPool.length} songs after filters (genres: ${settings.genres.length || 'all'}, decades: ${settings.decades.length || 'all'})`);

      console.log(`[Game] Fetching ${songsNeeded} songs from iTunes...`);
      songs = await fetchSongsForGame(filteredPool, songsNeeded + 5); // +5 skip buffer

      if (songs.length === 0) {
        return { success: false, error: 'Could not find any songs with previews' };
      }
    } else if (modeId === 'name-that-lyric') {
      const filteredPool = filterSongs(songDatabase, settings);
      console.log(`[Game] Pool: ${filteredPool.length} songs after filters`);
      console.log(`[Game] Fetching lyrics for ${settings.roundCount} songs...`);
      songs = await fetchSongsWithLyrics(filteredPool, settings.roundCount + 8); // +3 tiebreaker + 5 skip buffer

      if (songs.length === 0) {
        return { success: false, error: 'Could not find any songs with lyrics. Try again or check your connection.' };
      }
    } else {
      console.log(`[Game] ${mode.displayName} mode — no songs needed`);
    }

    // Initialize scores for all connected players
    const scores = new Map<string, PlayerScore>();
    for (const player of room.players.filter((p) => p.isConnected)) {
      scores.set(player.id, {
        playerId: player.id,
        displayName: player.displayName,
        score: 0,
        correctAnswers: 0,
      });
    }

    // Snapshot team assignments at game start
    const teamAssignments = new Map<string, number>();
    if (isTeamMode) {
      const assignments = roomManager.getTeamAssignments(roomCode);
      for (const [playerId, teamId] of Object.entries(assignments)) {
        teamAssignments.set(playerId, teamId);
      }
    }

    const playerIds = Array.from(scores.keys());
    const modeState = mode.initialize(settings, songs, playerIds);

    const game: ServerGameState = {
      roomCode,
      settings: { ...settings, roundCount: songs.length > 0 ? Math.min(settings.roundCount, songs.length) : settings.roundCount },
      songs,
      currentRound: 0,
      phase: 'pre-round',
      scores,
      buzzedPlayerId: null,
      buzzedPlayerName: null,
      disqualifiedIds: [],
      roundResult: null,
      drinkingPrompt: null,
      quietCallout: null,
      quietStreaks: new Map(),
      isTiebreaker: false,
      tiebreakerIds: [],
      tiebreakerSongOffset: 0,
      tiebreakerVotes: new Map(),
      tieVotes: new Map(),
      timeRemaining: 0,
      savedPlayingTime: null,
      phaseTimer: null,
      tickTimer: null,
      teamMode: !!isTeamMode,
      teamCount: isTeamMode ? (settings.teamCount || 2) : 0,
      teamAssignments,
      mode,
      modeState,
    };

    this.games.set(roomCode, game);
    roomManager.setRoomStatus(roomCode, 'playing');

    console.log(`[Game] Started ${mode.displayName} in room ${roomCode} with ${songs.length} rounds`);

    this.startRulesPhase(roomCode, io);

    return { success: true };
  }

  handleBuzzerPress(
    roomCode: string,
    playerId: string,
    io: GameIO
  ): { accepted: boolean; error?: string } {
    const game = this.games.get(roomCode);
    if (!game) return { accepted: false, error: 'No active game' };

    // Auto-heal stale socket IDs that slipped through missed reconnect events.
    // If this socket isn't in game.scores, find the player by display name in the
    // room and migrate all game state to the new ID before any other checks run.
    if (!game.scores.has(playerId)) {
      const room = roomManager.getRoom(roomCode);
      const player = room?.players.find((p) => p.id === playerId);
      if (player) {
        for (const [oldId, score] of game.scores) {
          if (score.displayName.toLowerCase() === player.displayName.toLowerCase()) {
            this.updatePlayerSocketId(roomCode, oldId, playerId);
            break;
          }
        }
      }
    }

    // In tiebreaker, only the tied players may buzz
    if (game.isTiebreaker && !game.tiebreakerIds.includes(playerId)) {
      return { accepted: false, error: 'Only tied players can buzz in sudden death' };
    }

    const modeState = this.buildModeState(game);
    const result = game.mode.onBuzzerPress(modeState, playerId);

    if (!result.accepted) {
      return result;
    }

    const playerScore = game.scores.get(playerId)!;
    game.buzzedPlayerId = playerId;
    game.buzzedPlayerName = playerScore.displayName;

    // Buzzing resets the quiet streak for this player.
    // Set to -1 so scoreboard's +1 brings it to 0 (not counting the buzz round as quiet).
    game.quietStreaks.set(playerId, -1);

    // Save the playing timer so we can resume from the same point if wrong answer
    game.savedPlayingTime = game.timeRemaining;
    this.clearTimers(game);

    io.to(roomCode).emit('game:buzzer-locked', {
      buzzedPlayerId: playerId,
      buzzedPlayerName: playerScore.displayName,
    });

    game.phase = 'buzzing';
    game.timeRemaining = game.mode.config.buzzingDuration;
    this.broadcastState(roomCode, io);
    this.startTicking(game, roomCode, io, () => this.handleBuzzerTimeout(roomCode, io));

    return { accepted: true };
  }

  handleSkipSong(
    roomCode: string,
    hostSocketId: string,
    io: GameIO
  ): { success: boolean; error?: string } {
    const game = this.games.get(roomCode);
    if (!game) return { success: false, error: 'No active game' };
    if (game.phase !== 'playing') return { success: false, error: 'Can only skip during the playing phase' };

    const room = roomManager.getRoom(roomCode);
    if (!room || room.hostSocketId !== hostSocketId) {
      return { success: false, error: 'Only the host can skip' };
    }

    // currentRound is 0-indexed; need at least one more song beyond it
    if (game.currentRound + 1 >= game.songs.length) {
      return { success: false, error: 'No songs left in skip buffer' };
    }

    this.clearTimers(game);

    // Remove the current song so the next one slides into its place
    game.songs.splice(game.currentRound, 1);

    // Reset round state
    game.disqualifiedIds = [];
    game.buzzedPlayerId = null;
    game.buzzedPlayerName = null;
    game.savedPlayingTime = null;

    // Reset sub-round for Snippet mode
    if (game.modeState.currentSubRound !== undefined) {
      game.modeState.currentSubRound = 0;
    }

    console.log(`[Game] Host skipped song in room ${roomCode} (round ${game.currentRound + 1})`);
    this.startPlaying(roomCode, io);
    return { success: true };
  }

  handleAnswerSubmit(
    roomCode: string,
    playerId: string,
    answer: { artist: string; title: string },
    io: GameIO
  ): { received: boolean; error?: string } {
    const game = this.games.get(roomCode);
    if (!game) return { received: false, error: 'No active game' };
    if (game.phase !== 'buzzing') return { received: false, error: 'Not accepting answers' };
    if (game.buzzedPlayerId !== playerId) return { received: false, error: 'Not your turn to answer' };

    this.clearTimers(game);

    const modeState = this.buildModeState(game);
    const result = game.mode.onAnswerSubmit(modeState, playerId, answer);

    // Send result to the answering player
    const answeringSocket = io.sockets.sockets.get(playerId);
    if (answeringSocket) {
      answeringSocket.emit('game:answer-result', {
        correct: result.correct,
        pointsAwarded: result.points,
        artistCorrect: result.artistCorrect,
        titleCorrect: result.titleCorrect,
      });
    }

    if (result.correct) {
      // Award points
      const playerScore = game.scores.get(playerId)!;
      playerScore.score += result.points;
      playerScore.correctAnswers += 1;

      // Last Chance: un-eliminate the player who got it right
      if (game.mode instanceof EliminationMode) {
        const elimModeState = (game.modeState as unknown) as { isLastChanceRound?: boolean };
        if (elimModeState.isLastChanceRound) {
          game.mode.unEliminate(modeState, playerId);
          elimModeState.isLastChanceRound = false;
          console.log(`[Game] Last Chance: ${playerScore.displayName} un-eliminated in room ${roomCode}`);
        }
      }
    } else {
      // Disqualify
      if (game.teamMode) {
        this.disqualifyTeam(game, playerId);
      } else {
        if (!game.disqualifiedIds.includes(playerId)) {
          game.disqualifiedIds.push(playerId);
        }
      }
      game.buzzedPlayerId = null;
      game.buzzedPlayerName = null;
    }

    // Apply round result and drinking prompt if provided
    if (result.roundResult) {
      game.roundResult = result.roundResult;
    }
    if (result.drinkingPrompt !== undefined) {
      game.drinkingPrompt = result.drinkingPrompt;
    }

    this.executeAction(roomCode, result.nextAction, io);
    return { received: true };
  }

  // --- Action Dispatcher ---

  private executeAction(roomCode: string, action: NextAction, io: GameIO): void {
    switch (action.type) {
      case 'play':
        this.resumePlaying(roomCode, io);
        break;
      case 'reveal':
        this.startReveal(roomCode, io);
        break;
      case 'scoreboard':
        this.startScoreboard(roomCode, io);
        break;
      case 'next-round':
        this.advanceRound(roomCode, io);
        break;
      case 'next-sub-round':
        this.nextSubRound(roomCode, io);
        break;
      case 'game-over':
        this.endGame(roomCode, io);
        break;
      case 'last-chance':
        this.startLastChance(roomCode, io);
        break;
      case 'elimination-reveal':
        this.startEliminationReveal(roomCode, io);
        break;
    }
  }

  // --- Phase Transitions ---

  private startRulesPhase(roomCode: string, io: GameIO): void {
    const game = this.games.get(roomCode);
    if (!game) return;

    game.phase = 'rules';
    game.timeRemaining = 8;

    this.broadcastState(roomCode, io);
    this.startTicking(game, roomCode, io, () => this.startPreRound(roomCode, io));
  }

  private startPreRound(roomCode: string, io: GameIO): void {
    const game = this.games.get(roomCode);
    if (!game) return;

    game.phase = 'pre-round';
    game.timeRemaining = game.mode.config.preRoundDuration;
    game.savedPlayingTime = null;
    game.buzzedPlayerId = null;
    game.buzzedPlayerName = null;
    game.disqualifiedIds = [];
    game.roundResult = null;
    game.drinkingPrompt = null;
    game.quietCallout = null;

    // Reset sub-round for Snippet mode
    if (game.modeState.currentSubRound !== undefined) {
      game.modeState.currentSubRound = 0;
    }

    this.broadcastState(roomCode, io);
    this.startTicking(game, roomCode, io, () => this.startPlaying(roomCode, io));
  }

  private startPlaying(roomCode: string, io: GameIO): void {
    const game = this.games.get(roomCode);
    if (!game) return;

    const modeState = this.buildModeState(game);
    const roundStart = game.mode.onRoundStart(modeState);

    game.phase = 'playing';
    game.timeRemaining = roundStart.playingDuration;

    // Send song preview URL to host only
    if (roundStart.previewUrl) {
      const room = roomManager.getRoom(roomCode);
      if (room) {
        const hostSocket = io.sockets.sockets.get(room.hostSocketId);
        if (hostSocket) {
          if (roundStart.clipDuration) {
            hostSocket.emit('game:clip-info', {
              previewUrl: roundStart.previewUrl,
              clipDuration: roundStart.clipDuration,
            });
          } else {
            hostSocket.emit('game:play-song', {
              previewUrl: roundStart.previewUrl,
            });
          }
        }
      }
    }

    this.broadcastState(roomCode, io);
    this.startTicking(game, roomCode, io, () => this.handlePlayingTimeout(roomCode, io));
  }

  private resumePlaying(roomCode: string, io: GameIO): void {
    const game = this.games.get(roomCode);
    if (!game) return;

    const modeState = this.buildModeState(game);
    const roundStart = game.mode.onRoundStart(modeState);

    game.phase = 'playing';
    // Resume from where the playing timer was when the buzz happened,
    // rather than resetting to the full round duration.
    game.timeRemaining = game.savedPlayingTime ?? roundStart.playingDuration;
    game.savedPlayingTime = null;
    this.broadcastState(roomCode, io);

    // Resend song to host
    const room = roomManager.getRoom(roomCode);
    if (room) {
      const hostSocket = io.sockets.sockets.get(room.hostSocketId);
      if (hostSocket) {
        if (roundStart.clipDuration) {
          hostSocket.emit('game:clip-info', {
            previewUrl: roundStart.previewUrl!,
            clipDuration: roundStart.clipDuration,
          });
        } else {
          hostSocket.emit('game:play-song', { previewUrl: roundStart.previewUrl! });
        }
      }
    }

    this.startTicking(game, roomCode, io, () => this.handlePlayingTimeout(roomCode, io));
  }

  private handlePlayingTimeout(roomCode: string, io: GameIO): void {
    const game = this.games.get(roomCode);
    if (!game) return;

    // During tiebreaker, skip mode-specific elimination logic entirely.
    // Nobody answered → treat as no winner and let startReveal cycle to next song.
    if (game.isTiebreaker) {
      const song = game.songs[game.currentRound];
      game.roundResult = {
        songTitle: song.title,
        songArtist: song.artist,
        albumArtUrl: song.albumArtUrl,
        winnerId: null,
        winnerName: null,
        pointsAwarded: 0,
        answerType: 'none',
      };
      this.startReveal(roomCode, io);
      return;
    }

    const modeState = this.buildModeState(game);
    const result = game.mode.onPlayingTimeout(modeState);

    if (result.roundResult) {
      game.roundResult = result.roundResult;
    }
    if (result.drinkingPrompt !== undefined) {
      game.drinkingPrompt = result.drinkingPrompt;
    }

    this.executeAction(roomCode, result.nextAction, io);
  }

  private handleBuzzerTimeout(roomCode: string, io: GameIO): void {
    const game = this.games.get(roomCode);
    if (!game) return;

    // Notify the timed-out player
    if (game.buzzedPlayerId) {
      const answeringSocket = io.sockets.sockets.get(game.buzzedPlayerId);
      if (answeringSocket) {
        answeringSocket.emit('game:answer-result', {
          correct: false,
          pointsAwarded: 0,
          artistCorrect: false,
          titleCorrect: false,
        });
      }

      // During tiebreaker, a buzzer timeout just disqualifies from this round —
      // no permanent elimination. Resume so other tied players can still buzz.
      if (game.isTiebreaker) {
        if (!game.disqualifiedIds.includes(game.buzzedPlayerId)) {
          game.disqualifiedIds.push(game.buzzedPlayerId);
        }
        game.buzzedPlayerId = null;
        game.buzzedPlayerName = null;

        // Check if all tiebreaker players are disqualified this round
        const allDone = game.tiebreakerIds.every((id) => game.disqualifiedIds.includes(id));
        if (allDone) {
          const song = game.songs[game.currentRound];
          game.roundResult = {
            songTitle: song.title,
            songArtist: song.artist,
            albumArtUrl: song.albumArtUrl,
            winnerId: null,
            winnerName: null,
            pointsAwarded: 0,
            answerType: 'none',
          };
          this.startReveal(roomCode, io);
        } else {
          this.resumePlaying(roomCode, io);
        }
        return;
      }

      // Disqualify (normal rounds)
      if (game.teamMode) {
        this.disqualifyTeam(game, game.buzzedPlayerId);
      } else {
        if (!game.disqualifiedIds.includes(game.buzzedPlayerId)) {
          game.disqualifiedIds.push(game.buzzedPlayerId);
        }
      }
    }

    game.buzzedPlayerId = null;
    game.buzzedPlayerName = null;

    const modeState = this.buildModeState(game);
    const result = game.mode.onBuzzerTimeout(modeState);

    if (result.roundResult) {
      game.roundResult = result.roundResult;
    }
    if (result.drinkingPrompt !== undefined) {
      game.drinkingPrompt = result.drinkingPrompt;
    }

    this.executeAction(roomCode, result.nextAction, io);
  }

  private startReveal(roomCode: string, io: GameIO): void {
    const game = this.games.get(roomCode);
    if (!game) return;

    game.phase = 'reveal';
    game.timeRemaining = game.mode.config.revealDuration;

    this.broadcastState(roomCode, io);

    this.startTicking(game, roomCode, io, () => {
      // Tiebreaker: someone won → game over; nobody answered → next tiebreaker song
      if (game.isTiebreaker) {
        if (game.roundResult?.winnerId) {
          this.finalizeGameOver(roomCode, io);
        } else {
          // Nobody got it — re-run tiebreaker with the next buffer song
          this.startTiebreaker(roomCode, io, game.tiebreakerIds);
        }
        return;
      }

      const modeState = this.buildModeState(game);
      const result = game.mode.onAfterReveal(modeState);

      if (result.nextAction.type === 'game-over') {
        game.currentRound += 1;
        this.endGame(roomCode, io);
      } else if (result.nextAction.type === 'scoreboard') {
        this.startScoreboard(roomCode, io);
      } else {
        this.executeAction(roomCode, result.nextAction, io);
      }
    });
  }

  private startScoreboard(roomCode: string, io: GameIO): void {
    const game = this.games.get(roomCode);
    if (!game) return;

    game.phase = 'scoreboard';
    game.timeRemaining = game.mode.config.scoreboardDuration;

    // Quiet player tracking — only in adult mode
    // Threshold scales with game length: ~30% of total rounds, minimum 2.
    // e.g. 5 rounds → 2, 9 rounds → 3, 12 rounds → 4
    game.quietCallout = null;
    if (game.settings.adultMode) {
      const QUIET_THRESHOLD = Math.max(3, Math.floor(game.settings.roundCount / 3));
      const connected = roomManager.getConnectedPlayers(roomCode).map((p) => p.id);
      const callouts: string[] = [];

      for (const playerId of connected) {
        const prev = game.quietStreaks.get(playerId) ?? 0;
        // If they didn't buzz this round (streak was NOT reset to 0 during handleBuzzerPress)
        const newStreak = prev + 1;
        game.quietStreaks.set(playerId, newStreak);

        if (newStreak >= QUIET_THRESHOLD) {
          const score = game.scores.get(playerId);
          if (score) callouts.push(score.displayName);
          // Reset so they don't get called out every single round after the threshold
          game.quietStreaks.set(playerId, 0);
        }
      }

      if (callouts.length > 0) {
        game.quietCallout = getQuietPlayerPrompt(callouts, QUIET_THRESHOLD);
      }
    }

    this.broadcastState(roomCode, io);
    this.startTicking(game, roomCode, io, () => {
      game.currentRound += 1;

      const modeState = this.buildModeState(game);
      const result = game.mode.onAfterScoreboard(modeState);

      if (result.nextAction.type === 'game-over') {
        this.endGame(roomCode, io);
      } else if (result.nextAction.type === 'next-round') {
        this.startPreRound(roomCode, io);
      } else {
        this.executeAction(roomCode, result.nextAction, io);
      }
    });
  }

  private advanceRound(roomCode: string, io: GameIO): void {
    const game = this.games.get(roomCode);
    if (!game) return;
    game.currentRound += 1;
    this.startPreRound(roomCode, io);
  }

  private nextSubRound(roomCode: string, io: GameIO): void {
    const game = this.games.get(roomCode);
    if (!game) return;

    // Increment sub-round in mode state
    const modeState = game.modeState as { currentSubRound?: number };
    modeState.currentSubRound = (modeState.currentSubRound ?? 0) + 1;

    // Reset per-sub-round state
    game.disqualifiedIds = [];
    game.buzzedPlayerId = null;
    game.buzzedPlayerName = null;

    // Brief transition phase (2s)
    game.phase = 'sub-round-transition';
    game.timeRemaining = 2;
    this.broadcastState(roomCode, io);

    this.startTicking(game, roomCode, io, () => {
      this.startPlaying(roomCode, io);
    });
  }

  private startEliminationReveal(roomCode: string, io: GameIO): void {
    const game = this.games.get(roomCode);
    if (!game || !(game.mode instanceof EliminationMode)) {
      this.startReveal(roomCode, io);
      return;
    }

    const modeState = this.buildModeState(game);
    const targets = game.mode.getEliminationTargets(modeState);

    // Apply permanent eliminations
    if (targets.length > 0) {
      game.mode.applyEliminations(modeState, targets);
      const eliminatedNames = targets
        .map((id) => game.scores.get(id)?.displayName || 'Unknown')
        .join(', ');
      console.log(`[Game] Eliminated: ${eliminatedNames} in room ${roomCode}`);
    }

    // Set disqualifiedIds to exactly who was eliminated this round so the client
    // knows who to display (eliminatedIds is the cumulative permanent store)
    game.disqualifiedIds = targets;

    // Show elimination-reveal phase (5s dramatic reveal)
    game.phase = 'elimination-reveal';
    game.timeRemaining = 5;
    this.broadcastState(roomCode, io);

    this.startTicking(game, roomCode, io, () => {
      // After reveal, go to regular reveal (shows the song answer)
      this.startReveal(roomCode, io);
    });
  }

  private startLastChance(roomCode: string, io: GameIO): void {
    const game = this.games.get(roomCode);
    if (!game || !(game.mode instanceof EliminationMode)) {
      this.advanceRound(roomCode, io);
      return;
    }

    const elimState = (game.modeState as unknown) as { lastChanceUsed: boolean; isLastChanceRound: boolean };
    elimState.lastChanceUsed = true;
    elimState.isLastChanceRound = true;

    // Dramatic 5s countdown phase
    game.phase = 'last-chance';
    game.timeRemaining = 5;
    game.disqualifiedIds = [];
    game.buzzedPlayerId = null;
    game.buzzedPlayerName = null;
    game.roundResult = null;
    game.drinkingPrompt = null;

    this.broadcastState(roomCode, io);

    this.startTicking(game, roomCode, io, () => {
      // After countdown, advance round and play (eliminated players get buzzers)
      game.currentRound += 1;
      this.startPlaying(roomCode, io);
    });
  }

  handleTiebreakerVote(
    roomCode: string,
    voterId: string,
    votedForId: string,
    io: GameIO
  ): { accepted: boolean; error?: string } {
    const game = this.games.get(roomCode);
    if (!game) return { accepted: false, error: 'No active game' };
    if (!game.isTiebreaker) return { accepted: false, error: 'Not in tiebreaker' };
    // Can only vote for actual tiebreaker participants
    if (!game.tiebreakerIds.includes(votedForId)) return { accepted: false, error: 'Invalid vote target' };
    // Tiebreaker participants can't vote for themselves (they're playing)
    if (game.tiebreakerIds.includes(voterId)) return { accepted: false, error: 'Tiebreaker players cannot vote' };
    // Lock voting once someone has buzzed in
    if (game.buzzedPlayerId) return { accepted: false, error: 'Voting closed — someone has buzzed' };

    game.tiebreakerVotes.set(voterId, votedForId);
    this.broadcastState(roomCode, io);
    return { accepted: true };
  }

  private getTiedPlayerIds(game: ServerGameState): string[] {
    if (game.teamMode) return []; // team ties handled separately — share win for now
    const scores = Array.from(game.scores.values()).sort((a, b) => b.score - a.score);
    if (scores.length < 2) return [];
    const topScore = scores[0].score;
    if (topScore === 0) return []; // no one scored — no tiebreaker
    const tied = scores.filter((s) => s.score === topScore);
    return tied.length > 1 ? tied.map((s) => s.playerId) : [];
  }

  private startTiebreaker(roomCode: string, io: GameIO, tiebreakerIds: string[]): void {
    const game = this.games.get(roomCode);
    if (!game) return;

    // Pick the tiebreaker song from the buffer (after the last regular round)
    const songIndex = game.settings.roundCount + game.tiebreakerSongOffset;
    if (songIndex >= game.songs.length) {
      // No more buffer songs — declare a shared win
      console.log(`[Game] No tiebreaker songs left, declaring shared win in room ${roomCode}`);
      this.finalizeGameOver(roomCode, io);
      return;
    }

    game.isTiebreaker = true;
    game.tiebreakerIds = tiebreakerIds;
    game.tiebreakerSongOffset += 1;
    game.currentRound = songIndex;
    game.disqualifiedIds = [];
    game.roundResult = null;
    game.drinkingPrompt = null;
    game.quietCallout = null;
    game.tiebreakerVotes = new Map(); // fresh votes each tiebreaker song

    game.phase = 'tiebreaker';
    game.timeRemaining = 6; // 6s dramatic "SUDDEN DEATH" screen
    this.broadcastState(roomCode, io);

    const names = tiebreakerIds
      .map((id) => game.scores.get(id)?.displayName || 'Unknown')
      .join(' vs ');
    console.log(`[Game] Sudden death: ${names} in room ${roomCode}`);

    // Skip startPreRound — go straight to playing after the tiebreaker screen
    this.startTicking(game, roomCode, io, () => this.startPlaying(roomCode, io));
  }

  private finalizeGameOver(roomCode: string, io: GameIO): void {
    const game = this.games.get(roomCode);
    if (!game) return;

    game.phase = 'game-over';
    game.timeRemaining = 0;
    game.isTiebreaker = false;
    this.clearTimers(game);

    roomManager.setRoomStatus(roomCode, 'finished');
    this.broadcastState(roomCode, io);
    console.log(`[Game] Finished in room ${roomCode}`);
  }

  private startTieVote(roomCode: string, io: GameIO, tiebreakerIds: string[]): void {
    const game = this.games.get(roomCode);
    if (!game) return;

    game.tiebreakerIds = tiebreakerIds; // store who's tied so clients can display names
    game.tieVotes = new Map();
    game.phase = 'tie-vote';
    game.timeRemaining = 15; // 15 seconds to vote
    this.broadcastState(roomCode, io);

    this.startTicking(game, roomCode, io, () => this.resolveTieVote(roomCode, io));
  }

  handleTieVote(
    roomCode: string,
    playerId: string,
    choice: 'sudden-death' | 'share',
    io: GameIO
  ): { accepted: boolean; error?: string } {
    const game = this.games.get(roomCode);
    if (!game) return { accepted: false, error: 'No active game' };
    if (game.phase !== 'tie-vote') return { accepted: false, error: 'Not in tie vote' };

    game.tieVotes.set(playerId, choice);
    this.broadcastState(roomCode, io);

    // Auto-resolve early if everyone has voted
    const connected = roomManager.getConnectedPlayers(roomCode);
    if (game.tieVotes.size >= connected.length) {
      this.clearTimers(game);
      this.resolveTieVote(roomCode, io);
    }

    return { accepted: true };
  }

  private resolveTieVote(roomCode: string, io: GameIO): void {
    const game = this.games.get(roomCode);
    if (!game) return;

    let suddenDeathVotes = 0;
    let shareVotes = 0;
    for (const choice of game.tieVotes.values()) {
      if (choice === 'sudden-death') suddenDeathVotes++;
      else shareVotes++;
    }

    // Majority wins; tie → sudden death (more exciting default)
    if (shareVotes > suddenDeathVotes) {
      this.finalizeGameOver(roomCode, io);
    } else {
      this.startTiebreaker(roomCode, io, game.tiebreakerIds);
    }
  }

  private endGame(roomCode: string, io: GameIO): void {
    const game = this.games.get(roomCode);
    if (!game) return;

    // Offer tie-vote whenever buffer songs exist (audio modes + Name That Lyric all fetch roundCount+3)
    if (!game.isTiebreaker && game.songs.length > game.settings.roundCount) {
      const tied = this.getTiedPlayerIds(game);
      if (tied.length > 1) {
        this.startTieVote(roomCode, io, tied);
        return;
      }
    }

    this.finalizeGameOver(roomCode, io);
  }

  // --- Timer Utilities ---

  private startTicking(
    game: ServerGameState,
    roomCode: string,
    io: GameIO,
    onComplete: () => void
  ): void {
    this.clearTimers(game);

    game.tickTimer = setInterval(() => {
      game.timeRemaining -= 1;
      io.to(roomCode).emit('game:tick', { timeRemaining: game.timeRemaining });

      if (game.timeRemaining <= 0) {
        this.clearTimers(game);
        onComplete();
      }
    }, 1000);
  }

  private clearTimers(game: ServerGameState): void {
    if (game.phaseTimer) {
      clearTimeout(game.phaseTimer);
      game.phaseTimer = null;
    }
    if (game.tickTimer) {
      clearInterval(game.tickTimer);
      game.tickTimer = null;
    }
  }

  // --- Mode State Bridge ---

  private buildModeState(game: ServerGameState): ModeGameState {
    return {
      roomCode: game.roomCode,
      settings: game.settings,
      songs: game.songs,
      currentRound: game.currentRound,
      phase: game.phase,
      scores: game.scores,
      buzzedPlayerId: game.buzzedPlayerId,
      buzzedPlayerName: game.buzzedPlayerName,
      disqualifiedIds: game.disqualifiedIds,
      roundResult: game.roundResult,
      drinkingPrompt: game.drinkingPrompt,
      timeRemaining: game.timeRemaining,
      teamMode: game.teamMode,
      teamCount: game.teamCount,
      teamAssignments: game.teamAssignments,
      modeState: game.modeState,
      getConnectedPlayerIds: () => {
        const connected = roomManager.getConnectedPlayers(game.roomCode);
        return connected.map((p) => p.id);
      },
    };
  }

  // --- Team Helpers ---

  private disqualifyTeam(game: ServerGameState, playerId: string): void {
    const teamId = game.teamAssignments.get(playerId);
    if (teamId === undefined) {
      if (!game.disqualifiedIds.includes(playerId)) {
        game.disqualifiedIds.push(playerId);
      }
      return;
    }

    for (const [memberId, memberTeamId] of game.teamAssignments) {
      if (memberTeamId === teamId && !game.disqualifiedIds.includes(memberId)) {
        game.disqualifiedIds.push(memberId);
      }
    }
  }

  private computeTeamScores(game: ServerGameState): TeamScore[] {
    const teamScores: TeamScore[] = [];

    for (let i = 0; i < game.teamCount; i++) {
      const members: TeamScore['members'] = [];
      let totalScore = 0;
      let totalCorrect = 0;

      for (const [playerId, teamId] of game.teamAssignments) {
        if (teamId === i) {
          const score = game.scores.get(playerId);
          if (score) {
            members.push({
              playerId: score.playerId,
              displayName: score.displayName,
              score: score.score,
              correctAnswers: score.correctAnswers,
            });
            totalScore += score.score;
            totalCorrect += score.correctAnswers;
          }
        }
      }

      teamScores.push({
        teamId: i,
        teamName: TEAM_NAMES[i],
        teamColor: TEAM_COLORS[i],
        totalScore,
        totalCorrect,
        members: members.sort((a, b) => b.score - a.score),
      });
    }

    return teamScores.sort((a, b) => b.totalScore - a.totalScore);
  }

  private getDisqualifiedTeamIds(game: ServerGameState): number[] {
    const disqualifiedTeams = new Set<number>();
    for (const playerId of game.disqualifiedIds) {
      const teamId = game.teamAssignments.get(playerId);
      if (teamId !== undefined) {
        disqualifiedTeams.add(teamId);
      }
    }
    return Array.from(disqualifiedTeams);
  }

  private getGameTeams(game: ServerGameState): Team[] {
    const teams: Team[] = [];
    for (let i = 0; i < game.teamCount; i++) {
      const playerIds: string[] = [];
      for (const [playerId, teamId] of game.teamAssignments) {
        if (teamId === i) playerIds.push(playerId);
      }
      teams.push({
        id: i,
        name: TEAM_NAMES[i],
        color: TEAM_COLORS[i],
        playerIds,
      });
    }
    return teams;
  }

  private broadcastState(roomCode: string, io: GameIO): void {
    const game = this.games.get(roomCode);
    if (!game) return;

    const modeState = this.buildModeState(game);
    const modeClientState = game.mode.buildClientState(modeState);

    // For Elimination, songs.length = roundCount + 5 (buffer songs).
    // Always use settings.roundCount as the authoritative round count.
    const totalRounds = game.settings.roundCount;

    const state: ClientGameState = {
      phase: game.phase,
      currentRound: game.currentRound + 1,
      totalRounds,
      scores: Array.from(game.scores.values()).sort((a, b) => b.score - a.score),
      timeRemaining: game.timeRemaining,
      buzzedPlayerId: game.buzzedPlayerId,
      buzzedPlayerName: game.buzzedPlayerName,
      roundResult: game.roundResult,
      disqualifiedIds: game.disqualifiedIds,
      drinkingPrompt: game.drinkingPrompt,
      quietCallout: game.quietCallout,
      isTiebreaker: game.isTiebreaker || undefined,
      tieVoteCounts: game.phase === 'tie-vote' && game.tieVotes.size > 0
        ? (() => {
            let suddenDeath = 0; let share = 0;
            for (const c of game.tieVotes.values()) { if (c === 'sudden-death') suddenDeath++; else share++; }
            return { suddenDeath, share };
          })()
        : undefined,
      tiebreakerIds: (game.isTiebreaker || game.phase === 'tie-vote') ? game.tiebreakerIds : undefined,
      tiebreakerVoteCounts: game.isTiebreaker && game.tiebreakerVotes.size > 0
        ? (() => {
            const counts: Record<string, number> = {};
            for (const votedForId of game.tiebreakerVotes.values()) {
              counts[votedForId] = (counts[votedForId] ?? 0) + 1;
            }
            return counts;
          })()
        : undefined,
      tiebreakerVotes: (game.isTiebreaker || game.phase === 'game-over') && game.tiebreakerVotes.size > 0
        ? Object.fromEntries(game.tiebreakerVotes)
        : undefined,
      ...modeClientState,
    };

    if (game.teamMode) {
      state.teamMode = true;
      state.teams = this.getGameTeams(game);
      state.teamScores = this.computeTeamScores(game);
      state.disqualifiedTeamIds = this.getDisqualifiedTeamIds(game);

      if (game.phase === 'game-over' && state.teamScores.length > 0) {
        state.winnerTeamId = state.teamScores[0].teamId;
      }
    }

    io.to(roomCode).emit('game:state-update', state);
  }

  // --- Cleanup ---

  cleanupGame(roomCode: string): void {
    const game = this.games.get(roomCode);
    if (!game) return;

    this.clearTimers(game);
    this.games.delete(roomCode);
    console.log(`[Game] Cleaned up game for room ${roomCode}`);
  }

  cleanupRoomRulesData(roomCode: string): void {
    this.rulesShown.delete(roomCode);
  }

  getGame(roomCode: string): ServerGameState | undefined {
    return this.games.get(roomCode);
  }

  // Push the current game state to a single socket (used after mid-game reconnect)
  pushStateTo(roomCode: string, socketId: string, io: GameIO): void {
    const game = this.games.get(roomCode);
    if (!game) return;

    const modeState = this.buildModeState(game);
    const modeClientState = game.mode.buildClientState(modeState);
    const totalRounds = game.settings.roundCount;

    const state: ClientGameState = {
      phase: game.phase,
      currentRound: game.currentRound + 1,
      totalRounds,
      scores: Array.from(game.scores.values()).sort((a, b) => b.score - a.score),
      timeRemaining: game.timeRemaining,
      buzzedPlayerId: game.buzzedPlayerId,
      buzzedPlayerName: game.buzzedPlayerName,
      roundResult: game.roundResult,
      disqualifiedIds: game.disqualifiedIds,
      drinkingPrompt: game.drinkingPrompt,
      quietCallout: game.quietCallout,
      isTiebreaker: game.isTiebreaker || undefined,
      tiebreakerIds: (game.isTiebreaker || game.phase === 'tie-vote') ? game.tiebreakerIds : undefined,
      ...modeClientState,
    };

    const targetSocket = io.sockets.sockets.get(socketId);
    if (targetSocket) {
      targetSocket.emit('game:state-update', state);
    }
  }

  // Update all game state maps when a player reconnects with a new socket ID
  updatePlayerSocketId(roomCode: string, oldId: string, newId: string): void {
    const game = this.games.get(roomCode);
    if (!game) return;

    // scores map
    const score = game.scores.get(oldId);
    if (score) {
      score.playerId = newId;
      game.scores.delete(oldId);
      game.scores.set(newId, score);
    }

    // buzzedPlayerId
    if (game.buzzedPlayerId === oldId) {
      game.buzzedPlayerId = newId;
    }

    // disqualifiedIds
    const dqIdx = game.disqualifiedIds.indexOf(oldId);
    if (dqIdx !== -1) game.disqualifiedIds[dqIdx] = newId;

    // tiebreakerIds
    const tbIdx = game.tiebreakerIds.indexOf(oldId);
    if (tbIdx !== -1) game.tiebreakerIds[tbIdx] = newId;

    // quietStreaks
    const streakVal = game.quietStreaks.get(oldId);
    if (streakVal !== undefined) {
      game.quietStreaks.delete(oldId);
      game.quietStreaks.set(newId, streakVal);
    }

    // teamAssignments (in game state — separate from roomManager's copy)
    const teamId = game.teamAssignments.get(oldId);
    if (teamId !== undefined) {
      game.teamAssignments.delete(oldId);
      game.teamAssignments.set(newId, teamId);
    }

    // tiebreakerVotes (voter ID → voted-for ID)
    const votedFor = game.tiebreakerVotes.get(oldId);
    if (votedFor !== undefined) {
      game.tiebreakerVotes.delete(oldId);
      game.tiebreakerVotes.set(newId, votedFor);
    }
    // Also update if the old ID was voted for
    for (const [voter, target] of game.tiebreakerVotes) {
      if (target === oldId) game.tiebreakerVotes.set(voter, newId);
    }

    // tieVotes
    const tieVote = game.tieVotes.get(oldId);
    if (tieVote !== undefined) {
      game.tieVotes.delete(oldId);
      game.tieVotes.set(newId, tieVote);
    }

    console.log(`[Game] Updated player socket ${oldId} → ${newId} in room ${roomCode}`);
  }
}

export const gameManager = new GameManager();
