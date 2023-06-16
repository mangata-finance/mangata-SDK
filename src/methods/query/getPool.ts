import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { getRatio } from "../../utils/getRatio";
import { TokenId } from "../../types/common";
import { TPoolWithRatio } from "../../types/query";
import { getLiquidityPool } from "./getLiquidityPool";
import { getAmountOfTokensInPool } from "./getAmountOfTokensInPool";
import { BN_ZERO } from "../../utils/bnConstants";

/**
 * @since 2.0.0
 */
export const getPool = async (
  instancePromise: Promise<ApiPromise>,
  liquidityTokenId: TokenId
) => {
  const api = await instancePromise;
  const [liquidityPoolTokens, promotedPoolRewardsV2] = await Promise.all([
    getLiquidityPool(instancePromise, liquidityTokenId),
    api.query.proofOfStake.promotedPoolRewards()
  ]);
  const promotedPoolInfos = promotedPoolRewardsV2.toHuman() as {
    [key: string]: {
      weight: string;
      rewards: string;
    };
  };
  const isPoolPromoted = promotedPoolInfos[liquidityTokenId];

  const [firstTokenId, secondTokenId] = liquidityPoolTokens;
  const [firstTokenAmount, secondTokenAmount] = await getAmountOfTokensInPool(
    instancePromise,
    firstTokenId.toString(),
    secondTokenId.toString()
  );
  return {
    firstTokenId: firstTokenId.toString(),
    secondTokenId: secondTokenId.toString(),
    firstTokenAmount,
    secondTokenAmount,
    liquidityTokenId,
    isPromoted:
      isPoolPromoted === undefined
        ? false
        : new BN(isPoolPromoted.rewards.replace(/[, ]/g, "")).gt(BN_ZERO),
    firstTokenRatio: getRatio(firstTokenAmount, secondTokenAmount),
    secondTokenRatio: getRatio(secondTokenAmount, firstTokenAmount)
  } as TPoolWithRatio;
};
