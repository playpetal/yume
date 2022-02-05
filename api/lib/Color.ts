const hexColors: string[] = [
  "EA88FF", // "developer pink"
  "EA73A4", // "community staff pink"
  "C774E0", // "graphic designer purple"
  "A1A3FF", // "release manager blue"
  "C0E6F0",
  "65C9D4",
  "82CAFA",
  /* Petal Pink */
  "FFAACC",
  /* Reds */
  "d41a0d",
  "fa3c2a",
  /* Oranges */
  "ed882f",
  "ed7307",
  "e89246",
  /* Yellows */
  "d1cf38",
  "f2f05c",
  /* Greens */
  "439c1f",
  "5de028",
  "7ced4e",
  /* Aquamarines */
  "12e374",
  "4fe897",
  /* Cyans */
  "1a998a",
  "15cfb9",
  "43f0db",
  /* Light Blues */
  "206199",
  "1276cc",
  "3ea2f7",
  /* Dark Blues */
  "2c32f5",
  "676bf5",
  /* Purples */
  "7d3cbd",
  "a75af2",
  "8716f5",
  /* Magentas */
  "c425bc",
  "f518eb",
  "f75cf0",
  /* Pinks */
  "bd1c57",
  "f70c63",
  "f73e82",
];

const colors = hexColors.map((c) => parseInt(c, 16));

export function getRandomColor(): number {
  return colors[Math.floor(Math.random() * colors.length)];
}
