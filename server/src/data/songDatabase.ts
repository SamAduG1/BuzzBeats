import { Song } from '@shared/types/music';

// ~200 curated songs across 8 genres and 6 decades.
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
];
