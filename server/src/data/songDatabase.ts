import { Song } from '@shared/types/music';

// ~602 curated songs across 9 genres (including K-Pop) and 7 decades.
// previewUrl and albumArtUrl are empty — iTunes fills them at game time.

export const songDatabase: Song[] = [
  // ═══════════════════════════════════════════
  // POP (~35 songs)
  // ═══════════════════════════════════════════

  // 1970s Pop
  { id: 'pop-001', title: 'Dancing Queen', artist: 'ABBA', album: 'Arrival', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 1976, isExplicit: false },
  { id: 'pop-002', title: 'Stayin\' Alive', artist: 'Bee Gees', album: 'Saturday Night Fever', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 1977, isExplicit: false },
  { id: 'pop-003', title: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 1975, isExplicit: false },

  // 1980s Pop
  { id: 'pop-004', title: 'Billie Jean', artist: 'Michael Jackson', album: 'Thriller', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 1982, isExplicit: false },
  { id: 'pop-005', title: 'Like a Prayer', artist: 'Madonna', album: 'Like a Prayer', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 1989, isExplicit: false },
  { id: 'pop-006', title: 'Take On Me', artist: 'a-ha', album: 'Hunting High and Low', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 1985, isExplicit: false },
  { id: 'pop-007', title: 'Girls Just Want to Have Fun', artist: 'Cyndi Lauper', album: 'She\'s So Unusual', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 1983, isExplicit: false },
  { id: 'pop-008', title: 'Wake Me Up Before You Go-Go', artist: 'Wham!', album: 'Make It Big', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 1984, isExplicit: false },

  // 1990s Pop
  { id: 'pop-009', title: '...Baby One More Time', artist: 'Britney Spears', album: '...Baby One More Time', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 1998, isExplicit: false },
  { id: 'pop-010', title: 'Wannabe', artist: 'Spice Girls', album: 'Spice', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 1996, isExplicit: false },
  { id: 'pop-011', title: 'I Want It That Way', artist: 'Backstreet Boys', album: 'Millennium', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 1999, isExplicit: false },
  { id: 'pop-012', title: 'Believe', artist: 'Cher', album: 'Believe', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 1998, isExplicit: false },

  // 2000s Pop
  { id: 'pop-013', title: 'Crazy in Love', artist: 'Beyoncé', album: 'Dangerously in Love', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2003, isExplicit: false },
  { id: 'pop-014', title: 'Since U Been Gone', artist: 'Kelly Clarkson', album: 'Breakaway', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2004, isExplicit: false },
  { id: 'pop-015', title: 'Toxic', artist: 'Britney Spears', album: 'In the Zone', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2003, isExplicit: false },
  { id: 'pop-016', title: 'Umbrella', artist: 'Rihanna', album: 'Good Girl Gone Bad', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2007, isExplicit: false },
  { id: 'pop-017', title: 'Poker Face', artist: 'Lady Gaga', album: 'The Fame', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2008, isExplicit: false },

  // 2010s Pop
  { id: 'pop-018', title: 'Rolling in the Deep', artist: 'Adele', album: '21', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2010, isExplicit: false },
  { id: 'pop-019', title: 'Shape of You', artist: 'Ed Sheeran', album: '÷', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2017, isExplicit: false },
  { id: 'pop-020', title: 'Uptown Funk', artist: 'Bruno Mars', album: 'Uptown Special', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2014, isExplicit: false },
  { id: 'pop-021', title: 'Bad Guy', artist: 'Billie Eilish', album: 'WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2019, isExplicit: false },
  { id: 'pop-022', title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2019, isExplicit: false },
  { id: 'pop-023', title: 'Happy', artist: 'Pharrell Williams', album: 'G I R L', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2013, isExplicit: false },
  { id: 'pop-024', title: 'Shake It Off', artist: 'Taylor Swift', album: '1989', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2014, isExplicit: false },
  { id: 'pop-025', title: 'Closer', artist: 'The Chainsmokers', album: 'Collage', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2016, isExplicit: false },
  { id: 'pop-026', title: 'Thinking Out Loud', artist: 'Ed Sheeran', album: 'x', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2014, isExplicit: false },

  // 2020s Pop
  { id: 'pop-027', title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2020, isExplicit: false },
  { id: 'pop-028', title: 'As It Was', artist: 'Harry Styles', album: 'Harry\'s House', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2022, isExplicit: false },
  { id: 'pop-029', title: 'Anti-Hero', artist: 'Taylor Swift', album: 'Midnights', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2022, isExplicit: false },
  { id: 'pop-030', title: 'Flowers', artist: 'Miley Cyrus', album: 'Endless Summer Vacation', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2023, isExplicit: false },
  { id: 'pop-031', title: 'Watermelon Sugar', artist: 'Harry Styles', album: 'Fine Line', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2020, isExplicit: false },
  { id: 'pop-032', title: 'drivers license', artist: 'Olivia Rodrigo', album: 'SOUR', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2021, isExplicit: false },
  { id: 'pop-033', title: 'Cruel Summer', artist: 'Taylor Swift', album: 'Lover', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2019, isExplicit: false },
  { id: 'pop-034', title: 'Espresso', artist: 'Sabrina Carpenter', album: 'Short n\' Sweet', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2024, isExplicit: false },

  // ═══════════════════════════════════════════
  // HIP-HOP/RAP (~30 songs)
  // ═══════════════════════════════════════════

  // 1980s Hip-Hop
  { id: 'hh-001', title: 'Rapper\'s Delight', artist: 'The Sugarhill Gang', album: 'Sugarhill Gang', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 1979, isExplicit: false },
  { id: 'hh-002', title: 'Fight the Power', artist: 'Public Enemy', album: 'Fear of a Black Planet', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 1989, isExplicit: true },
  { id: 'hh-003', title: 'It\'s Tricky', artist: 'Run-D.M.C.', album: 'Raising Hell', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 1986, isExplicit: false },

  // 1990s Hip-Hop
  { id: 'hh-004', title: 'Juicy', artist: 'The Notorious B.I.G.', album: 'Ready to Die', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 1994, isExplicit: true },
  { id: 'hh-005', title: 'California Love', artist: '2Pac', album: 'All Eyez on Me', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 1995, isExplicit: true },
  { id: 'hh-006', title: 'Nuthin\' but a \'G\' Thang', artist: 'Dr. Dre', album: 'The Chronic', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 1992, isExplicit: true },
  { id: 'hh-007', title: 'C.R.E.A.M.', artist: 'Wu-Tang Clan', album: 'Enter the Wu-Tang', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 1993, isExplicit: true },
  { id: 'hh-008', title: 'Shook Ones Part II', artist: 'Mobb Deep', album: 'The Infamous', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 1995, isExplicit: true },
  { id: 'hh-009', title: 'Ms. Jackson', artist: 'OutKast', album: 'Stankonia', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2000, isExplicit: true },

  // 2000s Hip-Hop
  { id: 'hh-010', title: 'Lose Yourself', artist: 'Eminem', album: '8 Mile Soundtrack', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2002, isExplicit: true },
  { id: 'hh-011', title: 'In Da Club', artist: '50 Cent', album: 'Get Rich or Die Tryin\'', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2003, isExplicit: true },
  { id: 'hh-012', title: 'Gold Digger', artist: 'Kanye West', album: 'Late Registration', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2005, isExplicit: true },
  { id: 'hh-013', title: 'Hey Ya!', artist: 'OutKast', album: 'Speakerboxxx/The Love Below', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2003, isExplicit: false },
  { id: 'hh-014', title: 'Crank That', artist: 'Soulja Boy', album: 'souljaboytellem.com', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2007, isExplicit: true },
  { id: 'hh-015', title: 'A Milli', artist: 'Lil Wayne', album: 'Tha Carter III', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2008, isExplicit: true },

  // 2010s Hip-Hop
  { id: 'hh-016', title: 'HUMBLE.', artist: 'Kendrick Lamar', album: 'DAMN.', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2017, isExplicit: true },
  { id: 'hh-017', title: 'Hotline Bling', artist: 'Drake', album: 'Views', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2015, isExplicit: false },
  { id: 'hh-018', title: 'Sicko Mode', artist: 'Travis Scott', album: 'Astroworld', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2018, isExplicit: true },
  { id: 'hh-019', title: 'Old Town Road', artist: 'Lil Nas X', album: '7', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2019, isExplicit: false },
  { id: 'hh-020', title: 'God\'s Plan', artist: 'Drake', album: 'Scorpion', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2018, isExplicit: true },
  { id: 'hh-021', title: 'Bodak Yellow', artist: 'Cardi B', album: 'Invasion of Privacy', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2017, isExplicit: true },
  { id: 'hh-022', title: 'XO Tour Llif3', artist: 'Lil Uzi Vert', album: 'Luv Is Rage 2', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2017, isExplicit: true },
  { id: 'hh-023', title: 'Mask Off', artist: 'Future', album: 'FUTURE', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2017, isExplicit: true },

  // 2020s Hip-Hop
  { id: 'hh-024', title: 'MONTERO', artist: 'Lil Nas X', album: 'MONTERO', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2021, isExplicit: true },
  { id: 'hh-025', title: 'Industry Baby', artist: 'Lil Nas X', album: 'MONTERO', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2021, isExplicit: true },
  { id: 'hh-026', title: 'Wait For U', artist: 'Future', album: 'I NEVER LIKED YOU', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2022, isExplicit: true },
  { id: 'hh-027', title: 'First Person Shooter', artist: 'Drake', album: 'For All the Dogs', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2023, isExplicit: true },
  { id: 'hh-028', title: 'Not Like Us', artist: 'Kendrick Lamar', album: 'GNX', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2024, isExplicit: true },
  { id: 'hh-029', title: 'Rich Flex', artist: 'Drake', album: 'Her Loss', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2022, isExplicit: true },

  // ═══════════════════════════════════════════
  // ROCK (~30 songs)
  // ═══════════════════════════════════════════

  // 1970s Rock
  { id: 'rock-001', title: 'Stairway to Heaven', artist: 'Led Zeppelin', album: 'Led Zeppelin IV', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1971, isExplicit: false },
  { id: 'rock-002', title: 'Hotel California', artist: 'Eagles', album: 'Hotel California', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1977, isExplicit: false },
  { id: 'rock-003', title: 'Highway to Hell', artist: 'AC/DC', album: 'Highway to Hell', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1979, isExplicit: false },
  { id: 'rock-004', title: 'Dream On', artist: 'Aerosmith', album: 'Aerosmith', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1973, isExplicit: false },

  // 1980s Rock
  { id: 'rock-005', title: 'Sweet Child O\' Mine', artist: 'Guns N\' Roses', album: 'Appetite for Destruction', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1987, isExplicit: false },
  { id: 'rock-006', title: 'Livin\' on a Prayer', artist: 'Bon Jovi', album: 'Slippery When Wet', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1986, isExplicit: false },
  { id: 'rock-007', title: 'Back in Black', artist: 'AC/DC', album: 'Back in Black', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1980, isExplicit: false },
  { id: 'rock-008', title: 'Every Breath You Take', artist: 'The Police', album: 'Synchronicity', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1983, isExplicit: false },
  { id: 'rock-009', title: 'Pour Some Sugar on Me', artist: 'Def Leppard', album: 'Hysteria', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1987, isExplicit: false },

  // 1990s Rock
  { id: 'rock-010', title: 'Smells Like Teen Spirit', artist: 'Nirvana', album: 'Nevermind', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1991, isExplicit: false },
  { id: 'rock-011', title: 'Under the Bridge', artist: 'Red Hot Chili Peppers', album: 'Blood Sugar Sex Magik', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1991, isExplicit: false },
  { id: 'rock-012', title: 'Wonderwall', artist: 'Oasis', album: '(What\'s the Story) Morning Glory?', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1995, isExplicit: false },
  { id: 'rock-013', title: 'Zombie', artist: 'The Cranberries', album: 'No Need to Argue', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1994, isExplicit: false },
  { id: 'rock-014', title: 'Semi-Charmed Life', artist: 'Third Eye Blind', album: 'Third Eye Blind', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1997, isExplicit: false },

  // 2000s Rock
  { id: 'rock-015', title: 'Mr. Brightside', artist: 'The Killers', album: 'Hot Fuss', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 2003, isExplicit: false },
  { id: 'rock-016', title: 'Boulevard of Broken Dreams', artist: 'Green Day', album: 'American Idiot', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 2004, isExplicit: false },
  { id: 'rock-017', title: 'In the End', artist: 'Linkin Park', album: 'Hybrid Theory', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 2000, isExplicit: false },
  { id: 'rock-018', title: 'Seven Nation Army', artist: 'The White Stripes', album: 'Elephant', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 2003, isExplicit: false },
  { id: 'rock-019', title: 'Numb', artist: 'Linkin Park', album: 'Meteora', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 2003, isExplicit: false },
  { id: 'rock-020', title: 'How You Remind Me', artist: 'Nickelback', album: 'Silver Side Up', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 2001, isExplicit: false },

  // 2010s Rock
  { id: 'rock-021', title: 'Radioactive', artist: 'Imagine Dragons', album: 'Night Visions', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 2012, isExplicit: false },
  { id: 'rock-022', title: 'Believer', artist: 'Imagine Dragons', album: 'Evolve', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 2017, isExplicit: false },
  { id: 'rock-023', title: 'Thunder', artist: 'Imagine Dragons', album: 'Evolve', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 2017, isExplicit: false },
  { id: 'rock-024', title: 'Riptide', artist: 'Vance Joy', album: 'Dream Your Life Away', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 2013, isExplicit: false },
  { id: 'rock-025', title: 'Stressed Out', artist: 'Twenty One Pilots', album: 'Blurryface', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 2015, isExplicit: false },

  // 2020s Rock
  { id: 'rock-026', title: 'Heat Waves', artist: 'Glass Animals', album: 'Dreamland', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 2020, isExplicit: false },
  { id: 'rock-027', title: 'Enemy', artist: 'Imagine Dragons', album: 'Mercury - Act 1', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 2021, isExplicit: false },
  { id: 'rock-028', title: 'Running Up That Hill', artist: 'Kate Bush', album: 'Hounds of Love', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1985, isExplicit: false },

  // ═══════════════════════════════════════════
  // R&B/SOUL (~25 songs)
  // ═══════════════════════════════════════════

  // 1970s-80s R&B
  { id: 'rnb-001', title: 'Superstition', artist: 'Stevie Wonder', album: 'Talking Book', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 1972, isExplicit: false },
  { id: 'rnb-002', title: 'I Will Always Love You', artist: 'Whitney Houston', album: 'The Bodyguard', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 1992, isExplicit: false },
  { id: 'rnb-003', title: 'September', artist: 'Earth, Wind & Fire', album: 'The Best of Earth, Wind & Fire Vol. 1', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 1978, isExplicit: false },
  { id: 'rnb-004', title: 'Let\'s Stay Together', artist: 'Al Green', album: 'Let\'s Stay Together', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 1971, isExplicit: false },

  // 1990s R&B
  { id: 'rnb-005', title: 'No Scrubs', artist: 'TLC', album: 'FanMail', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 1999, isExplicit: false },
  { id: 'rnb-006', title: 'Waterfalls', artist: 'TLC', album: 'CrazySexyCool', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 1995, isExplicit: false },
  { id: 'rnb-007', title: 'No Diggity', artist: 'Blackstreet', album: 'Another Level', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 1996, isExplicit: false },
  { id: 'rnb-008', title: 'Kiss from a Rose', artist: 'Seal', album: 'Seal II', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 1994, isExplicit: false },

  // 2000s R&B
  { id: 'rnb-009', title: 'Yeah!', artist: 'Usher', album: 'Confessions', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2004, isExplicit: false },
  { id: 'rnb-010', title: 'Irreplaceable', artist: 'Beyoncé', album: 'B\'Day', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2006, isExplicit: false },
  { id: 'rnb-011', title: 'Single Ladies', artist: 'Beyoncé', album: 'I Am... Sasha Fierce', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2008, isExplicit: false },
  { id: 'rnb-012', title: 'Ignition (Remix)', artist: 'R. Kelly', album: 'Chocolate Factory', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2003, isExplicit: false },

  // 2010s R&B
  { id: 'rnb-013', title: 'Thinking Bout You', artist: 'Frank Ocean', album: 'Channel Orange', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2012, isExplicit: true },
  { id: 'rnb-014', title: 'Earned It', artist: 'The Weeknd', album: 'Beauty Behind the Madness', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2015, isExplicit: false },
  { id: 'rnb-015', title: 'Drunk in Love', artist: 'Beyoncé', album: 'Beyoncé', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2013, isExplicit: true },
  { id: 'rnb-016', title: 'Best Part', artist: 'Daniel Caesar', album: 'Freudian', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2017, isExplicit: false },
  { id: 'rnb-017', title: 'Love Galore', artist: 'SZA', album: 'Ctrl', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2017, isExplicit: true },
  { id: 'rnb-018', title: 'Redbone', artist: 'Childish Gambino', album: 'Awaken, My Love!', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2016, isExplicit: false },

  // 2020s R&B
  { id: 'rnb-019', title: 'Kill Bill', artist: 'SZA', album: 'SOS', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2022, isExplicit: true },
  { id: 'rnb-020', title: 'Snooze', artist: 'SZA', album: 'SOS', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2022, isExplicit: true },
  { id: 'rnb-021', title: 'Essence', artist: 'Wizkid', album: 'Made in Lagos', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2020, isExplicit: false },
  { id: 'rnb-022', title: 'Die For You', artist: 'The Weeknd', album: 'Starboy', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2016, isExplicit: false },
  { id: 'rnb-023', title: 'Leave The Door Open', artist: 'Silk Sonic', album: 'An Evening with Silk Sonic', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2021, isExplicit: false },

  // ═══════════════════════════════════════════
  // COUNTRY (~20 songs)
  // ═══════════════════════════════════════════

  // Classic Country (70s-80s)
  { id: 'cntry-001', title: 'Ring of Fire', artist: 'Johnny Cash', album: 'Ring of Fire: The Best of Johnny Cash', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 1963, isExplicit: false },
  { id: 'cntry-002', title: 'Jolene', artist: 'Dolly Parton', album: 'Jolene', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 1973, isExplicit: false },
  { id: 'cntry-003', title: 'On the Road Again', artist: 'Willie Nelson', album: 'Honeysuckle Rose', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 1980, isExplicit: false },
  { id: 'cntry-004', title: 'Friends in Low Places', artist: 'Garth Brooks', album: 'No Fences', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 1990, isExplicit: false },

  // 1990s-2000s Country
  { id: 'cntry-005', title: 'Boot Scootin\' Boogie', artist: 'Brooks & Dunn', album: 'Brand New Man', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 1991, isExplicit: false },
  { id: 'cntry-006', title: 'Achy Breaky Heart', artist: 'Billy Ray Cyrus', album: 'Some Gave All', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 1992, isExplicit: false },
  { id: 'cntry-007', title: 'Before He Cheats', artist: 'Carrie Underwood', album: 'Some Hearts', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 2005, isExplicit: false },
  { id: 'cntry-008', title: 'Need You Now', artist: 'Lady A', album: 'Need You Now', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 2009, isExplicit: false },
  { id: 'cntry-009', title: 'Cruise', artist: 'Florida Georgia Line', album: 'Here\'s to the Good Times', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 2012, isExplicit: false },

  // 2010s Country
  { id: 'cntry-010', title: 'Meant to Be', artist: 'Bebe Rexha & Florida Georgia Line', album: 'Expectations', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 2017, isExplicit: false },
  { id: 'cntry-011', title: 'Body Like a Back Road', artist: 'Sam Hunt', album: 'Southside', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 2017, isExplicit: false },
  { id: 'cntry-012', title: 'Die a Happy Man', artist: 'Thomas Rhett', album: 'Tangled Up', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 2015, isExplicit: false },
  { id: 'cntry-013', title: 'Tennessee Whiskey', artist: 'Chris Stapleton', album: 'Traveller', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 2015, isExplicit: false },

  // 2020s Country
  { id: 'cntry-014', title: 'Fast Car', artist: 'Luke Combs', album: 'Gettin\' Old', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 2023, isExplicit: false },
  { id: 'cntry-015', title: 'Last Night', artist: 'Morgan Wallen', album: 'One Thing at a Time', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 2023, isExplicit: false },
  { id: 'cntry-016', title: 'Fancy Like', artist: 'Walker Hayes', album: 'Country Stuff the Album', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 2021, isExplicit: false },
  { id: 'cntry-017', title: 'Whiskey Glasses', artist: 'Morgan Wallen', album: 'If I Know Me', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 2018, isExplicit: false },
  { id: 'cntry-018', title: 'Something in the Orange', artist: 'Zach Bryan', album: 'American Heartbreak', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 2022, isExplicit: false },
  { id: 'cntry-019', title: 'I Remember Everything', artist: 'Zach Bryan', album: 'Zach Bryan', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 2023, isExplicit: true },

  // ═══════════════════════════════════════════
  // EDM/DANCE (~20 songs)
  // ═══════════════════════════════════════════

  // 1990s-2000s Dance
  { id: 'edm-001', title: 'Sandstorm', artist: 'Darude', album: 'Before the Storm', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 1999, isExplicit: false },
  { id: 'edm-002', title: 'Blue (Da Ba Dee)', artist: 'Eiffel 65', album: 'Europop', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 1998, isExplicit: false },
  { id: 'edm-003', title: 'Around the World', artist: 'Daft Punk', album: 'Homework', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 1997, isExplicit: false },
  { id: 'edm-004', title: 'Insomnia', artist: 'Faithless', album: 'Reverence', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 1995, isExplicit: false },

  // 2000s-2010s EDM
  { id: 'edm-005', title: 'One More Time', artist: 'Daft Punk', album: 'Discovery', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2000, isExplicit: false },
  { id: 'edm-006', title: 'Levels', artist: 'Avicii', album: 'True', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2011, isExplicit: false },
  { id: 'edm-007', title: 'Wake Me Up', artist: 'Avicii', album: 'True', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2013, isExplicit: false },
  { id: 'edm-008', title: 'Titanium', artist: 'David Guetta', album: 'Nothing but the Beat', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2011, isExplicit: false },
  { id: 'edm-009', title: 'Don\'t You Worry Child', artist: 'Swedish House Mafia', album: 'Until Now', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2012, isExplicit: false },
  { id: 'edm-010', title: 'Lean On', artist: 'Major Lazer & DJ Snake', album: 'Peace Is the Mission', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2015, isExplicit: false },
  { id: 'edm-011', title: 'This Is What You Came For', artist: 'Calvin Harris', album: 'My Way', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2016, isExplicit: false },
  { id: 'edm-012', title: 'Faded', artist: 'Alan Walker', album: 'Different World', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2015, isExplicit: false },
  { id: 'edm-013', title: 'The Middle', artist: 'Zedd', album: 'The Middle', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2018, isExplicit: false },
  { id: 'edm-014', title: 'Alone', artist: 'Marshmello', album: 'Joytime', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2016, isExplicit: false },
  { id: 'edm-015', title: 'Happier', artist: 'Marshmello', album: 'Joytime II', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2018, isExplicit: false },

  // 2020s EDM
  { id: 'edm-016', title: 'Roses (Imanbek Remix)', artist: 'SAINt JHN', album: 'Collection One', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2020, isExplicit: true },
  { id: 'edm-017', title: 'Save Your Tears (Remix)', artist: 'The Weeknd & Ariana Grande', album: 'After Hours', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2021, isExplicit: false },
  { id: 'edm-018', title: 'I\'m Good (Blue)', artist: 'David Guetta & Bebe Rexha', album: 'I\'m Good (Blue)', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2022, isExplicit: false },
  { id: 'edm-019', title: 'Where Are You Now', artist: 'Lost Frequencies', album: 'All Stand Together', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2021, isExplicit: false },

  // ═══════════════════════════════════════════
  // ALTERNATIVE/INDIE (~20 songs)
  // ═══════════════════════════════════════════

  // 1980s-90s Alternative
  { id: 'alt-001', title: 'Just Like Heaven', artist: 'The Cure', album: 'Kiss Me, Kiss Me, Kiss Me', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 1987, isExplicit: false },
  { id: 'alt-002', title: 'Creep', artist: 'Radiohead', album: 'Pablo Honey', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 1992, isExplicit: true },
  { id: 'alt-003', title: 'Karma Police', artist: 'Radiohead', album: 'OK Computer', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 1997, isExplicit: false },
  { id: 'alt-004', title: 'Bitter Sweet Symphony', artist: 'The Verve', album: 'Urban Hymns', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 1997, isExplicit: false },
  { id: 'alt-005', title: 'Closing Time', artist: 'Semisonic', album: 'Feeling Strangely Fine', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 1998, isExplicit: false },

  // 2000s Alternative
  { id: 'alt-006', title: 'Last Nite', artist: 'The Strokes', album: 'Is This It', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2001, isExplicit: false },
  { id: 'alt-007', title: 'Somebody That I Used to Know', artist: 'Gotye', album: 'Making Mirrors', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2011, isExplicit: false },
  { id: 'alt-008', title: 'Take Me Out', artist: 'Franz Ferdinand', album: 'Franz Ferdinand', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2004, isExplicit: false },
  { id: 'alt-009', title: 'Float On', artist: 'Modest Mouse', album: 'Good News for People Who Love Bad News', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2004, isExplicit: false },
  { id: 'alt-010', title: 'Pumped Up Kicks', artist: 'Foster the People', album: 'Torches', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2010, isExplicit: false },

  // 2010s Alternative
  { id: 'alt-011', title: 'Do I Wanna Know?', artist: 'Arctic Monkeys', album: 'AM', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2013, isExplicit: false },
  { id: 'alt-012', title: 'Sweater Weather', artist: 'The Neighbourhood', album: 'I Love You.', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2012, isExplicit: false },
  { id: 'alt-013', title: 'The Less I Know the Better', artist: 'Tame Impala', album: 'Currents', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2015, isExplicit: false },
  { id: 'alt-014', title: 'Electric Feel', artist: 'MGMT', album: 'Oracular Spectacular', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2007, isExplicit: false },
  { id: 'alt-015', title: 'Ho Hey', artist: 'The Lumineers', album: 'The Lumineers', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2012, isExplicit: false },
  { id: 'alt-016', title: 'Tongue Tied', artist: 'Grouplove', album: 'Never Trust a Happy Song', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2011, isExplicit: false },
  { id: 'alt-017', title: 'Take a Walk', artist: 'Passion Pit', album: 'Gossamer', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2012, isExplicit: false },

  // 2020s Alternative
  { id: 'alt-018', title: 'Line Without a Hook', artist: 'Ricky Montgomery', album: 'Montgomery Ricky', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2016, isExplicit: false },
  { id: 'alt-019', title: 'There\'d Better Be a Mirrorball', artist: 'Arctic Monkeys', album: 'The Car', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2022, isExplicit: false },
  { id: 'alt-020', title: 'My Love Mine All Mine', artist: 'Mitski', album: 'The Land Is Inhospitable and So Are We', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2023, isExplicit: false },

  // ═══════════════════════════════════════════
  // LATIN (~20 songs)
  // ═══════════════════════════════════════════

  // Classic Latin
  { id: 'lat-001', title: 'La Bamba', artist: 'Ritchie Valens', album: 'Ritchie Valens', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 1958, isExplicit: false },
  { id: 'lat-002', title: 'Livin\' La Vida Loca', artist: 'Ricky Martin', album: 'Ricky Martin', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 1999, isExplicit: false },
  { id: 'lat-003', title: 'Hips Don\'t Lie', artist: 'Shakira', album: 'Oral Fixation Vol. 2', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2006, isExplicit: false },
  { id: 'lat-004', title: 'Gasolina', artist: 'Daddy Yankee', album: 'Barrio Fino', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2004, isExplicit: false },
  { id: 'lat-005', title: 'Bailando', artist: 'Enrique Iglesias', album: 'Sex and Love', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2014, isExplicit: false },

  // 2010s Latin
  { id: 'lat-006', title: 'Despacito', artist: 'Luis Fonsi', album: 'Vida', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2017, isExplicit: false },
  { id: 'lat-007', title: 'Mi Gente', artist: 'J Balvin', album: 'Vibras', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2017, isExplicit: false },
  { id: 'lat-008', title: 'Danza Kuduro', artist: 'Don Omar', album: 'Meet the Orphans', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2010, isExplicit: false },
  { id: 'lat-009', title: 'Waka Waka', artist: 'Shakira', album: 'Sale el Sol', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2010, isExplicit: false },
  { id: 'lat-010', title: 'Felices los 4', artist: 'Maluma', album: 'F.A.M.E.', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2017, isExplicit: false },
  { id: 'lat-011', title: 'X', artist: 'Nicky Jam & J Balvin', album: 'X', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2018, isExplicit: false },
  { id: 'lat-012', title: 'Te Boté', artist: 'Casper Mágico, Nio García & Darell', album: 'Te Boté', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2018, isExplicit: true },
  { id: 'lat-013', title: 'Con Calma', artist: 'Daddy Yankee', album: 'Con Calma', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2019, isExplicit: false },

  // 2020s Latin
  { id: 'lat-014', title: 'Tití Me Preguntó', artist: 'Bad Bunny', album: 'Un Verano Sin Ti', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2022, isExplicit: true },
  { id: 'lat-015', title: 'Dákiti', artist: 'Bad Bunny & Jhay Cortez', album: 'El Último Tour Del Mundo', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2020, isExplicit: true },
  { id: 'lat-016', title: 'Hawái', artist: 'Maluma', album: 'Papi Juancho', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2020, isExplicit: false },
  { id: 'lat-017', title: 'Pepas', artist: 'Farruko', album: 'La 167', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2021, isExplicit: true },
  { id: 'lat-018', title: 'Me Porto Bonito', artist: 'Bad Bunny', album: 'Un Verano Sin Ti', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2022, isExplicit: true },
  { id: 'lat-019', title: 'Ojitos Lindos', artist: 'Bad Bunny', album: 'Un Verano Sin Ti', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2022, isExplicit: false },
  { id: 'lat-020', title: 'TQG', artist: 'Karol G & Shakira', album: 'Mañana Será Bonito', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2023, isExplicit: true },

  // ═══════════════════════════════════════════
  // POP — EXPANSION (+30 songs → ~64 total)
  // ═══════════════════════════════════════════

  { id: 'pop-035', title: 'Roar', artist: 'Katy Perry', album: 'Prism', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2013, isExplicit: false },
  { id: 'pop-036', title: 'Firework', artist: 'Katy Perry', album: 'Teenage Dream', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2010, isExplicit: false },
  { id: 'pop-037', title: 'Teenage Dream', artist: 'Katy Perry', album: 'Teenage Dream', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2010, isExplicit: false },
  { id: 'pop-038', title: 'Dark Horse', artist: 'Katy Perry', album: 'Prism', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2013, isExplicit: false },
  { id: 'pop-039', title: 'Problem', artist: 'Ariana Grande', album: 'My Everything', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2014, isExplicit: false },
  { id: 'pop-040', title: 'thank u, next', artist: 'Ariana Grande', album: 'thank u, next', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2018, isExplicit: false },
  { id: 'pop-041', title: '7 rings', artist: 'Ariana Grande', album: 'thank u, next', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2019, isExplicit: false },
  { id: 'pop-042', title: 'Into You', artist: 'Ariana Grande', album: 'Dangerous Woman', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2016, isExplicit: false },
  { id: 'pop-043', title: 'Baby', artist: 'Justin Bieber', album: 'My World 2.0', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2010, isExplicit: false },
  { id: 'pop-044', title: 'Love Yourself', artist: 'Justin Bieber', album: 'Purpose', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2015, isExplicit: false },
  { id: 'pop-045', title: 'Sorry', artist: 'Justin Bieber', album: 'Purpose', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2015, isExplicit: false },
  { id: 'pop-046', title: 'Stay', artist: 'The Kid LAROI & Justin Bieber', album: 'F*CK LOVE 3', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2021, isExplicit: false },
  { id: 'pop-047', title: 'We Found Love', artist: 'Rihanna', album: 'Talk That Talk', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2011, isExplicit: false },
  { id: 'pop-048', title: 'Diamonds', artist: 'Rihanna', album: 'Unapologetic', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2012, isExplicit: false },
  { id: 'pop-049', title: 'What Makes You Beautiful', artist: 'One Direction', album: 'Up All Night', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2011, isExplicit: false },
  { id: 'pop-050', title: 'Story of My Life', artist: 'One Direction', album: 'Midnight Memories', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2013, isExplicit: false },
  { id: 'pop-051', title: 'New Rules', artist: 'Dua Lipa', album: 'Dua Lipa', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2017, isExplicit: false },
  { id: 'pop-052', title: 'Don\'t Start Now', artist: 'Dua Lipa', album: 'Future Nostalgia', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2019, isExplicit: false },
  { id: 'pop-053', title: 'Sunflower', artist: 'Post Malone & Swae Lee', album: 'Spider-Man: Into the Spider-Verse', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2018, isExplicit: false },
  { id: 'pop-054', title: 'Circles', artist: 'Post Malone', album: 'Hollywood\'s Bleeding', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2019, isExplicit: false },
  { id: 'pop-055', title: 'Stitches', artist: 'Shawn Mendes', album: 'Handwritten', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2015, isExplicit: false },
  { id: 'pop-056', title: 'Treat You Better', artist: 'Shawn Mendes', album: 'Illuminate', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2016, isExplicit: false },
  { id: 'pop-057', title: 'Stay With Me', artist: 'Sam Smith', album: 'In the Lonely Hour', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2014, isExplicit: false },
  { id: 'pop-058', title: 'Too Good at Goodbyes', artist: 'Sam Smith', album: 'The Thrill of It All', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2017, isExplicit: false },
  { id: 'pop-059', title: 'Chandelier', artist: 'Sia', album: '1000 Forms of Fear', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2014, isExplicit: false },
  { id: 'pop-060', title: 'Cheap Thrills', artist: 'Sia', album: 'This Is Acting', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2016, isExplicit: false },
  { id: 'pop-061', title: 'Can\'t Stop the Feeling!', artist: 'Justin Timberlake', album: 'Trolls (Original Motion Picture Soundtrack)', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2016, isExplicit: false },
  { id: 'pop-062', title: 'Mirrors', artist: 'Justin Timberlake', album: 'The 20/20 Experience', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2013, isExplicit: false },
  { id: 'pop-063', title: 'Good 4 U', artist: 'Olivia Rodrigo', album: 'SOUR', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2021, isExplicit: false },
  { id: 'pop-064', title: 'Wrecking Ball', artist: 'Miley Cyrus', album: 'Bangerz', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2013, isExplicit: false },

  // ═══════════════════════════════════════════
  // HIP-HOP/RAP — EXPANSION (+25 songs → ~54 total)
  // ═══════════════════════════════════════════

  { id: 'hh-030', title: 'Empire State of Mind', artist: 'Jay-Z & Alicia Keys', album: 'The Blueprint 3', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2009, isExplicit: false },
  { id: 'hh-031', title: '99 Problems', artist: 'Jay-Z', album: 'The Black Album', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2004, isExplicit: true },
  { id: 'hh-032', title: 'If I Ruled the World', artist: 'Nas', album: 'It Was Written', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 1996, isExplicit: false },
  { id: 'hh-033', title: 'One Dance', artist: 'Drake', album: 'Views', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2016, isExplicit: false },
  { id: 'hh-034', title: 'Started From the Bottom', artist: 'Drake', album: 'Nothing Was the Same', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2013, isExplicit: true },
  { id: 'hh-035', title: 'Nonstop', artist: 'Drake', album: 'Scorpion', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2018, isExplicit: true },
  { id: 'hh-036', title: 'Super Bass', artist: 'Nicki Minaj', album: 'Pink Friday', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2011, isExplicit: false },
  { id: 'hh-037', title: 'Anaconda', artist: 'Nicki Minaj', album: 'The Pinkprint', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2014, isExplicit: true },
  { id: 'hh-038', title: 'Rockstar', artist: 'Post Malone', album: 'Beerbongs & Bentleys', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2017, isExplicit: true },
  { id: 'hh-039', title: 'Congratulations', artist: 'Post Malone', album: 'Stoney', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2016, isExplicit: true },
  { id: 'hh-040', title: 'Savage', artist: 'Megan Thee Stallion', album: 'Suga', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2020, isExplicit: true },
  { id: 'hh-041', title: 'No Role Modelz', artist: 'J. Cole', album: '2014 Forest Hills Drive', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2014, isExplicit: true },
  { id: 'hh-042', title: 'Middle Child', artist: 'J. Cole', album: 'Revenge of the Dreamers III', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2019, isExplicit: true },
  { id: 'hh-043', title: 'DNA.', artist: 'Kendrick Lamar', album: 'DAMN.', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2017, isExplicit: true },
  { id: 'hh-044', title: 'Money Trees', artist: 'Kendrick Lamar', album: 'good kid, m.A.A.d city', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2012, isExplicit: true },
  { id: 'hh-045', title: 'Bad and Boujee', artist: 'Migos', album: 'Culture', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2016, isExplicit: true },
  { id: 'hh-046', title: 'Lucid Dreams', artist: 'Juice WRLD', album: 'Goodbye & Good Riddance', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2018, isExplicit: true },
  { id: 'hh-047', title: 'A Lot', artist: '21 Savage', album: 'I Am > I Was', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2018, isExplicit: true },
  { id: 'hh-048', title: 'Bank Account', artist: '21 Savage', album: 'Issa Album', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2017, isExplicit: true },
  { id: 'hh-049', title: 'First Class', artist: 'Jack Harlow', album: 'Come Home the Kids Miss You', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2022, isExplicit: false },
  { id: 'hh-050', title: "What's Poppin", artist: 'Jack Harlow', album: 'That\'s What They All Say', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2020, isExplicit: true },
  { id: 'hh-051', title: 'Mood', artist: '24kGoldn', album: 'El Dorado', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2020, isExplicit: false },
  { id: 'hh-052', title: 'Like That', artist: 'Future & Metro Boomin', album: 'We Don\'t Trust You', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2024, isExplicit: true },
  { id: 'hh-053', title: 'Luther', artist: 'Kendrick Lamar', album: 'GNX', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2024, isExplicit: false },
  { id: 'hh-054', title: 'tv off', artist: 'Kendrick Lamar', album: 'GNX', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2024, isExplicit: true },

  // ═══════════════════════════════════════════
  // ROCK — EXPANSION (+25 songs → ~53 total)
  // ═══════════════════════════════════════════

  { id: 'rock-029', title: 'Born to Run', artist: 'Bruce Springsteen', album: 'Born to Run', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1975, isExplicit: false },
  { id: 'rock-030', title: 'Africa', artist: 'Toto', album: 'Toto IV', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1982, isExplicit: false },
  { id: 'rock-031', title: 'Come as You Are', artist: 'Nirvana', album: 'Nevermind', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1991, isExplicit: false },
  { id: 'rock-032', title: 'Black Hole Sun', artist: 'Soundgarden', album: 'Superunknown', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1994, isExplicit: false },
  { id: 'rock-033', title: 'Jeremy', artist: 'Pearl Jam', album: 'Ten', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1991, isExplicit: false },
  { id: 'rock-034', title: 'Basket Case', artist: 'Green Day', album: 'Dookie', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1994, isExplicit: false },
  { id: 'rock-035', title: 'Iris', artist: 'Goo Goo Dolls', album: 'Dizzy Up the Girl', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1998, isExplicit: false },
  { id: 'rock-036', title: 'Drops of Jupiter', artist: 'Train', album: 'Drops of Jupiter', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 2001, isExplicit: false },
  { id: 'rock-037', title: 'Yellow', artist: 'Coldplay', album: 'Parachute', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 2000, isExplicit: false },
  { id: 'rock-038', title: 'Fix You', artist: 'Coldplay', album: 'X&Y', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 2005, isExplicit: false },
  { id: 'rock-039', title: 'The Scientist', artist: 'Coldplay', album: 'A Rush of Blood to the Head', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 2002, isExplicit: false },
  { id: 'rock-040', title: 'Clocks', artist: 'Coldplay', album: 'A Rush of Blood to the Head', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 2002, isExplicit: false },
  { id: 'rock-041', title: 'Helena', artist: 'My Chemical Romance', album: 'Three Cheers for Sweet Revenge', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 2004, isExplicit: false },
  { id: 'rock-042', title: 'Welcome to the Black Parade', artist: 'My Chemical Romance', album: 'The Black Parade', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 2006, isExplicit: false },
  { id: 'rock-043', title: 'I Write Sins Not Tragedies', artist: 'Panic! at the Disco', album: 'A Fever You Can\'t Sweat Out', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 2005, isExplicit: false },
  { id: 'rock-044', title: 'Sugar, We\'re Goin Down', artist: 'Fall Out Boy', album: 'From Under the Cork Tree', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 2005, isExplicit: false },
  { id: 'rock-045', title: 'Best of You', artist: 'Foo Fighters', album: 'In Your Honor', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 2005, isExplicit: false },
  { id: 'rock-046', title: 'All My Life', artist: 'Foo Fighters', album: 'One by One', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 2002, isExplicit: false },
  { id: 'rock-047', title: 'Californication', artist: 'Red Hot Chili Peppers', album: 'Californication', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1999, isExplicit: false },
  { id: 'rock-048', title: 'Scar Tissue', artist: 'Red Hot Chili Peppers', album: 'Californication', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1999, isExplicit: false },
  { id: 'rock-049', title: 'Like a Stone', artist: 'Audioslave', album: 'Audioslave', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 2002, isExplicit: false },
  { id: 'rock-050', title: 'The Diary of Jane', artist: 'Breaking Benjamin', album: 'Phobia', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 2006, isExplicit: false },
  { id: 'rock-051', title: 'Here Without You', artist: '3 Doors Down', album: 'Away from the Sun', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 2002, isExplicit: false },
  { id: 'rock-052', title: 'Somewhere I Belong', artist: 'Linkin Park', album: 'Meteora', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 2003, isExplicit: false },
  { id: 'rock-053', title: 'Drive', artist: 'Incubus', album: 'Make Yourself', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 2000, isExplicit: false },

  // ═══════════════════════════════════════════
  // R&B/SOUL — EXPANSION (+20 songs → ~43 total)
  // ═══════════════════════════════════════════

  { id: 'rnb-024', title: 'No One', artist: 'Alicia Keys', album: 'As I Am', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2007, isExplicit: false },
  { id: 'rnb-025', title: 'Fallin\'', artist: 'Alicia Keys', album: 'Songs in A Minor', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2001, isExplicit: false },
  { id: 'rnb-026', title: 'Girl on Fire', artist: 'Alicia Keys', album: 'Girl on Fire', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2012, isExplicit: false },
  { id: 'rnb-027', title: 'All of Me', artist: 'John Legend', album: 'Love in the Future', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2013, isExplicit: false },
  { id: 'rnb-028', title: 'Ordinary People', artist: 'John Legend', album: 'Get Lifted', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2004, isExplicit: false },
  { id: 'rnb-029', title: 'Family Affair', artist: 'Mary J. Blige', album: 'No More Drama', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2001, isExplicit: false },
  { id: 'rnb-030', title: 'Real Love', artist: 'Mary J. Blige', album: 'What\'s the 411?', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 1992, isExplicit: false },
  { id: 'rnb-031', title: 'So Sick', artist: 'Ne-Yo', album: 'In My Own Words', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2006, isExplicit: false },
  { id: 'rnb-032', title: 'Miss Independent', artist: 'Ne-Yo', album: 'Because of You', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2008, isExplicit: false },
  { id: 'rnb-033', title: 'Can\'t Feel My Face', artist: 'The Weeknd', album: 'Beauty Behind the Madness', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2015, isExplicit: false },
  { id: 'rnb-034', title: 'Location', artist: 'Khalid', album: 'American Teen', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2017, isExplicit: false },
  { id: 'rnb-035', title: 'Talk', artist: 'Khalid', album: 'Free Spirit', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2019, isExplicit: false },
  { id: 'rnb-036', title: 'Focus', artist: 'H.E.R.', album: 'I Used to Know Her', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2018, isExplicit: false },
  { id: 'rnb-037', title: 'Over It', artist: 'Summer Walker', album: 'Over It', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2019, isExplicit: true },
  { id: 'rnb-038', title: 'Heartbreak Anniversary', artist: 'Giveon', album: 'Take Time', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2020, isExplicit: false },
  { id: 'rnb-039', title: 'Burn', artist: 'Usher', album: 'Confessions', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2004, isExplicit: false },
  { id: 'rnb-040', title: 'U Got It Bad', artist: 'Usher', album: '8701', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2001, isExplicit: false },
  { id: 'rnb-041', title: 'Say My Name', artist: 'Destiny\'s Child', album: 'The Writing\'s on the Wall', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 1999, isExplicit: false },
  { id: 'rnb-042', title: 'Survivor', artist: 'Destiny\'s Child', album: 'Survivor', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2001, isExplicit: false },
  { id: 'rnb-043', title: 'Peaches', artist: 'Justin Bieber', album: 'Justice', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2021, isExplicit: false },

  // ═══════════════════════════════════════════
  // COUNTRY — EXPANSION (+20 songs → ~39 total)
  // ═══════════════════════════════════════════

  { id: 'cntry-020', title: 'Man! I Feel Like a Woman!', artist: 'Shania Twain', album: 'Come On Over', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 1999, isExplicit: false },
  { id: 'cntry-021', title: 'You\'re Still the One', artist: 'Shania Twain', album: 'Come On Over', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 1998, isExplicit: false },
  { id: 'cntry-022', title: 'Live Like You Were Dying', artist: 'Tim McGraw', album: 'Live Like You Were Dying', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 2004, isExplicit: false },
  { id: 'cntry-023', title: 'It\'s Five O\'Clock Somewhere', artist: 'Alan Jackson & Jimmy Buffett', album: 'Greatest Hits Volume II', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 2003, isExplicit: false },
  { id: 'cntry-024', title: 'Crash My Party', artist: 'Luke Bryan', album: 'Crash My Party', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 2013, isExplicit: false },
  { id: 'cntry-025', title: 'Country Girl (Shake It for Me)', artist: 'Luke Bryan', album: 'Tailgates & Tanlines', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 2011, isExplicit: false },
  { id: 'cntry-026', title: 'Beautiful Crazy', artist: 'Luke Combs', album: 'This One\'s for You Too', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 2018, isExplicit: false },
  { id: 'cntry-027', title: 'God\'s Country', artist: 'Blake Shelton', album: 'Fully Loaded: God\'s Country', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 2019, isExplicit: false },
  { id: 'cntry-028', title: 'God Gave Me You', artist: 'Blake Shelton', album: 'Red River Blue', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 2011, isExplicit: false },
  { id: 'cntry-029', title: 'Tequila', artist: 'Dan + Shay', album: 'Dan + Shay', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 2018, isExplicit: false },
  { id: 'cntry-030', title: '10,000 Hours', artist: 'Dan + Shay & Justin Bieber', album: 'Good Things', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 2019, isExplicit: false },
  { id: 'cntry-031', title: 'Try That in a Small Town', artist: 'Jason Aldean', album: 'Highway Desperado', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 2023, isExplicit: false },
  { id: 'cntry-032', title: 'Dirt Road Anthem', artist: 'Jason Aldean', album: 'My Kinda Party', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 2010, isExplicit: false },
  { id: 'cntry-033', title: 'She\'s Country', artist: 'Jason Aldean', album: 'Wide Open', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 2009, isExplicit: false },
  { id: 'cntry-034', title: 'Holy', artist: 'Florida Georgia Line', album: 'Life Rolls On', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 2021, isExplicit: false },
  { id: 'cntry-035', title: 'Pour Me a Drink', artist: 'Post Malone & Blake Shelton', album: 'F-1 Trillion', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 2024, isExplicit: false },
  { id: 'cntry-036', title: 'Lose Control', artist: 'Zach Bryan', album: 'Zach Bryan', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 2023, isExplicit: false },
  { id: 'cntry-037', title: 'Cowgirls', artist: 'Morgan Wallen', album: 'One Thing at a Time', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 2023, isExplicit: false },
  { id: 'cntry-038', title: '98 Braves', artist: 'Morgan Wallen', album: 'One Thing at a Time', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 2023, isExplicit: false },
  { id: 'cntry-039', title: 'Beg Forgiveness', artist: 'Morgan Wallen & Eric Church', album: 'One Thing at a Time', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 2023, isExplicit: false },

  // ═══════════════════════════════════════════
  // EDM/DANCE — EXPANSION (+20 songs → ~39 total)
  // ═══════════════════════════════════════════

  { id: 'edm-020', title: 'Summer', artist: 'Calvin Harris', album: 'Motion', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2014, isExplicit: false },
  { id: 'edm-021', title: 'Feel So Close', artist: 'Calvin Harris', album: 'Night Vision', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2011, isExplicit: false },
  { id: 'edm-022', title: 'Outside', artist: 'Calvin Harris', album: 'Motion', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2014, isExplicit: false },
  { id: 'edm-023', title: 'Animals', artist: 'Martin Garrix', album: 'Gold Skies', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2013, isExplicit: false },
  { id: 'edm-024', title: 'In the Name of Love', artist: 'Martin Garrix & Bebe Rexha', album: 'Gold Skies', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2016, isExplicit: false },
  { id: 'edm-025', title: 'Firestone', artist: 'Kygo', album: 'Cloud Nine', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2014, isExplicit: false },
  { id: 'edm-026', title: 'Higher Love', artist: 'Kygo & Whitney Houston', album: 'Golden Hour', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2019, isExplicit: false },
  { id: 'edm-027', title: 'Roses', artist: 'The Chainsmokers', album: 'Collage', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2015, isExplicit: false },
  { id: 'edm-028', title: 'Don\'t Let Me Down', artist: 'The Chainsmokers', album: 'Collage', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2016, isExplicit: false },
  { id: 'edm-029', title: 'Paris', artist: 'The Chainsmokers', album: 'Memories...Do Not Open', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2017, isExplicit: false },
  { id: 'edm-030', title: 'Stay the Night', artist: 'Zedd', album: 'True Colors', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2014, isExplicit: false },
  { id: 'edm-031', title: 'Beautiful Now', artist: 'Zedd', album: 'True Colors', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2015, isExplicit: false },
  { id: 'edm-032', title: 'Latch', artist: 'Disclosure', album: 'Settle', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2013, isExplicit: false },
  { id: 'edm-033', title: 'Turn Down for What', artist: 'DJ Snake & Lil Jon', album: 'Turn Down for What', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2013, isExplicit: true },
  { id: 'edm-034', title: 'Taki Taki', artist: 'DJ Snake', album: 'Taki Taki', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2018, isExplicit: false },
  { id: 'edm-035', title: 'Hey Brother', artist: 'Avicii', album: 'True', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2013, isExplicit: false },
  { id: 'edm-036', title: 'The Night Is Still Young', artist: 'Nicki Minaj', album: 'The Pinkprint', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2015, isExplicit: false },
  { id: 'edm-037', title: 'Clarity', artist: 'Zedd', album: 'Clarity', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2012, isExplicit: false },
  { id: 'edm-038', title: 'Stole the Show', artist: 'Kygo', album: 'Cloud Nine', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2015, isExplicit: false },
  { id: 'edm-039', title: 'Never Be Like You', artist: 'Flume', album: 'Skin', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2016, isExplicit: false },

  // ═══════════════════════════════════════════
  // ALTERNATIVE/INDIE — EXPANSION (+20 songs → ~40 total)
  // ═══════════════════════════════════════════

  { id: 'alt-021', title: 'Take Me to Church', artist: 'Hozier', album: 'Hozier', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2013, isExplicit: false },
  { id: 'alt-022', title: 'Movement', artist: 'Hozier', album: 'Wasteland, Baby!', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2019, isExplicit: false },
  { id: 'alt-023', title: 'Little Lion Man', artist: 'Mumford & Sons', album: 'Sigh No More', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2009, isExplicit: true },
  { id: 'alt-024', title: 'The Cave', artist: 'Mumford & Sons', album: 'Sigh No More', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2010, isExplicit: false },
  { id: 'alt-025', title: 'Dog Days Are Over', artist: 'Florence + the Machine', album: 'Lungs', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2008, isExplicit: false },
  { id: 'alt-026', title: 'Shake It Out', artist: 'Florence + the Machine', album: 'Ceremonials', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2011, isExplicit: false },
  { id: 'alt-027', title: 'I Will Follow You into the Dark', artist: 'Death Cab for Cutie', album: 'Plans', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2005, isExplicit: false },
  { id: 'alt-028', title: 'Feel It Still', artist: 'Portugal. The Man', album: 'Woodstock', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2017, isExplicit: false },
  { id: 'alt-029', title: 'Somebody Else', artist: 'The 1975', album: 'I like it when you sleep...', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2016, isExplicit: false },
  { id: 'alt-030', title: 'Chocolate', artist: 'The 1975', album: 'The 1975', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2012, isExplicit: false },
  { id: 'alt-031', title: 'Ain\'t No Rest for the Wicked', artist: 'Cage the Elephant', album: 'Cage the Elephant', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2008, isExplicit: false },
  { id: 'alt-032', title: 'Cigarette Daydreams', artist: 'Cage the Elephant', album: 'Melophobia', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2013, isExplicit: false },
  { id: 'alt-033', title: 'What You Know', artist: 'Two Door Cinema Club', album: 'Tourist History', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2010, isExplicit: false },
  { id: 'alt-034', title: 'Skinny Love', artist: 'Bon Iver', album: 'For Emma, Forever Ago', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2007, isExplicit: false },
  { id: 'alt-035', title: 'Kyoto', artist: 'Phoebe Bridgers', album: 'Punisher', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2020, isExplicit: false },
  { id: 'alt-036', title: 'Robbers', artist: 'The 1975', album: 'The 1975', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2013, isExplicit: false },
  { id: 'alt-037', title: 'Slow Burn', artist: 'Kacey Musgraves', album: 'Golden Hour', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2018, isExplicit: false },
  { id: 'alt-038', title: 'Golden Hour', artist: 'Kacey Musgraves', album: 'Golden Hour', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2018, isExplicit: false },
  { id: 'alt-039', title: 'Shake Me Down', artist: 'Cage the Elephant', album: 'Thank You, Happy Birthday', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2011, isExplicit: false },
  { id: 'alt-040', title: 'Holocene', artist: 'Bon Iver', album: 'Bon Iver, Bon Iver', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2011, isExplicit: false },

  // ═══════════════════════════════════════════
  // LATIN — EXPANSION (+15 songs → ~35 total)
  // ═══════════════════════════════════════════

  { id: 'lat-021', title: 'Todo De Ti', artist: 'Rauw Alejandro', album: 'Vice Versa', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2021, isExplicit: false },
  { id: 'lat-022', title: 'Tattoo', artist: 'Rauw Alejandro', album: 'Afrodisíaco', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2020, isExplicit: false },
  { id: 'lat-023', title: 'Bichota', artist: 'Karol G', album: 'KG0516', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2020, isExplicit: true },
  { id: 'lat-024', title: 'PROVENZA', artist: 'Karol G', album: 'Mañana Será Bonito', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2023, isExplicit: false },
  { id: 'lat-025', title: 'China', artist: 'Anuel AA & Daddy Yankee', album: 'Emmanuel', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2019, isExplicit: true },
  { id: 'lat-026', title: 'BZRP Music Sessions #53', artist: 'Shakira & Bizarrap', album: 'BZRP Music Sessions Vol. 53', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2023, isExplicit: true },
  { id: 'lat-027', title: 'El Merengue', artist: 'Marshmello & Manuel Turizo', album: 'El Merengue', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2023, isExplicit: false },
  { id: 'lat-028', title: 'Mayores', artist: 'Becky G', album: 'Mala Santa', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2017, isExplicit: false },
  { id: 'lat-029', title: 'Sin Pijama', artist: 'Becky G & Natti Natasha', album: 'Mala Santa', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2018, isExplicit: false },
  { id: 'lat-030', title: 'Callaíta', artist: 'Bad Bunny', album: 'X 100PRE', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2019, isExplicit: false },
  { id: 'lat-031', title: 'Efecto', artist: 'Bad Bunny', album: 'Un Verano Sin Ti', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2022, isExplicit: false },
  { id: 'lat-032', title: 'Gato de Noche', artist: 'Peso Pluma', album: 'GÉNESIS', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2023, isExplicit: true },
  { id: 'lat-033', title: 'La Bachata', artist: 'Manuel Turizo', album: '2000', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2022, isExplicit: false },
  { id: 'lat-034', title: 'MIA', artist: 'Bad Bunny feat. Drake', album: 'X 100PRE', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2018, isExplicit: true },
  { id: 'lat-035', title: 'Tusa', artist: 'Karol G & Nicki Minaj', album: 'KG0516', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2019, isExplicit: false },

  // ═══════════════════════════════════════════
  // POP — EXPANSION 2 (+21 songs → ~85 total)
  // ═══════════════════════════════════════════

  { id: 'pop-065', title: 'Hollaback Girl', artist: 'Gwen Stefani', album: 'Love. Angel. Music. Baby.', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2004, isExplicit: false },
  { id: 'pop-066', title: 'Don\'t Speak', artist: 'No Doubt', album: 'Tragic Kingdom', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 1995, isExplicit: false },
  { id: 'pop-067', title: 'Just Give Me a Reason', artist: 'P!nk', album: 'The Truth About Love', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2012, isExplicit: false },
  { id: 'pop-068', title: 'Raise Your Glass', artist: 'P!nk', album: 'Greatest Hits...So Far!!!', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2010, isExplicit: false },
  { id: 'pop-069', title: 'Tik Tok', artist: 'Kesha', album: 'Animal', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2009, isExplicit: false },
  { id: 'pop-070', title: 'Hot in Herre', artist: 'Nelly', album: 'Nellyville', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2002, isExplicit: true },
  { id: 'pop-071', title: 'Dilemma', artist: 'Nelly feat. Kelly Rowland', album: 'Nellyville', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2002, isExplicit: false },
  { id: 'pop-072', title: 'I Gotta Feeling', artist: 'Black Eyed Peas', album: 'The E.N.D.', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2009, isExplicit: false },
  { id: 'pop-073', title: 'We Belong Together', artist: 'Mariah Carey', album: 'The Emancipation of Mimi', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2005, isExplicit: false },
  { id: 'pop-074', title: 'All I Want for Christmas Is You', artist: 'Mariah Carey', album: 'Merry Christmas', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 1994, isExplicit: false },
  { id: 'pop-075', title: 'Bye Bye Bye', artist: '*NSYNC', album: 'No Strings Attached', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2000, isExplicit: false },
  { id: 'pop-076', title: 'Juice', artist: 'Lizzo', album: 'Cuz I Love You', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2019, isExplicit: false },
  { id: 'pop-077', title: 'Say So', artist: 'Doja Cat', album: 'Hot Pink', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2019, isExplicit: false },
  { id: 'pop-078', title: 'Woman', artist: 'Doja Cat', album: 'Planet Her', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2021, isExplicit: false },
  { id: 'pop-079', title: 'Kiss Me More', artist: 'Doja Cat feat. SZA', album: 'Planet Her', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2021, isExplicit: false },
  { id: 'pop-080', title: 'Heather', artist: 'Conan Gray', album: 'Kid Krow', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2020, isExplicit: false },
  { id: 'pop-081', title: 'Summertime Sadness', artist: 'Lana Del Rey', album: 'Born to Die', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2012, isExplicit: false },
  { id: 'pop-082', title: 'Physical', artist: 'Dua Lipa', album: 'Future Nostalgia', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2020, isExplicit: false },
  { id: 'pop-083', title: 'Starboy', artist: 'The Weeknd', album: 'Starboy', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2016, isExplicit: false },
  { id: 'pop-084', title: 'Positions', artist: 'Ariana Grande', album: 'Positions', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2020, isExplicit: false },
  { id: 'pop-085', title: 'Break Free', artist: 'Ariana Grande', album: 'My Everything', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2014, isExplicit: false },

  // ═══════════════════════════════════════════
  // HIP-HOP/RAP — EXPANSION 2 (+23 songs → ~77 total)
  // ═══════════════════════════════════════════

  { id: 'hh-055', title: 'Work It', artist: 'Missy Elliott', album: 'Under Construction', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2002, isExplicit: true },
  { id: 'hh-056', title: 'Get Ur Freak On', artist: 'Missy Elliott', album: 'Miss E... So Addictive', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2001, isExplicit: false },
  { id: 'hh-057', title: 'X Gon\' Give It to Ya', artist: 'DMX', album: 'Cradle 2 the Grave', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2003, isExplicit: true },
  { id: 'hh-058', title: 'Doo Wop (That Thing)', artist: 'Lauryn Hill', album: 'The Miseducation of Lauryn Hill', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 1998, isExplicit: false },
  { id: 'hh-059', title: 'Big Pimpin\'', artist: 'Jay-Z', album: 'Vol. 3... Life and Times of S. Carter', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 1999, isExplicit: true },
  { id: 'hh-060', title: 'See You Again', artist: 'Wiz Khalifa', album: 'Furious 7: Original Motion Picture Soundtrack', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2015, isExplicit: false },
  { id: 'hh-061', title: 'Black and Yellow', artist: 'Wiz Khalifa', album: 'Rolling Papers', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2011, isExplicit: true },
  { id: 'hh-062', title: 'The Box', artist: 'Roddy Ricch', album: 'Please Excuse Me for Being Antisocial', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2019, isExplicit: true },
  { id: 'hh-063', title: 'BOP', artist: 'DaBaby', album: 'Kirk', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2019, isExplicit: true },
  { id: 'hh-064', title: 'Suge', artist: 'DaBaby', album: 'Baby on Baby', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2019, isExplicit: true },
  { id: 'hh-065', title: 'The Bigger Picture', artist: 'Lil Baby', album: 'My Turn', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2020, isExplicit: true },
  { id: 'hh-066', title: 'Drip Too Hard', artist: 'Lil Baby & Gunna', album: 'Drip Harder', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2018, isExplicit: true },
  { id: 'hh-067', title: 'Pop Out', artist: 'Polo G', album: 'Die a Legend', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2019, isExplicit: true },
  { id: 'hh-068', title: 'Heart on Ice', artist: 'Rod Wave', album: 'Ghetto Lenny\'s Love Songs', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2020, isExplicit: false },
  { id: 'hh-069', title: 'EARFQUAKE', artist: 'Tyler, the Creator', album: 'IGOR', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2019, isExplicit: false },
  { id: 'hh-070', title: 'Self Care', artist: 'Mac Miller', album: 'Swimming', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2018, isExplicit: true },
  { id: 'hh-071', title: 'Let You Down', artist: 'NF', album: 'Perception', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2017, isExplicit: false },
  { id: 'hh-072', title: 'Unforgettable', artist: 'French Montana', album: 'Jungle Rules', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2017, isExplicit: false },
  { id: 'hh-073', title: 'Antidote', artist: 'Travis Scott', album: 'Rodeo', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2015, isExplicit: true },
  { id: 'hh-074', title: 'Jumpman', artist: 'Drake & Future', album: 'What a Time to Be Alive', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2015, isExplicit: true },
  { id: 'hh-075', title: 'Life Is Good', artist: 'Future feat. Drake', album: 'High Off Life', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2020, isExplicit: true },
  { id: 'hh-076', title: 'Without Me', artist: 'Eminem', album: 'The Eminem Show', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2002, isExplicit: true },
  { id: 'hh-077', title: 'The Real Slim Shady', artist: 'Eminem', album: 'The Marshall Mathers LP', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2000, isExplicit: true },

  // ═══════════════════════════════════════════
  // ROCK — EXPANSION 2 (+21 songs → ~74 total)
  // ═══════════════════════════════════════════

  { id: 'rock-054', title: 'Come Together', artist: 'The Beatles', album: 'Abbey Road', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1969, isExplicit: false },
  { id: 'rock-055', title: 'Hey Jude', artist: 'The Beatles', album: 'Hey Jude', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1968, isExplicit: false },
  { id: 'rock-056', title: 'Let It Be', artist: 'The Beatles', album: 'Let It Be', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1970, isExplicit: false },
  { id: 'rock-057', title: 'Paint It Black', artist: 'The Rolling Stones', album: 'Aftermath', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1966, isExplicit: false },
  { id: 'rock-058', title: 'Dreams', artist: 'Fleetwood Mac', album: 'Rumours', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1977, isExplicit: false },
  { id: 'rock-059', title: 'Go Your Own Way', artist: 'Fleetwood Mac', album: 'Rumours', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1977, isExplicit: false },
  { id: 'rock-060', title: 'The Chain', artist: 'Fleetwood Mac', album: 'Rumours', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1977, isExplicit: false },
  { id: 'rock-061', title: 'Whole Lotta Love', artist: 'Led Zeppelin', album: 'Led Zeppelin II', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1969, isExplicit: false },
  { id: 'rock-062', title: 'Immigrant Song', artist: 'Led Zeppelin', album: 'Led Zeppelin III', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1970, isExplicit: false },
  { id: 'rock-063', title: 'Wish You Were Here', artist: 'Pink Floyd', album: 'Wish You Were Here', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1975, isExplicit: false },
  { id: 'rock-064', title: 'Space Oddity', artist: 'David Bowie', album: 'Space Oddity', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1969, isExplicit: false },
  { id: 'rock-065', title: 'Don\'t Stop Believin\'', artist: 'Journey', album: 'Escape', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1981, isExplicit: false },
  { id: 'rock-066', title: 'Free Fallin\'', artist: 'Tom Petty', album: 'Full Moon Fever', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1989, isExplicit: false },
  { id: 'rock-067', title: 'Jump', artist: 'Van Halen', album: '1984', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1984, isExplicit: false },
  { id: 'rock-068', title: 'You Give Love a Bad Name', artist: 'Bon Jovi', album: 'Slippery When Wet', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1986, isExplicit: false },
  { id: 'rock-069', title: 'Everlong', artist: 'Foo Fighters', album: 'The Colour and the Shape', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1997, isExplicit: false },
  { id: 'rock-070', title: 'Buddy Holly', artist: 'Weezer', album: 'Weezer (Blue Album)', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1994, isExplicit: false },
  { id: 'rock-071', title: 'Say It Ain\'t So', artist: 'Weezer', album: 'Weezer (Blue Album)', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1994, isExplicit: false },
  { id: 'rock-072', title: 'Smoke on the Water', artist: 'Deep Purple', album: 'Machine Head', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1972, isExplicit: false },
  { id: 'rock-073', title: 'Purple Haze', artist: 'Jimi Hendrix', album: 'Are You Experienced', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1967, isExplicit: false },
  { id: 'rock-074', title: 'More Than a Feeling', artist: 'Boston', album: 'Boston', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1976, isExplicit: false },

  // ═══════════════════════════════════════════
  // R&B/SOUL — EXPANSION 2 (+15 songs → ~58 total)
  // ═══════════════════════════════════════════

  { id: 'rnb-044', title: 'Rehab', artist: 'Amy Winehouse', album: 'Back to Black', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2006, isExplicit: false },
  { id: 'rnb-045', title: 'Valerie', artist: 'Amy Winehouse', album: 'Back to Black', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2006, isExplicit: false },
  { id: 'rnb-046', title: 'On & On', artist: 'Erykah Badu', album: 'Baduizm', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 1997, isExplicit: false },
  { id: 'rnb-047', title: 'Bag Lady', artist: 'Erykah Badu', album: 'Mama\'s Gun', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2000, isExplicit: false },
  { id: 'rnb-048', title: 'Are You That Somebody', artist: 'Aaliyah', album: 'Dr. Dolittle Soundtrack', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 1998, isExplicit: false },
  { id: 'rnb-049', title: 'Try Again', artist: 'Aaliyah', album: 'Romeo Must Die Soundtrack', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2000, isExplicit: false },
  { id: 'rnb-050', title: 'The Boy Is Mine', artist: 'Brandy & Monica', album: 'Never Say Never', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 1998, isExplicit: false },
  { id: 'rnb-051', title: 'Boo\'d Up', artist: 'Ella Mai', album: 'Ella Mai', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2018, isExplicit: false },
  { id: 'rnb-052', title: 'Adorn', artist: 'Miguel', album: 'Kaleidoscope Dream', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2012, isExplicit: false },
  { id: 'rnb-053', title: 'Sure Thing', artist: 'Miguel', album: 'All I Want Is You', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2010, isExplicit: false },
  { id: 'rnb-054', title: 'On My Mama', artist: 'Victoria Monét', album: 'Jaguar II', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2023, isExplicit: false },
  { id: 'rnb-055', title: 'Good Days', artist: 'SZA', album: 'Good Days', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2020, isExplicit: false },
  { id: 'rnb-056', title: 'Hard Place', artist: 'H.E.R.', album: 'I Used to Know Her', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2018, isExplicit: false },
  { id: 'rnb-057', title: 'Caught Up', artist: 'Usher', album: 'Confessions', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2004, isExplicit: false },
  { id: 'rnb-058', title: 'Saturn', artist: 'SZA', album: 'SOS', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2022, isExplicit: false },

  // ═══════════════════════════════════════════
  // COUNTRY — EXPANSION 2 (+5 songs → ~44 total)
  // ═══════════════════════════════════════════

  { id: 'cntry-040', title: 'Sand in My Boots', artist: 'Morgan Wallen', album: 'Dangerous: The Double Album', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 2021, isExplicit: false },
  { id: 'cntry-041', title: 'You Proof', artist: 'Morgan Wallen', album: 'One Thing at a Time', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 2023, isExplicit: false },
  { id: 'cntry-042', title: 'The Good Ones', artist: 'Gabby Barrett', album: 'Goldmine', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 2020, isExplicit: false },
  { id: 'cntry-043', title: 'Tennessee Whiskey', artist: 'Chris Stapleton', album: 'Traveller', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 2015, isExplicit: false },
  { id: 'cntry-044', title: 'Take Me Home, Country Roads', artist: 'John Denver', album: 'Poems, Prayers & Promises', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 1971, isExplicit: false },

  // ═══════════════════════════════════════════
  // EDM/DANCE — EXPANSION 2 (+8 songs → ~47 total)
  // ═══════════════════════════════════════════

  { id: 'edm-040', title: 'The Business', artist: 'Tiësto', album: 'The Business', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2020, isExplicit: false },
  { id: 'edm-041', title: 'Red Lights', artist: 'Tiësto', album: 'A Town Called Paradise', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2014, isExplicit: false },
  { id: 'edm-042', title: 'Shelter', artist: 'Porter Robinson & Madeon', album: 'Shelter', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2016, isExplicit: false },
  { id: 'edm-043', title: 'Language', artist: 'Porter Robinson', album: 'Worlds', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2014, isExplicit: false },
  { id: 'edm-044', title: 'Waiting for Love', artist: 'Avicii', album: 'Stories', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2015, isExplicit: false },
  { id: 'edm-045', title: 'Sweet Nothing', artist: 'Calvin Harris feat. Florence Welch', album: '18 Months', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2012, isExplicit: false },
  { id: 'edm-046', title: 'I Need Your Love', artist: 'Calvin Harris feat. Ellie Goulding', album: '18 Months', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2012, isExplicit: false },
  { id: 'edm-047', title: 'One Kiss', artist: 'Calvin Harris & Dua Lipa', album: 'One Kiss', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2018, isExplicit: false },

  // ═══════════════════════════════════════════
  // ALTERNATIVE/INDIE — EXPANSION 2 (+14 songs → ~54 total)
  // ═══════════════════════════════════════════

  { id: 'alt-041', title: 'R U Mine?', artist: 'Arctic Monkeys', album: 'AM', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2013, isExplicit: false },
  { id: 'alt-042', title: '505', artist: 'Arctic Monkeys', album: 'Favourite Worst Nightmare', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2007, isExplicit: false },
  { id: 'alt-043', title: 'A-Punk', artist: 'Vampire Weekend', album: 'Vampire Weekend', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2008, isExplicit: false },
  { id: 'alt-044', title: 'I\'m Yours', artist: 'Jason Mraz', album: 'We Sing. We Dance. We Steal Things.', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2008, isExplicit: false },
  { id: 'alt-045', title: 'Gravity', artist: 'John Mayer', album: 'Continuum', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2006, isExplicit: false },
  { id: 'alt-046', title: 'Slow Dancing in a Burning Room', artist: 'John Mayer', album: 'Continuum', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2006, isExplicit: false },
  { id: 'alt-047', title: 'Better Together', artist: 'Jack Johnson', album: 'In Between Dreams', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2005, isExplicit: false },
  { id: 'alt-048', title: 'Little Talks', artist: 'Of Monsters and Men', album: 'My Head Is an Animal', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2011, isExplicit: false },
  { id: 'alt-049', title: 'Counting Stars', artist: 'OneRepublic', album: 'Native', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2013, isExplicit: false },
  { id: 'alt-050', title: 'Apologize', artist: 'Timbaland feat. OneRepublic', album: 'Shock Value', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2007, isExplicit: false },
  { id: 'alt-051', title: 'Brave', artist: 'Sara Bareilles', album: 'The Blessed Unrest', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2013, isExplicit: false },
  { id: 'alt-052', title: 'Cleopatra', artist: 'The Lumineers', album: 'Cleopatra', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2016, isExplicit: false },
  { id: 'alt-053', title: 'Dandelions', artist: 'Ruth B.', album: 'Safe Haven', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2021, isExplicit: false },
  { id: 'alt-054', title: 'Middle of the Night', artist: 'Elley Duhé', album: 'Middle of the Night', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2022, isExplicit: false },

  // ═══════════════════════════════════════════
  // LATIN — EXPANSION 2 (+13 songs → ~48 total)
  // ═══════════════════════════════════════════

  { id: 'lat-036', title: 'Ella Baila Sola', artist: 'Eslabon Armado & Peso Pluma', album: 'Ella Baila Sola', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2023, isExplicit: false },
  { id: 'lat-037', title: 'Por Las Noches', artist: 'Peso Pluma', album: 'Génesis', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2023, isExplicit: false },
  { id: 'lat-038', title: 'No Se Va', artist: 'Grupo Frontera & Bad Bunny', album: 'No Se Va', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2023, isExplicit: false },
  { id: 'lat-039', title: 'Un x100to', artist: 'Grupo Frontera & Bad Bunny', album: 'Un x100to', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2023, isExplicit: false },
  { id: 'lat-040', title: 'La Noche de Anoche', artist: 'Bad Bunny & Rosalía', album: 'El Último Tour Del Mundo', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2020, isExplicit: false },
  { id: 'lat-041', title: 'Motomami', artist: 'Rosalía', album: 'MOTOMAMI', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2022, isExplicit: false },
  { id: 'lat-042', title: 'Secreto', artist: 'Anuel AA & Karol G', album: 'Secreto', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2019, isExplicit: true },
  { id: 'lat-043', title: 'Mañana Será Bonito', artist: 'Karol G', album: 'Mañana Será Bonito', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2023, isExplicit: false },
  { id: 'lat-044', title: 'Yonaguni', artist: 'Bad Bunny', album: 'El Último Tour Del Mundo', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2021, isExplicit: false },
  { id: 'lat-045', title: 'La Bebe (Remix)', artist: 'Yng Lvcas & Peso Pluma', album: 'La Bebe', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2023, isExplicit: true },
  { id: 'lat-046', title: 'AMARGURA', artist: 'Fuerza Regida', album: 'SIGAN DE LARGO', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2023, isExplicit: true },
  { id: 'lat-047', title: 'Que Vuelvas', artist: 'Carin Leon & Grupo Frontera', album: 'Que Vuelvas', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2023, isExplicit: false },
  { id: 'lat-048', title: 'Reggaetón en lo Oscuro', artist: 'Daddy Yankee & Marc Anthony', album: 'Corazón', albumArtUrl: '', previewUrl: '', genre: 'Latin', releaseYear: 2016, isExplicit: false },

  // ═══════════════════════════════════════════
  // K-POP (new genre, 15 songs)
  // ═══════════════════════════════════════════

  { id: 'kpop-001', title: 'Dynamite', artist: 'BTS', album: 'BE', albumArtUrl: '', previewUrl: '', genre: 'K-Pop', releaseYear: 2020, isExplicit: false },
  { id: 'kpop-002', title: 'Butter', artist: 'BTS', album: 'Butter', albumArtUrl: '', previewUrl: '', genre: 'K-Pop', releaseYear: 2021, isExplicit: false },
  { id: 'kpop-003', title: 'DNA', artist: 'BTS', album: 'Love Yourself: Her', albumArtUrl: '', previewUrl: '', genre: 'K-Pop', releaseYear: 2017, isExplicit: false },
  { id: 'kpop-004', title: 'Boy With Luv', artist: 'BTS', album: 'Map of the Soul: Persona', albumArtUrl: '', previewUrl: '', genre: 'K-Pop', releaseYear: 2019, isExplicit: false },
  { id: 'kpop-005', title: 'Life Goes On', artist: 'BTS', album: 'BE', albumArtUrl: '', previewUrl: '', genre: 'K-Pop', releaseYear: 2020, isExplicit: false },
  { id: 'kpop-006', title: 'DDU-DU DDU-DU', artist: 'BLACKPINK', album: 'SQUARE UP', albumArtUrl: '', previewUrl: '', genre: 'K-Pop', releaseYear: 2018, isExplicit: false },
  { id: 'kpop-007', title: 'Kill This Love', artist: 'BLACKPINK', album: 'Kill This Love', albumArtUrl: '', previewUrl: '', genre: 'K-Pop', releaseYear: 2019, isExplicit: false },
  { id: 'kpop-008', title: 'Lovesick Girls', artist: 'BLACKPINK', album: 'THE ALBUM', albumArtUrl: '', previewUrl: '', genre: 'K-Pop', releaseYear: 2020, isExplicit: false },
  { id: 'kpop-009', title: 'How You Like That', artist: 'BLACKPINK', album: 'THE ALBUM', albumArtUrl: '', previewUrl: '', genre: 'K-Pop', releaseYear: 2020, isExplicit: false },
  { id: 'kpop-010', title: 'Pink Venom', artist: 'BLACKPINK', album: 'BORN PINK', albumArtUrl: '', previewUrl: '', genre: 'K-Pop', releaseYear: 2022, isExplicit: false },
  { id: 'kpop-011', title: "God's Menu", artist: 'Stray Kids', album: 'GO生 (GO LIVE)', albumArtUrl: '', previewUrl: '', genre: 'K-Pop', releaseYear: 2020, isExplicit: false },
  { id: 'kpop-012', title: 'Super Shy', artist: 'NewJeans', album: 'Get Up', albumArtUrl: '', previewUrl: '', genre: 'K-Pop', releaseYear: 2023, isExplicit: false },
  { id: 'kpop-013', title: 'Hype Boy', artist: 'NewJeans', album: 'New Jeans', albumArtUrl: '', previewUrl: '', genre: 'K-Pop', releaseYear: 2022, isExplicit: false },
  { id: 'kpop-014', title: 'Next Level', artist: 'aespa', album: 'Savage', albumArtUrl: '', previewUrl: '', genre: 'K-Pop', releaseYear: 2021, isExplicit: false },
  { id: 'kpop-015', title: 'Fancy', artist: 'TWICE', album: 'Fancy You', albumArtUrl: '', previewUrl: '', genre: 'K-Pop', releaseYear: 2019, isExplicit: false },

  // ── Pop (+13) ────────────────────────────────────────────────────────────────
  { id: 'pop-086', title: 'As It Was', artist: 'Harry Styles', album: "Harry's House", albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2022, isExplicit: false },
  { id: 'pop-087', title: 'Watermelon Sugar', artist: 'Harry Styles', album: 'Fine Line', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2019, isExplicit: false },
  { id: 'pop-088', title: 'Anti-Hero', artist: 'Taylor Swift', album: 'Midnights', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2022, isExplicit: false },
  { id: 'pop-089', title: 'Cruel Summer', artist: 'Taylor Swift', album: 'Lover', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2019, isExplicit: false },
  { id: 'pop-090', title: 'Flowers', artist: 'Miley Cyrus', album: 'Endless Summer Vacation', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2023, isExplicit: false },
  { id: 'pop-091', title: 'Die With a Smile', artist: 'Lady Gaga & Bruno Mars', album: 'Die With a Smile', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2024, isExplicit: false },
  { id: 'pop-092', title: 'APT.', artist: 'ROSÉ & Bruno Mars', album: 'APT.', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2024, isExplicit: false },
  { id: 'pop-093', title: 'Espresso', artist: 'Sabrina Carpenter', album: 'Short n\' Sweet', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2024, isExplicit: false },
  { id: 'pop-094', title: 'Please Please Please', artist: 'Sabrina Carpenter', album: 'Short n\' Sweet', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2024, isExplicit: false },
  { id: 'pop-095', title: 'Greedy', artist: 'Tate McRae', album: 'THINK LATER', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2023, isExplicit: false },
  { id: 'pop-096', title: 'Bad Blood', artist: 'Taylor Swift', album: '1989', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2014, isExplicit: false },
  { id: 'pop-097', title: 'Since U Been Gone', artist: 'Kelly Clarkson', album: 'Breakaway', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2004, isExplicit: false },
  { id: 'pop-098', title: 'Toxic', artist: 'Britney Spears', album: 'In the Zone', albumArtUrl: '', previewUrl: '', genre: 'Pop', releaseYear: 2004, isExplicit: false },

  // ── Hip-Hop/Rap (+13) ────────────────────────────────────────────────────────
  { id: 'hh-078', title: 'Not Like Us', artist: 'Kendrick Lamar', album: 'Not Like Us', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2024, isExplicit: true },
  { id: 'hh-079', title: 'HUMBLE.', artist: 'Kendrick Lamar', album: 'DAMN.', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2017, isExplicit: true },
  { id: 'hh-080', title: 'Sicko Mode', artist: 'Travis Scott', album: 'ASTROWORLD', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2018, isExplicit: true },
  { id: 'hh-081', title: 'goosebumps', artist: 'Travis Scott', album: 'Birds in the Trap Sing McKnight', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2016, isExplicit: true },
  { id: 'hh-082', title: 'Rich Flex', artist: 'Drake & 21 Savage', album: 'Her Loss', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2022, isExplicit: true },
  { id: 'hh-083', title: 'Way 2 Sexy', artist: 'Drake feat. Future & Young Thug', album: 'Certified Lover Boy', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2021, isExplicit: true },
  { id: 'hh-084', title: 'Butterfly Effect', artist: 'Travis Scott', album: 'Birds in the Trap Sing McKnight', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2016, isExplicit: true },
  { id: 'hh-085', title: 'Jumpman', artist: 'Drake & Future', album: 'What a Time to Be Alive', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2015, isExplicit: true },
  { id: 'hh-086', title: 'Mask Off', artist: 'Future', album: 'Future', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2017, isExplicit: true },
  { id: 'hh-087', title: 'Rockstar', artist: 'Post Malone feat. 21 Savage', album: 'beerbongs & bentleys', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2017, isExplicit: true },
  { id: 'hh-088', title: 'Congratulations', artist: 'Post Malone feat. Quavo', album: 'Stoney', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2016, isExplicit: false },
  { id: 'hh-089', title: 'Money in the Grave', artist: 'Drake feat. Rick Ross', album: 'Money in the Grave', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2019, isExplicit: true },
  { id: 'hh-090', title: 'Big Energy', artist: 'Latto', album: '777', albumArtUrl: '', previewUrl: '', genre: 'Hip-Hop/Rap', releaseYear: 2021, isExplicit: true },

  // ── Rock (+14) ───────────────────────────────────────────────────────────────
  { id: 'rock-075', title: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1975, isExplicit: false },
  { id: 'rock-076', title: 'We Will Rock You', artist: 'Queen', album: 'News of the World', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1977, isExplicit: false },
  { id: 'rock-077', title: "Don't Stop Me Now", artist: 'Queen', album: 'Jazz', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1978, isExplicit: false },
  { id: 'rock-078', title: 'Black Dog', artist: 'Led Zeppelin', album: 'Led Zeppelin IV', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1971, isExplicit: false },
  { id: 'rock-079', title: 'Fortunate Son', artist: 'Creedence Clearwater Revival', album: 'Willy and the Poor Boys', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1969, isExplicit: false },
  { id: 'rock-080', title: 'Kick Rocks', artist: 'Benson Boone', album: 'Beautiful Things', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 2024, isExplicit: false },
  { id: 'rock-081', title: 'Beautiful Things', artist: 'Benson Boone', album: 'Beautiful Things', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 2024, isExplicit: false },
  { id: 'rock-082', title: 'Losing My Religion', artist: 'R.E.M.', album: 'Out of Time', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1991, isExplicit: false },
  { id: 'rock-083', title: 'Semi-Charmed Life', artist: 'Third Eye Blind', album: 'Third Eye Blind', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1997, isExplicit: false },
  { id: 'rock-084', title: 'Mr. Jones', artist: 'Counting Crows', album: 'August and Everything After', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1993, isExplicit: false },
  { id: 'rock-085', title: "Iris", artist: 'Goo Goo Dolls', album: 'Dizzy Up the Girl', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1998, isExplicit: false },
  { id: 'rock-086', title: '1979', artist: 'The Smashing Pumpkins', album: 'Mellon Collie and the Infinite Sadness', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 1995, isExplicit: false },
  { id: 'rock-087', title: 'Seven Nation Army', artist: 'The White Stripes', album: 'Elephant', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 2003, isExplicit: false },
  { id: 'rock-088', title: 'Riptide', artist: 'Vance Joy', album: 'Dream Your Life Away', albumArtUrl: '', previewUrl: '', genre: 'Rock', releaseYear: 2013, isExplicit: false },

  // ── R&B/Soul (+15) ───────────────────────────────────────────────────────────
  { id: 'rnb-059', title: 'CUFF IT', artist: 'Beyoncé', album: 'RENAISSANCE', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2022, isExplicit: false },
  { id: 'rnb-060', title: 'BREAK MY SOUL', artist: 'Beyoncé', album: 'RENAISSANCE', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2022, isExplicit: false },
  { id: 'rnb-061', title: 'Leave the Door Open', artist: 'Bruno Mars, Anderson .Paak, Silk Sonic', album: 'An Evening with Silk Sonic', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2021, isExplicit: false },
  { id: 'rnb-062', title: 'Smokin Out the Window', artist: 'Bruno Mars, Anderson .Paak, Silk Sonic', album: 'An Evening with Silk Sonic', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2021, isExplicit: true },
  { id: 'rnb-063', title: 'Essence', artist: 'Wizkid feat. Tems', album: 'Made in Lagos (Deluxe)', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2020, isExplicit: false },
  { id: 'rnb-064', title: 'Dandelion', artist: 'Tems', album: 'Born in the Wild', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2024, isExplicit: false },
  { id: 'rnb-065', title: 'Snooze', artist: 'SZA', album: 'SOS', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2022, isExplicit: false },
  { id: 'rnb-066', title: 'Nobody Gets Me', artist: 'SZA', album: 'SOS', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2022, isExplicit: false },
  { id: 'rnb-067', title: 'Call Out My Name', artist: 'The Weeknd', album: 'My Dear Melancholy,', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2018, isExplicit: false },
  { id: 'rnb-068', title: 'Often', artist: 'The Weeknd', album: 'Beauty Behind the Madness', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2014, isExplicit: true },
  { id: 'rnb-069', title: 'Slow Motion', artist: 'Trey Songz', album: 'Trigga', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2014, isExplicit: true },
  { id: 'rnb-070', title: 'No Scrubs', artist: 'TLC', album: 'FanMail', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 1999, isExplicit: false },
  { id: 'rnb-071', title: 'Waterfalls', artist: 'TLC', album: 'CrazySexyCool', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 1995, isExplicit: false },
  { id: 'rnb-072', title: 'Differences', artist: 'Ginuwine', album: 'The Life', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2001, isExplicit: false },
  { id: 'rnb-073', title: 'Come & Get It', artist: 'Aaliyah', album: 'Aaliyah', albumArtUrl: '', previewUrl: '', genre: 'R&B/Soul', releaseYear: 2001, isExplicit: false },

  // ── Alternative/Indie (+15) ──────────────────────────────────────────────────
  { id: 'alt-055', title: 'Do I Wanna Know?', artist: 'Arctic Monkeys', album: 'AM', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2013, isExplicit: false },
  { id: 'alt-056', title: 'R U Mine?', artist: 'Arctic Monkeys', album: 'AM', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2013, isExplicit: false },
  { id: 'alt-057', title: '505', artist: 'Arctic Monkeys', album: 'Favourite Worst Nightmare', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2007, isExplicit: false },
  { id: 'alt-058', title: 'Somebody That I Used to Know', artist: 'Gotye feat. Kimbra', album: 'Making Mirrors', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2011, isExplicit: false },
  { id: 'alt-059', title: 'Ho Hey', artist: 'The Lumineers', album: 'The Lumineers', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2012, isExplicit: false },
  { id: 'alt-060', title: 'Stubborn Love', artist: 'The Lumineers', album: 'The Lumineers', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2012, isExplicit: false },
  { id: 'alt-061', title: 'Little Talks', artist: 'Of Monsters and Men', album: 'My Head Is an Animal', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2011, isExplicit: false },
  { id: 'alt-062', title: 'Dog Days Are Over', artist: 'Florence + The Machine', album: 'Lungs', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2008, isExplicit: false },
  { id: 'alt-063', title: 'You Know Me Too Well', artist: 'New Politics', album: 'A Bad Girl in Harlem', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2013, isExplicit: false },
  { id: 'alt-064', title: 'Take Me to Church', artist: 'Hozier', album: 'Hozier', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2013, isExplicit: false },
  { id: 'alt-065', title: 'Cherry Wine', artist: 'Hozier', album: 'Hozier', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2014, isExplicit: false },
  { id: 'alt-066', title: 'Budapest', artist: 'George Ezra', album: 'Wanted on Voyage', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2014, isExplicit: false },
  { id: 'alt-067', title: 'Barcelona', artist: 'George Ezra', album: 'Wanted on Voyage', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2014, isExplicit: false },
  { id: 'alt-068', title: 'Ribs', artist: 'Lorde', album: 'Pure Heroine', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2013, isExplicit: false },
  { id: 'alt-069', title: 'Green Light', artist: 'Lorde', album: 'Melodrama', albumArtUrl: '', previewUrl: '', genre: 'Alternative/Indie', releaseYear: 2017, isExplicit: false },

  // ── EDM/Dance (+10) ──────────────────────────────────────────────────────────
  { id: 'edm-048', title: 'Clarity', artist: 'Zedd feat. Foxes', album: 'Clarity', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2012, isExplicit: false },
  { id: 'edm-049', title: 'Beautiful Now', artist: 'Zedd feat. Jon Bellion', album: 'True Colors', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2015, isExplicit: false },
  { id: 'edm-050', title: 'Alive', artist: 'Sia', album: 'This Is Acting', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2015, isExplicit: false },
  { id: 'edm-051', title: 'Cheap Thrills', artist: 'Sia', album: 'This Is Acting', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2016, isExplicit: false },
  { id: 'edm-052', title: 'The Days', artist: 'Avicii feat. Robbie Williams', album: 'The Days / Nights', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2014, isExplicit: false },
  { id: 'edm-053', title: 'Faded', artist: 'Alan Walker', album: 'Different World', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2015, isExplicit: false },
  { id: 'edm-054', title: 'Alone', artist: 'Alan Walker', album: 'Different World', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2016, isExplicit: false },
  { id: 'edm-055', title: 'Cola', artist: 'Camelphat & Elderbrook', album: 'Cola', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2017, isExplicit: false },
  { id: 'edm-056', title: 'Piece of Your Heart', artist: 'Meduza feat. Goodboys', album: 'Piece of Your Heart', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2019, isExplicit: false },
  { id: 'edm-057', title: 'Head & Heart', artist: 'Joel Corry feat. MNEK', album: 'Head & Heart', albumArtUrl: '', previewUrl: '', genre: 'EDM/Dance', releaseYear: 2020, isExplicit: false },

  // ── Country (+10) ────────────────────────────────────────────────────────────
  { id: 'cntry-045', title: 'Chicken Fried', artist: 'Zac Brown Band', album: 'The Foundation', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 2008, isExplicit: false },
  { id: 'cntry-046', title: 'Colder Weather', artist: 'Zac Brown Band', album: 'You Get What You Give', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 2010, isExplicit: false },
  { id: 'cntry-047', title: 'Take Your Time', artist: 'Sam Hunt', album: 'Montevallo', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 2014, isExplicit: false },
  { id: 'cntry-048', title: 'Body Like a Back Road', artist: 'Sam Hunt', album: 'Southside', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 2017, isExplicit: false },
  { id: 'cntry-049', title: 'Fast Car', artist: 'Luke Combs', album: 'Gettin\' Old', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 2023, isExplicit: false },
  { id: 'cntry-050', title: 'When It Rains It Pours', artist: 'Luke Combs', album: 'This One\'s for You', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 2017, isExplicit: false },
  { id: 'cntry-051', title: 'Whiskey Glasses', artist: 'Morgan Wallen', album: 'If I Know Me', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 2018, isExplicit: false },
  { id: 'cntry-052', title: '7 Summers', artist: 'Morgan Wallen', album: 'Dangerous: The Double Album', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 2020, isExplicit: false },
  { id: 'cntry-053', title: 'Texas Hold \'Em', artist: 'Beyoncé', album: 'Cowboy Carter', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 2024, isExplicit: false },
  { id: 'cntry-054', title: 'ii Most Wanted', artist: 'Beyoncé feat. Miley Cyrus', album: 'Cowboy Carter', albumArtUrl: '', previewUrl: '', genre: 'Country', releaseYear: 2024, isExplicit: false },

  // ── K-Pop (+10) ──────────────────────────────────────────────────────────────
  { id: 'kpop-016', title: 'Cupid (Twin Ver.)', artist: 'FIFTY FIFTY', album: 'The Beginning: Cupid', albumArtUrl: '', previewUrl: '', genre: 'K-Pop', releaseYear: 2023, isExplicit: false },
  { id: 'kpop-017', title: 'Spicy', artist: 'aespa', album: 'MY WORLD', albumArtUrl: '', previewUrl: '', genre: 'K-Pop', releaseYear: 2023, isExplicit: false },
  { id: 'kpop-018', title: 'OMG', artist: 'NewJeans', album: 'OMG', albumArtUrl: '', previewUrl: '', genre: 'K-Pop', releaseYear: 2023, isExplicit: false },
  { id: 'kpop-019', title: 'ETA', artist: 'NewJeans', album: 'Get Up', albumArtUrl: '', previewUrl: '', genre: 'K-Pop', releaseYear: 2023, isExplicit: false },
  { id: 'kpop-020', title: 'MIROH', artist: 'Stray Kids', album: 'Clé 1 : MIROH', albumArtUrl: '', previewUrl: '', genre: 'K-Pop', releaseYear: 2019, isExplicit: false },
  { id: 'kpop-021', title: 'CASE 143', artist: 'Stray Kids', album: 'MAXIDENT', albumArtUrl: '', previewUrl: '', genre: 'K-Pop', releaseYear: 2022, isExplicit: false },
  { id: 'kpop-022', title: 'Kill This Love', artist: 'BLACKPINK', album: 'Kill This Love', albumArtUrl: '', previewUrl: '', genre: 'K-Pop', releaseYear: 2019, isExplicit: false },
  { id: 'kpop-023', title: 'Shut Down', artist: 'BLACKPINK', album: 'BORN PINK', albumArtUrl: '', previewUrl: '', genre: 'K-Pop', releaseYear: 2022, isExplicit: false },
  { id: 'kpop-024', title: 'Butter', artist: 'BTS', album: 'Butter', albumArtUrl: '', previewUrl: '', genre: 'K-Pop', releaseYear: 2021, isExplicit: false },
  { id: 'kpop-025', title: 'Permission to Dance', artist: 'BTS', album: 'Butter', albumArtUrl: '', previewUrl: '', genre: 'K-Pop', releaseYear: 2021, isExplicit: false },
];
