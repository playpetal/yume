import { GuessTheSongMinigame } from "yume";
import { redis } from "../../redis";

export async function setMinigame(
  data: GuessTheSongMinigame<any>
): Promise<GuessTheSongMinigame<any>> {
  const _data = JSON.stringify(data);
  await redis.set(`minigame:${data.accountId}`, _data, "PX", 1000 * 60 * 30);

  return data;
}
