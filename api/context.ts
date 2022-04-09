import { db } from "./db";
import { PrismaClient } from "@prisma/client";
import { Request } from "express";
import { Redis } from "ioredis";
import { redis } from "./lib/redis";

export interface Context {
  db: PrismaClient;
  req: Request;
  redis: Redis;
}

export const context = { db, redis };
