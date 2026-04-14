// Drinking game prompts for adult mode
// {winner} is replaced with the actual winner's display name at runtime

export const winnerPrompts = [
  '{winner} picks someone to drink!',
  '{winner} is on fire! Losers sip!',
  'Everyone drink except {winner}!',
  '{winner} assigns two sips to anyone!',
  'Cheers to {winner}! Everyone else drinks.',
  '{winner} got it! Last person to toast to this drinks double!',
  '{winner} calls a toast! Everyone sips.',
  'Nice one {winner}! Pick two people to drink.',
  '{winner} is a music genius! Everyone else takes a sip!',
  '{winner} rules! The person to their left drinks.',
  '{winner} makes a rule for the next round. Break it and drink!',
  'Big brain {winner}! Losers take a sip.',
  'Shoutout to {winner}! Everyone else finishes their sip.',
  '{winner} is killing it! The person with the lowest score drinks!',
];

export const nobodyPrompts = [
  'Nobody got it? Everyone drinks!',
  "That's embarrassing... everyone takes a sip!",
  'Total wipeout! Group drink!',
  'Not a single correct answer. Bottoms up, everyone!',
  'Yikes! Everyone sips for that one.',
  'The music won this round. Everyone drinks!',
  'Nobody?! Take a big sip, all of you.',
  'Wow, tough one. Everyone comfort-drinks.',
  'The artist would be offended. Everyone sips!',
  'A moment of silence... then everyone drinks.',
  'Zero correct? That calls for a group sip!',
  "Don't feel bad, just drink about it.",
];

export function getRandomPrompt(hasWinner: boolean, winnerName?: string): string {
  const pool = hasWinner ? winnerPrompts : nobodyPrompts;
  const prompt = pool[Math.floor(Math.random() * pool.length)];
  return winnerName ? prompt.replace(/\{winner\}/g, winnerName) : prompt;
}

// Team mode drinking prompts

export const teamWinnerPrompts = [
  'Team {team} scores! {winner} picks someone from another team to drink!',
  '{winner} got it for Team {team}! Other teams take a sip!',
  'Team {team} is dominating! Everyone else drinks.',
  '{winner} carries Team {team}! Losing teams sip.',
  'Nice one {winner}! Team {team} assigns sips to another team!',
  'Team {team} strikes again! Other teams take a group sip.',
  '{winner} is Team {team}\'s MVP! Other teams drink.',
  'Big brain {winner}! Team {team} picks a team to drink double.',
  'Team {team} is on fire! Last-place team takes two sips.',
  '{winner} nails it for Team {team}! Everyone else, bottoms up.',
];

export const teamNobodyPrompts = [
  'No team got it? Every team drinks!',
  'Total team wipeout! Group drink for all teams!',
  'Not a single team got it right. Everyone sips!',
  'All teams struck out! Universal sip!',
  'The music stumped every team. Everyone drinks!',
  'Zero correct across all teams. Bottoms up!',
  'No winners this round. All teams take a sip!',
  'Every team whiffed! Comfort-drink together.',
];

export function getTeamPrompt(hasWinner: boolean, teamName?: string, winnerName?: string): string {
  const pool = hasWinner ? teamWinnerPrompts : teamNobodyPrompts;
  const prompt = pool[Math.floor(Math.random() * pool.length)];
  return prompt
    .replace(/\{team\}/g, teamName || '')
    .replace(/\{winner\}/g, winnerName || '');
}

// Elimination mode drinking prompts

export const eliminationWinnerPrompts = [
  '{winner} survives! Everyone else takes a sip!',
  '{winner} lives to fight another round! Losers drink!',
  'Safe for now, {winner}! Pick someone to drink.',
  '{winner} is untouchable! The eliminated player drinks 2!',
  '{winner} keeps it going! Lowest scorer sips nervously.',
];

export const eliminationNobodyPrompts = [
  'Nobody got it and someone gets eliminated! Everyone drinks in solidarity!',
  'Elimination round wipeout! Group drink!',
  'The song claimed a victim. Everyone takes a sip!',
  'Another one bites the dust! Consolation sips all around.',
  "That's brutal! Everyone drinks for the fallen.",
];

export function getEliminationPrompt(hasWinner: boolean, winnerName?: string): string {
  const pool = hasWinner ? eliminationWinnerPrompts : eliminationNobodyPrompts;
  const prompt = pool[Math.floor(Math.random() * pool.length)];
  return winnerName ? prompt.replace(/\{winner\}/g, winnerName) : prompt;
}

// Quiet player prompts — fired when someone hasn't buzzed in {n} consecutive rounds

export const quietPlayerPrompts = [
  "{names} hasn't buzzed in {n} rounds. Are you even here? Drink 2.",
  "{names} is playing BuzzBeats in spectator mode. Drink 1 and actually try.",
  "{n} rounds of silence from {names}. The game is judging you. Drink 2.",
  "Is {names} okay? {n} rounds without a single buzz. Take a sip and wake up.",
  "{names} clearly knows none of these songs. Drink 2 for the embarrassment.",
  "Shoutout to {names} for contributing absolutely nothing for {n} rounds. Drink 3.",
  "{names} has been lurking for {n} rounds. Say something! Or just drink 2.",
  "The buzzer is right there, {names}. {n} rounds and you still haven't touched it. Drink up.",
];

export const quietMultiplePlayersPrompts = [
  "{names} have both been asleep for {n} rounds. Group sip for the slackers.",
  "It's a silence competition between {names}. {n} rounds and counting. Both drink 2.",
  "{names} are apparently allergic to the buzzer. Both drink 2.",
  "Matching energy from {names}, and that's absolutely none. {n} rounds, both drink.",
];

export function getQuietPlayerPrompt(names: string[], rounds: number): string {
  const pool = names.length > 1 ? quietMultiplePlayersPrompts : quietPlayerPrompts;
  const prompt = pool[Math.floor(Math.random() * pool.length)];
  return prompt
    .replace(/\{names\}/g, names.join(' & '))
    .replace(/\{n\}/g, String(rounds));
}
