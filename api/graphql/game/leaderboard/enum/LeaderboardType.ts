import { enumType } from "nexus";

export const LeaderboardType = enumType({
  name: "LeaderboardType",
  members: [
    "PUBLIC_SUPPORTER",
    "GUESS_THE_SONGxTIME",
    "GUESS_THE_SONGxPETAL",
    "GUESS_THE_SONGxCARD",
    "GUESS_THE_SONGxLILY",
    "GUESS_THE_IDOLxTIME",
    "GUESS_THE_IDOLxPETAL",
    "GUESS_THE_IDOLxCARD",
    "GUESS_THE_IDOLxLILY",
  ],
});
