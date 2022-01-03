import { db } from "./db";
import { PrismaClient } from "@prisma/client";
import OAuth from "discord-oauth2";
import { discordOAuth2 } from "./graphql/util/auth/DiscordOAuth";

export interface Context {
  db: PrismaClient;
  discord: OAuth;
}

export const context = { db, discord: discordOAuth2 };
