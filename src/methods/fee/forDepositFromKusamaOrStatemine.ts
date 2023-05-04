import { ApiPromise, WsProvider } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { DepositFromKusamaOrStatemineFee } from "../../types/xTokens";
import { fromBN } from "../../utils/bnUtility";

export const forDepositFromKusamaOrStatemine = async (
  args: DepositFromKusamaOrStatemineFee
) => {
  const {
    url,
    destination,
    beneficiary,
    assets,
    feeAssetItem,
    weightLimit,
    account
  } = args;

  const api = await new ApiPromise({
    provider: new WsProvider(url),
    noInitWarn: true
  }).isReady;

  const dispatchInfo = await api.tx.polkadotXcm
    .limitedReserveTransferAssets(
      destination,
      beneficiary,
      assets,
      feeAssetItem,
      weightLimit
    )
    .paymentInfo(account);
  return fromBN(new BN(dispatchInfo.partialFee.toString()));
};