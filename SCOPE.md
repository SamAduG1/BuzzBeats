# BuzzBeats - Game Design & Architecture Reference

> **Version:** 2.0
> **Last Updated:** April 2026
> **Status:** v1.0 Feature-Complete — Pending Deployment

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture Overview](#2-architecture-overview)
3. [Tech Stack](#3-tech-stack)
4. [Game Flow](#4-game-flow)
5. [Game Modes](#5-game-modes)
6. [Scoring & Points System](#6-scoring--points-system)
7. [Music Integration](#7-music-integration)
8. [Adult Mode](#8-adult-mode)
9. [UI/UX & Sound Design](#9-uiux--sound-design)
10. [Player & Room Management](#10-player--room-management)
11. [Technical Architecture](#11-technical-architecture)
12. [Development Status](#12-development-status)
13. [Deployment](#13-deployment)
14. [Future Ideas](#14-future-ideas)

---

## 1. Project Overview

**BuzzBeats** is a real-time multiplayer music trivia web app. A host device (laptop or TV) runs the main game display while players join and interact from their phones via a room code.

### Core Concept
- Players compete solo or in teams to guess songs and artists from audio clips
- 5 distinct game modes with different rulesets and energy levels
- Adult mode adds optional drinking game suggestions for party settings
- Dark neon/cyberpunk visual theme (cyan `#00f0ff` + magenta `#ff00e5`)

### Target Audience
- Friend groups, party-goers, casual game nights
- Music enthusiasts of all ages

---

## 2. Architecture Overview

### Jackbox-Style Model

BuzzBeats uses a **dual-interface architecture** inspired by Jackbox Games:

#### Host Screen (Laptop / TV / Shared Display)
- Runs the full web application in a browser
- Displays shared game state: round number, song playing, timer, scores, visuals
- **All audio plays exclusively from this device**
- The host does NOT participate as a player
- Synthesized sound effects and ambient lobby music via Web Audio API

#### Player Controller (Phone Browser)
- Players access via phone browser (URL or QR code scan)
- Touch-optimized: buzz-in button, answer submission, score display
- No audio playback on player devices

#### Connection Flow
1. Host opens BuzzBeats on a laptop/TV browser → creates a room → gets a **4-character room code** + QR code
2. Players scan QR or type site URL on phone → enter room code + display name
3. Host sees connected players in lobby, configures settings
4. Host starts game → real-time synchronized game loop begins

---

## 3. Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | Next.js 15 (App Router) | `use client` for socket components |
| Styling | Tailwind CSS v4 | CSS `@theme` directive (no JS config) |
| Real-Time | Socket.io | All game state synced via WebSocket |
| Backend | Node.js + Express | Game logic, room management |
| Music API | iTunes Search API | Free, no auth required. 30s previews. |
| Lyrics API | lyrics.ovh (primary) / Musixmatch (fallback) | For Name That Lyric mode clue display |
| Audio | Web Audio API | Synthesized SFX + ambient music — zero audio files |
| Hosting (Frontend) | Vercel | Pending deployment |
| Hosting (Backend) | Railway | Pending deployment |

**Not used:** Spotify (deprecated in favor of iTunes), Supabase (no user accounts in v1)

---

## 4. Game Flow

### General Round Structure

```
PRE_ROUND → PLAYING → BUZZING → REVEAL → SCOREBOARD → (loop) → GAME_OVER
```

**PRE_ROUND**: Host screen shows round number, mode hint, and (in Snippet) which sub-round clip length is coming.

**PLAYING**: Song clip plays (or word/lyric displayed). Timer counts down. Players can buzz in at any time. Timer bar animates on host screen with equalizer visualization.

**BUZZING**: First player to buzz in locks the buzzer. A 15s answer window opens. Other players see who buzzed. Host screen shows buzzed-in player's name. Player submits song title and/or artist on their phone.

**REVEAL**: Correct answer shown with album art. Points awarded. Drinking prompt shown (if Adult Mode on). Winner highlighted.

**SCOREBOARD**: Full leaderboard shown after each round. Rank changes animated.

**GAME_OVER**: Final standings with winner celebration. Play Again option returns to lobby.

### Game Settings (Configured by Host Before Starting)

| Setting | Options |
|---------|---------|
| Game Mode | Classic, Speed, Snippet, Elimination, Lyric Word Match |
| Rounds | 5–30 (not shown in Elimination: Last One Standing sub-mode) |
| Timer | 15s or 30s per round (Classic/Lyric Word Match) |
| Genre | Pop, Hip-Hop/Rap, Rock, R&B/Soul, Country, EDM/Dance, Alternative/Indie, Latin, All |
| Era | Pre-2000s, 2000s, 2010s, 2020s, All |
| Teams | Free-for-all or 2–4 teams |
| Adult Mode | On/Off — enables drinking prompts |

---

## 5. Game Modes

### Mode 1: Classic

**Concept**: A 30-second song clip plays. First player/team to buzz in and correctly identify the song and/or artist earns points.

**Rules**:
- Song clip plays from host device for up to 30 seconds
- Any player can buzz in at any time during playback
- First to buzz gets a 15-second answer window
- If correct: points awarded, round ends
- If incorrect: buzzer reopens, song resumes playing for remaining players
- Round ends when someone gets it right or the clip runs out

**Timer**: Configurable 15s or 30s clip window

---

### Mode 2: Speed

**Concept**: Rapid-fire version of Classic. Shorter clips, faster transitions, keeps energy high.

**Rules**:
- Song clip plays for **10 seconds** (not 30)
- Buzzer window is **10 seconds**
- Auto-advances immediately after answer or timeout
- Scoring identical to Classic

*Internally extends ClassicMode — same logic, different durations.*

---

### Mode 3: Snippet

**Concept**: The same song is played 4 times with progressively longer clips. Guess earlier = more points.

**Sub-round clip lengths**: 2s → 5s → 10s → 20s

**Points per sub-round**: 4 → 3 → 2 → 1

**Rules**:
- Each song has up to 4 sub-rounds
- A clip plays. Players buzz in if they know it.
- First correct answer at any sub-round ends that song and advances to the next
- If all 4 sub-rounds pass with no correct answer, song is skipped
- Round count = number of full songs attempted

**Host screen**: Shows "Clip 1 of 4 — 2 seconds" etc. Sub-round transition has its own animated phase.

---

### Mode 4: Elimination

**Concept**: Wrong answer = permanent elimination. High stakes, dramatic pacing.

**Sub-Modes (Host selects before starting)**:

#### Last One Standing
- No fixed round count — keeps going until one player remains
- If you buzz in wrong: you're **permanently eliminated** (shown on host with animation)
- If nobody buzzes before timer: lowest-score player is eliminated (no-buzz penalty)
- Last two players eliminated in the same round → **Sudden Death** tiebreaker
- Always produces exactly one winner

#### Fixed Rounds
- Set number of rounds; elimination rules apply throughout
- Survivors at the end: highest score wins
- Tied survivors → **Sudden Death** round between them

**Last Chance (Comeback Mechanic)**:
- Triggers **once** when half the starting players have been eliminated
- All eliminated players get one final chance: buzz in and answer correctly = back in the game
- Wrong answer = permanently out
- Special stinger + host screen overlay marks this moment

**Sudden Death (Tiebreaker)**:
- Special audio sting + pulsing visual effect
- Standard buzz-in rules, first correct answer wins
- Used for both End-of-game ties and Last-Two-Standing scenarios

**Adult Mode with Elimination**:
- Each eliminated player "drinks" their pool amount (2 drinks each)
- Prize pool grows as players are eliminated (displayed on host screen)
- Winner distributes entire pool

---

### Mode 5: Lyric Word Match

**Concept**: A word is displayed on the host screen. Players buzz in when they think of a song lyric containing that word. Non-audio mode — no song clips play.

**Word bank**: 60 curated words across Easy / Medium / Hard tiers

| Tier | Example Words |
|------|--------------|
| Easy | love, fire, night, dance, baby, heart, rain, dream |
| Medium | thunder, diamond, highway, shadow, ocean, crown, ghost |
| Hard | chandelier, silhouette, avalanche, masquerade, velvet |

**Rules**:
- A word is shown. Players buzz in when they have a lyric.
- Buzzed-in player submits a song title containing that word
- Host marks correct/incorrect (host judges the answer)
- Correct: 1 point + new word
- Incorrect: buzzer reopens for others
- Round ends when correct answer given or time runs out

**Answer verification**: Fuzzy match on song title against the 192+ song database (same engine as Classic mode). Server checks if the submitted title reasonably matches any song in the database that contains the displayed word in its lyrics cache.

**Lyrics**: Pre-cached from lyrics.ovh + Musixmatch. Only songs with cached lyrics are eligible for this mode.

---

## 6. Scoring & Points System

### Standard Scoring (Classic, Speed, Lyric Word Match)

| Achievement | Points |
|------------|--------|
| Correct artist only | 1 point |
| Correct song title only | 2 points |
| Both artist and song title | 3 points |
| Lyric Word Match correct song | 1 point |

### Snippet Scoring

| Sub-Round | Points Awarded |
|-----------|---------------|
| 1st clip (2s) | 4 points |
| 2nd clip (5s) | 3 points |
| 3rd clip (10s) | 2 points |
| 4th clip (20s) | 1 point |

### Answer Verification

Fuzzy matching is implemented server-side using normalized string comparison:
- Case-insensitive
- Punctuation stripped
- Common abbreviations handled (e.g. "RHCP" → Red Hot Chili Peppers)
- Minor typos tolerated (Levenshtein distance-based)
- Artist first name accepted (e.g. "Kendrick" matches "Kendrick Lamar")

### Drinking Prompts (Adult Mode)

Displayed on host screen after REVEAL. Three pools of prompts:
- **FFA pool**: generic prompts for free-for-all games
- **Team pool**: team-targeted prompts
- **Elimination pool**: elimination-specific prompts (e.g. "eliminated player drinks")

---

## 7. Music Integration

### iTunes Search API

- Free, no API key, no user auth required
- Returns 30-second preview URLs + album art + metadata
- Called at game start for each song batch (songs pre-fetched, not mid-round)
- Fallback: if a preview URL can't be fetched, song is skipped and another is drawn

### Song Database

~367 curated songs across 8 genres and 6 decades (stored in `server/src/data/songDatabase.ts`):

| Genre | Count |
|-------|-------|
| Pop | ~64 |
| Hip-Hop/Rap | ~54 |
| Rock | ~53 |
| R&B/Soul | ~43 |
| Country | ~39 |
| EDM/Dance | ~39 |
| Alternative/Indie | ~40 |
| Latin | ~35 |
| **Total** | **~367** |

Songs have `isExplicit` flag — Adult Mode off hides explicit songs from the pool.

### Filtering

Host can filter the pool by:
- **Genre**: one of the 8 above, or All
- **Era**: Pre-2000s / 2000s / 2010s / 2020s / All

Songs are drawn randomly from the filtered pool. No repeat within a single game session.

### Lyrics (Name That Lyric / Lyric Word Match)

- Primary: **lyrics.ovh** (free, no key needed)
- Fallback: **Musixmatch** (requires `MUSIXMATCH_API_KEY` env var — free Basic tier, 2,000 calls/day)
- Results are disk-cached (`server/src/data/lyricsCache/`)
- Only songs with cached lyrics are eligible for Lyric Word Match

---

## 8. Adult Mode

Selected by host in lobby. Affects:
1. **Song pool**: explicit songs are excluded when Adult Mode is OFF
2. **Drinking prompts**: shown on host screen after each REVEAL when ON

Prompts are suggestions only — displayed as playful text. The app does not track or enforce drinking.

Example prompts:
- "Losing team takes a sip!"
- "Winner picks someone to drink!"
- "Nobody guessed it? Everyone drinks!"
- "First buzz-in wrong? That's on you — drink!"

---

## 9. UI/UX & Sound Design

### Visual Theme
- **Dark neon/cyberpunk**: background `#0a0a0f`, primary cyan `#00f0ff`, accent magenta `#ff00e5`
- Font: Orbitron (display), system sans-serif (body)
- Glowing borders, scan-line effects, animated timer bars
- Equalizer visualization during song playback

### Sound Effects (Web Audio API — zero audio files)

All sounds are synthesized in-browser. Preview at `/sounds`.

| Sound | Trigger |
|-------|---------|
| Buzzer Press | Player hits the buzz button |
| Correct Answer | Host marks answer correct |
| Wrong Answer | Host marks answer wrong (or time runs out) |
| Tick | Final 5 seconds of timer countdown |
| Fanfare | Game over / winner revealed |
| Sudden Death Stinger | Entering sudden death / tiebreaker |
| Sudden Death Pulse | Looping drone during sudden death |
| Elimination Reveal | Player eliminated animation |
| Last Chance Stinger | Last Chance phase begins |
| Lobby Ambience | Synthwave loop in host lobby (start/stop/mute) |

### Lobby Ambience
- Plays automatically when host enters the lobby
- Stops with 2.5s fade when game starts
- Mutable via speaker button in header (volume ramp, scheduler keeps running)
- 128 BPM synthwave: kick/snare/hi-hat rhythm section, walking bass, resonant arp, atmosphere pad
- Synthesized via lookahead scheduler (25ms interval, 120ms lookahead) for timing accuracy

---

## 10. Player & Room Management

### Room System
- 4-character alphanumeric room code (e.g. `A3K9`)
- QR code displayed in lobby — links directly to join page with code pre-filled
- Room is destroyed on game end or after inactivity timeout

### Player Limits

| Mode | Min | Max |
|------|-----|-----|
| Free-for-all | 2 | 10 |
| Team Mode | 4 | 32 (up to 4 teams, up to 8 per team) |

### Teams
- Host drags players into teams in lobby (drag-and-drop via @dnd-kit)
- Tap-to-cycle also supported (mobile-friendly)
- 2–4 teams, named Team 1 / Team 2 / etc.

### Disconnection Handling
- Player disconnects → "disconnected" indicator on host screen
- **60-second auto-kick timer** if player doesn't rejoin
- Player can rejoin with same room code within the window; score and state preserved
- Game continues without pausing for disconnects
- **Socket ID self-healing**: if a player's socket ID changes on reconnect and they try to buzz in, the server matches by display name and relinks their ID — prevents stale-ID buzzer failures

---

## 11. Technical Architecture

### State Machine (Server-Side)

GameManager owns the canonical game state. Phases:

```
PRE_ROUND → PLAYING → BUZZING → REVEAL → SCOREBOARD → PRE_ROUND (loop)
                                                     → GAME_OVER
```

Elimination extras:
```
PLAYING → "last-chance" → REVEAL (→ "elimination-reveal") → SCOREBOARD
```

Snippet extras:
```
PLAYING → BUZZING/REVEAL → "sub-round-transition" → PLAYING (next clip)
```

### Strategy Pattern (Game Modes)

Each game mode implements the `GameMode` interface (`server/src/game/modes/GameMode.ts`):

```typescript
interface GameMode {
  getConfig(): ModeConfig;
  initState(settings, songs): ModeGameState;
  songsNeeded(settings): number;       // 0 for non-audio modes
  buildClientState(game, roomCode): Partial<ClientGameState>;
  onRoundStart(game, io, roomCode): void;
  onBuzzerPress(game, playerId): BuzzerResult;
  onAnswerSubmit(game, playerId, answer, songDb): AnswerResult;
  onRoundEnd(game, io, roomCode): RoundEndResult;
}
```

Mode instances created via `modeFactory.ts`.

### Key Files

| File | Purpose |
|------|---------|
| `server/src/game/GameManager.ts` | State machine, round loop, phase transitions |
| `server/src/game/modes/` | GameMode interface + 5 mode implementations |
| `server/src/rooms/RoomManager.ts` | Room state, disconnect/reconnect, 60s auto-kick |
| `server/src/socket/handlers/` | Socket event handlers (room, connection, game) |
| `server/src/data/songDatabase.ts` | ~367 curated songs |
| `server/src/data/drinkingPrompts.ts` | Drinking prompt pools |
| `server/src/data/wordBank.ts` | 60 words for Lyric Word Match |
| `shared/types/game.ts` | GameSettings, ClientGameState, GamePhase |
| `shared/types/gameMode.ts` | GameModeId union, AVAILABLE_GAME_MODES |
| `client/src/context/RoomContext.tsx` | Client state + socket event listeners |
| `client/src/hooks/useSoundEffects.ts` | All synthesized SFX + lobby ambience |
| `client/src/hooks/useAudioPlayer.ts` | iTunes preview playback with Web Audio fade-out |
| `client/src/components/host/GameScreen.tsx` | Host game view — audio management, phase routing |
| `client/src/components/host/PlayingDisplay.tsx` | Timer bars, equalizer, word display (purely visual) |
| `client/src/components/host/EliminationOverlay.tsx` | Elimination reveal + Last Chance UI |
| `client/src/components/player/GameScreen.tsx` | Player view — buzzer, eliminated states |
| `client/src/app/host/lobby/page.tsx` | Lobby with settings, ambience, mute button |

### Important Gotchas

- `socket.to(room)` excludes sender — use `io.to(room)` when sender also needs the event
- Tailwind v4 uses CSS `@theme` directive, not `tailwind.config.js`
- Socket.io client must be in `'use client'` components only (no SSR)
- Server must start with `npm run dev` (not `npx ts-node-dev` directly) — includes `-r tsconfig-paths/register`
- Server `tsconfig.json` needs `rootDir: ".."` to include the shared directory
- Snippet `subRound` in `ClientGameState` is **1-indexed**
- Non-audio modes: `songs` array is empty — use `settings.roundCount` for `totalRounds`
- `SnippetModeState` cast needs `as unknown` intermediate: `((state.modeState as unknown) as SnippetModeState)`

---

## 12. Development Status

### Phase 1 — MVP ✅ Complete
- [x] Project setup (Next.js 15, Tailwind v4, Express, Socket.io)
- [x] Host screen: landing, room creation, lobby, game screen, scoreboard, game over
- [x] Player controller: join, lobby, buzzer, answer input, score display
- [x] Room system: 4-char code, QR code, room cleanup
- [x] Classic Buzz-In mode
- [x] iTunes Search API integration (30s preview, album art, metadata)
- [x] Fuzzy answer verification (song title + artist)
- [x] Real-time sync: buzzer, answers, scores, round progression
- [x] Scoring: 1pt artist / 2pt song / 3pt both
- [x] Dark neon/cyberpunk UI

### Phase 2 — Customization ✅ Complete
- [x] Genre filter (single-select)
- [x] Era/date range filter
- [x] Configurable round count and timer
- [x] Adult mode: drinking prompts after each round
- [x] Kid-friendly default (no adult content)
- [x] Team mode (2–4 teams, drag-and-drop assignment)

### Phase 3 — Additional Game Modes ✅ Complete
- [x] Game mode selection in lobby (mode grid with descriptions)
- [x] **Speed** mode (10s clips, fast transitions)
- [x] **Snippet** mode (2/5/10/20s clips, 4/3/2/1 pts)
- [x] **Elimination** mode (Last One Standing + Fixed Rounds, Last Chance, Sudden Death)
- [x] **Lyric Word Match** mode (60-word bank, non-audio, host-judged)
- [x] Song fade-out on correct answer (Web Audio API gain ramp)

### Phase 4 — Polish ✅ Complete
- [x] Synthesized sound effects (buzzer, correct, wrong, tick, fanfare, tiebreaker stinger/pulse, elimination reveal, last chance)
- [x] Sound Lab preview page (`/sounds`)
- [x] Lobby ambience music (128 BPM synthwave, lookahead-scheduled)
- [x] Lobby mute/unmute button (volume ramp — never stops scheduler)
- [x] Disconnection self-healing (socket ID remapped by display name at buzz time)
- [x] 60s auto-kick for disconnected players
- [ ] Pre-game rules screen (mode-specific tips before round 1)
- [ ] Winner celebration animation (Game Over screen)

### Pending / Backlog
- [ ] Deploy to Railway (server) + Vercel (client)
- [ ] Pre-populate lyric cache for Name That Lyric (currently 23/367 songs cached)
- [ ] Difficulty filter (requires charts API or adaptive system)
- [ ] Tie-breaking by timestamp of final point (first to reach winning score wins)
- [ ] Play Again flow (reset without full page reload)
- [ ] Drag-and-drop cursor offset polish

---

## 13. Deployment

### Target Infrastructure
- **Backend**: Railway — Node.js server with Socket.io
- **Frontend**: Vercel — Next.js 15

### Environment Variables

**Server (Railway)**:
```
PORT=                        # Set automatically by Railway — do not override
CLIENT_URL=                  # Vercel production URL (for CORS)
MUSIXMATCH_API_KEY=          # Optional — Musixmatch free tier, 2000 calls/day
```

**Client (Vercel)**:
```
NEXT_PUBLIC_SERVER_URL=      # Railway production URL
```

### Deployment Steps
1. Push to GitHub
2. Deploy server to Railway (connect repo, set `CLIENT_URL` after Vercel URL is known)
3. Deploy client to Vercel (connect repo, set `NEXT_PUBLIC_SERVER_URL` to Railway URL)
4. Update Railway `CLIENT_URL` with the final Vercel URL
5. Smoke test: create room, join on phone, play a round of each mode

---

## 14. Future Ideas

| Idea | Notes |
|------|-------|
| Name That Playlist | Given 3–5 songs, guess what genre/decade/theme connects them |
| Finish the Lyric | Lyric displayed with a blank — fill in the missing word |
| Artist Roulette | All songs from one mystery artist; guess who it is |
| Album Cover | Album art shown; guess album name and artist |
| Versus Mode | 1v1 bracket tournament |
| Audience/Spectator mode | Watch-only join for large gatherings |
| User Accounts | Optional sign-up for stats and leaderboards |
| Global Leaderboards | Cross-game score tracking |
| Apple Music API | MusicKit migration ($99/yr Apple Developer Program) — better preview reliability |
| Custom Playlist | Host pastes a playlist URL as the song pool |

---

## Revision Log

| Date | Version | Changes |
|------|---------|---------|
| Feb 2026 | 1.0 | Initial scope document (pre-development) |
| Apr 2026 | 2.0 | Full rewrite to reflect actual built state: 5 game modes, sound system, architecture details, deployment plan |
