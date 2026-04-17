'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import type { ClientToServerEvents, ServerToClientEvents } from '@shared/types/socket-events';
import type { Player, RoomStatus } from '@shared/types/room';
import type { ClientGameState, GameSettings } from '@shared/types/game';
import type { Team, TeamAssignments } from '@shared/types/team';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export interface RoomState {
  code: string;
  players: Player[];
  status: RoomStatus;
  teamMode?: boolean;
  teams?: Team[];
  teamAssignments?: TeamAssignments;
}

interface RoomContextValue {
  socket: TypedSocket;
  room: RoomState | null;
  error: string | null;
  isLoading: boolean;
  isHost: boolean;
  gameState: ClientGameState | null;
  songUrl: string | null;
  answerResult: { correct: boolean; pointsAwarded: number; artistCorrect: boolean; titleCorrect: boolean } | null;
  createRoom: () => Promise<string | null>;
  joinRoom: (roomCode: string, displayName: string) => Promise<boolean>;
  leaveRoom: () => void;
  syncRoomState: (roomCode: string) => Promise<boolean>;
  clearError: () => void;
  startGame: (settings: GameSettings) => Promise<boolean>;
  pressBuzzer: () => Promise<boolean>;
  submitAnswer: (artist: string, title: string) => Promise<boolean>;
  resetToLobby: () => Promise<boolean>;
  kickPlayer: (playerId: string) => Promise<boolean>;
  setTeamMode: (enabled: boolean, teamCount?: number) => Promise<boolean>;
  shuffleTeams: () => Promise<boolean>;
  movePlayerToTeam: (playerId: string, targetTeamId: number) => Promise<boolean>;
  voteTiebreaker: (votedForId: string) => Promise<boolean>;
  voteTie: (choice: 'sudden-death' | 'share') => Promise<boolean>;
  skipSong: () => Promise<boolean>;
}

const RoomContext = createContext<RoomContextValue | null>(null);

