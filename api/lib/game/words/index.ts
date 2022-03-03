export function getWord(): string {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

export function wordIsValid(word: string): boolean {
  return WORDS.includes(word.toUpperCase());
}

export const WORDS = [
  "AESPA",
  "AISHA",
  "ALICE",
  "APINK",
  "APRIL",
  "ARIAZ",
  "ASAHI",
  "ASTRO",
  "ATEEZ",
  "AYEON",
  "BBOMB",
  "BEAST",
  "BELLA",
  "BENJI",
  "BITTO",
  "BOBBY",
  "BOMIN",
  "CHANI",
  "CRUSH",
  "DAISY",
  "DAWON",
  "DOSIE",
  "EDAWN",
  "ELKIE",
  "ELRIS",
  "ETION",
  "EUNBI",
  "EUNHA",
  "EUNJI",
  "EUNKI",
  "FELIX",
  "GIDLE",
  "GOEUN",
  "GOWON",
  "GYURI",
  "HAEIN",
  "HANSE",
  "HEEDO",
  "HOONY",
  "HOSHI",
  "HWALL",
  "HYEJU",
  "HYERI",
  "HYUNA",
  "INTAK",
  "IRENE",
  "JACOB",
  "JASON",
  "JESSI",
  "JHOON",
  "JHOPE",
  "JIEUN",
  "JIHAN",
  "JIHUN",
  "JIHYO",
  "JIMIN",
  "JINAM",
  "JINHA",
  "JINHO",
  "JISOO",
  "JISUN",
  "JIUNG",
  "JIWON",
  "JIWOO",
  "JOOEN",
  "JSEPH",
  "JUNHO",
  "JUNJI",
  "KARIN",
  "KEEHO",
  "KELLY",
  "KENTA",
  "KEVIN",
  "KIWON",
  "KYUNG",
  "LEEDO",
  "LOONA",
  "LUCAS",
  "MBLAQ",
  "MEIQI",
  "MIJOO",
  "MINAH",
  "MINHO",
  "MINJU",
  "MINSU",
  "MISSA",
  "NAEUN",
  "NANCY",
  "NAYUN",
  "NUEST",
  "PETAL",
  "ROCKY",
  "SALLY",
  "SANHA",
  "SEEUN",
  "SEHUN",
  "SEJUN",
  "SEOHO",
  "SEOLA",
  "SIEUN",
  "SOEUN",
  "SOHEE",
  "SOJIN",
  "SOLAR",
  "SOLJI",
  "SOMIN",
  "SOWON",
  "SOYEE",
  "SUMIN",
  "SUNMI",
  "SUNOO",
  "SUWON",
  "SPICA",
  "SUBIN",
  "TAEHA",
  "TAEHO",
  "TAEIL",
  "TWICE",
  "TZUYU",
  "UCHAE",
  "UKISS",
  "UKWON",
  "VIVIZ",
  "WENDY",
  "WONHO",
  "WOOZI",
  "WYATT",
  "YANAN",
  "YEBIN",
  "YEDAM",
  "YEEUN",
  "YERIN",
  "YEWON",
  "YIREN",
  "YOHAN",
  "YOSHI",
  "YUBIN",
  "YUJIN",
  "YUNHO",
];
