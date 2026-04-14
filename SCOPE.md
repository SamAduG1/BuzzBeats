# BuzzBeats - Comprehensive Scope & Requirements Document

> **Version:** 1.0
> **Last Updated:** February 2026
> **Status:** Pre-Development

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture Overview](#2-architecture-overview)
3. [Tech Stack](#3-tech-stack)
4. [Game Flow](#4-game-flow)
5. [Game Modes](#5-game-modes)
6. [Scoring & Points System](#6-scoring--points-system)
7. [Music Integration & Filters](#7-music-integration--filters)
8. [Adult Mode & Kid-Friendly Mode](#8-adult-mode--kid-friendly-mode)
9. [UI/UX Requirements](#9-uiux-requirements)
10. [Player & Room Management](#10-player--room-management)
11. [Technical Requirements](#11-technical-requirements)
12. [Development Phases](#12-development-phases)
13. [Open Decisions & TBD](#13-open-decisions--tbd)

---

## 1. Project Overview

**BuzzBeats** is a real-time multiplayer music trivia web application where players compete to prove their music knowledge. The app follows a Jackbox-style architecture: a host device (laptop/TV) runs the main game display while players join and interact from their phones via a room code or QR code.

### Core Concept
- Players compete solo or in teams to guess songs, artists, and recall lyrics
- Multiple game modes offer variety and replayability
- Customizable filters let players tailor the experience (genre, era, difficulty)
- Adult mode adds optional drinking game suggestions for party settings
- Kid-friendly mode provides the same experience without adult content

### Target Audience
- Friend groups, party-goers, family game nights
- Music enthusiasts of all ages
- Casual and competitive players alike

---

## 2. Architecture Overview

### Jackbox-Style Model

BuzzBeats uses a **dual-interface architecture** inspired by Jackbox Games:

#### Host Screen (Laptop / TV / Shared Display)
- Runs the full web application in a browser
- Displays the shared game state: current round, song playing, timer, scores, visuals
- Audio plays exclusively from this device
- The host device does **NOT** participate as a player
- Designed for larger screens with rich visuals and animations

#### Player Controller (Phone Browser)
- Players access via their phone's browser (URL entry or QR code scan)
- Lightweight, touch-optimized interface
- Used for: buzzing in, submitting answers, viewing personal score
- No audio playback on player devices
- Minimal data usage and battery-friendly

#### Connection Flow
1. Host opens BuzzBeats on a laptop/TV browser
2. Host creates a game room -> receives a **room code** and **QR code**
3. Players scan QR code or type the site URL on their phone
4. Players enter the room code and choose a display name
5. Host sees all connected players in the lobby
6. Host configures game settings (mode, filters, rounds, adult/kid mode)
7. Host starts the game
8. Game plays out in real-time with synchronized state

---

## 3. Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React (Next.js) | UI framework, server-side rendering |
| Styling | Tailwind CSS | Responsive, modern UI design |
| Real-Time | Socket.io | WebSocket connections for live game state |
| Backend | Node.js + Express | API server, game logic, room management |
| Music API | Spotify Web API | Song data, previews, metadata, filtering |
| Lyrics API | Genius / Musixmatch API | Lyric verification for Lyric Word Match mode |
| Database | Supabase (PostgreSQL) | User accounts, leaderboards, game history |
| Hosting (Frontend) | Vercel | Frontend deployment |
| Hosting (Backend) | Railway or Render | WebSocket server deployment |

---

## 4. Game Flow

### General Round Structure (Applies to All Modes)

1. **Pre-Round**: Host screen displays the round number and mode-specific setup
2. **Active Round**: A prompt is presented (song clip, word, etc.) and players respond
3. **Buzzer/Submission Phase**: Players buzz in or submit answers within a time limit
4. **Reveal Phase**: Correct answer is revealed, points are awarded
5. **Scoreboard Update**: Updated scores are displayed on the host screen
6. **Adult Mode Prompt** (if enabled): Drinking game suggestion is displayed
7. **Next Round or Game End**: Repeat or show final standings

### Configurable Game Settings (Set by Host Before Starting)
- **Game Mode**: Select which mode to play
- **Number of Rounds**: How many rounds per game (e.g., 10, 15, 20, custom)
- **Time Per Round**: How long players have to answer (e.g., 10s, 15s, 30s)
- **Filters**: Genre, era/date range, difficulty (see Section 7)
- **Team or Solo**: Free-for-all or team-based play
- **Adult or Kid-Friendly Mode**: Toggle drinking game features on/off

---

## 5. Game Modes

### Mode 1: Classic Buzz-In (MVP Mode)

**Concept**: A song clip plays on the host device. First player/team to buzz in and correctly identify the song and/or artist earns points.

**Rules**:
- A 30-second song preview plays from the host device
- Players can buzz in at any time during playback
- First player to buzz in gets to answer
- Player submits their answer (song title, artist, or both)
- If correct: points awarded based on what they got right (see scoring)
- If incorrect: the buzzer reopens for remaining players
- Round ends when someone answers correctly or time runs out

**Variations to Consider**:
- "Blind Buzz" - Song clip starts very quietly and gradually gets louder
- "Quick Draw" - Only 10 seconds of the clip plays

---

### Mode 2: Lyric Word Match

**Concept**: A random word is displayed on the host screen. First player/team to name a real song lyric containing that word earns the point.

**Rules**:
- A word is randomly selected from a curated word bank (see below)
- Players buzz in when they think of a lyric containing that word
- Player states/submits their lyric and the song it's from
- **Verification uses a hybrid approach**:
  - Other players/teams vote on whether the answer is legitimate
  - If challenged, a lyrics API (Genius/Musixmatch) is used as the final judge
  - This prevents unfair rejections for minor inaccuracies (e.g., getting 90% of the lyric right)
- If correct: 1 point awarded
- If incorrect or challenged and disproven: no point, buzzer reopens

**Word Bank Design**:
Words are categorized into difficulty tiers and pulled from a curated database:

| Tier | Examples | Criteria |
|------|----------|----------|
| Easy | love, fire, night, dance, baby, heart, rain, dream | Appears in hundreds of songs, most people can recall one quickly |
| Medium | thunder, diamond, highway, shadow, villain, ocean, crown, ghost | Appears in many songs but requires more thought |
| Hard | chandelier, silhouette, avalanche, masquerade, kaleidoscope, velvet | Appears in songs but takes real music knowledge to recall |

**Word Filtering Rules**:
- Exclude stop words: the, is, and, a, an, or, but, in, on, at, to, for, of, it, etc.
- Exclude extremely obscure words that appear in fewer than ~5 known songs
- Words can be sourced by analyzing common lyrics databases and filtering appropriately

---

### Mode 3: Speed Round

**Concept**: Rapid-fire version of Classic Buzz-In. Short clips, fast timer, keeps the energy high.

**Rules**:
- Song clip plays for only 5-10 seconds
- Shorter answer window (e.g., 10 seconds total)
- Auto-advances to next round immediately after answer or timeout
- Points same as Classic Buzz-In
- Best for late-game energy or as a tiebreaker mode

---

### Mode 4: Elimination

**Concept**: Wrong answer or failure to answer = you're eliminated. Last player/team standing wins. Designed for larger groups with higher stakes.

**Player Limits**: Min 4, Max 16 (solo) | Teams scale accordingly

**Sub-Modes** (Host selects before starting):

#### Option A: Last One Standing
- No fixed round count. Rounds keep going until one player remains.
- If you buzz in and answer wrong, you're eliminated.
- If no one buzzes in before the timer, the player with the lowest cumulative score is eliminated.
- If the last two players both get eliminated in the same round, a sudden death round between them settles it.
- Always produces exactly one winner.

#### Option B: Fixed Rounds
- Set number of rounds (e.g., 25). Elimination rules apply throughout.
- If multiple players survive all rounds, the one with the highest score wins.
- If tied, a sudden death round between tied survivors determines the winner.
- Always one winner.

**Last Chance Round (Comeback Mechanic)**:
- A single dedicated "Last Chance Round" triggers once half the players have been eliminated.
- All eliminated players get ONE shot to buzz in and answer correctly.
- Get it right: you're back in the game. Get it wrong: you're done for good.
- Creates a dramatic moment with special visuals on the host screen.
- Only happens once per game.

**Elimination Drinking Game (Adult Mode)**:
- Preset: 2 drinks per player
- Each player has 2 "pool drinks" assigned at the start (separate from penalties).
- When eliminated, you drink 2 penalty drinks.
- Your 2 pool drinks transfer to the winner's prize pool.
- Winner distributes the entire pool to other players as they see fit.
- Example: 8 players = 16 pool drinks. Winner hands out all 16.
- Host screen displays the prize pool growing as players are eliminated.

---

### Mode 5: Snippet Challenge

**Concept**: The song clip starts extremely short (1-2 seconds) and gradually gets longer each sub-round. Guess earlier for more points.

**Rules**:
- Round 1: 1-2 second clip plays
- Round 2: 5 second clip plays (same song)
- Round 3: 10 second clip plays (same song)
- Round 4: 20 second clip plays (same song)
- Points decrease with each sub-round (e.g., 4 points -> 3 -> 2 -> 1)
- First correct answer at any sub-round ends that song and moves to the next
- Rewards deep music knowledge and quick recognition

---

### Future Game Mode Ideas (Post-MVP Brainstorm)
- **Name That Playlist**: Given 3-5 songs, guess what genre/decade/theme connects them
- **Finish the Lyric**: A lyric is displayed with a blank, fill in the missing word(s)
- **Artist Roulette**: All songs come from one mystery artist, guess who it is
- **Versus Mode**: 1v1 head-to-head bracket tournament
- **Album Cover**: A random song from an album plays while the album cover is displayed on the host screen. Players guess the album name and artist. Requires album art API (iTunes Search API returns `artworkUrl100` which can be upscaled). Priority: post-MVP, after all current modes are stable.

---

## 6. Scoring & Points System

### Classic Buzz-In / Speed Round / Snippet Challenge Scoring

| Achievement | Points |
|------------|--------|
| Correct artist only | 1 point |
| Correct song title only | 2 points |
| Both artist and song title | 3 points |

### Lyric Word Match Scoring

| Achievement | Points |
|------------|--------|
| Valid lyric with correct song attribution | 1 point |

### Snippet Challenge Bonus Scoring

| Sub-Round Guessed | Points Multiplier |
|-------------------|-------------------|
| 1st snippet (1-2s) | 4 points (base x2) |
| 2nd snippet (5s) | 3 points |
| 3rd snippet (10s) | 2 points |
| 4th snippet (20s) | 1 point |

### Answer Verification
- **Fuzzy matching** should be implemented for typed answers
  - "Kendrick" should match "Kendrick Lamar"
  - Minor typos should be forgiven (e.g., "Rhianna" vs "Rihanna")
  - Common abbreviations accepted (e.g., "RHCP" for "Red Hot Chili Peppers")
  - Nicknames of artists accepted (e.g., "Drizzy" for "Drake" or Riri for "Rihanna")
- **For Lyric Word Match**: Hybrid verification (player vote + API challenge system)

### Win Conditions
- **Standard**: Most points after all rounds wins
- **Elimination**: Last player/team standing
- **Tiebreaker**: Can trigger a sudden-death Speed Round

---

## 7. Music Integration & Filters

### Spotify Web API Integration

**Approach**: The Spotify API is used on the **backend only**. Players do NOT need Spotify accounts.

- The app uses Spotify's API to fetch song previews (30-second clips), metadata, and filtering data
- A server-side Spotify developer account handles API authentication
- Song previews are streamed to the host device only

**Key Spotify Data Used**:
- Song title and artist name (for answer verification)
- Album art (for host screen display during reveal)
- Genre tags (for filtering)
- Release date (for era filtering)
- Popularity score (for difficulty filtering)

### Filter Options (Configurable by Host)

| Filter | Description | Examples |
|--------|------------|---------|
| Genre | Single or multiple genres | Pop, Hip-Hop, Rock, R&B, Country, EDM, etc. |
| Era / Date Range | Songs from a specific time period | 2010-present, 1990s, 1980-2000, all time |
| Difficulty | Based on song popularity metrics | Easy (top hits), Medium (well-known), Hard (deep cuts) |
| No Filter | All genres and eras are fair game | Complete randomization |
| Custom Playlist | Use a specific Spotify playlist as the pool | Host pastes a Spotify playlist link |

### Song Randomization Logic
- Songs are pulled from Spotify based on active filters
- A randomization engine ensures no repeats within a game session
- Songs are pre-fetched in batches to avoid mid-game loading delays
- Fallback logic if a preview clip is unavailable for a selected song

---

## 8. Adult Mode & Kid-Friendly Mode

### Mode Toggle
- Selected by the host during game setup
- Affects only the **drinking game suggestions** and potentially the **song content filter**

### Adult Mode Features
Drinking game suggestions appear on the host screen after each round, tied to the scoring outcome:

**Example Drinking Game Rules** (displayed as fun prompts, not requirements):
- "Losing team drinks!"
- "Winner picks someone to drink!"
- "Everyone who didn't buzz in takes a sip!"
- "Wrong answer? That's a drink!"
- "Perfect round (artist + song)? Hand out 3 drinks!"
- "No one got it? Everyone drinks!"

These are **suggestions only** - displayed as playful text on the host screen. The app does not track or enforce drinking.

### Kid-Friendly Mode Features
- Identical gameplay with zero drinking references
- Optionally: filters out songs with explicit content tags (Spotify provides this metadata)
- Family-friendly celebration messages instead (e.g., "Great round!" "Music master!")

---

## 9. UI/UX Requirements

### General Design Direction
- **Primary mode: Dark theme** (suits the party/game-show vibe)
- Optional light mode can be added later but is not a priority
- Visual style should feel energetic, modern, and game-show inspired
- Smooth animations for buzzer hits, score reveals, round transitions
- Color palette and exact theme TBD during design phase (modern vs retro vs neon, etc.)

### Host Screen (Laptop/TV Display)

| Screen | Key Elements |
|--------|-------------|
| **Landing Page** | App logo, "Create Game" button, brief tagline |
| **Room Lobby** | Room code (large), QR code, list of connected players, game settings panel, "Start Game" button |
| **Active Game** | Current round number, timer, game-mode-specific content (song clip visualizer, word display, etc.) |
| **Answer Reveal** | Correct answer with album art, who got it right, points awarded |
| **Scoreboard** | Running scores for all players/teams, updated after each round |
| **Drinking Prompt** | (Adult mode only) Fun drinking suggestion displayed briefly |
| **Game Over** | Final standings, winner celebration animation, "Play Again" option |

### Player Controller (Phone Screen)

| Screen | Key Elements |
|--------|-------------|
| **Join Screen** | Room code input field, QR code scanner option, display name input |
| **Lobby** | "Waiting for host to start..." status, list of other players |
| **Buzzer Screen** | Large, prominent buzz-in button (easy to tap), timer display |
| **Answer Input** | Text field(s) for song title / artist name, submit button |
| **Lyric Input** | (Lyric Word Match) Text field for lyric, song name field |
| **Vote Screen** | (Lyric Word Match challenge) Accept / Reject buttons for judging answers |
| **Personal Score** | Player's current score and rank |
| **Game Over** | Final rank, personal stats |

### Responsive Design Notes
- Host screen: Optimized for 1080p+ displays, should look great on TVs
- Player controller: Mobile-first, thumb-friendly, large tap targets
- Player controller must work across iOS Safari, Android Chrome, and other mobile browsers
- Minimal data transfer to player devices to keep things snappy

---

## 10. Player & Room Management

### Room System
- Rooms are created by the host and identified by a short, easy-to-type code (e.g., 4-6 alphanumeric characters)
- QR code is generated that links directly to the join page with the room code pre-filled
- Rooms are destroyed after the game ends or after a period of inactivity

### Player Limits

| Play Style | Min Players | Max Players |
|-----------|-------------|-------------|
| Free-for-all | 2 | 10 |
| Team Mode | 4 (2 per team min) | 32 (up to 4 teams, up to 8 per team) |

### Disconnection Handling
- If a player disconnects, they can rejoin using the **same room code**
- Their score and state are preserved
- Host screen shows a "disconnected" indicator next to the player's name
- If a player doesn't rejoin within a configurable timeout, they are removed from the game
- Game continues with remaining players (does not pause for disconnects)

### User Accounts (Future Feature)
- MVP: No accounts required. Players just enter a display name.
- Future: Optional accounts for tracking stats, global leaderboards, friend lists

---

## 11. Technical Requirements

### Real-Time Communication
- **Socket.io** handles all real-time game state synchronization
- Events include: player joins, buzzer press, answer submission, round advance, score update, game end
- Buzzer priority is determined **server-side** to prevent race conditions (server timestamp is authoritative)
- Latency should be <100ms for buzzer fairness

### API Rate Limiting
- Spotify API has rate limits; songs should be pre-fetched and cached
- Lyrics API calls should be batched or cached where possible
- Implement server-side caching layer for frequently used song data

### Security Considerations
- Room codes should be random and non-sequential to prevent guessing
- No sensitive data stored on player devices
- Spotify API credentials stored server-side only, never exposed to clients
- Input sanitization on all player-submitted text (answers, display names)
- Rate limiting on buzzer presses to prevent spam

### Performance Targets
- Host screen: 60fps animations, smooth transitions
- Player controller: <1 second load time, instant buzzer response
- Song preview: Pre-buffered to prevent playback delays
- WebSocket connection: Auto-reconnect on drop with state recovery

---

## 12. Development Phases

### Phase 1: MVP (Core Experience)
**Goal**: A playable game that demonstrates the core concept end-to-end.

- [x] Project setup (Next.js, Tailwind, Express, Socket.io)
- [x] Host screen: landing page, room creation, lobby, basic game screen, scoreboard, game over
- [x] Player controller: join screen, lobby, buzzer, answer input, score display
- [x] Room system with code generation and QR code
- [x] **Classic Buzz-In mode** (single game mode)
- [x] iTunes Search API integration: song preview playback, song/artist metadata
- [x] Basic answer verification (fuzzy matching for song title and artist)
- [x] Real-time synchronization: buzzer, answers, scores, round progression
- [x] Basic scoring: 1 point artist, 2 points song, 3 points both
- [x] Dark theme UI (neon cyberpunk)
- [x] Free-for-all mode (2-8 players)
- [ ] Deploy frontend (Vercel) + backend (Railway/Render)

### Phase 2: Filters & Customization
- [x] Genre filter (single and multi-select)
- [x] Era/date range filter
- [ ] Difficulty filter (deferred — needs Apple Music API charts or adaptive system)
- [ ] Custom playlist support (deferred — tied to Apple Music API migration)
- [x] Configurable round count and timer
- [x] Adult mode: drinking game suggestions after each round
- [x] Kid-friendly mode: default mode without adult toggle
- [x] Team mode (2-4 teams)

### Phase 3: Additional Game Modes
- [ ] Game mode selection in lobby
- [ ] **Speed Round** mode
- [ ] **Song fade-out on correct answer**: When a player guesses correctly (song, artist, or both), the song preview continues playing for ~2 seconds and smoothly fades out (using Web Audio API gain ramp) instead of stopping abruptly. Creates a satisfying "nailed it" moment where players hear the song confirm their answer before the reveal phase begins.
- [ ] **Snippet Challenge** mode with progressive clip lengths
- [ ] **Elimination** mode
- [ ] **Lyric Word Match** mode with curated word bank
- [ ] Hybrid verification system (player vote + lyrics API challenge)

### Phase 4: Polish & Social Features
- [ ] Refined animations and visual effects (host screen)
- [ ] Winner celebration animation on game-over screen (top-3 reveal with special effects, inspired by Kahoot-style and Jackbox-style reveals)
- [ ] **Sound effects** (synthesized via Web Audio API for zero-dependency, tiny footprint):
  - Buzzer press: satisfying "buzz" or "ding" when a player hits the buzzer
  - Correct answer: positive chime / success sound
  - Wrong answer: subtle negative tone (not punishing, just informative)
  - Timer urgency: ticking or rising-pitch sound in the last ~5 seconds of a round
  - Game over / winner reveal: celebratory fanfare
  - Player join notification: subtle audio cue on host screen when a new player enters the lobby
- [ ] **Background music / lobby ambiance**: Subtle ambient music loop for the lobby and waiting screens to fill dead air while players join. Important considerations:
  - Background music should ONLY play in lobby/waiting states — during gameplay the song preview IS the audio
  - Must include a visible mute/volume toggle since hosts may be in noisy environments or prefer silence
  - Should fade out smoothly when transitioning from lobby to game start
  - Keep it low-energy and unobtrusive so it doesn't compete with conversation
- [ ] Optional light mode toggle
- [ ] Player accounts (optional sign-up)
- [ ] Leaderboards (global and friend-based)
- [ ] Game history / stats tracking
- [ ] Audience/spectator mode for large gatherings
- [ ] Additional game modes from brainstorm list

---

## 13. Open Decisions & TBD

These items need to be decided during development:

| Decision | Options | Notes |
|----------|---------|-------|
| Visual theme | Modern / Retro / Neon / Game-show | To be explored during design phase |
| Color palette | TBD | Should complement dark mode primary theme |
| Exact Spotify scopes needed | TBD | Depends on final feature set |
| Lyrics API choice | Genius vs Musixmatch vs both | Evaluate accuracy, rate limits, and cost |
| Word bank source for Lyric Word Match | Custom curated vs generated from lyrics corpus | Could start curated and expand |
| Fuzzy matching threshold | How close is "close enough"? | Need to test with real song/artist names |
| Disconnect timeout | 30s? 60s? 2 min? | How long to hold a player's spot |
| Sound effects | Web Audio API synthesis vs pre-recorded audio files | Synthesis preferred for zero dependencies and small bundle; see Phase 4 for detailed plan |
| Monetization (if any) | Ads, premium modes, cosmetics, none | Not a priority but worth noting |

---

## Revision Log

| Date | Version | Changes |
|------|---------|---------|
| Feb 2026 | 1.0 | Initial scope document created |