export function RoomProvider({ children }: { children: React.ReactNode }) {
  const socketRef = useRef<TypedSocket | null>(null);
  const [room, setRoom] = useState<RoomState | null>(null);
  const roomRef = useRef<RoomState | null>(null); // always reflects latest room for use in event handlers
  const playerNameRef = useRef<string | null>(null); // display name for reconnect
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [gameState, setGameState] = useState<ClientGameState | null>(null);
  const [songUrl, setSongUrl] = useState<string | null>(null);
  const [answerResult, setAnswerResult] = useState<RoomContextValue['answerResult']>(null);

  // Initialize socket once
  if (!socketRef.current) {
    socketRef.current = io(SERVER_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    }) as TypedSocket;
  }

  const socket = socketRef.current;

  const createRoom = useCallback((): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    return new Promise((resolve) => {
      socket.emit('room:create', (response) => {
        setIsLoading(false);
        if (response.success && response.roomCode) {
          setRoom({ code: response.roomCode, players: [], status: 'lobby' });
          setIsHost(true);
          resolve(response.roomCode);
        } else {
          setError(response.error || 'Failed to create room');
          resolve(null);
        }
      });
    });
  }, [socket]);

  const joinRoom = useCallback(
    (roomCode: string, displayName: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      return new Promise((resolve) => {
        socket.emit('room:join', { roomCode, displayName }, (response) => {
          setIsLoading(false);
          if (response.success && response.room) {
            const newRoom = {
              code: response.room.code,
              players: response.room.players,
              status: response.room.status,
              teamMode: response.room.teamMode,
              teams: response.room.teams,
              teamAssignments: response.room.teamAssignments,
            };
            setRoom(newRoom);
            roomRef.current = newRoom;
            playerNameRef.current = displayName;
            // Persist so page-refresh reconnect can rejoin automatically
            sessionStorage.setItem('bb_room', response.room.code);
            sessionStorage.setItem('bb_name', displayName);
            setIsHost(false);
            resolve(true);
          } else {
            setError(response.error || 'Failed to join room');
            resolve(false);
          }
        });
      });
    },
    [socket]
  );

  const leaveRoom = useCallback(() => {
    socket.emit('room:leave');
    setRoom(null);
    setIsHost(false);
    setGameState(null);
    setSongUrl(null);
    setAnswerResult(null);
    sessionStorage.removeItem('bb_room');
    sessionStorage.removeItem('bb_name');
  }, [socket]);

  const syncRoomState = useCallback(
    (roomCode: string): Promise<boolean> => {
      return new Promise((resolve) => {
        socket.emit('room:get-state', { roomCode }, (response) => {
          if (response.success && response.room) {
            setRoom({
              code: response.room.code,
              players: response.room.players,
              status: response.room.status,
              teamMode: response.room.teamMode,
              teams: response.room.teams,
              teamAssignments: response.room.teamAssignments,
            });
            setIsHost(response.isHost || false);
            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
    },
    [socket]
  );

  const clearError = useCallback(() => setError(null), []);

  // Game actions

  const startGame = useCallback(
    (settings: GameSettings): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      return new Promise((resolve) => {
        socket.emit('game:start', { settings }, (response) => {
          setIsLoading(false);
          if (response.success) {
            resolve(true);
          } else {
            setError(response.error || 'Failed to start game');
            resolve(false);
          }
        });
      });
    },
    [socket]
  );

  const pressBuzzer = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      socket.emit('game:buzzer-press', (response) => {
        resolve(response.accepted);
      });
    });
  }, [socket]);

  const submitAnswer = useCallback(
    (artist: string, title: string): Promise<boolean> => {
      return new Promise((resolve) => {
        socket.emit('game:answer-submit', { artist, title }, (response) => {
          resolve(response.received);
        });
      });
    },
    [socket]
  );

  const resetToLobby = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      socket.emit('game:play-again', (response) => {
        if (response.success) {
          setGameState(null);
          setSongUrl(null);
          setAnswerResult(null);
        }
        resolve(response.success);
      });
    });
  }, [socket]);

  const kickPlayer = useCallback(
    (playerId: string): Promise<boolean> => {
      return new Promise((resolve) => {
        socket.emit('room:kick-player', { playerId }, (response) => {
          resolve(response.success);
        });
      });
    },
    [socket]
  );

  const setTeamMode = useCallback(
    (enabled: boolean, teamCount?: number): Promise<boolean> => {
      return new Promise((resolve) => {
        socket.emit('room:set-team-mode', { enabled, teamCount }, (response) => {
          resolve(response.success);
        });
      });
    },
    [socket]
  );

  const shuffleTeams = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      socket.emit('room:shuffle-teams', (response) => {
        resolve(response.success);
      });
    });
  }, [socket]);

  const movePlayerToTeam = useCallback(
    (playerId: string, targetTeamId: number): Promise<boolean> => {
      return new Promise((resolve) => {
        socket.emit('room:move-player-team', { playerId, targetTeamId }, (response) => {
          resolve(response.success);
        });
      });
    },
    [socket]
  );

  const voteTie = useCallback(
    (choice: 'sudden-death' | 'share'): Promise<boolean> => {
      return new Promise((resolve) => {
        socket.emit('game:tie-vote', { choice }, (response) => {
          resolve(response.accepted);
        });
      });
    },
    [socket]
  );

  const skipSong = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      socket.emit('game:skip-song', (response) => {
        resolve(response.success);
      });
    });
  }, [socket]);

  const voteTiebreaker = useCallback(
    (votedForId: string): Promise<boolean> => {
      return new Promise((resolve) => {
        socket.emit('game:tiebreaker-vote', { votedForId }, (response) => {
          resolve(response.accepted);
        });
      });
    },
    [socket]
  );

  // Listen for room events
  useEffect(() => {
    const onPlayerJoined = ({ players }: { player: Player; players: Player[] }) => {
      setRoom((prev) => (prev ? { ...prev, players } : null));
    };

    const onPlayerLeft = ({ players }: { playerId: string; players: Player[] }) => {
      setRoom((prev) => (prev ? { ...prev, players } : null));
    };

    const onPlayerDisconnected = ({ playerId }: { playerId: string }) => {
      setRoom((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          players: prev.players.map((p) =>
            p.id === playerId ? { ...p, isConnected: false } : p
          ),
        };
      });
    };

    const onPlayerReconnected = ({ playerId, displayName }: { playerId: string; displayName: string }) => {
      setRoom((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          players: prev.players.map((p) =>
            p.displayName.toLowerCase() === displayName.toLowerCase()
              ? { ...p, id: playerId, isConnected: true }
              : p
          ),
        };
      });
    };

    const onStateSync = (data: { code: string; players: Player[]; status: RoomStatus; teamMode?: boolean; teams?: Team[]; teamAssignments?: TeamAssignments }) => {
      setRoom({
        code: data.code,
        players: data.players,
        status: data.status,
        teamMode: data.teamMode,
        teams: data.teams,
        teamAssignments: data.teamAssignments,
      });
      // Clear game state when room resets to lobby (play-again flow)
      if (data.status === 'lobby') {
        setGameState(null);
        setSongUrl(null);
        setAnswerResult(null);
      }
    };

    const onRoomClosed = () => {
      setRoom(null);
      setIsHost(false);
      setGameState(null);
      setSongUrl(null);
      setAnswerResult(null);
      sessionStorage.removeItem('bb_room');
      sessionStorage.removeItem('bb_name');
      setError('Room has been closed');
    };

    socket.on('room:player-joined', onPlayerJoined);
    socket.on('room:player-left', onPlayerLeft);
    socket.on('room:player-disconnected', onPlayerDisconnected);
    socket.on('room:player-reconnected', onPlayerReconnected);
    socket.on('room:state-sync', onStateSync);
    const onKicked = ({ reason }: { reason: string }) => {
      setRoom(null);
      setIsHost(false);
      setGameState(null);
      setSongUrl(null);
      setAnswerResult(null);
      sessionStorage.removeItem('bb_room');
      sessionStorage.removeItem('bb_name');
      setError(reason);
    };

    const onTeamsUpdated = ({ teams, teamAssignments }: { teams: Team[]; teamAssignments: TeamAssignments }) => {
      setRoom((prev) => prev ? { ...prev, teamMode: true, teams, teamAssignments } : null);
    };

    socket.on('room:closed', onRoomClosed);
    socket.on('room:kicked', onKicked);
    socket.on('room:teams-updated', onTeamsUpdated);

    return () => {
      socket.off('room:player-joined', onPlayerJoined);
      socket.off('room:player-left', onPlayerLeft);
      socket.off('room:player-disconnected', onPlayerDisconnected);
      socket.off('room:player-reconnected', onPlayerReconnected);
      socket.off('room:state-sync', onStateSync);
      socket.off('room:closed', onRoomClosed);
      socket.off('room:kicked', onKicked);
      socket.off('room:teams-updated', onTeamsUpdated);
    };
  }, [socket]);

  // On socket reconnect (or page refresh), re-join the room so we receive events again.
  // Socket.io reconnection assigns a new socket.id — the server won't route
  // game events to us until we re-subscribe to the room channel.
  useEffect(() => {
    const onConnect = () => {
      let currentRoom = roomRef.current;
      let name = playerNameRef.current;

      // Page refresh clears in-memory refs — fall back to sessionStorage
      if (!currentRoom || !name) {
        const savedRoom = sessionStorage.getItem('bb_room');
        const savedName = sessionStorage.getItem('bb_name');
        if (savedRoom && savedName) {
          name = savedName;
          currentRoom = { code: savedRoom, players: [], status: 'lobby' };
        }
      }

      if (!currentRoom || !name) return; // not in a room, nothing to do

      console.log('[Socket] Reconnected — rejoining room', currentRoom.code);
      socket.emit('room:join', { roomCode: currentRoom.code, displayName: name }, (response) => {
        if (response.success && response.room) {
          const updated = {
            code: response.room.code,
            players: response.room.players,
            status: response.room.status,
            teamMode: response.room.teamMode,
            teams: response.room.teams,
            teamAssignments: response.room.teamAssignments,
          };
          setRoom(updated);
          roomRef.current = updated;
          playerNameRef.current = name;
        } else {
          // Room gone or player kicked — clear saved session so we don't loop
          sessionStorage.removeItem('bb_room');
          sessionStorage.removeItem('bb_name');
        }
      });
    };

    socket.on('connect', onConnect);
    return () => { socket.off('connect', onConnect); };
  }, [socket]);

  // Listen for game events
  useEffect(() => {
    const onGameStateUpdate = (state: ClientGameState) => {
      setGameState(state);
      setAnswerResult(null); // Clear answer result on phase change
      // Update room status based on game phase
      if (state.phase === 'game-over') {
        setRoom((prev) => (prev ? { ...prev, status: 'finished' } : null));
      } else {
        setRoom((prev) => (prev ? { ...prev, status: 'playing' } : null));
      }
    };

    const onPlaySong = ({ previewUrl }: { previewUrl: string }) => {
      setSongUrl(previewUrl);
    };

    const onTick = ({ timeRemaining }: { timeRemaining: number }) => {
      setGameState((prev) => (prev ? { ...prev, timeRemaining } : null));
    };

    const onAnswerResult = (result: { correct: boolean; pointsAwarded: number; artistCorrect: boolean; titleCorrect: boolean }) => {
      setAnswerResult(result);
    };

    const onBuzzerLocked = ({ buzzedPlayerId, buzzedPlayerName }: { buzzedPlayerId: string; buzzedPlayerName: string }) => {
      setGameState((prev) =>
        prev ? { ...prev, buzzedPlayerId, buzzedPlayerName } : null
      );
    };

    const onClipInfo = ({ previewUrl, clipDuration }: { previewUrl: string; clipDuration: number }) => {
      setSongUrl(previewUrl);
      setGameState((prev) => prev ? { ...prev, clipDuration } : null);
    };

    socket.on('game:state-update', onGameStateUpdate);
    socket.on('game:play-song', onPlaySong);
    socket.on('game:tick', onTick);
    socket.on('game:answer-result', onAnswerResult);
    socket.on('game:buzzer-locked', onBuzzerLocked);
    socket.on('game:clip-info', onClipInfo);

    return () => {
      socket.off('game:state-update', onGameStateUpdate);
      socket.off('game:play-song', onPlaySong);
      socket.off('game:tick', onTick);
      socket.off('game:answer-result', onAnswerResult);
      socket.off('game:buzzer-locked', onBuzzerLocked);
      socket.off('game:clip-info', onClipInfo);
    };
  }, [socket]);

  return (
    <RoomContext.Provider
      value={{
        socket,
        room,
        error,
        isLoading,
        isHost,
        gameState,
        songUrl,
        answerResult,
        createRoom,
        joinRoom,
        leaveRoom,
        syncRoomState,
        clearError,
        startGame,
        pressBuzzer,
        submitAnswer,
        resetToLobby,
        kickPlayer,
        setTeamMode,
        shuffleTeams,
        movePlayerToTeam,
        voteTiebreaker,
        voteTie,
        skipSong,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}

export function useRoom() {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
}
