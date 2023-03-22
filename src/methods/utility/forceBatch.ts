import { ApiPromise } from "@polkadot/api";
import { signTx } from "../../utils/signTx";
import { Merge } from "type-fest";
import { ExtrinsicCommon } from "src/types/common";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { ISubmittableResult } from "@polkadot/types/types";

export type Batch = Merge<
  ExtrinsicCommon,
  { calls: SubmittableExtrinsic<"promise", ISubmittableResult>[] }
>;

export const forceBatch = async (
  instancePromise: Promise<ApiPromise>,
  args: Batch
) => {
  const api = await instancePromise;
  const { account, txOptions, calls } = args;
  const tx = api.tx.utility.forceBatch(calls);
  return await signTx(api, tx, account, txOptions);
};
