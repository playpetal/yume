import { Account } from "@prisma/client";
import { Reward, UnknownMinigameData } from "yume";
import { Context } from "../../context";
import { redis } from "../redis";
import { upsertMinigameStats } from "./upsertMinigameStats";

export async function destroyMinigame(
  ctx: Context,
  account: Account,
  data: UnknownMinigameData,
  reward: { type: Reward; amount: number }
): Promise<void> {
  data.elapsed = Date.now() - new Date(data.startedAt).getTime();
  await redis.del(`minigame:${account.id}`);

  if (data.correct)
    await upsertMinigameStats(
      ctx,
      data.type,
      account,
      reward,
      1,
      data.attempts,
      data.elapsed
    );

  return;
}
