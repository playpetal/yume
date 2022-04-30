import similar from "string-similarity";

export function findBestMatch(
  target: string,
  strings: string[]
): { str: string; rating: number } {
  const matches = similar.findBestMatch(
    target.toLowerCase(),
    strings.map((s) => s.toLowerCase())
  );

  return { str: matches.bestMatch.target, rating: matches.bestMatch.rating };
}
