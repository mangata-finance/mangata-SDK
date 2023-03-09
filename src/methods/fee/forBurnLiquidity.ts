import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { BurnLiquidity } from "../../types/xyk";
import { fromBN } from "../../utils/bnUtility";
import { Object } from "ts-toolbelt";

export type BurnLiquidityFee = Object.Omit<BurnLiquidity, "txOptions">;

export const forBurnLiquidity = async (
  instancePromise: Promise<ApiPromise>,
  args: BurnLiquidityFee
): Promise<string> => {
  const api = await instancePromise;
  const { amount, firstTokenId, secondTokenId, account } = args;
  const dispatchInfo = await api.tx.xyk
    .burnLiquidity(firstTokenId, secondTokenId, amount)
    .paymentInfo(account);
  return fromBN(new BN(dispatchInfo.partialFee.toString()));
};