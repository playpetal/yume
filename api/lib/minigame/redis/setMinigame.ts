import { MinigameType } from "@prisma/client";
import { Minigame } from "yume";
import { redis } from "../../redis";

export async function setMinigame<T extends MinigameType>(
  data: Minigame<T>
): Promise<Minigame<T>> {
  const _data = JSON.stringify(data);
  await redis.set(`minigame:${data.accountId}`, _data, "PX", 1000 * 60 * 30);

  return data;
}
