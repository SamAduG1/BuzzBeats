'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import HostGameScreen from '@/components/host/GameScreen';
import TeamPlayerList from '@/components/host/TeamPlayerList';
import { useRoom } from '@/context/RoomContext';
import { AVAILABLE_GENRES, AVAILABLE_DECADES } from '@shared/types/game';
import { GameModeId, AVAILABLE_GAME_MODES } from '@shared/types/gameMode';
import GameModeIcon from '@/components/ui/GameModeIcon';
import { useSoundEffects } from '@/hooks/useSoundEffects';

const ROUND_OPTIONS = [5, 10, 15, 20];
const TIMER_OPTIONS = [15, 30];
const LYRIC_TIMER_OPTIONS = [30, 45, 60];

const MODE_COLORS: Record<string, string> = {
  'classic': '#00f0ff',
  'speed': '#ffe600',
  'snippet': '#39ff14',
  'elimination': '#ff1744',
  'name-that-lyric': '#b400ff',
};

// All-cyan speaker logo for host
function SpeakerLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="4" width="24" height="40" rx="2" stroke="#00f0ff" strokeWidth="2" fill="#0a0a0f"
        style={{ filter: 'drop-shadow(0 0 6px rgba(0,240,255,0.5))' }}/>
      <circle cx="24" cy="16" r="6" stroke="#00f0ff" strokeWidth="2" fill="none"
        style={{ filter: 'drop-shadow(0 0 8px rgba(0,240,255,0.6))' }}/>
      <circle cx="24" cy="16" r="3" fill="#00f0ff"
        style={{ filter: 'drop-shadow(0 0 6px rgba(0,240,255,0.8))' }}/>
      <circle cx="24" cy="32" r="6" stroke="#00f0ff" strokeWidth="2" fill="none"
        style={{ filter: 'drop-shadow(0 0 8px rgba(0,240,255,0.4))' }}/>
      <circle cx="24" cy="32" r="3" fill="#00f0ff"
        style={{ filter: 'drop-shadow(0 0 6px rgba(0,240,255,0.6))' }}/>
    </svg>
  );
}

// Toggle switch — label always sits right next to it
function ToggleSwitch({ on, onClick, color = '#00f0ff' }: { on: boolean; onClick: () => void; color?: string }) {
  return (
    <button
      onClick={onClick}
      className="relative w-11 h-6 rounded-full transition-all cursor-pointer flex-shrink-0"
      style={{ background: on ? color : 'rgba(255,255,255,0.12)' }}
    >
      <span
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
        style={{ left: on ? '1.25rem' : '0.125rem' }}
      />
    </button>
  );
}

// Shared label style used for all settings — bold, uppercase, same weight
function SettingLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-xs font-bold uppercase tracking-widest mb-2.5"
      style={{ color: '#e0e0ff', fontFamily: 'var(--font-orbitron), sans-serif' }}
    >
      {children}
    </p>
  );
}

