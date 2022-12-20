import{isHex as t,hexToBn as e,BN as n,hexToString as a,BN_ZERO as i,hexToU8a as r}from"@polkadot/util";export{BN}from"@polkadot/util";import{ApiPromise as s,Keyring as o}from"@polkadot/api";import{WsProvider as c}from"@polkadot/rpc-provider/ws";import{options as u}from"@mangata-finance/types";import{encodeAddress as d}from"@polkadot/util-crypto";import y from"big.js";import{v4 as l}from"uuid";class w{static async getChain(t){return(await t.rpc.system.chain()).toHuman()}static async getNodeName(t){return(await t.rpc.system.name()).toHuman()}static async getNodeVersion(t){return(await t.rpc.system.version()).toHuman()}static async calculateRewardsAmount(a,i,r){const s=await a.rpc.xyk.calculate_rewards_amount(i,r);return t(s.price.toString())?e(s.price.toString()):new n(s.price)}static async calculateBuyPrice(t,e,a,i){const r=await t.rpc.xyk.calculate_buy_price(e,a,i);return new n(r.price)}static async calculateSellPrice(t,e,a,i){const r=await t.rpc.xyk.calculate_sell_price(e,a,i);return new n(r.price)}static async getBurnAmount(t,e,n,a){const i=await t.rpc.xyk.get_burn_amount(e,n,a);return JSON.parse(i.toString())}static async calculateSellPriceId(t,e,a,i){const r=await t.rpc.xyk.calculate_sell_price_id(e,a,i);return new n(r.price)}static async calculateBuyPriceId(t,e,a,i){const r=await t.rpc.xyk.calculate_buy_price_id(e,a,i);return new n(r.price)}}class g{static instance;db={};constructor(){}static getInstance(){return g.instance||(g.instance=new g),g.instance}hasAddressNonce=t=>!!this.db[t];setNonce=(t,e)=>{this.db[t]=e};getNonce=t=>this.db[t]}const m=g.getInstance(),p=async t=>(await t.query.assetRegistry.metadata.entries()).reduce(((t,[e,n])=>{const i=e.toHuman()[0].replace(/[, ]/g,""),{name:r,decimals:s,symbol:o}=n.unwrap(),c={id:i,chainId:0,decimals:Number(s.toString()),name:a(r.toString()),symbol:a(o.toString()),address:"MGA"===a(o.toString())?"0xc7e3bda797d2ceb740308ec40142ae235e08144a":"ETH"===a(o.toString())?"0x0000000000000000000000000000000000000000":""};return t[i]=c,t}),{}),T=async t=>(await t.query.xyk.liquidityAssets.entries()).reduce(((t,[e,n])=>{const a=e.args.map((t=>t.toHuman()))[0],i=n.toString().replace(/[, ]/g,"");return t[a]=i,t}),{}),k=async(a,i)=>(await a.query.tokens.accounts.entries(i)).reduce(((a,[i,r])=>{const s=JSON.parse(JSON.stringify(r)).free.toString(),o=JSON.parse(JSON.stringify(r)).frozen.toString(),c=JSON.parse(JSON.stringify(r)).reserved.toString(),u={free:t(s)?e(s):new n(s),frozen:t(o)?e(o):new n(o),reserved:t(c)?e(c):new n(c)};return a[i.toHuman()[1].replace(/[, ]/g,"")]=u,a}),{}),h=async t=>{const n=await p(t);return Object.values(n).filter((t=>"1"!==t.id&&"3"!==t.id)).reduce(((t,n)=>{const a={...n,name:n.name.replace(/0x\w+/,"").replace(/[A-Z]/g," $&").trim(),symbol:n.symbol.includes("TKN")?n.symbol.split("-").reduce(((t,n)=>{const a=n.replace("TKN",""),i=a.startsWith("0x")?e(a).toString():a;return t.push(i),t}),[]).join("-"):n.symbol};return t[a.id]=a,t}),{})},A=new n("0"),f=new n("1"),x=new n("10"),S=new n("100"),F=new n("1000"),I=new n("10000"),P=new n("100000"),b=new n("1000000"),N=new n("10000000"),v=new n("100000000"),q=new n("1000000000"),R=new n("10000000000"),L=new n("100000000000"),M=new n("1000000000000"),O=18,H=new n("10").pow(new n(18)),B=async(t,e,a)=>{if(a.isZero())return A;const i=await t.query.tokens.totalIssuance(e),r=new n(i.toString());return a.mul(H).div(r)},V=(t,e)=>e.gt(A)?V(e,t.mod(e)):t,$=(t,e)=>{const n=((t,e)=>{const n=V(t,e);return n.isZero()?[A,A]:[t.div(n),e.div(n)]})(t,e);return n[1].mul(H).div(n[0])},E=async t=>{try{return(await t.query.issuance.promotedPoolsRewards.entries()).map((([t])=>t.args.map((t=>t.toHuman()))[0]))}catch(t){return[]}};class J{static async getNonce(t,e){return(await t.rpc.system.accountNextIndex(e)).toBn()}static async getAmountOfTokenIdInPool(a,i,r){const s=await a.query.xyk.pools([i,r]),o=s[0].toString(),c=s[1].toString();return[t(o)?e(o):new n(o),t(c)?e(c):new n(c)]}static async getLiquidityTokenId(t,e,a){const r=await t.query.xyk.liquidityAssets([e,a]);return r.isSome?new n(r.toString()):i}static async getLiquidityPool(t,e){const a=await t.query.xyk.liquidityPools(e);return a.isSome?a.unwrap().map((t=>new n(t))):[new n(-1),new n(-1)]}static async getTotalIssuance(t,e){const a=await t.query.tokens.totalIssuance(e);return new n(a)}static async getTokenBalance(a,i,r){const{free:s,reserved:o,frozen:c}=await a.query.tokens.accounts(i,r);return{free:t(s.toString())?e(s.toString()):new n(s.toString()),reserved:t(o.toString())?e(o.toString()):new n(o.toString()),frozen:t(c.toString())?e(c.toString()):new n(c.toString())}}static async getNextTokenId(t){const e=await t.query.tokens.nextCurrencyId();return new n(e)}static async getTokenInfo(t,e){return(await this.getAssetsInfo(t))[e]}static async getLiquidityTokenIds(t){return(await t.query.xyk.liquidityAssets.entries()).map((t=>t[1].toString()))}static async getLiquidityTokens(t){const e=await this.getAssetsInfo(t);return Object.values(e).reduce(((t,e)=>(e.name.includes("Liquidity Pool Token")&&(t[e.id]=e),t)),{})}static async getAssetsInfo(t){const n=await p(t);return Object.values(n).filter((t=>!["1","3","6"].includes(t.id))).reduce(((t,a)=>{const i={...a,name:a.name.replace(/0x\w+/,"").replace(/[A-Z]/g," $&").trim(),symbol:a.symbol.includes("TKN")?a.symbol.split("-").reduce(((t,a)=>{const i=a.replace("TKN",""),r=i.startsWith("0x")?e(i).toString():i,s=n[r].symbol;return t.push(s),t}),[]).join("-"):a.symbol};return t[i.id]=i,t}),{})}static async getBlockNumber(t){return(await t.rpc.chain.getBlock()).block.header.number.toString()}static async getOwnedTokens(t,e){if(!e)return null;const[n,a]=await Promise.all([this.getAssetsInfo(t),k(t,e)]);return Object.values(n).reduce(((t,e)=>(Object.keys(a).includes(e.id)&&(t[e.id]={...e,balance:a[e.id]}),t)),{})}static async getBalances(t){return(await t.query.tokens.totalIssuance.entries()).reduce(((t,[e,a])=>{const i=e.toHuman()[0].replace(/[, ]/g,""),r=new n(a.toString());return t[i]=r,t}),{})}static async getInvestedPools(t,e){const[n,a,i]=await Promise.all([h(t),k(t,e),E(t)]),r=Object.values(n).reduce(((t,e)=>(Object.keys(a).includes(e.id)&&e.name.includes("Liquidity Pool Token")&&t.push(e),t)),[]).map((async e=>{const n=a[e.id],r=e.symbol.split("-")[0],s=e.symbol.split("-")[1],[o,c]=await this.getAmountOfTokenIdInPool(t,r.toString(),s.toString());return{firstTokenId:r,secondTokenId:s,firstTokenAmount:o,secondTokenAmount:c,liquidityTokenId:e.id,isPromoted:i.includes(e.id),share:await B(t,e.id,n.free.add(n.reserved)),firstTokenRatio:$(o,c),secondTokenRatio:$(c,o),activatedLPTokens:n.reserved,nonActivatedLPTokens:n.free}}));return Promise.all(r)}static async getPool(t,e){const[n,a]=await Promise.all([this.getLiquidityPool(t,e),t.query.issuance.promotedPoolsRewards(e)]),[i,r]=n,[s,o]=await this.getAmountOfTokenIdInPool(t,i.toString(),r.toString());return{firstTokenId:i.toString(),secondTokenId:r.toString(),firstTokenAmount:s,secondTokenAmount:o,liquidityTokenId:e,isPromoted:a.gtn(0),firstTokenRatio:$(s,o),secondTokenRatio:$(o,s)}}static async getPools(a){const[i,r]=await Promise.all([h(a),T(a)]),s=await(async(a,i)=>(await a.query.xyk.pools.entries()).reduce(((a,[r,s])=>{const o=r.args.map((t=>t.toHuman()))[0],c=JSON.parse(JSON.stringify(s)).map((a=>t(a)?e(a):new n(a)));return a[i[o]]=c,a}),{}))(a,r),o=await E(a);return Object.values(i).reduce(((t,e)=>Object.values(r).includes(e.id)?t.concat(e):t),[]).map((t=>{const[e,n]=s[t.id];return{firstTokenId:t.symbol.split("-")[0],secondTokenId:t.symbol.split("-")[1],firstTokenAmount:e,secondTokenAmount:n,liquidityTokenId:t.id,firstTokenRatio:$(e,n),secondTokenRatio:$(n,e),isPromoted:o.includes(t.id)}}))}}const _=async(t,e,n,a)=>new Promise((async(i,r)=>{const s="string"==typeof n?n:n.address,o=await(async(t,e,n)=>{let a;if(n&&n.nonce)a=n.nonce;else{const n=await J.getNonce(t,e);a=m.hasAddressNonce(e)?m.getNonce(e):n,n&&n.gt(a)&&(a=n);const i=a.addn(1);m.setNonce(e,i)}return a})(t,s,a);await e.signAsync(n,{nonce:o,signer:a?.signer}),console.info(`submitting Tx[${e.hash.toString()}]who: ${s} nonce: ${o.toString()} `);try{const n=await e.send((async c=>{if(console.info(`Tx[${e.hash.toString()}]who: ${s} nonce: ${o.toString()} => ${c.status.type}(${c.status.value.toString()})${function(t,e){if(!process.env.TX_VERBOSE)return"";const n=JSON.parse(e.method.toString()),a=JSON.stringify(n.args),i=t.registry.findMetaCall(e.method.callIndex);if("sudo"==i.method&&"sudo"==i.method){const a=e.method.args[0].callIndex,i=JSON.stringify(n.args.call.args),r=t.registry.findMetaCall(a);return` (sudo:: ${r.section}:: ${r.method}(${i})`}return` (${i.section}:: ${i.method}(${a}))`}(t,e)}`),a?.statusCallback?.(c),c.status.isInBlock){const u=c.status.asInBlock.toString(),d=(await t.rpc.chain.getHeader(u)).number.toBn(),y=d.addn(1),l=d.addn(10),w=y,g=await t.rpc.chain.subscribeNewHeads((async c=>{const u=c.number.toBn();if(w.gt(l)){g(),r(`Tx([${e.hash.toString()}])\n                      was not executed in blocks : ${y.toString()}..${l.toString()}`);const a=await J.getNonce(t,s);return m.setNonce(s,a),void n()}if(u.gte(w)){const r=await t.rpc.chain.getBlockHash(w),c=await t.rpc.chain.getHeader(r),u=(await t.rpc.chain.getBlock(c.hash)).block.extrinsics,d=await t.query.system.events.at(c.hash);w.iaddn(1);const y=u.findIndex((t=>t.hash.toString()===e.hash.toString()));if(y<0)return void console.info(`Tx([${e.hash.toString()}]) not found in block ${w} $([${(t=>{if(!t)return"";const e=t.length;return t.substring(0,7)+"..."+t.substring(e-5,e)})(r.toString())}])`);g(),console.info(`Tx[${e.hash.toString()}]who:${s} nonce:${o.toString()} => Executed(${r.toString()})`);const l=d.filter((t=>t.phase.isApplyExtrinsic&&t.phase.asApplyExtrinsic.toNumber()===y)).map((e=>{const{event:n,phase:a}=e,i=n.typeDef,r=n.data.map(((t,e)=>({lookupName:i[e].lookupName,data:t})));return{event:n,phase:a,section:n.section,method:n.method,metaDocumentation:n.meta.docs.toString(),eventData:r,error:K(t,n.method,r)}}));a?.extrinsicStatus?.(l),i(l),n()}}))}else if(c.isError){console.info("Transaction Error Result",JSON.stringify(c,null,2)),r(`Tx([${e.hash.toString()}]) Transaction error`);const n=await J.getNonce(t,s);m.setNonce(s,n)}}))}catch(e){const n=await J.getNonce(t,s);m.setNonce(s,n),r({data:e.message||e.description||e.data?.toString()||e.toString()})}})),K=(e,a,i)=>{if("ExtrinsicFailed"===a){const a=i.find((t=>t.lookupName.includes("DispatchError")))?.data?.toHuman?.(),s=a?.Module?.error,o=a?.Module?.index;if(!s||!o)return{documentation:["Unknown error"],name:"UnknownError"};try{const a=e.registry.findMetaError({error:t(s)?r(s):new n(s),index:new n(o)});return{documentation:a.docs,name:a.name}}catch(t){return{documentation:["Unknown error"],name:"UnknownError"}}}return null};class X{static async sendKusamaTokenFromRelayToParachain(t,e,n,a,i,r){const o=new c(t),u=await new s({provider:o}).isReady,d={V1:{interior:{X1:{ParaChain:i}},parents:0}},y={V1:{interior:{X1:{AccountId32:{id:u.createType("AccountId32",n).toHex(),network:"Any"}}},parents:0}},l={V1:[{fun:{Fungible:a},id:{Concrete:{interior:"Here",parents:0}}}]};await u.tx.xcmPallet.reserveTransferAssets(d,y,l,0).signAndSend(e,{signer:r?.signer,nonce:r?.nonce})}static async sendKusamaTokenFromParachainToRelay(t,e,a,i,r){const s={V1:{parents:1,interior:{X1:{AccountId32:{network:"Any",id:t.createType("AccountId32",a).toHex()}}}}};await t.tx.xTokens.transfer("4",i,s,new n("6000000000")).signAndSend(e,{signer:r?.signer,nonce:r?.nonce})}static async sendTokenFromParachainToMangata(...t){const[e,a,i,r,o,u,y,l]=t,w=new c(a),g=await new s({provider:w}).isReady,m=d(u,42),p=(await e.query.assetRegistry.metadata.entries()).find((t=>t[1].value.symbol.toPrimitive()===i));if(p&&p[1].value.location){const{location:t}=p[1].unwrap(),e={V1:{id:{Concrete:{parents:"1",interior:JSON.parse(t.toString()).v1.interior}},fun:{Fungible:y}}},a={V1:{parents:1,interior:{X2:[{Parachain:2110},{AccountId32:{network:"Any",id:g.createType("AccountId32",m).toHex()}}]}}};await g.tx.xTokens.transferMultiasset(e,a,new n(r)).signAndSend(o,{signer:l?.signer,nonce:l?.nonce})}}static async sendTokenFromMangataToParachain(...t){const[e,a,i,r,s,o,c,u]=t,y=d(o,42),l=(await e.query.assetRegistry.metadata.entries()).find((t=>t[1].value.symbol.toPrimitive()===a));if(l&&l[1].value.location){const t=l[0].toHuman()[0].replace(/[, ]/g,""),a={V1:{parents:1,interior:{X2:[{Parachain:r},{AccountId32:{network:"Any",id:e.createType("AccountId32",y).toHex()}}]}}};await _(e,e.tx.xTokens.transfer(t,c,a,new n(i)),s,u)}}static async sendTurTokenFromTuringToMangata(t,e,a,i,r,o){const u=new c(e),y=await new s({provider:u}).isReady,l=d(i,42),w={V1:{id:{Concrete:{parents:1,interior:{X1:{Parachain:2114}}}},fun:{Fungible:r}}},g={V1:{parents:1,interior:{X2:[{Parachain:2110},{AccountId32:{network:"Any",id:t.createType("AccountId32",l).toHex()}}]}}};await y.tx.xTokens.transferMultiasset(w,g,new n("4000000000")).signAndSend(a,{signer:o?.signer,nonce:o?.nonce})}static async sendTurTokenFromMangataToTuring(t,e,a,i,r){const s=d(a,42),o={V1:{parents:1,interior:{X2:[{Parachain:2114},{AccountId32:{network:"Any",id:t.createType("AccountId32",s).toHex()}}]}}};await _(t,t.tx.xTokens.transfer("7",i,o,new n("6000000000")),e,r)}static async activateLiquidity(t,e,n,a,i){return await _(t,t.tx.xyk.activateLiquidityV2(n,a,null),e,i)}static async deactivateLiquidity(t,e,n,a,i){return await _(t,t.tx.xyk.deactivateLiquidityV2(n,a),e,i)}static async claimRewards(t,e,n,a,i){return await _(t,t.tx.xyk.claimRewardsV2(n,a),e,i)}static async createPool(t,e,n,a,i,r,s){return await _(t,t.tx.xyk.createPool(n,a,i,r),e,s)}static async sellAsset(t,e,n,a,i,r,s){return await _(t,t.tx.xyk.sellAsset(n,a,i,r),e,s)}static async buyAsset(t,e,n,a,i,r,s){return await _(t,t.tx.xyk.buyAsset(n,a,i,r),e,s)}static async mintLiquidity(t,e,n,a,i,r,s){return await _(t,t.tx.xyk.mintLiquidity(n,a,i,r),e,s)}static async burnLiquidity(t,e,n,a,i,r){return await _(t,t.tx.xyk.burnLiquidity(n,a,i),e,r)}static async transferToken(t,e,n,a,i,r){return await _(t,t.tx.tokens.transfer(a,n,i),e,r)}static async transferAllToken(t,e,n,a,i){return await _(t,t.tx.tokens.transferAll(a,n,!0),e,i)}}const C=y("0"),j=y("1"),U=y("10"),D=y("100"),Z=y("1000"),z=y("10000"),G=y("100000"),W=y("1000000"),Q=y("10000000"),Y=y("100000000"),tt=y("1000000000"),et=y("10000000000"),nt=y("100000000000"),at=y("1000000000000");y.PE=256,y.NE=-256,y.DP=40,y.RM=y.roundUp;const it=U.pow(18),rt=(t,e)=>{if(!t)return A;try{const a=y(t),i=e&&18!==e?U.pow(e):it,r=a.mul(i).toString();return/\D/gm.test(r)?A:new n(r)}catch(t){return A}},st=(t,e)=>{if(!t)return"0";try{const n=y(t.toString()),a=e&&18!==e?U.pow(e):it,i=n.div(a);return i.toString()}catch(t){return"0"}};class ot{static async sendTokenFromParachainToMangataFee(...t){const[e,a,i,r,o,u,y]=t,l=new c(a),w=await new s({provider:l}).isReady,g=d(u,42),m=(await e.query.assetRegistry.metadata.entries()).find((t=>t[1].value.symbol.toPrimitive()===i));if(m&&m[1].value.location){const{location:t,decimals:e}=m[1].unwrap(),a=JSON.parse(t.toString()),i=JSON.parse(e.toString()),s={V1:{id:{Concrete:{parents:"1",interior:a.v1.interior}},fun:{Fungible:y}}},c={V1:{parents:1,interior:{X2:[{Parachain:2110},{AccountId32:{network:"Any",id:w.createType("AccountId32",g).toHex()}}]}}},u=await w.tx.xTokens.transferMultiasset(s,c,new n(r)).paymentInfo(o);return st(new n(u.partialFee.toString()),Number(i))}return"0"}static async sendTokenFromMangataToParachainFee(...t){const[e,a,i,r,s,o,c]=t,u=d(o,42),y=(await e.query.assetRegistry.metadata.entries()).find((t=>t[1].value.symbol.toPrimitive()===a));if(y&&y[1].value.location){const t=y[0].toHuman()[0].replace(/[, ]/g,""),a={V1:{parents:1,interior:{X2:[{Parachain:r},{AccountId32:{network:"Any",id:e.createType("AccountId32",u).toHex()}}]}}},o=await e.tx.xTokens.transfer(t,c,a,new n(i)).paymentInfo(s);return st(new n(o.partialFee.toString()))}return"0"}static async sendTurTokenFromTuringToMangataFee(t,e,a,i,r){const o=new c(e),u=await new s({provider:o}).isReady,y=d(i,42),l={V1:{id:{Concrete:{parents:1,interior:{X1:{Parachain:2114}}}},fun:{Fungible:r}}},w={V1:{parents:1,interior:{X2:[{Parachain:2110},{AccountId32:{network:"Any",id:t.createType("AccountId32",y).toHex()}}]}}},g=await u.tx.xTokens.transferMultiasset(l,w,new n("4000000000")).paymentInfo(a);return st(new n(g.partialFee.toString()),10)}static async sendTurTokenFromMangataToTuringFee(t,e,a,i){const r=d(a,42),s={V1:{parents:1,interior:{X2:[{Parachain:2114},{AccountId32:{network:"Any",id:t.createType("AccountId32",r).toHex()}}]}}},o=await t.tx.xTokens.transfer("7",i,s,new n("6000000000")).paymentInfo(e);return st(new n(o.partialFee.toString()))}static async sendKusamaTokenFromRelayToParachainFee(t,e,a,i,r){const o=new c(t),u=await new s({provider:o}).isReady,y={V1:{interior:{X1:{ParaChain:r}},parents:0}},l={V1:{interior:{X1:{AccountId32:{id:u.createType("AccountId32",d(a,42)).toHex(),network:"Any"}}},parents:0}},w={V1:[{fun:{Fungible:i},id:{Concrete:{interior:"Here",parents:0}}}]},g=await u.tx.xcmPallet.reserveTransferAssets(y,l,w,0).paymentInfo(e);return st(new n(g.partialFee.toString()),12)}static async sendKusamaTokenFromParachainToRelayFee(t,e,a,i){const r={V1:{parents:1,interior:{X1:{AccountId32:{network:"Any",id:t.createType("AccountId32",d(a,2)).toHex()}}}}},s=await t.tx.xTokens.transfer("4",i,r,new n("6000000000")).paymentInfo(e);return st(new n(s.partialFee.toString()))}static async activateLiquidity(t,e,a,i){const r=await t.tx.xyk.activateLiquidityV2(a,i,null).paymentInfo(e);return st(new n(r.partialFee.toString()))}static async deactivateLiquidity(t,e,a,i){const r=await t.tx.xyk.deactivateLiquidityV2(a,i).paymentInfo(e);return st(new n(r.partialFee.toString()))}static async claimRewardsFee(t,e,a,i){const r=await t.tx.xyk.claimRewardsV2(a,i).paymentInfo(e);return st(new n(r.partialFee.toString()))}static async createPoolFee(t,e,a,i,r,s){const o=await t.tx.xyk.createPool(a,i,r,s).paymentInfo(e);return st(new n(o.partialFee.toString()))}static async sellAssetFee(t,e,a,i,r,s){const o=await t.tx.xyk.sellAsset(a,i,r,s).paymentInfo(e);return st(new n(o.partialFee.toString()))}static async buyAssetFee(t,e,a,i,r,s){const o=await t.tx.xyk.buyAsset(a,i,r,s).paymentInfo(e);return st(new n(o.partialFee.toString()))}static async mintLiquidityFee(t,e,a,i,r,s=new n(Number.MAX_SAFE_INTEGER)){const o=await t.tx.xyk.mintLiquidity(a,i,r,s).paymentInfo(e);return st(new n(o.partialFee.toString()))}static async burnLiquidityFee(t,e,a,i,r){const s=await t.tx.xyk.burnLiquidity(a,i,r).paymentInfo(e);return st(new n(s.partialFee.toString()))}static async transferTokenFee(t,e,a,i,r){const s=await t.tx.tokens.transfer(i,a,r).paymentInfo(e);return st(new n(s.partialFee.toString()))}static async transferAllTokenFee(t,e,a,i){const r=await t.tx.tokens.transferAll(i,a,!0).paymentInfo(e);return st(new n(r.partialFee.toString()))}}class ct{api;urls;static instanceMap=new Map;constructor(t){this.urls=t,this.api=(async()=>await this.connectToNode(t))()}async connectToNode(t){const e=new c(t,5e3);return await s.create(u({provider:e,throwOnConnect:!0,throwOnUnknown:!0}))}static getInstance(t){return ct.instanceMap.has(JSON.stringify(t))||ct.instanceMap.set(JSON.stringify(t),new ct(t)),ct.instanceMap.get(JSON.stringify(t))}async getApi(){return this.api||(this.api=this.connectToNode(this.urls)),this.api}getUrls(){return this.urls}async waitForNewBlock(t){let e=0;const n=await this.getApi(),a=t||2;return new Promise((async t=>{const i=await n.rpc.chain.subscribeNewHeads((()=>{++e===a&&(i(),t(!0))}))}))}async getChain(){const t=await this.getApi();return w.getChain(t)}async getNodeName(){const t=await this.getApi();return w.getNodeName(t)}async getNodeVersion(){const t=await this.getApi();return w.getNodeVersion(t)}async getNonce(t){const e=await this.getApi();return J.getNonce(e,t)}async disconnect(){const t=await this.getApi();await t.disconnect()}async sendTokenFromParachainToMangata(t,e,n,a,i,r,s){const o=await this.getApi();return await X.sendTokenFromParachainToMangata(o,t,e,n,a,i,r,s)}async sendTokenFromMangataToParachain(t,e,n,a,i,r,s){const o=await this.getApi();return await X.sendTokenFromMangataToParachain(o,t,e,n,a,i,r,s)}async sendTokenFromParachainToMangataFee(t,e,n,a,i,r){const s=await this.getApi();return await ot.sendTokenFromParachainToMangataFee(s,t,e,n,a,i,r)}async sendTokenFromMangataToParachainFee(t,e,n,a,i,r){const s=await this.getApi();return await ot.sendTokenFromMangataToParachainFee(s,t,e,n,a,i,r)}async sendKusamaTokenFromRelayToParachain(t,e,n,a,i=2110,r){return await X.sendKusamaTokenFromRelayToParachain(t,e,n,a,i,r)}async sendKusamaTokenFromRelayToParachainFee(t,e,n,a,i=2110){return await ot.sendKusamaTokenFromRelayToParachainFee(t,e,n,a,i)}async sendKusamaTokenFromParachainToRelay(t,e,n,a){const i=await this.getApi();return await X.sendKusamaTokenFromParachainToRelay(i,t,e,n,a)}async sendKusamaTokenFromParachainToRelayFee(t,e,n){const a=await this.getApi();return await ot.sendKusamaTokenFromParachainToRelayFee(a,t,e,n)}async sendTurTokenFromTuringToMangata(t,e,n,a,i){const r=await this.getApi();return await X.sendTurTokenFromTuringToMangata(r,t,e,n,a,i)}async sendTurTokenFromMangataToTuring(t,e,n,a){const i=await this.getApi();return await X.sendTurTokenFromMangataToTuring(i,t,e,n,a)}async sendTurTokenFromTuringToMangataFee(t,e,n,a){const i=await this.getApi();return await ot.sendTurTokenFromTuringToMangataFee(i,t,e,n,a)}async sendTurTokenFromMangataToTuringFee(t,e,n){const a=await this.getApi();return await ot.sendTurTokenFromMangataToTuringFee(a,t,e,n)}async activateLiquidity(t,e,n,a){const i=await this.getApi();return await X.activateLiquidity(i,t,e,n,a)}async deactivateLiquidity(t,e,n,a){const i=await this.getApi();return await X.deactivateLiquidity(i,t,e,n,a)}async calculateFutureRewardsAmountForMinting(t,e,a){const i=await this.getApi();return await(async(t,e,a,i)=>{const r=new n("136986000000000000000000"),s=i.div(new n("1200")).mul(r),o=(await t.query.issuance.promotedPoolsRewardsV2()).toHuman(),c=Object.values(o).reduce(((t,e)=>t.add(new n(e.weight))),new n(0)),u=new n(o[e].weight.toString()),d=s.mul(u).div(c),y=await t.query.xyk.liquidityMiningActivePoolV2(e);return d.mul(a).div(new n(y.toString()).add(a))})(i,t,e,a)}async calculateRewardsAmount(t,e){const n=await this.getApi();return await w.calculateRewardsAmount(n,t,e)}async claimRewardsFee(t,e,n){const a=await this.getApi();return await ot.claimRewardsFee(a,t,e,n)}async claimRewards(t,e,n,a){const i=await this.getApi();return await X.claimRewards(i,t,e,n,a)}async createPoolFee(t,e,n,a,i){const r=await this.getApi();return await ot.createPoolFee(r,t,e,n,a,i)}async createPool(t,e,n,a,i,r){const s=await this.getApi();return await X.createPool(s,t,e,n,a,i,r)}async sellAssetFee(t,e,n,a,i){const r=await this.getApi();return await ot.sellAssetFee(r,t,e,n,a,i)}async sellAsset(t,e,n,a,i,r){const s=await this.getApi();return await X.sellAsset(s,t,e,n,a,i,r)}async mintLiquidityFee(t,e,n,a,i){const r=await this.getApi();return await ot.mintLiquidityFee(r,t,e,n,a,i)}async mintLiquidity(t,e,n,a,i,r){const s=await this.getApi();return await X.mintLiquidity(s,t,e,n,a,i,r)}async burnLiquidityFee(t,e,n,a){const i=await this.getApi();return await ot.burnLiquidityFee(i,t,e,n,a)}async burnLiquidity(t,e,n,a,i){const r=await this.getApi();return await X.burnLiquidity(r,t,e,n,a,i)}async buyAssetFee(t,e,n,a,i){const r=await this.getApi();return await ot.buyAssetFee(r,t,e,n,a,i)}async buyAsset(t,e,n,a,i,r){const s=await this.getApi();return await X.buyAsset(s,t,e,n,a,i,r)}async calculateBuyPrice(t,e,n){const a=await this.getApi();return await w.calculateBuyPrice(a,t,e,n)}async calculateSellPrice(t,e,n){const a=await this.getApi();return await w.calculateSellPrice(a,t,e,n)}async getBurnAmount(t,e,n){const a=await this.getApi();return await w.getBurnAmount(a,t,e,n)}async calculateSellPriceId(t,e,n){const a=await this.getApi();return await w.calculateSellPriceId(a,t,e,n)}async calculateBuyPriceId(t,e,n){const a=await this.getApi();return await w.calculateBuyPriceId(a,t,e,n)}async getAmountOfTokenIdInPool(t,e){const n=await this.getApi();return await J.getAmountOfTokenIdInPool(n,t,e)}async getLiquidityTokenId(t,e){const n=await this.getApi();return await J.getLiquidityTokenId(n,t,e)}async getLiquidityPool(t){const e=await this.getApi();return await J.getLiquidityPool(e,t)}async transferTokenFee(t,e,n,a){const i=await this.getApi();return await ot.transferTokenFee(i,t,e,n,a)}async transferToken(t,e,n,a,i){const r=await this.getApi();return await X.transferToken(r,t,e,n,a,i)}async transferTokenAllFee(t,e,n){const a=await this.getApi();return await ot.transferAllTokenFee(a,t,e,n)}async transferTokenAll(t,e,n,a){const i=await this.getApi();return await X.transferAllToken(i,t,e,n,a)}async getTotalIssuance(t){const e=await this.getApi();return await J.getTotalIssuance(e,t)}async getTokenBalance(t,e){const n=await this.getApi();return await J.getTokenBalance(n,e,t)}async getNextTokenId(){const t=await this.getApi();return await J.getNextTokenId(t)}async getTokenInfo(t){const e=await this.getApi();return await J.getTokenInfo(e,t)}async getBlockNumber(){const t=await this.getApi();return await J.getBlockNumber(t)}async getOwnedTokens(t){const e=await this.getApi();return await J.getOwnedTokens(e,t)}async getLiquidityTokenIds(){const t=await this.getApi();return await J.getLiquidityTokenIds(t)}async getAssetsInfo(){const t=await this.getApi();return await J.getAssetsInfo(t)}async getBalances(){const t=await this.getApi();return await J.getBalances(t)}async getLiquidityTokens(){const t=await this.getApi();return await J.getLiquidityTokens(t)}async getPool(t){const e=await this.getApi();return await J.getPool(e,t)}async getInvestedPools(t){const e=await this.getApi();return await J.getInvestedPools(e,t)}async getPools(){const t=await this.getApi();return await J.getPools(t)}}const ut=(t,e)=>{const n=new RegExp(`^-?\\d+(?:\\.\\d{0,${e}})?`,"gm");return(t.match(n)?.[0]||t).match(/^-?0*(\d+(?:\.(?:(?!0+$)\d)+)?)/gm)?.[0]??t},dt=t=>{const e=+t;return!(!t||isNaN(Number(t))||isNaN(e)||e<0)};class yt{static createKeyring(t){return new o({type:t})}static createKeyPairFromName(t,e=""){const n=e||"//testUser_"+l(),a=t.createFromUri(n);return t.addPair(a),a}static getPriceImpact(t,e,n,a){if(!(t&&e&&dt(n)&&dt(a)))return;const i=t.firstTokenBalance,r=t.secondTokenBalance,s=rt(n,e.firstTokenDecimals),o=rt(a,e.secondTokenDecimals);if(o.gte(r))return"";const c=i.add(s).mul(I).mul(r),u=r.sub(o).mul(i),d=c.div(u).sub(I).toString(),l=y(d);return ut(l.div(D).toString(),2)}}export{tt as BIG_BILLION,D as BIG_HUNDRED,nt as BIG_HUNDRED_BILLIONS,Y as BIG_HUNDRED_MILLIONS,G as BIG_HUNDRED_THOUSAND,W as BIG_MILLION,j as BIG_ONE,U as BIG_TEN,et as BIG_TEN_BILLIONS,Q as BIG_TEN_MILLIONS,z as BIG_TEN_THOUSAND,Z as BIG_THOUSAND,at as BIG_TRILLION,C as BIG_ZERO,q as BN_BILLION,H as BN_DIV_NUMERATOR_MULTIPLIER,O as BN_DIV_NUMERATOR_MULTIPLIER_DECIMALS,S as BN_HUNDRED,L as BN_HUNDRED_BILLIONS,v as BN_HUNDRED_MILLIONS,P as BN_HUNDRED_THOUSAND,b as BN_MILLION,f as BN_ONE,x as BN_TEN,R as BN_TEN_BILLIONS,N as BN_TEN_MILLIONS,I as BN_TEN_THOUSAND,F as BN_THOUSAND,M as BN_TRILLION,A as BN_ZERO,ct as Mangata,yt as MangataHelpers,st as fromBN,_ as signTx,rt as toBN,ut as toFixed};
