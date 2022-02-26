export function getWord(): string {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

export function wordIsValid(word: string): boolean {
  return WORDS.includes(word.toUpperCase());
}

export const WORDS = [
  "BOBBY",
  "JHOPE",
  "JIHYO",
  "JIMIN",
  "JISOO",
  "SEHUN",
  "TWICE",
  "WONHO",
];
