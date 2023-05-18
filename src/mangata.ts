import "@mangata-finance/types";
import { BN } from "@polkadot/util";
import { deactivateLiquidity } from "./methods/xyk/deactivateLiquidity";
import {
  ActivateLiquidityFee,
  BurnLiquidity,
  BurnLiquidityFee,
  BuyAsset,
  BuyAssetFee,
  ClaimRewardsFee,
  CreatePool,
  CreatePoolFee,
  DeactivateLiquidityFee,
  Liquidity,
  MintLiquidity,
  MintLiquidityFee,
  MultiswapBuyAsset,
  MultiswapSellAsset,
  Price,
  Reserve,
  Rewards,
  SellAsset,
  SellAssetFee
} from "./types/xyk";
import { activateLiquidity } from "./methods/xyk/activateLiquidity";
import { burnLiquidity } from "./methods/xyk/burnLiquidity";
import { transferAllTokens } from "./methods/tokens/transferAllTokens";
import { transferTokens } from "./methods/tokens/transferTokens";

import {
  Transfer,
  TransferAllFee,
  TransferTokenFee,
  TransferTokens
} from "./types/tokens";
import { Address, MangataInstance, TokenAmount, TokenId } from "./types/common";
import { mintLiquidity } from "./methods/xyk/mintLiquidity";
import { depositFromParachain } from "./methods/xTokens/depositFromParachain";
import {
  Deposit,
  DepositFromKusamaOrStatemineFee,
  DepositFromParachainFee,
  RelayDeposit,
  RelayWithdraw,
  Withdraw,
  WithdrawFee,
  WithdrawKsmFee
} from "./types/xTokens";
import { buyAsset } from "./methods/xyk/buyAsset";
import { sellAsset } from "./methods/xyk/sellAsset";
import { createPool } from "./methods/xyk/createPool";
import { claimRewards } from "./methods/xyk/claimRewards";
import { calculateBuyPriceId } from "./methods/rpc/calculateBuyPriceId";
import { calculateSellPriceId } from "./methods/rpc/calculateSellPriceId";
import { getBurnAmount } from "./methods/rpc/getBurnAmount";
import { calculateSellPrice } from "./methods/rpc/calculateSellPrice";
import { calculateBuyPrice } from "./methods/rpc/calculateBuyPrice";
import { calculateRewardsAmount } from "./methods/rpc/calculateRewardsAmount";
import { getNodeVersion } from "./methods/rpc/getNodeVersion";
import { getNodeName } from "./methods/rpc/getNodeName";
import { getChain } from "./methods/rpc/getChain";
import { getPools } from "./methods/query/getPools";
import { getPool } from "./methods/query/getPool";
import { getLiquidityPool } from "./methods/query/getLiquidityPool";
import { getAmountOfTokensInPool } from "./methods/query/getAmountOfTokensInPool";
import { getInvestedPools } from "./methods/query/getInvestedPools";
import { getTotalIssuanceOfTokens } from "./methods/query/getTotalIssuanceOfTokens";
import { getOwnedTokens } from "./methods/query/getOwnedTokens";
import { getAssetsInfo } from "./methods/query/getAssetsInfo";
import { getBlockNumber } from "./methods/query/getBlockNumber";
import { getLiquidityTokens } from "./methods/query/getLiquidityTokens";
import { getLiquidityTokenIds } from "./methods/query/getLiquidityTokenIds";
import { getTokenInfo } from "./methods/query/getTokenInfo";
import { getTokenBalance } from "./methods/query/getTokenBalance";
import { getTotalIssuance } from "./methods/query/getTotalIssuance";
import { getLiquidityTokenId } from "./methods/query/getLiquidityTokenId";
import { getNonce } from "./methods/query/getNonce";
import { withdraw } from "./methods/xTokens/withdraw";
import { withdrawKsm } from "./methods/xTokens/withdrawKsm";
import { batch } from "./methods/utility/batch";
import { batchAll } from "./methods/utility/batchAll";
import { forceBatch } from "./methods/utility/forceBatch";
import { getOrCreateInstance } from "./utils/getOrCreateInstance";
import { waitForNewBlock } from "./methods/rpc/waitForNewBlock";
import { depositFromKusamaOrStatemine } from "./methods/xTokens/depositFromKusamaOrStatemine";
import { calculateMintingFutureRewards } from "./utils/calculateMintingFutureRewards";
import { Batch } from "./types/utility";
import { getActivateLiquidityFee } from "./methods/fee/getActivateLiquidityFee";
import { getDepositFromParachainFee } from "./methods/fee/getDepositFromParachainFee";
import { getDepositFromKusamaOrStatemineFee } from "./methods/fee/getDepositFromKusamaOrStatemineFee";
import { getWithdrawFee } from "./methods/fee/getWithdrawFee";
import { getWithdrawKsmFee } from "./methods/fee/getWithdrawKsmFee";
import { getDeactivateLiquidityFee } from "./methods/fee/getDeactivateLiquidityFee";
import { getClaimRewardsFee } from "./methods/fee/getClaimRewardsFee";
import { getCreatePoolFee } from "./methods/fee/getCreatePoolFee";
import { getSellAssetFee } from "./methods/fee/getSellAssetFee";
import { getBuyAssetFee } from "./methods/fee/getBuyAssetFee";
import { getMintLiquidityFee } from "./methods/fee/getMintLiquidityFee";
import { getBurnLiquidityFee } from "./methods/fee/getBurnLiquidityFee";
import { getTransferAllTokenFee } from "./methods/fee/getTransferAllTokenFee";
import { getTransferTokenFee } from "./methods/fee/getTransferTokenFee";
import { multiswapBuyAsset } from "./methods/xyk/multiswapBuyAsset";
import { multiswapSellAsset } from "./methods/xyk/multiswapSellAsset";

