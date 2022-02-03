export function parseElse(
  str: string | undefined | null,
  fallback: number
): number {
  if (str === undefined || str === null) return fallback;
  return parseInt(str, 10);
}
