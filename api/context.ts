import { db } from "./db";
import { PrismaClient } from "@prisma/client";
import OAuth from "discord-oauth2";
import { discordOAuth2 } from "./graphql/util/auth/DiscordOAuth";
import { Request } from "express";

export interface Context {
  db: PrismaClient;
  discord: OAuth;
  req: Request;
}

export const context = { db, discord: discordOAuth2 };
