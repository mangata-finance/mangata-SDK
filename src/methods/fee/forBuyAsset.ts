import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { BuyAsset } from "../../types/xyk";
import { fromBN } from "../../utils/bnUtility";
import { Object } from "ts-toolbelt";

export type BuyAssetFee = Object.Omit<BuyAsset, "txOptions">;

export const forBuyAsset = async (
  instancePromise: Promise<ApiPromise>,
  args: BuyAssetFee
): Promise<string> => {
  const api = await instancePromise;
  const { soldTokenId, boughtTokenId, amount, maxAmountIn, account } = args;
  const dispatchInfo = await api.tx.xyk
    .buyAsset(soldTokenId, boughtTokenId, amount, maxAmountIn)
    .paymentInfo(account);
  return fromBN(new BN(dispatchInfo.partialFee.toString()));
};
