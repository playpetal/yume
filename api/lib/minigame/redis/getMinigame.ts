import { GuessTheSongMinigame } from "yume";
import { redis } from "../../redis";

export async function getMinigame(
  accountId: number
): Promise<GuessTheSongMinigame<any> | null> {
  const minigame = await redis.get(`minigame:${accountId}`);
  if (!minigame) return null;

  const _minigame = JSON.parse(minigame) as GuessTheSongMinigame<any>;
  _minigame.startedAt = new Date(_minigame.startedAt);

  return _minigame;
}
