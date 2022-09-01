import{isHex as t,hexToBn as e,BN as n,BN_ZERO as a,hexToU8a as i}from"@polkadot/util";export{BN}from"@polkadot/util";import{ApiPromise as s,Keyring as r}from"@polkadot/api";import{WsProvider as o}from"@polkadot/rpc-provider/ws";import{options as c}from"@mangata-finance/types";import{encodeAddress as u}from"@polkadot/util-crypto";import{XoShiRo256Plus as g}from"mangata-prng-xoshiro";import d from"big.js";import{v4 as l}from"uuid";class w{static async getChain(t){return(await t.rpc.system.chain()).toHuman()}static async getNodeName(t){return(await t.rpc.system.name()).toHuman()}static async getNodeVersion(t){return(await t.rpc.system.version()).toHuman()}static async calculateRewardsAmount(a,i,s){const r=await a.rpc.xyk.calculate_rewards_amount(i,s);return t(r.price.toString())?e(r.price.toString()):new n(r.price)}static async calculateBuyPrice(t,e,a,i){const s=await t.rpc.xyk.calculate_buy_price(e,a,i);return new n(s.price)}static async calculateSellPrice(t,e,a,i){const s=await t.rpc.xyk.calculate_sell_price(e,a,i);return new n(s.price)}static async getBurnAmount(t,e,n,a){const i=await t.rpc.xyk.get_burn_amount(e,n,a);return JSON.parse(i.toString())}static async calculateSellPriceId(t,e,a,i){const s=await t.rpc.xyk.calculate_sell_price_id(e,a,i);return new n(s.price)}static async calculateBuyPriceId(t,e,a,i){const s=await t.rpc.xyk.calculate_buy_price_id(e,a,i);return new n(s.price)}}class y{static instance;db={};constructor(){}static getInstance(){return y.instance||(y.instance=new y),y.instance}hasAddressNonce=t=>!!this.db[t];setNonce=(t,e)=>{this.db[t]=e};getNonce=t=>this.db[t]}const m=y.getInstance(),p=async t=>(await t.query.assetsInfo.assetsInfo.entries()).reduce(((t,[e,n])=>{const a=n.toHuman(),i=e.toHuman()[0].replace(/[, ]/g,""),s={id:i,chainId:0,symbol:a.symbol,address:"MGA"===a.symbol?"0xc7e3bda797d2ceb740308ec40142ae235e08144a":"ETH"===a.symbol?"0x0000000000000000000000000000000000000000":a.description,name:a.symbol.includes("TKN")?"Liquidity Pool Token":a.name,decimals:Number(a.decimals)};return t[i]=s,t}),{}),h=async t=>(await t.query.xyk.liquidityAssets.entries()).reduce(((t,[e,n])=>{const a=e.args.map((t=>t.toHuman()))[0],i=n.toString().replace(/[, ]/g,"");return t[a]=i,t}),{}),k=async(a,i)=>(await a.query.tokens.accounts.entries(i)).reduce(((a,[i,s])=>{const r=JSON.parse(JSON.stringify(s)).free.toString(),o=JSON.parse(JSON.stringify(s)).frozen.toString(),c=JSON.parse(JSON.stringify(s)).reserved.toString(),u={free:t(r)?e(r):new n(r),frozen:t(o)?e(o):new n(o),reserved:t(c)?e(c):new n(c)};return a[i.toHuman()[1].replace(/[, ]/g,"")]=u,a}),{}),T=async t=>{const n=await p(t);return Object.values(n).filter((t=>"1"!==t.id&&"3"!==t.id)).reduce(((t,n)=>{const a={...n,symbol:n.symbol.includes("TKN")?n.symbol.split("-").reduce(((t,n)=>{const a=n.replace("TKN",""),i=a.startsWith("0x")?e(a).toString():a;return t.push(i),t}),[]).join("-"):n.symbol};return t[a.id]=a,t}),{})},I=new n("0"),f=new n("1"),A=new n("10"),S=new n("100"),x=new n("1000"),B=new n("10000"),b=new n("100000"),q=new n("1000000"),F=new n("10000000"),P=new n("100000000"),N=new n("1000000000"),v=new n("10000000000"),L=new n("100000000000"),R=new n("1000000000000"),O=18,C=new n("10").pow(new n(18)),M=async(t,e,a)=>{if(a.isZero())return I;const i=await t.query.tokens.totalIssuance(e),s=new n(i.toString());return a.mul(C).div(s)},$=(t,e)=>e.gt(I)?$(e,t.mod(e)):t,H=(t,e)=>{const n=((t,e)=>{const n=$(t,e);return n.isZero()?[I,I]:[t.div(n),e.div(n)]})(t,e);return n[1].mul(C).div(n[0])},E=async t=>{try{return(await t.query.issuance.promotedPoolsRewards.entries()).map((([t])=>t.args.map((t=>t.toHuman()))[0]))}catch(t){return[]}};class _{static async getNonce(t,e){return(await t.rpc.system.accountNextIndex(e)).toBn()}static async getAmountOfTokenIdInPool(a,i,s){const r=await a.query.xyk.pools([i,s]),o=r[0].toString(),c=r[1].toString();return[t(o)?e(o):new n(o),t(c)?e(c):new n(c)]}static async getLiquidityTokenId(t,e,i){const s=await t.query.xyk.liquidityAssets([e,i]);return s.isSome?new n(s.toString()):a}static async getLiquidityPool(t,e){const a=await t.query.xyk.liquidityPools(e);return a.isSome?a.unwrap().map((t=>new n(t))):[new n(-1),new n(-1)]}static async getTotalIssuance(t,e){const a=await t.query.tokens.totalIssuance(e);return new n(a)}static async getTokenBalance(a,i,s){const{free:r,reserved:o,frozen:c}=await a.query.tokens.accounts(i,s);return{free:t(r.toString())?e(r.toString()):new n(r.toString()),reserved:t(o.toString())?e(o.toString()):new n(o.toString()),frozen:t(c.toString())?e(c.toString()):new n(c.toString())}}static async getNextTokenId(t){const e=await t.query.tokens.nextCurrencyId();return new n(e)}static async getTokenInfo(t,e){return(await this.getAssetsInfo(t))[e]}static async getLiquidityTokenIds(t){return(await t.query.xyk.liquidityAssets.entries()).map((t=>t[1].toString()))}static async getLiquidityTokens(t){const e=await this.getAssetsInfo(t);return Object.values(e).reduce(((t,e)=>(e.name.includes("Liquidity Pool Token")&&(t[e.id]=e),t)),{})}static async getAssetsInfo(t){const n=await p(t);return Object.values(n).filter((t=>"1"!==t.id&&"3"!==t.id)).reduce(((t,a)=>{const i={...a,symbol:a.symbol.includes("TKN")?a.symbol.split("-").reduce(((t,a)=>{const i=a.replace("TKN",""),s=i.startsWith("0x")?e(i).toString():i,r=n[s].symbol;return t.push(r),t}),[]).join("-"):a.symbol};return t[i.id]=i,t}),{})}static async getBlockNumber(t){return(await t.rpc.chain.getBlock()).block.header.number.toString()}static async getOwnedTokens(t,e){if(!e)return null;const[n,a]=await Promise.all([this.getAssetsInfo(t),k(t,e)]);return Object.values(n).reduce(((t,e)=>(Object.keys(a).includes(e.id)&&(t[e.id]={...e,balance:a[e.id]}),t)),{})}static async getBalances(t){return(await t.query.tokens.totalIssuance.entries()).reduce(((t,[e,a])=>{const i=e.toHuman()[0].replace(/[, ]/g,""),s=new n(a.toString());return t[i]=s,t}),{})}static async getInvestedPools(t,e){const[n,a,i]=await Promise.all([T(t),k(t,e),E(t)]),s=Object.values(n).reduce(((t,e)=>(Object.keys(a).includes(e.id)&&e.name.includes("Liquidity Pool Token")&&t.push(e),t)),[]).map((async e=>{const n=a[e.id],s=e.symbol.split("-")[0],r=e.symbol.split("-")[1],[o,c]=await this.getAmountOfTokenIdInPool(t,s.toString(),r.toString());return{firstTokenId:s,secondTokenId:r,firstTokenAmount:o,secondTokenAmount:c,liquidityTokenId:e.id,isPromoted:i.includes(e.id),share:await M(t,e.id,n.free.add(n.reserved)),firstTokenRatio:H(o,c),secondTokenRatio:H(c,o),activatedLPTokens:n.reserved,nonActivatedLPTokens:n.free}}));return Promise.all(s)}static async getPool(t,e){const[n,a]=await Promise.all([this.getLiquidityPool(t,e),t.query.issuance.promotedPoolsRewards(e)]),[i,s]=n,[r,o]=await this.getAmountOfTokenIdInPool(t,i.toString(),s.toString());return{firstTokenId:i.toString(),secondTokenId:s.toString(),firstTokenAmount:r,secondTokenAmount:o,liquidityTokenId:e,isPromoted:a.gtn(0),firstTokenRatio:H(r,o),secondTokenRatio:H(o,r)}}static async getPools(a){const[i,s]=await Promise.all([T(a),h(a)]),r=await(async(a,i)=>(await a.query.xyk.pools.entries()).reduce(((a,[s,r])=>{const o=s.args.map((t=>t.toHuman()))[0],c=JSON.parse(JSON.stringify(r)).map((a=>t(a)?e(a):new n(a)));return a[i[o]]=c,a}),{}))(a,s),o=await E(a);return Object.values(i).reduce(((t,e)=>Object.values(s).includes(e.id)?t.concat(e):t),[]).map((t=>{const[e,n]=r[t.id];return{firstTokenId:t.symbol.split("-")[0],secondTokenId:t.symbol.split("-")[1],firstTokenAmount:e,secondTokenAmount:n,liquidityTokenId:t.id,firstTokenRatio:H(e,n),secondTokenRatio:H(n,e),isPromoted:o.includes(t.id)}}))}}function K(t){const{s0:e,s1:n,s2:a,s3:i}=function(t){return{s0:BigInt(t[0])<<BigInt(0)|BigInt(t[1])<<BigInt(8)|BigInt(t[2])<<BigInt(16)|BigInt(t[3])<<BigInt(24)|BigInt(t[4])<<BigInt(32)|BigInt(t[5])<<BigInt(40)|BigInt(t[6])<<BigInt(48)|BigInt(t[7])<<BigInt(56),s1:BigInt(t[8])<<BigInt(0)|BigInt(t[9])<<BigInt(8)|BigInt(t[10])<<BigInt(16)|BigInt(t[11])<<BigInt(24)|BigInt(t[12])<<BigInt(32)|BigInt(t[13])<<BigInt(40)|BigInt(t[14])<<BigInt(48)|BigInt(t[15])<<BigInt(56),s2:BigInt(t[16])<<BigInt(0)|BigInt(t[17])<<BigInt(8)|BigInt(t[18])<<BigInt(16)|BigInt(t[19])<<BigInt(24)|BigInt(t[20])<<BigInt(32)|BigInt(t[21])<<BigInt(40)|BigInt(t[22])<<BigInt(48)|BigInt(t[23])<<BigInt(56),s3:BigInt(t[24])<<BigInt(0)|BigInt(t[25])<<BigInt(8)|BigInt(t[26])<<BigInt(16)|BigInt(t[27])<<BigInt(24)|BigInt(t[28])<<BigInt(32)|BigInt(t[29])<<BigInt(40)|BigInt(t[30])<<BigInt(48)|BigInt(t[31])<<BigInt(56)}}(t);return new g(e,n,a,i)}class V{xoshiro;constructor(t){this.xoshiro=K(t)}next_u64(){const t=new n(this.xoshiro.nextBigInt(BigInt(4294967295)).toString()),e=new n(this.xoshiro.nextBigInt(BigInt(4294967295)).toString());return t.shln(32).or(e)}shuffle=t=>{for(let e=t.length-1;e>0;e--){const n=this.next_u64().modn(e+1),a=t[e];t[e]=t[n],t[n]=a}}}const J=t=>{if(!t)return"";const e=t.length;return t.substring(0,7)+"..."+t.substring(e-5,e)};const X=async(t,e,n,a)=>new Promise((async(i,s)=>{let r=[];const o="string"==typeof n?n:n.address,c=await(async(t,e,n)=>{let a;if(n&&n.nonce)a=n.nonce;else{const n=await _.getNonce(t,e);a=m.hasAddressNonce(e)?m.getNonce(e):n,n&&n.gt(a)&&(a=n);const i=a.addn(1);m.setNonce(e,i)}return a})(t,o,a);let u=0;try{const g=await e.signAndSend(n,{nonce:c,signer:a?.signer},(async n=>{if(console.info(`Tx[${J(e.hash.toString())}] => ${n.status.type}(${n.status.value.toString()})${function(t,e){if(!process.env.TX_VERBOSE)return"";const n=JSON.parse(e.method.toString()),a=JSON.stringify(n.args),i=t.registry.findMetaCall(e.method.callIndex);if("sudo"==i.method&&"sudo"==i.method){const a=e.method.args[0].callIndex,i=JSON.stringify(n.args.call.args),s=t.registry.findMetaCall(a);return` (sudo::${s.section}::${s.method}(${i})`}return` (${i.section}::${i.method}(${a}))`}(t,e)}`),a?.statusCallback?.(n),n.status.isFinalized){const c=n.status.asFinalized.toString(),d=(await t.rpc.chain.getHeader(c)).number.toBn(),l=d.addn(1),w=await t.rpc.chain.subscribeFinalizedHeads((async n=>{if(n.number.toBn().gt(d)){const n=await t.rpc.chain.getBlockHash(l),o=await t.rpc.chain.getHeader(n);w();const u=(await t.rpc.chain.getBlock(o.hash)).block.extrinsics,d=await t.query.system.events.at(o.hash),y=JSON.parse(o.toString()),m=Buffer.from(y.seed.seed.substring(2),"hex"),p=y.count,h=u.slice(0,p).filter((t=>!t.isSigned)),k=u.slice(p,u.length),T=h.concat(k),I=T.filter((t=>!t.isSigned)),f=((t,e)=>{let n=[];const a=new V(e),i=new Map;for(t.forEach((t=>{const e=t[0],n=t[1];i.has(e)?i.get(e).push(n):i.set(e,[n])}));0!=i.size;){const t=[],e=[];for(const t of i.entries())e.push(t[0]);e.sort();for(const n of e){const e=i.get(n);t.push(e.shift()),0==e.length&&i.delete(n)}a.shuffle(t),n=n.concat(t)}return n})(T.filter((t=>t.isSigned)).map((t=>[t.isSigned?t.signer.toString():"0000",t])),Uint8Array.from(m)),A=I.concat(f),S=A.findIndex((t=>t.hash.toString()===e.hash.toString()));S<0&&(T.forEach((t=>{console.info(`Tx ([${J(e.hash.toString())}]) origin ${t.hash.toString()}`)})),A.forEach((t=>{console.info(`Tx ([${J(e.hash.toString())}]) shuffled ${t.hash.toString()}`)})),s(`Tx ([${e.hash.toString()}])\n                      could not be find in the block\n                      $([${J(c)}])`));const x=d.filter((t=>t.phase.isApplyExtrinsic&&t.phase.asApplyExtrinsic.toNumber()===S)).map((e=>{const{event:n,phase:a}=e,i=n.typeDef,s=n.data.map(((t,e)=>({lookupName:i[e].lookupName,data:t})));return{event:n,phase:a,section:n.section,method:n.method,metaDocumentation:n.meta.docs.toString(),eventData:s,error:j(t,n.method,s)}}));r=r.concat(x),a?.extrinsicStatus?.(r),i(r),g()}else if(u++<10)console.info(`Retry [${u}] Tx: [${J(e.hash.toString())}] current: #${n.number} [${J(n.hash.toString())}] finalized in: #${d} [${J(c)}] `);else{w(),s(`Transaction was not finalized: Tx ([${J(e.hash.toString())}]): parent hash: ([${J(n.parentHash.toString())}]): Status finalized: ([${J(c)}])`);const a=await _.getNonce(t,o);m.setNonce(o,a),g()}}))}else if(n.isError){console.info("Transaction Error Result",JSON.stringify(n,null,2)),s(`Tx ([${J(e.hash.toString())}]) Transaction error`);const a=await _.getNonce(t,o);m.setNonce(o,a)}}))}catch(e){const n=await _.getNonce(t,o);m.setNonce(o,n),s({data:e.message||e.description||e.data?.toString()||e.toString()})}})),j=(e,a,s)=>{if("ExtrinsicFailed"===a){const a=s.find((t=>t.lookupName.includes("DispatchError")))?.data?.toHuman?.(),r=a?.Module?.error,o=a?.Module?.index;if(!r||!o)return{documentation:["Unknown error"],name:"UnknownError"};try{const a=e.registry.findMetaError({error:t(r)?i(r):new n(r),index:new n(o)});return{documentation:a.docs,name:a.name}}catch(t){return{documentation:["Unknown error"],name:"UnknownError"}}}return null};class U{static async sendKusamaTokenFromRelayToParachain(t,e,n,a,i,r){const c=new o(t),u=await new s({provider:c}).isReady,g={V1:{interior:{X1:{ParaChain:i}},parents:0}},d={V1:{interior:{X1:{AccountId32:{id:u.createType("AccountId32",n).toHex(),network:"Any"}}},parents:0}},l={V1:[{fun:{Fungible:a},id:{Concrete:{interior:"Here",parents:0}}}]};await u.tx.xcmPallet.reserveTransferAssets(g,d,l,0).signAndSend(e,{signer:r?.signer,nonce:r?.nonce})}static async sendKusamaTokenFromParachainToRelay(t,e,a,i,s){const r={V1:{parents:1,interior:{X1:{AccountId32:{network:"Any",id:t.createType("AccountId32",a).toHex()}}}}};await t.tx.xTokens.transfer("4",i,r,new n("6000000000")).signAndSend(e,{signer:s?.signer,nonce:s?.nonce})}static async sendTurTokenFromTuringToMangata(t,e,a,i,r,c){const g=new o(e),d=await new s({provider:g}).isReady,l=u(i,42),w={V1:{id:{Concrete:{parents:1,interior:{X1:{Parachain:2114}}}},fun:{Fungible:r}}},y={V1:{parents:1,interior:{X2:[{Parachain:2110},{AccountId32:{network:"Any",id:t.createType("AccountId32",l).toHex()}}]}}};await d.tx.xTokens.transferMultiasset(w,y,new n("4000000000")).signAndSend(a,{signer:c?.signer,nonce:c?.nonce})}static async sendTurTokenFromMangataToTuring(t,e,a,i,s){const r=u(a,42),o={V1:{parents:1,interior:{X2:[{Parachain:2114},{AccountId32:{network:"Any",id:t.createType("AccountId32",r).toHex()}}]}}};await X(t,t.tx.xTokens.transfer("7",i,o,new n("6000000000")),e,s)}static async activateLiquidity(t,e,n,a,i){return await X(t,t.tx.xyk.activateLiquidity(n,a,null),e,i)}static async deactivateLiquidity(t,e,n,a,i){return await X(t,t.tx.xyk.deactivateLiquidity(n,a),e,i)}static async claimRewards(t,e,n,a,i){return await X(t,t.tx.xyk.claimRewards(n,a),e,i)}static async createPool(t,e,n,a,i,s,r){return await X(t,t.tx.xyk.createPool(n,a,i,s),e,r)}static async sellAsset(t,e,n,a,i,s,r){return await X(t,t.tx.xyk.sellAsset(n,a,i,s),e,r)}static async buyAsset(t,e,n,a,i,s,r){return await X(t,t.tx.xyk.buyAsset(n,a,i,s),e,r)}static async mintLiquidity(t,e,n,a,i,s,r){return await X(t,t.tx.xyk.mintLiquidity(n,a,i,s),e,r)}static async burnLiquidity(t,e,n,a,i,s){return await X(t,t.tx.xyk.burnLiquidity(n,a,i),e,s)}static async transferToken(t,e,n,a,i,s){return await X(t,t.tx.tokens.transfer(a,n,i),e,s)}static async transferAllToken(t,e,n,a,i){return await X(t,t.tx.tokens.transferAll(a,n,!0),e,i)}}const z=d("0"),D=d("1"),W=d("10"),Z=d("100"),G=d("1000"),Q=d("10000"),Y=d("100000"),tt=d("1000000"),et=d("10000000"),nt=d("100000000"),at=d("1000000000"),it=d("10000000000"),st=d("100000000000"),rt=d("1000000000000");d.PE=256,d.NE=-256,d.DP=40,d.RM=d.roundUp;const ot=W.pow(18),ct=(t,e)=>{if(!t)return I;try{const a=d(t),i=e&&18!==e?W.pow(e):ot,s=a.mul(i).toString();return/\D/gm.test(s)?I:new n(s)}catch(t){return I}},ut=(t,e)=>{if(!t)return"0";try{const n=d(t.toString()),a=e&&18!==e?W.pow(e):ot,i=n.div(a);return i.toString()}catch(t){return"0"}};class gt{static async sendTurTokenFromTuringToMangataFee(t,e,a,i,r){const c=new o(e),g=await new s({provider:c}).isReady,d=u(i,42),l={V1:{id:{Concrete:{parents:1,interior:{X1:{Parachain:2114}}}},fun:{Fungible:r}}},w={V1:{parents:1,interior:{X2:[{Parachain:2110},{AccountId32:{network:"Any",id:t.createType("AccountId32",d).toHex()}}]}}},y=await g.tx.xTokens.transferMultiasset(l,w,new n("4000000000")).paymentInfo(a);return ut(new n(y.partialFee.toString()),10)}static async sendTurTokenFromMangataToTuringFee(t,e,a,i){const s=u(a,42),r={V1:{parents:1,interior:{X2:[{Parachain:2114},{AccountId32:{network:"Any",id:t.createType("AccountId32",s).toHex()}}]}}},o=await t.tx.xTokens.transfer("7",i,r,new n("6000000000")).paymentInfo(e);return ut(new n(o.partialFee.toString()))}static async sendKusamaTokenFromRelayToParachainFee(t,e,a,i,r){const c=new o(t),g=await new s({provider:c}).isReady,d={V1:{interior:{X1:{ParaChain:r}},parents:0}},l={V1:{interior:{X1:{AccountId32:{id:g.createType("AccountId32",u(a,42)).toHex(),network:"Any"}}},parents:0}},w={V1:[{fun:{Fungible:i},id:{Concrete:{interior:"Here",parents:0}}}]},y=await g.tx.xcmPallet.reserveTransferAssets(d,l,w,0).paymentInfo(e);return ut(new n(y.partialFee.toString()),12)}static async sendKusamaTokenFromParachainToRelayFee(t,e,a,i){const s={V1:{parents:1,interior:{X1:{AccountId32:{network:"Any",id:t.createType("AccountId32",u(a,2)).toHex()}}}}},r=await t.tx.xTokens.transfer("4",i,s,new n("6000000000")).paymentInfo(e);return ut(new n(r.partialFee.toString()))}static async activateLiquidity(t,e,a,i){const s=await t.tx.xyk.activateLiquidity(a,i,null).paymentInfo(e);return ut(new n(s.partialFee.toString()))}static async deactivateLiquidity(t,e,a,i){const s=await t.tx.xyk.deactivateLiquidity(a,i).paymentInfo(e);return ut(new n(s.partialFee.toString()))}static async claimRewardsFee(t,e,a,i){const s=await t.tx.xyk.claimRewards(a,i).paymentInfo(e);return ut(new n(s.partialFee.toString()))}static async createPoolFee(t,e,a,i,s,r){const o=await t.tx.xyk.createPool(a,i,s,r).paymentInfo(e);return ut(new n(o.partialFee.toString()))}static async sellAssetFee(t,e,a,i,s,r){const o=await t.tx.xyk.sellAsset(a,i,s,r).paymentInfo(e);return ut(new n(o.partialFee.toString()))}static async buyAssetFee(t,e,a,i,s,r){const o=await t.tx.xyk.buyAsset(a,i,s,r).paymentInfo(e);return ut(new n(o.partialFee.toString()))}static async mintLiquidityFee(t,e,a,i,s,r=new n(Number.MAX_SAFE_INTEGER)){const o=await t.tx.xyk.mintLiquidity(a,i,s,r).paymentInfo(e);return ut(new n(o.partialFee.toString()))}static async burnLiquidityFee(t,e,a,i,s){const r=await t.tx.xyk.burnLiquidity(a,i,s).paymentInfo(e);return ut(new n(r.partialFee.toString()))}static async transferTokenFee(t,e,a,i,s){const r=await t.tx.tokens.transfer(i,a,s).paymentInfo(e);return ut(new n(r.partialFee.toString()))}static async transferAllTokenFee(t,e,a,i){const s=await t.tx.tokens.transferAll(i,a,!0).paymentInfo(e);return ut(new n(s.partialFee.toString()))}}const dt=(t,e,a,i,s)=>{const r=e.sub(a),o=new n(t).mul(r),c=new n(s).mul(new n(106)).div(new n(6)),u=d(1e4),g=d(1.06).pow(r.toNumber()).mul(u).round(0,0),l=(""+g.toString()).replace(/(-?)(\d*)\.?(\d+)e([+-]\d+)/,(function(t,e,n,a,i){return i<0?e+"0."+Array(1-i-n.length).join("0")+n+a:e+n+a+Array(i-a.length+1).join("0")}));const w=new n(c).sub(new n(c).mul(new n(u.toString())).div(new n(l))),y=new n(o).sub(w);return new n(i).add(y)},lt=async(t,e,a,i,s)=>{const{lastCheckpoint:r,cummulativeWorkInLastCheckpoint:o,missingAtLastCheckpoint:c}=await(async(t,e,a,i)=>{const[s,r,o]=await i.query.xyk.liquidityMiningUser([t,e]);return new n(s.toString()).eq(new n(0))&&new n(r.toString()).eq(new n(0))&&new n(o.toString()).eq(new n(0))?{lastCheckpoint:a,cummulativeWorkInLastCheckpoint:d(0),missingAtLastCheckpoint:d(0)}:{lastCheckpoint:d(s.toString()),cummulativeWorkInLastCheckpoint:d(r.toString()),missingAtLastCheckpoint:d(o.toString())}})(t,a,i,s);return dt(e,i,new n(r.toString()),new n(o.toString()),new n(c.toString()))},wt=async(t,e,a,i)=>{const{lastCheckpoint:s,cummulativeWorkInLastCheckpoint:r,missingAtLastCheckpoint:o}=await(async(t,e,a)=>{const[i,s,r]=await a.query.xyk.liquidityMiningPool(t);return new n(i.toString()).eq(new n(0))&&new n(s.toString()).eq(new n(0))&&new n(r.toString()).eq(new n(0))?{lastCheckpoint:e,cummulativeWorkInLastCheckpoint:new n(0),missingAtLastCheckpoint:new n(0)}:{lastCheckpoint:new n(i.toString()),cummulativeWorkInLastCheckpoint:new n(s.toString()),missingAtLastCheckpoint:new n(r.toString())}})(e,a,i);return dt(t,a,new n(s.toString()),new n(r.toString()),new n(o.toString()))};class yt{api;urls;static instanceMap=new Map;constructor(t){this.urls=t,this.api=(async()=>await this.connectToNode(t))()}async connectToNode(t){const e=new o(t,5e3);return await s.create(c({provider:e,throwOnConnect:!0,throwOnUnknown:!0}))}static getInstance(t){return yt.instanceMap.has(JSON.stringify(t))||yt.instanceMap.set(JSON.stringify(t),new yt(t)),yt.instanceMap.get(JSON.stringify(t))}async getApi(){return this.api||(this.api=this.connectToNode(this.urls)),this.api}getUrls(){return this.urls}async waitForNewBlock(t){let e=0;const n=await this.getApi(),a=t||2;return new Promise((async t=>{const i=await n.rpc.chain.subscribeNewHeads((()=>{++e===a&&(i(),t(!0))}))}))}async getChain(){const t=await this.getApi();return w.getChain(t)}async getNodeName(){const t=await this.getApi();return w.getNodeName(t)}async getNodeVersion(){const t=await this.getApi();return w.getNodeVersion(t)}async getNonce(t){const e=await this.getApi();return _.getNonce(e,t)}async disconnect(){const t=await this.getApi();await t.disconnect()}async sendKusamaTokenFromRelayToParachain(t,e,n,a,i=2110,s){return await U.sendKusamaTokenFromRelayToParachain(t,e,n,a,i,s)}async sendKusamaTokenFromRelayToParachainFee(t,e,n,a,i=2110){return await gt.sendKusamaTokenFromRelayToParachainFee(t,e,n,a,i)}async sendKusamaTokenFromParachainToRelay(t,e,n,a){const i=await this.getApi();return await U.sendKusamaTokenFromParachainToRelay(i,t,e,n,a)}async sendKusamaTokenFromParachainToRelayFee(t,e,n){const a=await this.getApi();return await gt.sendKusamaTokenFromParachainToRelayFee(a,t,e,n)}async sendTurTokenFromTuringToMangata(t,e,n,a,i){const s=await this.getApi();return await U.sendTurTokenFromTuringToMangata(s,t,e,n,a,i)}async sendTurTokenFromMangataToTuring(t,e,n,a){const i=await this.getApi();return await U.sendTurTokenFromMangataToTuring(i,t,e,n,a)}async sendTurTokenFromTuringToMangataFee(t,e,n,a){const i=await this.getApi();return await gt.sendTurTokenFromTuringToMangataFee(i,t,e,n,a)}async sendTurTokenFromMangataToTuringFee(t,e,n){const a=await this.getApi();return await gt.sendTurTokenFromMangataToTuringFee(a,t,e,n)}async activateLiquidity(t,e,n,a){const i=await this.getApi();return await U.activateLiquidity(i,t,e,n,a)}async deactivateLiquidity(t,e,n,a){const i=await this.getApi();return await U.deactivateLiquidity(i,t,e,n,a)}async calculateFutureRewardsAmount(t,e,a){const i=await this.getApi();return await(async(t,e,a,i)=>{const s=await t.rpc.chain.getBlock(),r=new n(s.block.header.number.toString()),o=r.add(new n(i)).div(new n(1e4)),c=await t.query.xyk.liquidityMiningActiveUser([e,new n(a)]),u=await t.query.xyk.liquidityMiningActivePool(new n(a)),g=await lt(e,new n(c.toString()),a,o,t),d=await wt(new n(u.toString()),a,o,t),l=await t.query.xyk.liquidityMiningUserToBeClaimed([e,a]),w=await t.query.xyk.liquidityMiningUserClaimed([e,a]),y=await t.query.issuance.promotedPoolsRewards(a),m=new n(y.toString()),p=new n("136986000000000000000000"),h=i.sub(r).div(new n(1200)),k=await t.query.issuance.promotedPoolsRewards.entries(),T=m.add(p.mul(h).div(new n(k.length)));let I=new n(0);return g.gt(new n(0))&&d.gt(new n(0))&&(I=T.mul(g).div(d)),I.add(new n(l.toString())).sub(new n(w.toString()))})(i,t,e,a)}async calculateRewardsAmount(t,e){const n=await this.getApi();return await w.calculateRewardsAmount(n,t,e)}async claimRewardsFee(t,e,n){const a=await this.getApi();return await gt.claimRewardsFee(a,t,e,n)}async claimRewards(t,e,n,a){const i=await this.getApi();return await U.claimRewards(i,t,e,n,a)}async createPoolFee(t,e,n,a,i){const s=await this.getApi();return await gt.createPoolFee(s,t,e,n,a,i)}async createPool(t,e,n,a,i,s){const r=await this.getApi();return await U.createPool(r,t,e,n,a,i,s)}async sellAssetFee(t,e,n,a,i){const s=await this.getApi();return await gt.sellAssetFee(s,t,e,n,a,i)}async sellAsset(t,e,n,a,i,s){const r=await this.getApi();return await U.sellAsset(r,t,e,n,a,i,s)}async mintLiquidityFee(t,e,n,a,i){const s=await this.getApi();return await gt.mintLiquidityFee(s,t,e,n,a,i)}async mintLiquidity(t,e,n,a,i,s){const r=await this.getApi();return await U.mintLiquidity(r,t,e,n,a,i,s)}async burnLiquidityFee(t,e,n,a){const i=await this.getApi();return await gt.burnLiquidityFee(i,t,e,n,a)}async burnLiquidity(t,e,n,a,i){const s=await this.getApi();return await U.burnLiquidity(s,t,e,n,a,i)}async buyAssetFee(t,e,n,a,i){const s=await this.getApi();return await gt.buyAssetFee(s,t,e,n,a,i)}async buyAsset(t,e,n,a,i,s){const r=await this.getApi();return await U.buyAsset(r,t,e,n,a,i,s)}async calculateBuyPrice(t,e,n){const a=await this.getApi();return await w.calculateBuyPrice(a,t,e,n)}async calculateSellPrice(t,e,n){const a=await this.getApi();return await w.calculateSellPrice(a,t,e,n)}async getBurnAmount(t,e,n){const a=await this.getApi();return await w.getBurnAmount(a,t,e,n)}async calculateSellPriceId(t,e,n){const a=await this.getApi();return await w.calculateSellPriceId(a,t,e,n)}async calculateBuyPriceId(t,e,n){const a=await this.getApi();return await w.calculateBuyPriceId(a,t,e,n)}async getAmountOfTokenIdInPool(t,e){const n=await this.getApi();return await _.getAmountOfTokenIdInPool(n,t,e)}async getLiquidityTokenId(t,e){const n=await this.getApi();return await _.getLiquidityTokenId(n,t,e)}async getLiquidityPool(t){const e=await this.getApi();return await _.getLiquidityPool(e,t)}async transferTokenFee(t,e,n,a){const i=await this.getApi();return await gt.transferTokenFee(i,t,e,n,a)}async transferToken(t,e,n,a,i){const s=await this.getApi();return await U.transferToken(s,t,e,n,a,i)}async transferTokenAllFee(t,e,n){const a=await this.getApi();return await gt.transferAllTokenFee(a,t,e,n)}async transferTokenAll(t,e,n,a){const i=await this.getApi();return await U.transferAllToken(i,t,e,n,a)}async getTotalIssuance(t){const e=await this.getApi();return await _.getTotalIssuance(e,t)}async getTokenBalance(t,e){const n=await this.getApi();return await _.getTokenBalance(n,e,t)}async getNextTokenId(){const t=await this.getApi();return await _.getNextTokenId(t)}async getTokenInfo(t){const e=await this.getApi();return await _.getTokenInfo(e,t)}async getBlockNumber(){const t=await this.getApi();return await _.getBlockNumber(t)}async getOwnedTokens(t){const e=await this.getApi();return await _.getOwnedTokens(e,t)}async getLiquidityTokenIds(){const t=await this.getApi();return await _.getLiquidityTokenIds(t)}async getAssetsInfo(){const t=await this.getApi();return await _.getAssetsInfo(t)}async getBalances(){const t=await this.getApi();return await _.getBalances(t)}async getLiquidityTokens(){const t=await this.getApi();return await _.getLiquidityTokens(t)}async getPool(t){const e=await this.getApi();return await _.getPool(e,t)}async getInvestedPools(t){const e=await this.getApi();return await _.getInvestedPools(e,t)}async getPools(){const t=await this.getApi();return await _.getPools(t)}}const mt=(t,e)=>{const n=new RegExp(`^-?\\d+(?:\\.\\d{0,${e}})?`,"gm");return(t.match(n)?.[0]||t).match(/^0*(\d+(?:\.(?:(?!0+$)\d)+)?)/gm)?.[0]??t},pt=t=>{const e=+t;return!(!t||isNaN(Number(t))||isNaN(e)||e<0)};class ht{static createKeyring(t){return new r({type:t})}static createKeyPairFromName(t,e=""){const n=e||"//testUser_"+l(),a=t.createFromUri(n);return t.addPair(a),a}static getXoshiro(t){return K(t)}static getPriceImpact(t,e,n,a){if(!(t&&e&&pt(n)&&pt(a)))return;const i=t.firstTokenBalance,s=t.secondTokenBalance,r=ct(n,e.firstTokenDecimals),o=ct(a,e.secondTokenDecimals);if(o.gte(s))return"";const c=i.add(r).mul(B).mul(s),u=s.sub(o).mul(i),g=c.div(u).sub(B).toString(),l=d(g);return mt(l.div(Z).toString(),2)}}export{at as BIG_BILLION,Z as BIG_HUNDRED,st as BIG_HUNDRED_BILLIONS,nt as BIG_HUNDRED_MILLIONS,Y as BIG_HUNDRED_THOUSAND,tt as BIG_MILLION,D as BIG_ONE,W as BIG_TEN,it as BIG_TEN_BILLIONS,et as BIG_TEN_MILLIONS,Q as BIG_TEN_THOUSAND,G as BIG_THOUSAND,rt as BIG_TRILLION,z as BIG_ZERO,N as BN_BILLION,C as BN_DIV_NUMERATOR_MULTIPLIER,O as BN_DIV_NUMERATOR_MULTIPLIER_DECIMALS,S as BN_HUNDRED,L as BN_HUNDRED_BILLIONS,P as BN_HUNDRED_MILLIONS,b as BN_HUNDRED_THOUSAND,q as BN_MILLION,f as BN_ONE,A as BN_TEN,v as BN_TEN_BILLIONS,F as BN_TEN_MILLIONS,B as BN_TEN_THOUSAND,x as BN_THOUSAND,R as BN_TRILLION,I as BN_ZERO,yt as Mangata,ht as MangataHelpers,ut as fromBN,X as signTx,ct as toBN,mt as toFixed};
