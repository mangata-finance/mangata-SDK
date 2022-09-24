"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var t=require("@polkadot/util"),e=require("@polkadot/api"),n=require("@polkadot/rpc-provider/ws"),a=require("@mangata-finance/types"),i=require("@polkadot/util-crypto"),r=require("big.js"),s=require("uuid"),o=require("mangata-prng-xoshiro");function c(t){return t&&"object"==typeof t&&"default"in t?t:{default:t}}var u=c(r);class d{static async getChain(t){return(await t.rpc.system.chain()).toHuman()}static async getNodeName(t){return(await t.rpc.system.name()).toHuman()}static async getNodeVersion(t){return(await t.rpc.system.version()).toHuman()}static async calculateRewardsAmount(e,n,a){const i=await e.rpc.xyk.calculate_rewards_amount(n,a);return t.isHex(i.price.toString())?t.hexToBn(i.price.toString()):new t.BN(i.price)}static async calculateBuyPrice(e,n,a,i){const r=await e.rpc.xyk.calculate_buy_price(n,a,i);return new t.BN(r.price)}static async calculateSellPrice(e,n,a,i){const r=await e.rpc.xyk.calculate_sell_price(n,a,i);return new t.BN(r.price)}static async getBurnAmount(t,e,n,a){const i=await t.rpc.xyk.get_burn_amount(e,n,a);return JSON.parse(i.toString())}static async calculateSellPriceId(e,n,a,i){const r=await e.rpc.xyk.calculate_sell_price_id(n,a,i);return new t.BN(r.price)}static async calculateBuyPriceId(e,n,a,i){const r=await e.rpc.xyk.calculate_buy_price_id(n,a,i);return new t.BN(r.price)}}class g{static instance;db={};constructor(){}static getInstance(){return g.instance||(g.instance=new g),g.instance}hasAddressNonce=t=>!!this.db[t];setNonce=(t,e)=>{this.db[t]=e};getNonce=t=>this.db[t]}const l=g.getInstance(),w=async t=>(await t.query.assetsInfo.assetsInfo.entries()).reduce(((t,[e,n])=>{const a=n.toHuman(),i=e.toHuman()[0].replace(/[, ]/g,""),r={id:i,chainId:0,symbol:a.symbol,address:"MGA"===a.symbol?"0xc7e3bda797d2ceb740308ec40142ae235e08144a":"ETH"===a.symbol?"0x0000000000000000000000000000000000000000":a.description,name:a.symbol.includes("TKN")?"Liquidity Pool Token":a.name,decimals:Number(a.decimals)};return t[i]=r,t}),{}),y=async t=>(await t.query.xyk.liquidityAssets.entries()).reduce(((t,[e,n])=>{const a=e.args.map((t=>t.toHuman()))[0],i=n.toString().replace(/[, ]/g,"");return t[a]=i,t}),{}),p=async(e,n)=>(await e.query.tokens.accounts.entries(n)).reduce(((e,[n,a])=>{const i=JSON.parse(JSON.stringify(a)).free.toString(),r=JSON.parse(JSON.stringify(a)).frozen.toString(),s=JSON.parse(JSON.stringify(a)).reserved.toString(),o={free:t.isHex(i)?t.hexToBn(i):new t.BN(i),frozen:t.isHex(r)?t.hexToBn(r):new t.BN(r),reserved:t.isHex(s)?t.hexToBn(s):new t.BN(s)};return e[n.toHuman()[1].replace(/[, ]/g,"")]=o,e}),{}),B=async e=>{const n=await w(e);return Object.values(n).filter((t=>"1"!==t.id&&"3"!==t.id)).reduce(((e,n)=>{const a={...n,symbol:n.symbol.includes("TKN")?n.symbol.split("-").reduce(((e,n)=>{const a=n.replace("TKN",""),i=a.startsWith("0x")?t.hexToBn(a).toString():a;return e.push(i),e}),[]).join("-"):n.symbol};return e[a.id]=a,e}),{})},N=new t.BN("0"),m=new t.BN("1"),I=new t.BN("10"),T=new t.BN("100"),k=new t.BN("1000"),h=new t.BN("10000"),A=new t.BN("100000"),x=new t.BN("1000000"),f=new t.BN("10000000"),S=new t.BN("100000000"),P=new t.BN("1000000000"),q=new t.BN("10000000000"),b=new t.BN("100000000000"),L=new t.BN("1000000000000"),F=new t.BN("10").pow(new t.BN(18)),v=async(e,n,a)=>{if(a.isZero())return N;const i=await e.query.tokens.totalIssuance(n),r=new t.BN(i.toString());return a.mul(F).div(r)},_=(t,e)=>e.gt(N)?_(e,t.mod(e)):t,R=(t,e)=>{const n=((t,e)=>{const n=_(t,e);return n.isZero()?[N,N]:[t.div(n),e.div(n)]})(t,e);return n[1].mul(F).div(n[0])},O=async t=>{try{return(await t.query.issuance.promotedPoolsRewards.entries()).map((([t])=>t.args.map((t=>t.toHuman()))[0]))}catch(t){return[]}};class H{static async getNonce(t,e){return(await t.rpc.system.accountNextIndex(e)).toBn()}static async getAmountOfTokenIdInPool(e,n,a){const i=await e.query.xyk.pools([n,a]),r=i[0].toString(),s=i[1].toString();return[t.isHex(r)?t.hexToBn(r):new t.BN(r),t.isHex(s)?t.hexToBn(s):new t.BN(s)]}static async getLiquidityTokenId(e,n,a){const i=await e.query.xyk.liquidityAssets([n,a]);return i.isSome?new t.BN(i.toString()):t.BN_ZERO}static async getLiquidityPool(e,n){const a=await e.query.xyk.liquidityPools(n);return a.isSome?a.unwrap().map((e=>new t.BN(e))):[new t.BN(-1),new t.BN(-1)]}static async getTotalIssuance(e,n){const a=await e.query.tokens.totalIssuance(n);return new t.BN(a)}static async getTokenBalance(e,n,a){const{free:i,reserved:r,frozen:s}=await e.query.tokens.accounts(n,a);return{free:t.isHex(i.toString())?t.hexToBn(i.toString()):new t.BN(i.toString()),reserved:t.isHex(r.toString())?t.hexToBn(r.toString()):new t.BN(r.toString()),frozen:t.isHex(s.toString())?t.hexToBn(s.toString()):new t.BN(s.toString())}}static async getNextTokenId(e){const n=await e.query.tokens.nextCurrencyId();return new t.BN(n)}static async getTokenInfo(t,e){return(await this.getAssetsInfo(t))[e]}static async getLiquidityTokenIds(t){return(await t.query.xyk.liquidityAssets.entries()).map((t=>t[1].toString()))}static async getLiquidityTokens(t){const e=await this.getAssetsInfo(t);return Object.values(e).reduce(((t,e)=>(e.name.includes("Liquidity Pool Token")&&(t[e.id]=e),t)),{})}static async getAssetsInfo(e){const n=await w(e);return Object.values(n).filter((t=>"1"!==t.id&&"3"!==t.id)).reduce(((e,a)=>{const i={...a,symbol:a.symbol.includes("TKN")?a.symbol.split("-").reduce(((e,a)=>{const i=a.replace("TKN",""),r=i.startsWith("0x")?t.hexToBn(i).toString():i,s=n[r].symbol;return e.push(s),e}),[]).join("-"):a.symbol};return e[i.id]=i,e}),{})}static async getBlockNumber(t){return(await t.rpc.chain.getBlock()).block.header.number.toString()}static async getOwnedTokens(t,e){if(!e)return null;const[n,a]=await Promise.all([this.getAssetsInfo(t),p(t,e)]);return Object.values(n).reduce(((t,e)=>(Object.keys(a).includes(e.id)&&(t[e.id]={...e,balance:a[e.id]}),t)),{})}static async getBalances(e){return(await e.query.tokens.totalIssuance.entries()).reduce(((e,[n,a])=>{const i=n.toHuman()[0].replace(/[, ]/g,""),r=new t.BN(a.toString());return e[i]=r,e}),{})}static async getInvestedPools(t,e){const[n,a,i]=await Promise.all([B(t),p(t,e),O(t)]),r=Object.values(n).reduce(((t,e)=>(Object.keys(a).includes(e.id)&&e.name.includes("Liquidity Pool Token")&&t.push(e),t)),[]).map((async e=>{const n=a[e.id],r=e.symbol.split("-")[0],s=e.symbol.split("-")[1],[o,c]=await this.getAmountOfTokenIdInPool(t,r.toString(),s.toString());return{firstTokenId:r,secondTokenId:s,firstTokenAmount:o,secondTokenAmount:c,liquidityTokenId:e.id,isPromoted:i.includes(e.id),share:await v(t,e.id,n.free.add(n.reserved)),firstTokenRatio:R(o,c),secondTokenRatio:R(c,o),activatedLPTokens:n.reserved,nonActivatedLPTokens:n.free}}));return Promise.all(r)}static async getPool(t,e){const[n,a]=await Promise.all([this.getLiquidityPool(t,e),t.query.issuance.promotedPoolsRewards(e)]),[i,r]=n,[s,o]=await this.getAmountOfTokenIdInPool(t,i.toString(),r.toString());return{firstTokenId:i.toString(),secondTokenId:r.toString(),firstTokenAmount:s,secondTokenAmount:o,liquidityTokenId:e,isPromoted:a.gtn(0),firstTokenRatio:R(s,o),secondTokenRatio:R(o,s)}}static async getPools(e){const[n,a]=await Promise.all([B(e),y(e)]),i=await(async(e,n)=>(await e.query.xyk.pools.entries()).reduce(((e,[a,i])=>{const r=a.args.map((t=>t.toHuman()))[0],s=JSON.parse(JSON.stringify(i)).map((e=>t.isHex(e)?t.hexToBn(e):new t.BN(e)));return e[n[r]]=s,e}),{}))(e,a),r=await O(e);return Object.values(n).reduce(((t,e)=>Object.values(a).includes(e.id)?t.concat(e):t),[]).map((t=>{const[e,n]=i[t.id];return{firstTokenId:t.symbol.split("-")[0],secondTokenId:t.symbol.split("-")[1],firstTokenAmount:e,secondTokenAmount:n,liquidityTokenId:t.id,firstTokenRatio:R(e,n),secondTokenRatio:R(n,e),isPromoted:r.includes(t.id)}}))}}const M=async(t,e,n,a)=>new Promise((async(i,r)=>{const s="string"==typeof n?n:n.address,o=await(async(t,e,n)=>{let a;if(n&&n.nonce)a=n.nonce;else{const n=await H.getNonce(t,e);a=l.hasAddressNonce(e)?l.getNonce(e):n,n&&n.gt(a)&&(a=n);const i=a.addn(1);l.setNonce(e,i)}return a})(t,s,a);try{const c=await e.signAndSend(n,{nonce:o,signer:a?.signer},(async n=>{if(console.info(`Tx[${e.hash.toString()}] who:${s} nonce:${o.toString()} => ${n.status.type}(${n.status.value.toString()})${function(t,e){if(!process.env.TX_VERBOSE)return"";const n=JSON.parse(e.method.toString()),a=JSON.stringify(n.args),i=t.registry.findMetaCall(e.method.callIndex);if("sudo"==i.method&&"sudo"==i.method){const a=e.method.args[0].callIndex,i=JSON.stringify(n.args.call.args),r=t.registry.findMetaCall(a);return` (sudo::${r.section}::${r.method}(${i})`}return` (${i.section}::${i.method}(${a}))`}(t,e)}`),a?.statusCallback?.(n),n.status.isFinalized){const u=n.status.asFinalized.toString(),d=(await t.rpc.chain.getHeader(u)).number.toBn(),g=d.addn(1),w=d.addn(10),y=g,p=await t.rpc.chain.subscribeFinalizedHeads((async n=>{const u=n.number.toBn();if(y.gt(w)){p(),r(`Tx ([${e.hash.toString()}])\n                      was not executed in blocks : ${g.toString()} .. ${w.toString()}`);const n=await H.getNonce(t,s);return l.setNonce(s,n),void c()}if(u.gte(y)){const n=await t.rpc.chain.getBlockHash(y),r=await t.rpc.chain.getHeader(n),u=(await t.rpc.chain.getBlock(r.hash)).block.extrinsics,d=await t.query.system.events.at(r.hash);y.iaddn(1);const g=u.findIndex((t=>t.hash.toString()===e.hash.toString()));if(g<0)return void console.info(`Tx([${e.hash.toString()}]) not found in block ${y} $([${(t=>{if(!t)return"";const e=t.length;return t.substring(0,7)+"..."+t.substring(e-5,e)})(n.toString())}])`);p(),console.info(`Tx[${e.hash.toString()}] who:${s} nonce:${o.toString()} => Executed(${n.toString()})`);const l=d.filter((t=>t.phase.isApplyExtrinsic&&t.phase.asApplyExtrinsic.toNumber()===g)).map((e=>{const{event:n,phase:a}=e,i=n.typeDef,r=n.data.map(((t,e)=>({lookupName:i[e].lookupName,data:t})));return{event:n,phase:a,section:n.section,method:n.method,metaDocumentation:n.meta.docs.toString(),eventData:r,error:E(t,n.method,r)}}));a?.extrinsicStatus?.(l),i(l),c()}}))}else if(n.isError){console.info("Transaction Error Result",JSON.stringify(n,null,2)),r(`Tx([${e.hash.toString()}]) Transaction error`);const a=await H.getNonce(t,s);l.setNonce(s,a)}}))}catch(e){const n=await H.getNonce(t,s);l.setNonce(s,n),r({data:e.message||e.description||e.data?.toString()||e.toString()})}})),E=(e,n,a)=>{if("ExtrinsicFailed"===n){const n=a.find((t=>t.lookupName.includes("DispatchError")))?.data?.toHuman?.(),i=n?.Module?.error,r=n?.Module?.index;if(!i||!r)return{documentation:["Unknown error"],name:"UnknownError"};try{const n=e.registry.findMetaError({error:t.isHex(i)?t.hexToU8a(i):new t.BN(i),index:new t.BN(r)});return{documentation:n.docs,name:n.name}}catch(t){return{documentation:["Unknown error"],name:"UnknownError"}}}return null};class C{static async sendKusamaTokenFromRelayToParachain(t,a,i,r,s,o){const c=new n.WsProvider(t),u=await new e.ApiPromise({provider:c}).isReady,d={V1:{interior:{X1:{ParaChain:s}},parents:0}},g={V1:{interior:{X1:{AccountId32:{id:u.createType("AccountId32",i).toHex(),network:"Any"}}},parents:0}},l={V1:[{fun:{Fungible:r},id:{Concrete:{interior:"Here",parents:0}}}]};await u.tx.xcmPallet.reserveTransferAssets(d,g,l,0).signAndSend(a,{signer:o?.signer,nonce:o?.nonce})}static async sendKusamaTokenFromParachainToRelay(e,n,a,i,r){const s={V1:{parents:1,interior:{X1:{AccountId32:{network:"Any",id:e.createType("AccountId32",a).toHex()}}}}};await e.tx.xTokens.transfer("4",i,s,new t.BN("6000000000")).signAndSend(n,{signer:r?.signer,nonce:r?.nonce})}static async sendTurTokenFromTuringToMangata(a,r,s,o,c,u){const d=new n.WsProvider(r),g=await new e.ApiPromise({provider:d}).isReady,l=i.encodeAddress(o,42),w={V1:{id:{Concrete:{parents:1,interior:{X1:{Parachain:2114}}}},fun:{Fungible:c}}},y={V1:{parents:1,interior:{X2:[{Parachain:2110},{AccountId32:{network:"Any",id:a.createType("AccountId32",l).toHex()}}]}}};await g.tx.xTokens.transferMultiasset(w,y,new t.BN("4000000000")).signAndSend(s,{signer:u?.signer,nonce:u?.nonce})}static async sendTurTokenFromMangataToTuring(e,n,a,r,s){const o=i.encodeAddress(a,42),c={V1:{parents:1,interior:{X2:[{Parachain:2114},{AccountId32:{network:"Any",id:e.createType("AccountId32",o).toHex()}}]}}};await M(e,e.tx.xTokens.transfer("7",r,c,new t.BN("6000000000")),n,s)}static async activateLiquidity(t,e,n,a,i){return await M(t,t.tx.xyk.activateLiquidity(n,a,null),e,i)}static async deactivateLiquidity(t,e,n,a,i){return await M(t,t.tx.xyk.deactivateLiquidity(n,a),e,i)}static async claimRewards(t,e,n,a,i){return await M(t,t.tx.xyk.claimRewards(n,a),e,i)}static async createPool(t,e,n,a,i,r,s){return await M(t,t.tx.xyk.createPool(n,a,i,r),e,s)}static async sellAsset(t,e,n,a,i,r,s){return await M(t,t.tx.xyk.sellAsset(n,a,i,r),e,s)}static async buyAsset(t,e,n,a,i,r,s){return await M(t,t.tx.xyk.buyAsset(n,a,i,r),e,s)}static async mintLiquidity(t,e,n,a,i,r,s){return await M(t,t.tx.xyk.mintLiquidity(n,a,i,r),e,s)}static async burnLiquidity(t,e,n,a,i,r){return await M(t,t.tx.xyk.burnLiquidity(n,a,i),e,r)}static async transferToken(t,e,n,a,i,r){return await M(t,t.tx.tokens.transfer(a,n,i),e,r)}static async transferAllToken(t,e,n,a,i){return await M(t,t.tx.tokens.transferAll(a,n,!0),e,i)}}const D=u.default("0"),U=u.default("1"),$=u.default("10"),K=u.default("100"),V=u.default("1000"),j=u.default("10000"),G=u.default("100000"),J=u.default("1000000"),X=u.default("10000000"),W=u.default("100000000"),z=u.default("1000000000"),Z=u.default("10000000000"),Q=u.default("100000000000"),Y=u.default("1000000000000");u.default.PE=256,u.default.NE=-256,u.default.DP=40,u.default.RM=u.default.roundUp;const tt=$.pow(18),et=(e,n)=>{if(!e)return N;try{const a=u.default(e),i=n&&18!==n?$.pow(n):tt,r=a.mul(i).toString();return/\D/gm.test(r)?N:new t.BN(r)}catch(t){return N}},nt=(t,e)=>{if(!t)return"0";try{const n=u.default(t.toString()),a=e&&18!==e?$.pow(e):tt,i=n.div(a);return i.toString()}catch(t){return"0"}};class at{static async sendTurTokenFromTuringToMangataFee(a,r,s,o,c){const u=new n.WsProvider(r),d=await new e.ApiPromise({provider:u}).isReady,g=i.encodeAddress(o,42),l={V1:{id:{Concrete:{parents:1,interior:{X1:{Parachain:2114}}}},fun:{Fungible:c}}},w={V1:{parents:1,interior:{X2:[{Parachain:2110},{AccountId32:{network:"Any",id:a.createType("AccountId32",g).toHex()}}]}}},y=await d.tx.xTokens.transferMultiasset(l,w,new t.BN("4000000000")).paymentInfo(s);return nt(new t.BN(y.partialFee.toString()),10)}static async sendTurTokenFromMangataToTuringFee(e,n,a,r){const s=i.encodeAddress(a,42),o={V1:{parents:1,interior:{X2:[{Parachain:2114},{AccountId32:{network:"Any",id:e.createType("AccountId32",s).toHex()}}]}}},c=await e.tx.xTokens.transfer("7",r,o,new t.BN("6000000000")).paymentInfo(n);return nt(new t.BN(c.partialFee.toString()))}static async sendKusamaTokenFromRelayToParachainFee(a,r,s,o,c){const u=new n.WsProvider(a),d=await new e.ApiPromise({provider:u}).isReady,g={V1:{interior:{X1:{ParaChain:c}},parents:0}},l={V1:{interior:{X1:{AccountId32:{id:d.createType("AccountId32",i.encodeAddress(s,42)).toHex(),network:"Any"}}},parents:0}},w={V1:[{fun:{Fungible:o},id:{Concrete:{interior:"Here",parents:0}}}]},y=await d.tx.xcmPallet.reserveTransferAssets(g,l,w,0).paymentInfo(r);return nt(new t.BN(y.partialFee.toString()),12)}static async sendKusamaTokenFromParachainToRelayFee(e,n,a,r){const s={V1:{parents:1,interior:{X1:{AccountId32:{network:"Any",id:e.createType("AccountId32",i.encodeAddress(a,2)).toHex()}}}}},o=await e.tx.xTokens.transfer("4",r,s,new t.BN("6000000000")).paymentInfo(n);return nt(new t.BN(o.partialFee.toString()))}static async activateLiquidity(e,n,a,i){const r=await e.tx.xyk.activateLiquidity(a,i,null).paymentInfo(n);return nt(new t.BN(r.partialFee.toString()))}static async deactivateLiquidity(e,n,a,i){const r=await e.tx.xyk.deactivateLiquidity(a,i).paymentInfo(n);return nt(new t.BN(r.partialFee.toString()))}static async claimRewardsFee(e,n,a,i){const r=await e.tx.xyk.claimRewards(a,i).paymentInfo(n);return nt(new t.BN(r.partialFee.toString()))}static async createPoolFee(e,n,a,i,r,s){const o=await e.tx.xyk.createPool(a,i,r,s).paymentInfo(n);return nt(new t.BN(o.partialFee.toString()))}static async sellAssetFee(e,n,a,i,r,s){const o=await e.tx.xyk.sellAsset(a,i,r,s).paymentInfo(n);return nt(new t.BN(o.partialFee.toString()))}static async buyAssetFee(e,n,a,i,r,s){const o=await e.tx.xyk.buyAsset(a,i,r,s).paymentInfo(n);return nt(new t.BN(o.partialFee.toString()))}static async mintLiquidityFee(e,n,a,i,r,s=new t.BN(Number.MAX_SAFE_INTEGER)){const o=await e.tx.xyk.mintLiquidity(a,i,r,s).paymentInfo(n);return nt(new t.BN(o.partialFee.toString()))}static async burnLiquidityFee(e,n,a,i,r){const s=await e.tx.xyk.burnLiquidity(a,i,r).paymentInfo(n);return nt(new t.BN(s.partialFee.toString()))}static async transferTokenFee(e,n,a,i,r){const s=await e.tx.tokens.transfer(i,a,r).paymentInfo(n);return nt(new t.BN(s.partialFee.toString()))}static async transferAllTokenFee(e,n,a,i){const r=await e.tx.tokens.transferAll(i,a,!0).paymentInfo(n);return nt(new t.BN(r.partialFee.toString()))}}const it=(e,n,a,i,r)=>{const s=n.sub(a),o=new t.BN(e).mul(s),c=new t.BN(r).mul(new t.BN(106)).div(new t.BN(6)),d=u.default(1e4),g=u.default(1.06).pow(s.toNumber()).mul(d).round(0,0),l=(""+g.toString()).replace(/(-?)(\d*)\.?(\d+)e([+-]\d+)/,(function(t,e,n,a,i){return i<0?e+"0."+Array(1-i-n.length).join("0")+n+a:e+n+a+Array(i-a.length+1).join("0")}));const w=new t.BN(c).sub(new t.BN(c).mul(new t.BN(d.toString())).div(new t.BN(l))),y=new t.BN(o).sub(w);return new t.BN(i).add(y)},rt=async(e,n,a,i,r)=>{const{lastCheckpoint:s,cummulativeWorkInLastCheckpoint:o,missingAtLastCheckpoint:c}=await(async(e,n,a,i)=>{const[r,s,o]=await i.query.xyk.liquidityMiningUser([e,n]);return new t.BN(r.toString()).eq(new t.BN(0))&&new t.BN(s.toString()).eq(new t.BN(0))&&new t.BN(o.toString()).eq(new t.BN(0))?{lastCheckpoint:a,cummulativeWorkInLastCheckpoint:u.default(0),missingAtLastCheckpoint:u.default(0)}:{lastCheckpoint:u.default(r.toString()),cummulativeWorkInLastCheckpoint:u.default(s.toString()),missingAtLastCheckpoint:u.default(o.toString())}})(e,a,i,r);return it(n,i,new t.BN(s.toString()),new t.BN(o.toString()),new t.BN(c.toString()))},st=async(e,n,a,i)=>{const{lastCheckpoint:r,cummulativeWorkInLastCheckpoint:s,missingAtLastCheckpoint:o}=await(async(e,n,a)=>{const[i,r,s]=await a.query.xyk.liquidityMiningPool(e);return new t.BN(i.toString()).eq(new t.BN(0))&&new t.BN(r.toString()).eq(new t.BN(0))&&new t.BN(s.toString()).eq(new t.BN(0))?{lastCheckpoint:n,cummulativeWorkInLastCheckpoint:new t.BN(0),missingAtLastCheckpoint:new t.BN(0)}:{lastCheckpoint:new t.BN(i.toString()),cummulativeWorkInLastCheckpoint:new t.BN(r.toString()),missingAtLastCheckpoint:new t.BN(s.toString())}})(n,a,i);return it(e,a,new t.BN(r.toString()),new t.BN(s.toString()),new t.BN(o.toString()))},ot=async(e,n,a,i)=>{const r=await e.rpc.chain.getBlock(),s=new t.BN(r.block.header.number.toString()),o=s.add(new t.BN(i)).div(new t.BN(1e4)),c=s.div(new t.BN(1e4)),u=await e.query.xyk.liquidityMiningActivePool(new t.BN(n)),d=await(async(e,n,a,i)=>{const r=n,s=new t.BN(0),o=e;return it(e,a,new t.BN(r.toString()),new t.BN(s.toString()),new t.BN(o.toString()))})(a,c,o),g=await st(new t.BN(u.toString()).add(a),n,o,e),l=await e.query.issuance.promotedPoolsRewards(n),w=new t.BN(l.toString()),y=new t.BN("136986000000000000000000"),p=i.div(new t.BN(1200)),B=await e.query.issuance.promotedPoolsRewards.entries(),N=y.mul(p).div(new t.BN(B.length)).add(w);let m=new t.BN(0);return d.gt(new t.BN(0))&&g.gt(new t.BN(0))&&(m=N.mul(d).div(g)),m};class ct{api;urls;static instanceMap=new Map;constructor(t){this.urls=t,this.api=(async()=>await this.connectToNode(t))()}async connectToNode(t){const i=new n.WsProvider(t,5e3);return await e.ApiPromise.create(a.options({provider:i,throwOnConnect:!0,throwOnUnknown:!0}))}static getInstance(t){return ct.instanceMap.has(JSON.stringify(t))||ct.instanceMap.set(JSON.stringify(t),new ct(t)),ct.instanceMap.get(JSON.stringify(t))}async getApi(){return this.api||(this.api=this.connectToNode(this.urls)),this.api}getUrls(){return this.urls}async waitForNewBlock(t){let e=0;const n=await this.getApi(),a=t||2;return new Promise((async t=>{const i=await n.rpc.chain.subscribeNewHeads((()=>{++e===a&&(i(),t(!0))}))}))}async getChain(){const t=await this.getApi();return d.getChain(t)}async getNodeName(){const t=await this.getApi();return d.getNodeName(t)}async getNodeVersion(){const t=await this.getApi();return d.getNodeVersion(t)}async getNonce(t){const e=await this.getApi();return H.getNonce(e,t)}async disconnect(){const t=await this.getApi();await t.disconnect()}async sendKusamaTokenFromRelayToParachain(t,e,n,a,i=2110,r){return await C.sendKusamaTokenFromRelayToParachain(t,e,n,a,i,r)}async sendKusamaTokenFromRelayToParachainFee(t,e,n,a,i=2110){return await at.sendKusamaTokenFromRelayToParachainFee(t,e,n,a,i)}async sendKusamaTokenFromParachainToRelay(t,e,n,a){const i=await this.getApi();return await C.sendKusamaTokenFromParachainToRelay(i,t,e,n,a)}async sendKusamaTokenFromParachainToRelayFee(t,e,n){const a=await this.getApi();return await at.sendKusamaTokenFromParachainToRelayFee(a,t,e,n)}async sendTurTokenFromTuringToMangata(t,e,n,a,i){const r=await this.getApi();return await C.sendTurTokenFromTuringToMangata(r,t,e,n,a,i)}async sendTurTokenFromMangataToTuring(t,e,n,a){const i=await this.getApi();return await C.sendTurTokenFromMangataToTuring(i,t,e,n,a)}async sendTurTokenFromTuringToMangataFee(t,e,n,a){const i=await this.getApi();return await at.sendTurTokenFromTuringToMangataFee(i,t,e,n,a)}async sendTurTokenFromMangataToTuringFee(t,e,n){const a=await this.getApi();return await at.sendTurTokenFromMangataToTuringFee(a,t,e,n)}async activateLiquidity(t,e,n,a){const i=await this.getApi();return await C.activateLiquidity(i,t,e,n,a)}async deactivateLiquidity(t,e,n,a){const i=await this.getApi();return await C.deactivateLiquidity(i,t,e,n,a)}async calculateFutureRewardsAmount(e,n,a){const i=await this.getApi();return await(async(e,n,a,i)=>{const r=await e.rpc.chain.getBlock(),s=new t.BN(r.block.header.number.toString()).add(new t.BN(i)).div(new t.BN(1e4)),o=await e.query.xyk.liquidityMiningActiveUser([n,new t.BN(a)]),c=await e.query.xyk.liquidityMiningActivePool(new t.BN(a)),u=await rt(n,new t.BN(o.toString()),a,s,e),d=await st(new t.BN(c.toString()),a,s,e),g=await e.query.xyk.liquidityMiningUserToBeClaimed([n,a]),l=await e.query.xyk.liquidityMiningUserClaimed([n,a]),w=await e.query.issuance.promotedPoolsRewards(a),y=new t.BN(w.toString()),p=new t.BN("136986000000000000000000"),B=i.div(new t.BN(1200)),N=await e.query.issuance.promotedPoolsRewards.entries(),m=y.add(p.mul(B).div(new t.BN(N.length)));let I=new t.BN(0);return u.gt(new t.BN(0))&&d.gt(new t.BN(0))&&(I=m.mul(u).div(d)),I.add(new t.BN(g.toString())).sub(new t.BN(l.toString()))})(i,e,n,a)}async calculateFutureRewardsAmountForMinting(t,e,n){const a=await this.getApi();return await ot(a,t,e,n)}async calculateRewardsAmount(t,e){const n=await this.getApi();return await d.calculateRewardsAmount(n,t,e)}async claimRewardsFee(t,e,n){const a=await this.getApi();return await at.claimRewardsFee(a,t,e,n)}async claimRewards(t,e,n,a){const i=await this.getApi();return await C.claimRewards(i,t,e,n,a)}async createPoolFee(t,e,n,a,i){const r=await this.getApi();return await at.createPoolFee(r,t,e,n,a,i)}async createPool(t,e,n,a,i,r){const s=await this.getApi();return await C.createPool(s,t,e,n,a,i,r)}async sellAssetFee(t,e,n,a,i){const r=await this.getApi();return await at.sellAssetFee(r,t,e,n,a,i)}async sellAsset(t,e,n,a,i,r){const s=await this.getApi();return await C.sellAsset(s,t,e,n,a,i,r)}async mintLiquidityFee(t,e,n,a,i){const r=await this.getApi();return await at.mintLiquidityFee(r,t,e,n,a,i)}async mintLiquidity(t,e,n,a,i,r){const s=await this.getApi();return await C.mintLiquidity(s,t,e,n,a,i,r)}async burnLiquidityFee(t,e,n,a){const i=await this.getApi();return await at.burnLiquidityFee(i,t,e,n,a)}async burnLiquidity(t,e,n,a,i){const r=await this.getApi();return await C.burnLiquidity(r,t,e,n,a,i)}async buyAssetFee(t,e,n,a,i){const r=await this.getApi();return await at.buyAssetFee(r,t,e,n,a,i)}async buyAsset(t,e,n,a,i,r){const s=await this.getApi();return await C.buyAsset(s,t,e,n,a,i,r)}async calculateBuyPrice(t,e,n){const a=await this.getApi();return await d.calculateBuyPrice(a,t,e,n)}async calculateSellPrice(t,e,n){const a=await this.getApi();return await d.calculateSellPrice(a,t,e,n)}async getBurnAmount(t,e,n){const a=await this.getApi();return await d.getBurnAmount(a,t,e,n)}async calculateSellPriceId(t,e,n){const a=await this.getApi();return await d.calculateSellPriceId(a,t,e,n)}async calculateBuyPriceId(t,e,n){const a=await this.getApi();return await d.calculateBuyPriceId(a,t,e,n)}async getAmountOfTokenIdInPool(t,e){const n=await this.getApi();return await H.getAmountOfTokenIdInPool(n,t,e)}async getLiquidityTokenId(t,e){const n=await this.getApi();return await H.getLiquidityTokenId(n,t,e)}async getLiquidityPool(t){const e=await this.getApi();return await H.getLiquidityPool(e,t)}async transferTokenFee(t,e,n,a){const i=await this.getApi();return await at.transferTokenFee(i,t,e,n,a)}async transferToken(t,e,n,a,i){const r=await this.getApi();return await C.transferToken(r,t,e,n,a,i)}async transferTokenAllFee(t,e,n){const a=await this.getApi();return await at.transferAllTokenFee(a,t,e,n)}async transferTokenAll(t,e,n,a){const i=await this.getApi();return await C.transferAllToken(i,t,e,n,a)}async getTotalIssuance(t){const e=await this.getApi();return await H.getTotalIssuance(e,t)}async getTokenBalance(t,e){const n=await this.getApi();return await H.getTokenBalance(n,e,t)}async getNextTokenId(){const t=await this.getApi();return await H.getNextTokenId(t)}async getTokenInfo(t){const e=await this.getApi();return await H.getTokenInfo(e,t)}async getBlockNumber(){const t=await this.getApi();return await H.getBlockNumber(t)}async getOwnedTokens(t){const e=await this.getApi();return await H.getOwnedTokens(e,t)}async getLiquidityTokenIds(){const t=await this.getApi();return await H.getLiquidityTokenIds(t)}async getAssetsInfo(){const t=await this.getApi();return await H.getAssetsInfo(t)}async getBalances(){const t=await this.getApi();return await H.getBalances(t)}async getLiquidityTokens(){const t=await this.getApi();return await H.getLiquidityTokens(t)}async getPool(t){const e=await this.getApi();return await H.getPool(e,t)}async getInvestedPools(t){const e=await this.getApi();return await H.getInvestedPools(e,t)}async getPools(){const t=await this.getApi();return await H.getPools(t)}}const ut=(t,e)=>{const n=new RegExp(`^-?\\d+(?:\\.\\d{0,${e}})?`,"gm");return(t.match(n)?.[0]||t).match(/^-?0*(\d+(?:\.(?:(?!0+$)\d)+)?)/gm)?.[0]??t},dt=t=>{const e=+t;return!(!t||isNaN(Number(t))||isNaN(e)||e<0)};function gt(t){const{s0:e,s1:n,s2:a,s3:i}=function(t){return{s0:BigInt(t[0])<<BigInt(0)|BigInt(t[1])<<BigInt(8)|BigInt(t[2])<<BigInt(16)|BigInt(t[3])<<BigInt(24)|BigInt(t[4])<<BigInt(32)|BigInt(t[5])<<BigInt(40)|BigInt(t[6])<<BigInt(48)|BigInt(t[7])<<BigInt(56),s1:BigInt(t[8])<<BigInt(0)|BigInt(t[9])<<BigInt(8)|BigInt(t[10])<<BigInt(16)|BigInt(t[11])<<BigInt(24)|BigInt(t[12])<<BigInt(32)|BigInt(t[13])<<BigInt(40)|BigInt(t[14])<<BigInt(48)|BigInt(t[15])<<BigInt(56),s2:BigInt(t[16])<<BigInt(0)|BigInt(t[17])<<BigInt(8)|BigInt(t[18])<<BigInt(16)|BigInt(t[19])<<BigInt(24)|BigInt(t[20])<<BigInt(32)|BigInt(t[21])<<BigInt(40)|BigInt(t[22])<<BigInt(48)|BigInt(t[23])<<BigInt(56),s3:BigInt(t[24])<<BigInt(0)|BigInt(t[25])<<BigInt(8)|BigInt(t[26])<<BigInt(16)|BigInt(t[27])<<BigInt(24)|BigInt(t[28])<<BigInt(32)|BigInt(t[29])<<BigInt(40)|BigInt(t[30])<<BigInt(48)|BigInt(t[31])<<BigInt(56)}}(t);return new o.XoShiRo256Plus(e,n,a,i)}Object.defineProperty(exports,"BN",{enumerable:!0,get:function(){return t.BN}}),exports.BIG_BILLION=z,exports.BIG_HUNDRED=K,exports.BIG_HUNDRED_BILLIONS=Q,exports.BIG_HUNDRED_MILLIONS=W,exports.BIG_HUNDRED_THOUSAND=G,exports.BIG_MILLION=J,exports.BIG_ONE=U,exports.BIG_TEN=$,exports.BIG_TEN_BILLIONS=Z,exports.BIG_TEN_MILLIONS=X,exports.BIG_TEN_THOUSAND=j,exports.BIG_THOUSAND=V,exports.BIG_TRILLION=Y,exports.BIG_ZERO=D,exports.BN_BILLION=P,exports.BN_DIV_NUMERATOR_MULTIPLIER=F,exports.BN_DIV_NUMERATOR_MULTIPLIER_DECIMALS=18,exports.BN_HUNDRED=T,exports.BN_HUNDRED_BILLIONS=b,exports.BN_HUNDRED_MILLIONS=S,exports.BN_HUNDRED_THOUSAND=A,exports.BN_MILLION=x,exports.BN_ONE=m,exports.BN_TEN=I,exports.BN_TEN_BILLIONS=q,exports.BN_TEN_MILLIONS=f,exports.BN_TEN_THOUSAND=h,exports.BN_THOUSAND=k,exports.BN_TRILLION=L,exports.BN_ZERO=N,exports.Mangata=ct,exports.MangataHelpers=class{static createKeyring(t){return new e.Keyring({type:t})}static createKeyPairFromName(t,e=""){const n=e||"//testUser_"+s.v4(),a=t.createFromUri(n);return t.addPair(a),a}static getXoshiro(t){return gt(t)}static getPriceImpact(t,e,n,a){if(!(t&&e&&dt(n)&&dt(a)))return;const i=t.firstTokenBalance,r=t.secondTokenBalance,s=et(n,e.firstTokenDecimals),o=et(a,e.secondTokenDecimals);if(o.gte(r))return"";const c=i.add(s).mul(h).mul(r),d=r.sub(o).mul(i),g=c.div(d).sub(h).toString(),l=u.default(g);return ut(l.div(K).toString(),2)}},exports.fromBN=nt,exports.signTx=M,exports.toBN=et,exports.toFixed=ut;
