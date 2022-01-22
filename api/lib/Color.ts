const hexColors: string[] = [
  "FFAACC", // "petal pink"
  "EA88FF", // "developer pink"
  "EA73A4", // "community staff pink"
  "C774E0", // "graphic designer purple"
  "A1A3FF", // "release manager blue"
  "F38BA0", // "early supporter pink"
];

const colors = hexColors.map((c) => parseInt(c, 16));

export function getRandomColor(): number {
  return colors[Math.floor(Math.random() * colors.length)];
}
