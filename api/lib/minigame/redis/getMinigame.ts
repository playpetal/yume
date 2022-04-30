import { MinigameType } from "@prisma/client";
import { Minigame } from "yume";
import { redis } from "../../redis";

export async function getMinigame<T extends MinigameType>(
  accountId: number
): Promise<Minigame<T> | null> {
  const minigame = await redis.get(`minigame:${accountId}`);
  if (!minigame) return null;

  return JSON.parse(minigame) as Minigame<T>;
}