function HostLobbyContent() {
  const searchParams = useSearchParams();
  const roomCode = searchParams.get('code') || '';
  const { room, isLoading, syncRoomState, startGame, kickPlayer, setTeamMode, shuffleTeams, movePlayerToTeam } = useRoom();

  const [gameMode, setGameModeRaw] = useState<GameModeId | null>(null);
  const [roundCount, setRoundCount] = useState(5);
  const [timePerRound, setTimePerRound] = useState(30);

  const setGameMode = (id: GameModeId) => {
    setGameModeRaw(id);
    // Reset timer to a sensible default for each mode's options
    if (id === 'name-that-lyric') setTimePerRound(45);
    else if (id !== 'speed' && id !== 'snippet') setTimePerRound(30);
  };
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedDecades, setSelectedDecades] = useState<string[]>([]);
  const [adultMode, setAdultMode] = useState(false);
  const [teamCount, setTeamCount] = useState(2);
  const [eliminationSubMode, setEliminationSubMode] = useState<'last-one-standing' | 'fixed-rounds'>('last-one-standing');
  const [showQR, setShowQR] = useState(false);
  const [musicMuted, setMusicMuted] = useState(false);
  const { startLobbyAmbience, stopLobbyAmbience, setLobbyAmbienceVolume } = useSoundEffects();

  // Start ambience when in lobby, stop it when in game. Reacts to status
  // changes so music resumes when the host returns from a finished game.
  const isInGame = room?.status === 'playing' || room?.status === 'finished';
  useEffect(() => {
    if (isInGame) {
      stopLobbyAmbience();
      return;
    }
    startLobbyAmbience();
    return () => { stopLobbyAmbience(); };
  }, [isInGame, startLobbyAmbience, stopLobbyAmbience]);

  const toggleMusic = () => {
    setMusicMuted(m => {
      const next = !m;
      setLobbyAmbienceVolume(next ? 0 : 0.45);
      return next;
    });
  };

  const toggleGenre = (g: string) =>
    setSelectedGenres((prev) => prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]);
  const toggleDecade = (d: string) =>
    setSelectedDecades((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);

  useEffect(() => {
    if (!room && roomCode) syncRoomState(roomCode);
  }, [room, roomCode, syncRoomState]);

  const players = room?.players || [];
  const displayCode = room?.code || roomCode;

  if (room?.status === 'playing' || room?.status === 'finished') {
    return (
      <main className="min-h-screen bg-[#0a0a0f]">
        <div className="max-w-6xl mx-auto px-10 py-8">
          <HostGameScreen />
        </div>
      </main>
    );
  }

  const handleToggleTeamMode = async (enabled: boolean) => {
    await setTeamMode(enabled, enabled ? teamCount : undefined);
  };
  const handleTeamCountChange = async (count: number) => {
    setTeamCount(count);
    await setTeamMode(true, count);
  };
  const handleStartGame = async () => {
    if (!gameMode) return;
    await startGame({
      gameMode,
      roundCount,
      timePerRound: gameMode === 'speed' ? 10 : timePerRound,
      genres: selectedGenres,
      decades: selectedDecades,
      adultMode,
      teamMode: room?.teamMode || false,
      teamCount: room?.teamMode ? teamCount : undefined,
      eliminationSubMode: gameMode === 'elimination' ? eliminationSubMode : undefined,
    });
  };

  const modeInfo = gameMode ? AVAILABLE_GAME_MODES.find((m) => m.id === gameMode) : null;
  const modeMinPlayers = modeInfo?.minPlayers ?? 2;
  const minPlayers = room?.teamMode ? Math.max(4, modeMinPlayers) : modeMinPlayers;
  const canStart = !!gameMode && players.length >= minPlayers && !isLoading;
  const accentColor = gameMode ? (MODE_COLORS[gameMode] ?? '#00f0ff') : '#00f0ff';

  const joinUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/play?code=${displayCode}`
    : `http://localhost:3000/play?code=${displayCode}`;

  // Pill button style for selector options (rounds, timer, teams)
  const pillStyle = (active: boolean, color = '#00f0ff') => ({
    background: active ? `${color}18` : 'transparent',
    border: active ? `1px solid ${color}80` : '1px solid rgba(255,255,255,0.1)',
    color: active ? color : '#8888aa',
    fontFamily: 'var(--font-jetbrains-mono), monospace',
  } as React.CSSProperties);

  return (
    // Outer: full-screen background
    <main className="min-h-screen bg-[#0a0a0f] flex justify-center">
      {/* Inner: max-width container with side margins */}
      <div className="w-full max-w-[1400px] flex flex-col">

        {/* ── Header ── */}
        <header
          className="flex items-center justify-between px-8 py-4 border-b flex-shrink-0"
          style={{ borderColor: 'rgba(0,240,255,0.08)' }}
        >
          {/* Clickable logo → home */}
          <button
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <SpeakerLogo size={32} />
            <div className="text-left">
              <span
                className="text-xl font-bold tracking-tight block leading-none"
                style={{
                  fontFamily: 'var(--font-orbitron), sans-serif',
                  color: '#00f0ff',
                  textShadow: '0 0 16px rgba(0,240,255,0.5)',
                }}
              >
                BuzzBeats
              </span>
              <span className="text-xs block mt-0.5" style={{ color: '#8888aa' }}>Setup your game</span>
            </div>
          </button>

          {/* Music mute toggle */}
          <button
            onClick={toggleMusic}
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all cursor-pointer"
            style={{
              background: musicMuted ? 'rgba(255,255,255,0.05)' : 'rgba(0,240,255,0.06)',
              border: musicMuted ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,240,255,0.25)',
            }}
            title={musicMuted ? 'Unmute lobby music' : 'Mute lobby music'}
          >
            {musicMuted ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555577" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              </svg>
            )}
            <span className="text-xs" style={{ color: musicMuted ? '#555577' : '#00f0ff', fontFamily: 'var(--font-orbitron), sans-serif' }}>
              {musicMuted ? 'MUTED' : 'MUSIC'}
            </span>
          </button>

          {/* Room code + QR */}
          <div className="relative">
            <div
              className="flex items-center gap-3 px-5 py-2.5 rounded-xl cursor-default"
              style={{
                background: 'rgba(0,240,255,0.05)',
                border: '1.5px solid rgba(0,240,255,0.45)',
                boxShadow: '0 0 20px rgba(0,240,255,0.15)',
              }}
            >
              <span
                className="text-xs uppercase tracking-widest"
                style={{ color: '#8888aa', fontFamily: 'var(--font-orbitron), sans-serif' }}
              >
                Room Code
              </span>
              <span
                className="text-2xl font-bold tracking-[0.2em]"
                style={{
                  fontFamily: 'var(--font-jetbrains-mono), monospace',
                  color: '#00f0ff',
                  textShadow: '0 0 20px rgba(0,240,255,0.7)',
                }}
              >
                {displayCode}
              </span>
              <button
                onClick={() => setShowQR((v) => !v)}
                className="cursor-pointer opacity-50 hover:opacity-100 transition-opacity ml-1"
                style={{ color: '#00f0ff' }}
                title="Show QR code"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1"/>
                  <rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/>
                  <path d="M14 14h3v3h-3zM17 17h4v4h-4zM14 21h3"/>
                </svg>
              </button>
            </div>

            {showQR && (
              <div
                className="absolute right-0 top-full mt-2 p-3 rounded-2xl z-50"
                style={{
                  background: '#12121a',
                  border: '1px solid rgba(0,240,255,0.2)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
                }}
              >
                <div className="bg-white rounded-lg p-2">
                  <QRCodeSVG value={joinUrl} size={130} bgColor="#ffffff" fgColor="#0a0a0f" level="M" />
                </div>
                <p className="text-center text-xs mt-2" style={{ color: '#8888aa' }}>Scan to join</p>
              </div>
            )}
          </div>
        </header>

        {/* ── Body ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* ── Left: Players — wider than before ── */}
          <aside
            className="w-80 flex-shrink-0 flex flex-col"
            style={{ background: '#111118', borderRight: '1px solid rgba(0,240,255,0.1)' }}
          >
            <div
              className="px-5 py-4 border-b flex items-center gap-2.5"
              style={{ borderColor: 'rgba(0,240,255,0.1)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" strokeWidth="2.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <span
                className="text-sm font-bold uppercase tracking-widest"
                style={{ color: '#00f0ff', fontFamily: 'var(--font-orbitron), sans-serif' }}
              >
                Players ({players.length})
              </span>
            </div>

            <div className="flex-1 overflow-y-auto py-3">
              {room?.teamMode && room.teams ? (
                <div className="px-4">
                  <TeamPlayerList
                    players={players}
                    teams={room.teams}
                    teamCount={teamCount}
                    onKick={kickPlayer}
                    onMovePlayer={movePlayerToTeam}
                  />
                </div>
              ) : players.length === 0 ? (
                <div className="px-5 py-12 text-center">
                  <p className="text-sm" style={{ color: '#8888aa' }}>Waiting for players...</p>
                  <p className="text-xs mt-1" style={{ color: '#8888aa', opacity: 0.5 }}>Share the room code above</p>
                </div>
              ) : (
                <div className="space-y-2 px-3">
                  {players.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl group"
                      style={{
                        background: '#1a1a26',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{
                          background: p.isConnected ? '#39ff14' : '#ff1744',
                          boxShadow: p.isConnected ? '0 0 8px rgba(57,255,20,0.8)' : '0 0 8px rgba(255,23,68,0.8)',
                        }}
                      />
                      <span className="flex-1 text-sm" style={{ color: '#e0e0ff' }}>{p.displayName}</span>
                      <button
                        onClick={() => kickPlayer(p.id)}
                        className="text-[10px] opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-opacity cursor-pointer"
                        style={{ color: '#ff1744', fontFamily: 'var(--font-orbitron), sans-serif' }}
                      >
                        KICK
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* ── Right: Mode + Settings ── */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-8 py-6">

              {/* ── INITIAL STATE: Full mode grid ── */}
              {gameMode === null && (
                <div>
                  <p
                    className="text-base font-bold mb-5"
                    style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#e0e0ff' }}
                  >
                    Select Game Mode
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {AVAILABLE_GAME_MODES.map((mode) => {
                      const mColor = MODE_COLORS[mode.id] ?? '#00f0ff';
                      return (
                        <button
                          key={mode.id}
                          onClick={() => mode.available && setGameMode(mode.id as GameModeId)}
                          disabled={!mode.available}
                          className={`relative p-6 rounded-2xl text-left transition-all duration-200 ${
                            mode.available ? 'cursor-pointer hover:scale-[1.02]' : 'cursor-not-allowed opacity-40'
                          } ${mode.id === 'name-that-lyric' ? 'col-span-2' : ''}`}
                          style={{
                            background: '#12121a',
                            border: '1px solid rgba(255,255,255,0.07)',
                          }}
                          onMouseEnter={(e) => {
                            if (mode.available) {
                              (e.currentTarget as HTMLElement).style.border = `1px solid ${mColor}55`;
                              (e.currentTarget as HTMLElement).style.boxShadow = `0 0 24px ${mColor}18`;
                            }
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.07)';
                            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                          }}
                        >
                          {!mode.available && (
                            <span
                              className="absolute top-3 right-3 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded"
                              style={{ color: '#8888aa', background: 'rgba(255,255,255,0.08)' }}
                            >
                              Soon
                            </span>
                          )}
                          <div className="mb-3"><GameModeIcon id={mode.id} size={30} /></div>
                          <span
                            className="text-base font-bold block mb-1.5"
                            style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#e0e0ff' }}
                          >
                            {mode.name}
                          </span>
                          <span className="text-sm leading-snug block" style={{ color: '#8888aa' }}>
                            {mode.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── SELECTED STATE: Expanded hero + all settings ── */}
              {gameMode !== null && modeInfo && (() => {
                const otherModes = AVAILABLE_GAME_MODES.filter((m) => m.id !== gameMode);
                return (
                  <div style={{ animation: 'fadeSlideIn 0.2s ease' }}>

                    {/* Hero card */}
                    <div
                      className="rounded-2xl p-6 mb-5"
                      style={{
                        background: `linear-gradient(135deg, ${accentColor}0e 0%, transparent 100%)`,
                        border: `2px solid ${accentColor}`,
                        boxShadow: `0 0 30px ${accentColor}22`,
                      }}
                    >
                      {/* Mode header row */}
                      <div className="flex items-center gap-4 mb-6">
                        <GameModeIcon id={modeInfo.id} size={36} />
                        <div>
                          <h2
                            className="text-xl font-bold"
                            style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: accentColor }}
                          >
                            {modeInfo.name}
                          </h2>
                          <p className="text-sm mt-0.5" style={{ color: '#8888aa' }}>{modeInfo.description}</p>
                        </div>
                      </div>

                      {/* ── Settings — all use same bold label style ── */}
                      <div
                        className="space-y-6 border-t pt-6"
                        style={{ borderColor: `${accentColor}20` }}
                      >

                        {/* Rounds + Timer side by side */}
                        <div className="flex flex-wrap gap-8">
                          {/* Rounds — hidden for Elimination last-one-standing (round count is automatic) */}
                          {!(gameMode === 'elimination' && eliminationSubMode === 'last-one-standing') && (
                          <div>
                            <SettingLabel>{gameMode === 'snippet' ? 'Songs' : 'Rounds'}</SettingLabel>
                            <div className="flex gap-2">
                              {ROUND_OPTIONS.map((n) => (
                                <button
                                  key={n}
                                  onClick={() => setRoundCount(n)}
                                  className="w-12 py-2 rounded-xl text-sm font-bold border transition-all cursor-pointer"
                                  style={pillStyle(roundCount === n, accentColor)}
                                >
                                  {n}
                                </button>
                              ))}
                            </div>
                          </div>
                          )}

                          {/* Timer */}
                          {gameMode === 'speed' && (
                            <div>
                              <SettingLabel>Timer</SettingLabel>
                              <div
                                className="px-4 py-2 rounded-xl text-sm font-bold inline-block"
                                style={{
                                  color: accentColor,
                                  background: `${accentColor}15`,
                                  border: `1px solid ${accentColor}40`,
                                  fontFamily: 'var(--font-jetbrains-mono), monospace',
                                }}
                              >
                                10s (fixed)
                              </div>
                            </div>
                          )}
                          {gameMode !== 'speed' && gameMode !== 'snippet' && (
                            <div>
                              <SettingLabel>Timer</SettingLabel>
                              <div className="flex gap-2">
                                {(gameMode === 'name-that-lyric' ? LYRIC_TIMER_OPTIONS : TIMER_OPTIONS).map((t) => (
                                  <button
                                    key={t}
                                    onClick={() => setTimePerRound(t)}
                                    className="px-5 py-2 rounded-xl text-sm font-bold border transition-all cursor-pointer"
                                    style={pillStyle(timePerRound === t, accentColor)}
                                  >
                                    {t}s
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Elimination sub-mode */}
                        {gameMode === 'elimination' && (
                          <div>
                            <SettingLabel>Elimination Style</SettingLabel>
                            <div className="flex gap-3">
                              {([
                                { value: 'last-one-standing' as const, label: 'Last One Standing', desc: 'Rounds until 1 remains' },
                                { value: 'fixed-rounds' as const, label: 'Fixed Rounds', desc: 'Set number of rounds' },
                              ]).map((sub) => (
                                <button
                                  key={sub.value}
                                  onClick={() => setEliminationSubMode(sub.value)}
                                  className="flex-1 py-3 px-4 rounded-xl text-sm font-bold border transition-all cursor-pointer text-left"
                                  style={{
                                    background: eliminationSubMode === sub.value ? `${accentColor}15` : 'transparent',
                                    border: eliminationSubMode === sub.value ? `1px solid ${accentColor}70` : '1px solid rgba(255,255,255,0.1)',
                                    color: eliminationSubMode === sub.value ? accentColor : '#8888aa',
                                  }}
                                >
                                  <span className="block">{sub.label}</span>
                                  <span className="block text-xs font-normal mt-0.5" style={{ color: '#8888aa' }}>{sub.desc}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Genres */}
                        {(modeInfo.usesAudio !== false || gameMode === 'name-that-lyric') && (
                          <div>
                            <SettingLabel>
                              Genres{' '}
                              <span className="normal-case font-normal tracking-normal" style={{ color: '#8888aa', opacity: 0.7 }}>
                                (all if none selected)
                              </span>
                            </SettingLabel>
                            <div className="flex flex-wrap gap-2">
                              {AVAILABLE_GENRES.map((genre) => (
                                <button
                                  key={genre}
                                  onClick={() => toggleGenre(genre)}
                                  className="px-4 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer"
                                  style={{
                                    ...pillStyle(selectedGenres.includes(genre), accentColor),
                                    fontFamily: 'var(--font-orbitron), sans-serif',
                                  }}
                                >
                                  {genre}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Decades */}
                        {(modeInfo.usesAudio !== false || gameMode === 'name-that-lyric') && (
                          <div>
                            <SettingLabel>
                              Decades{' '}
                              <span className="normal-case font-normal tracking-normal" style={{ color: '#8888aa', opacity: 0.7 }}>
                                (all if none selected)
                              </span>
                            </SettingLabel>
                            <div className="flex flex-wrap gap-2">
                              {AVAILABLE_DECADES.map((decade) => (
                                <button
                                  key={decade.value}
                                  onClick={() => toggleDecade(decade.value)}
                                  className="px-4 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer"
                                  style={pillStyle(selectedDecades.includes(decade.value), accentColor)}
                                >
                                  {decade.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Adult Mode — toggle left, label right, no stretching */}
                        <div className="flex items-center gap-4">
                          <ToggleSwitch on={adultMode} onClick={() => setAdultMode((v) => !v)} color="#ff00e5" />
                          <div>
                            <p
                              className="text-xs font-bold uppercase tracking-widest"
                              style={{ color: '#e0e0ff', fontFamily: 'var(--font-orbitron), sans-serif' }}
                            >
                              Adult Mode
                            </p>
                            <p className="text-xs mt-0.5" style={{ color: '#8888aa' }}>
                              Drinking game prompts after each round
                            </p>
                          </div>
                        </div>

                        {/* Team Mode — toggle left, label right */}
                        <div>
                          <div className="flex items-center gap-4">
                            <ToggleSwitch
                              on={!!room?.teamMode}
                              onClick={() => handleToggleTeamMode(!room?.teamMode)}
                            />
                            <div>
                              <p
                                className="text-xs font-bold uppercase tracking-widest"
                                style={{ color: '#e0e0ff', fontFamily: 'var(--font-orbitron), sans-serif' }}
                              >
                                Team Mode
                              </p>
                              <p className="text-xs mt-0.5" style={{ color: '#8888aa' }}>
                                Split players into 2–4 teams
                              </p>
                            </div>
                          </div>
                          {room?.teamMode && (
                            <div className="flex items-center gap-3 mt-4 ml-[3.75rem]">
                              <div className="flex gap-2">
                                {[2, 3, 4].map((n) => (
                                  <button
                                    key={n}
                                    onClick={() => handleTeamCountChange(n)}
                                    className="w-12 py-2 rounded-xl text-sm font-bold border transition-all cursor-pointer"
                                    style={pillStyle(teamCount === n)}
                                  >
                                    {n}
                                  </button>
                                ))}
                              </div>
                              <button
                                onClick={() => shuffleTeams()}
                                className="px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer hover:bg-white/5"
                                style={{
                                  color: '#00f0ff',
                                  border: '1px solid rgba(0,240,255,0.25)',
                                  fontFamily: 'var(--font-orbitron), sans-serif',
                                }}
                              >
                                SHUFFLE
                              </button>
                            </div>
                          )}
                        </div>

                      </div>
                    </div>

                    {/* Other modes compact strip */}
                    <div className="flex gap-2 flex-wrap">
                      {otherModes.map((mode) => {
                        const mColor = MODE_COLORS[mode.id] ?? '#00f0ff';
                        return (
                          <button
                            key={mode.id}
                            onClick={() => mode.available && setGameMode(mode.id as GameModeId)}
                            disabled={!mode.available}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border transition-all"
                            style={{
                              background: '#12121a',
                              border: '1px solid rgba(255,255,255,0.07)',
                              opacity: mode.available ? 1 : 0.4,
                              cursor: mode.available ? 'pointer' : 'not-allowed',
                            }}
                            onMouseEnter={(e) => {
                              if (mode.available) {
                                (e.currentTarget as HTMLElement).style.borderColor = `${mColor}50`;
                                (e.currentTarget as HTMLElement).style.transform = 'scale(1.03)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
                              (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                            }}
                          >
                            <GameModeIcon id={mode.id} size={16} />
                            <span className="text-xs font-bold whitespace-nowrap" style={{ color: '#e0e0ff' }}>
                              {mode.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* ── Start Game — sticky bottom ── */}
            <div
              className="px-8 py-4 border-t flex-shrink-0"
              style={{ borderColor: 'rgba(0,240,255,0.08)', background: '#0a0a0f' }}
            >
              <button
                onClick={handleStartGame}
                disabled={!canStart}
                className="w-full py-4 rounded-2xl transition-all duration-300 hover:enabled:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-3"
                style={{
                  background: canStart
                    ? `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}aa 100%)`
                    : '#1a1a2e',
                  boxShadow: canStart ? `0 0 40px ${accentColor}50, 0 8px 24px rgba(0,0,0,0.3)` : 'none',
                  border: canStart ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  fontFamily: 'var(--font-orbitron), sans-serif',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: canStart ? '#0a0a0f' : '#8888aa',
                }}
              >
                {canStart && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5,3 19,12 5,21"/>
                  </svg>
                )}
                {isLoading
                  ? (modeInfo?.usesAudio !== false ? 'LOADING SONGS...' : 'STARTING...')
                  : gameMode === null
                  ? 'SELECT A GAME MODE'
                  : players.length < minPlayers
                  ? `NEED ${minPlayers - players.length} MORE PLAYER${minPlayers - players.length === 1 ? '' : 'S'}`
                  : 'START GAME'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-5px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}

export default function HostLobbyPage() {
  return (
    <Suspense>
      <HostLobbyContent />
    </Suspense>
  );
}
