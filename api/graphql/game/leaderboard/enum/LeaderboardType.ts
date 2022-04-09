import { enumType } from "nexus";

export const LeaderboardType = enumType({
  name: "LeaderboardType",
  members: [
    "PUBLIC_SUPPORTER",
    "GTS_TIME",
    "GTS_PETAL",
    "GTS_CARD",
    "GTS_LILY",
    "WORDS_TIME",
    "WORDS_PETAL",
    "WORDS_CARD",
    "WORDS_LILY",
  ],
});
