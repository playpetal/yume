import { db } from "./db";
import { PrismaClient } from "@prisma/client";
import OAuth from "discord-oauth2";
import { discordOAuth2 } from "./graphql/util/auth/DiscordOAuth";
import { Request } from "express";
import { Redis } from "ioredis";
import { redis } from "./lib/redis";

export interface Context {
  db: PrismaClient;
  discord: OAuth;
  req: Request;
  redis: Redis;
}

export const context = { db, discord: discordOAuth2, redis };