function createMangataInstance(urls: string[]): MangataInstance {
  const instancePromise = getOrCreateInstance(urls);

  return {
    api: async () => await instancePromise,
    batch: async (args: Batch) => await batch(instancePromise, args),
    batchAll: async (args: Batch) => await batchAll(instancePromise, args),
    forceBatch: async (args: Batch) => await forceBatch(instancePromise, args),
    xTokens: {
      depositFromParachain: async (args: Deposit) =>
        await depositFromParachain(args),
      depositFromKusamaOrStatemine: async (args: RelayDeposit) =>
        await depositFromKusamaOrStatemine(args),
      withdraw: async (args: Withdraw) => await withdraw(instancePromise, args),
      withdrawKsm: async (args: RelayWithdraw) =>
        await withdrawKsm(instancePromise, args)
    },
    xyk: {
      deactivateLiquidity: async (args: Liquidity) =>
        await deactivateLiquidity(instancePromise, args, false),
      activateLiquidity: async (args: Liquidity) =>
        await activateLiquidity(instancePromise, args, false),
      burnLiquidity: async (args: BurnLiquidity) =>
        await burnLiquidity(instancePromise, args, false),
      mintLiquidity: async (args: MintLiquidity) =>
        await mintLiquidity(instancePromise, args, false),
      buyAsset: async (args: BuyAsset) =>
        await buyAsset(instancePromise, args, false),
      sellAsset: async (args: SellAsset) =>
        await sellAsset(instancePromise, args, false),
      createPool: async (args: CreatePool) =>
        await createPool(instancePromise, args, false),
      claimRewards: async (args: Liquidity) =>
        await claimRewards(instancePromise, args, false),
      multiswapBuyAsset: async (args: MultiswapBuyAsset) =>
        await multiswapBuyAsset(instancePromise, args, false),
      multiswapSellAsset: async (args: MultiswapSellAsset) =>
        await multiswapSellAsset(instancePromise, args, false)
    },
    rpc: {
      calculateBuyPriceId: async (args: Price) =>
        await calculateBuyPriceId(instancePromise, args),
      calculateSellPriceId: async (args: Price) =>
        await calculateSellPriceId(instancePromise, args),
      getBurnAmount: async (args: Price) =>
        await getBurnAmount(instancePromise, args),
      calculateSellPrice: async (args: Reserve) =>
        await calculateSellPrice(instancePromise, args),
      calculateBuyPrice: async (args: Reserve) =>
        await calculateBuyPrice(instancePromise, args),
      calculateRewardsAmount: async (args: Rewards) =>
        await calculateRewardsAmount(instancePromise, args),
      getNodeVersion: async () => await getNodeVersion(instancePromise),
      getNodeName: async () => await getNodeName(instancePromise),
      getChain: async () => await getChain(instancePromise),
      waitForNewBlock: async (blockNumber?: number) =>
        await waitForNewBlock(instancePromise, blockNumber)
    },
    tokens: {
      transferAllTokens: async (args: Transfer) =>
        await transferAllTokens(instancePromise, args, false),
      transferTokens: async (args: TransferTokens) =>
        await transferTokens(instancePromise, args, false)
    },
    submitableExtrinsic: {
      createPool: async (args: CreatePool) =>
        await createPool(instancePromise, args, true),
      claimRewards: async (args: Liquidity) =>
        await claimRewards(instancePromise, args, true),
      sellAsset: async (args: SellAsset) =>
        await sellAsset(instancePromise, args, true),
      buyAsset: async (args: BuyAsset) =>
        await buyAsset(instancePromise, args, true),
      mintLiquidity: async (args: MintLiquidity) =>
        await mintLiquidity(instancePromise, args, true),
      burnLiquidity: async (args: BurnLiquidity) =>
        await burnLiquidity(instancePromise, args, true),
      activateLiquidity: async (args: Liquidity) =>
        await activateLiquidity(instancePromise, args, true),
      deactivateLiquidity: async (args: Liquidity) =>
        await deactivateLiquidity(instancePromise, args, true),
      transferAllTokens: async (args: Transfer) =>
        await transferAllTokens(instancePromise, args, true),
      transferTokens: async (args: Transfer & { amount: TokenAmount }) =>
        await transferTokens(instancePromise, args, true)
    },
    query: {
      getNonce: async (address: Address) =>
        await getNonce(instancePromise, address),
      getLiquidityTokenId: async (
        firstTokenId: TokenId,
        secondTokenId: TokenId
      ) =>
        await getLiquidityTokenId(instancePromise, firstTokenId, secondTokenId),
      getTotalIssuance: async (tokenId: TokenId) =>
        await getTotalIssuance(instancePromise, tokenId),
      getTokenBalance: async (address: Address, tokenId: TokenId) =>
        await getTokenBalance(instancePromise, address, tokenId),
      getTokenInfo: async (tokenId: TokenId) =>
        await getTokenInfo(instancePromise, tokenId),
      getLiquidityTokenIds: async () =>
        await getLiquidityTokenIds(instancePromise),
      getLiquidityTokens: async () => await getLiquidityTokens(instancePromise),
      getBlockNumber: async () => await getBlockNumber(instancePromise),
      getOwnedTokens: async (address: Address) =>
        await getOwnedTokens(instancePromise, address),
      getAssetsInfo: async () => await getAssetsInfo(instancePromise),
      getInvestedPools: async (address: Address) =>
        await getInvestedPools(instancePromise, address),
      getAmountOfTokensInPool: async (
        firstTokenId: TokenId,
        secondTokenId: TokenId
      ) =>
        await getAmountOfTokensInPool(
          instancePromise,
          firstTokenId,
          secondTokenId
        ),
      getLiquidityPool: async (liquidityTokenId: TokenId) =>
        await getLiquidityPool(instancePromise, liquidityTokenId),
      getPool: async (liquidityTokenId: TokenId) =>
        await getPool(instancePromise, liquidityTokenId),
      getPools: async () => await getPools(instancePromise),
      getTotalIssuanceOfTokens: async () =>
        await getTotalIssuanceOfTokens(instancePromise)
    },
    fee: {
      depositFromParachain: async (args: DepositFromParachainFee) =>
        await getDepositFromParachainFee(args),
      depositFromKusamaOrStatemine: (args: DepositFromKusamaOrStatemineFee) =>
        getDepositFromKusamaOrStatemineFee(args),
      withdraw: async (args: WithdrawFee) =>
        await getWithdrawFee(instancePromise, args),
      withdrawKsm: async (args: WithdrawKsmFee) =>
        await getWithdrawKsmFee(instancePromise, args),
      activateLiquidity: async (args: ActivateLiquidityFee) =>
        await getActivateLiquidityFee(instancePromise, args),
      deactivateLiquidity: async (args: DeactivateLiquidityFee) =>
        await getDeactivateLiquidityFee(instancePromise, args),
      claimRewards: async (args: ClaimRewardsFee) =>
        await getClaimRewardsFee(instancePromise, args),
      createPool: async (args: CreatePoolFee) =>
        await getCreatePoolFee(instancePromise, args),
      sellAsset: async (args: SellAssetFee) =>
        await getSellAssetFee(instancePromise, args),
      buyAsset: async (args: BuyAssetFee) =>
        await getBuyAssetFee(instancePromise, args),
      mintLiquidity: async (args: MintLiquidityFee) =>
        await getMintLiquidityFee(instancePromise, args),
      burnLiquidity: async (args: BurnLiquidityFee) =>
        await getBurnLiquidityFee(instancePromise, args),
      transferAllToken: async (args: TransferAllFee) =>
        await getTransferAllTokenFee(instancePromise, args),
      transferToken: async (args: TransferTokenFee) =>
        await getTransferTokenFee(instancePromise, args)
    },
    util: {
      calculateMintingFutureRewards: async (
        liquidityTokenId: string,
        mintingAmount: BN,
        blocksToPass: BN
      ) =>
        await calculateMintingFutureRewards(
          instancePromise,
          liquidityTokenId,
          mintingAmount,
          blocksToPass
        )
    }
  };
}

const Mangata = {
  instance: createMangataInstance
};

export { Mangata };