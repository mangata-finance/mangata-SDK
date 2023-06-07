import{isHex as t,hexToBn as e,BN as n,hexToString as a,BN_ZERO as i,hexToU8a as r}from"@polkadot/util";export{BN}from"@polkadot/util";import{ApiPromise as s,Keyring as o}from"@polkadot/api";import{WsProvider as c}from"@polkadot/rpc-provider/ws";import{options as u}from"@mangata-finance/types";import{encodeAddress as d}from"@polkadot/util-crypto";import l from"big.js";import{v4 as y}from"uuid";class w{static async getChain(t){return(await t.rpc.system.chain()).toHuman()}static async getNodeName(t){return(await t.rpc.system.name()).toHuman()}static async getNodeVersion(t){return(await t.rpc.system.version()).toHuman()}static async calculateRewardsAmount(a,i,r){const s=await a.rpc.xyk.calculate_rewards_amount(i,r);return t(s.price.toString())?e(s.price.toString()):new n(s.price)}static async calculateBuyPrice(t,e,a,i){const r=await t.rpc.xyk.calculate_buy_price(e,a,i);return new n(r.price)}static async calculateSellPrice(t,e,a,i){const r=await t.rpc.xyk.calculate_sell_price(e,a,i);return new n(r.price)}static async getBurnAmount(t,e,n,a){const i=await t.rpc.xyk.get_burn_amount(e,n,a);return JSON.parse(i.toString())}static async calculateSellPriceId(t,e,a,i){const r=await t.rpc.xyk.calculate_sell_price_id(e,a,i);return new n(r.price)}static async calculateBuyPriceId(t,e,a,i){const r=await t.rpc.xyk.calculate_buy_price_id(e,a,i);return new n(r.price)}}class g{static instance;db={};constructor(){}static getInstance(){return g.instance||(g.instance=new g),g.instance}hasAddressNonce=t=>!!this.db[t];setNonce=(t,e)=>{this.db[t]=e};getNonce=t=>this.db[t]}const p=g.getInstance(),m=async t=>(await t.query.assetRegistry.metadata.entries()).reduce(((t,[e,n])=>{const i=e.toHuman()[0].replace(/[, ]/g,""),r=n.toHuman(),{name:s,decimals:o,symbol:c}=r,u={id:i,chainId:0,decimals:Number(o.toString()),name:s,symbol:c,address:"MGA"===a(c.toString())?"0xc7e3bda797d2ceb740308ec40142ae235e08144a":"ETH"===a(c.toString())?"0x0000000000000000000000000000000000000000":""};return t[i]=u,t}),{}),T=async t=>(await t.query.xyk.liquidityAssets.entries()).reduce(((t,[e,n])=>{const a=e.args.map((t=>t.toHuman()))[0],i=n.toString().replace(/[, ]/g,"");return t[a]=i,t}),{}),f=async(a,i)=>(await a.query.tokens.accounts.entries(i)).reduce(((a,[i,r])=>{const s=JSON.parse(JSON.stringify(r)).free.toString(),o=JSON.parse(JSON.stringify(r)).frozen.toString(),c=JSON.parse(JSON.stringify(r)).reserved.toString(),u={free:t(s)?e(s):new n(s),frozen:t(o)?e(o):new n(o),reserved:t(c)?e(c):new n(c)};return a[i.toHuman()[1].replace(/[, ]/g,"")]=u,a}),{}),k=async t=>{const n=await m(t);return Object.values(n).filter((t=>"1"!==t.id&&"3"!==t.id)).reduce(((t,n)=>{const a={...n,name:n.name.replace(/0x\w+/,"").replace(/[A-Z]/g," $&").trim(),symbol:n.symbol.includes("TKN")?n.symbol.split("-").reduce(((t,n)=>{const a=n.replace("TKN",""),i=a.startsWith("0x")?e(a).toString():a;return t.push(i),t}),[]).join("-"):n.symbol};return t[a.id]=a,t}),{})},h=new n("0"),A=new n("1"),S=new n("10"),x=new n("100"),I=new n("1000"),F=new n("10000"),N=new n("100000"),P=new n("1000000"),b=new n("10000000"),v=new n("100000000"),q=new n("1000000000"),O=new n("10000000000"),R=new n("100000000000"),M=new n("1000000000000"),L=18,H=new n("10").pow(new n(18)),B=(t,e)=>e.gt(h)?B(e,t.mod(e)):t,J=(t,e)=>{const n=((t,e)=>{const n=B(t,e);return n.isZero()?[h,h]:[t.div(n),e.div(n)]})(t,e);return n[1].mul(H).div(n[0])},V=async t=>{try{const e=(await t.query.proofOfStake.promotedPoolRewards()).toHuman();return Object.keys(e)}catch(t){return[]}};class K{static async getNonce(t,e){return(await t.rpc.system.accountNextIndex(e)).toBn()}static async getAmountOfTokenIdInPool(a,i,r){const s=JSON.parse(JSON.stringify(await a.query.xyk.pools([i,r])));return[t(s[0])?e(s[0]):new n(s[0]),t(s[1])?e(s[1]):new n(s[1])]}static async getLiquidityTokenId(t,e,a){const r=await t.query.xyk.liquidityAssets([e,a]);return r?new n(r.toString()):i}static async getLiquidityPool(t,e){const a=JSON.parse(JSON.stringify(await t.query.xyk.liquidityPools(e)));return a?a.map((t=>new n(t))):[new n(-1),new n(-1)]}static async getTotalIssuance(t,e){const a=await t.query.tokens.totalIssuance(e);return new n(a.toString())}static async getTokenBalance(a,i,r){const{free:s,reserved:o,frozen:c}=JSON.parse(JSON.stringify(await a.query.tokens.accounts(i,r)));return{free:t(s.toString())?e(s.toString()):new n(s.toString()),reserved:t(o.toString())?e(o.toString()):new n(o.toString()),frozen:t(c.toString())?e(c.toString()):new n(c.toString())}}static async getNextTokenId(t){const e=await t.query.tokens.nextCurrencyId();return new n(e.toString())}static async getTokenInfo(t,e){return(await this.getAssetsInfo(t))[e]}static async getLiquidityTokenIds(t){return(await t.query.xyk.liquidityAssets.entries()).map((t=>t[1].toString()))}static async getLiquidityTokens(t){const e=await this.getAssetsInfo(t);return Object.values(e).reduce(((t,e)=>(e.name.includes("Liquidity Pool Token")&&(t[e.id]=e),t)),{})}static async getAssetsInfo(t){const n=await m(t);return Object.values(n).filter((t=>!["1","3"].includes(t.id))).reduce(((t,a)=>{const i={...a,name:a.name.replace(/0x\w+/,"").replace(/[A-Z]/g,"$&").trim(),symbol:a.symbol.includes("TKN")?a.symbol.split("-").reduce(((t,a)=>{const i=a.replace("TKN",""),r=i.startsWith("0x")?e(i).toString():i,s=n[r].symbol;return t.push(s),t}),[]).join("-"):a.symbol};return t[i.id]=i,t}),{})}static async getBlockNumber(t){return(await t.rpc.chain.getBlock()).block.header.number.toString()}static async getOwnedTokens(t,e){if(!e)return null;const[n,a]=await Promise.all([this.getAssetsInfo(t),f(t,e)]);return Object.values(n).reduce(((t,e)=>(Object.keys(a).includes(e.id)&&(t[e.id]={...e,balance:a[e.id]}),t)),{})}static async getBalances(t){return(await t.query.tokens.totalIssuance.entries()).reduce(((t,[e,a])=>{const i=e.toHuman()[0].replace(/[, ]/g,""),r=new n(a.toString());return t[i]=r,t}),{})}static async getInvestedPools(t,e){const[a,r,s]=await Promise.all([k(t),f(t,e),V(t)]),o=Object.values(a).reduce(((t,e)=>(Object.keys(r).includes(e.id)&&e.name.includes("Liquidity Pool Token")&&t.push(e),t)),[]).map((async e=>{const a=r[e.id],o=e.symbol.split("-")[0],c=e.symbol.split("-")[1],[u,d]=await this.getAmountOfTokenIdInPool(t,o.toString(),c.toString()),l=await(async(t,e,a)=>{if(a.isZero())return h;const i=await t.query.tokens.totalIssuance(e),r=new n(i.toString());return a.mul(H).div(r)})(t,e.id,a.free.add(a.reserved));return{firstTokenId:o,secondTokenId:c,firstTokenAmount:u,secondTokenAmount:d,liquidityTokenId:e.id,isPromoted:s.includes(e.id),share:l,firstTokenRatio:l.eq(i)?i:J(u,d),secondTokenRatio:l.eq(i)?i:J(d,u),activatedLPTokens:a.reserved,nonActivatedLPTokens:a.free}}));return Promise.all(o)}static async getPool(t,e){const n=await this.getLiquidityPool(t,e),a=(await t.query.proofOfStake.promotedPoolRewards()).toHuman()[e],[i,r]=n,[s,o]=await this.getAmountOfTokenIdInPool(t,i.toString(),r.toString());return{firstTokenId:i.toString(),secondTokenId:r.toString(),firstTokenAmount:s,secondTokenAmount:o,liquidityTokenId:e,isPromoted:!!a,firstTokenRatio:J(s,o),secondTokenRatio:J(o,s)}}static async getPools(a){const[i,r]=await Promise.all([k(a),T(a)]),s=await(async(a,i)=>(await a.query.xyk.pools.entries()).reduce(((a,[r,s])=>{const o=r.args.map((t=>t.toHuman()))[0],c=JSON.parse(JSON.stringify(s)).map((a=>t(a)?e(a):new n(a)));return a[i[o]]=c,a}),{}))(a,r),o=await V(a);return Object.values(i).reduce(((t,e)=>Object.values(r).includes(e.id)?t.concat(e):t),[]).map((t=>{const[e,n]=s[t.id];return{firstTokenId:t.symbol.split("-")[0],secondTokenId:t.symbol.split("-")[1],firstTokenAmount:e,secondTokenAmount:n,liquidityTokenId:t.id,firstTokenRatio:J(e,n),secondTokenRatio:J(n,e),isPromoted:o.includes(t.id)}}))}}const $=(t,e)=>e?.meta.args.at(-1)?.type.eq("XcmV2WeightLimit")?{Limited:t}:t,X=(t,e)=>"BNC"===t?{parents:"0",interior:{x1:{generalKey:"0x0001"}}}:"vBNC"===t?{parents:"0",interior:{x1:{generalKey:"0x0101"}}}:"ZLK"===t?{parents:"0",interior:{x1:{generalKey:"0x0207"}}}:"vsKSM"===t?{parents:"0",interior:{x1:{generalKey:"0x0404"}}}:"vKSM"===t?{parents:"0",interior:{x1:{generalKey:"0x0104"}}}:"USDT"===t?{parents:"0",interior:{x2:[{PalletInstance:50},{GeneralIndex:1984}]}}:"RMRK"===t?{parents:"0",interior:{x2:[{PalletInstance:50},{GeneralIndex:8}]}}:{interior:e.v3.interior};const C=async(t,e,n,a)=>new Promise((async(i,r)=>{const s="string"==typeof n?n:n.address;let o=!1;const c=await(async(t,e,n)=>{let a;if(n&&n.nonce)a=n.nonce;else{const n=await K.getNonce(t,e);a=p.hasAddressNonce(e)?p.getNonce(e):n,n&&n.gt(a)&&(a=n);const i=a.addn(1);p.setNonce(e,i)}return a})(t,s,a);try{await e.signAsync(n,{nonce:c,signer:a?.signer})}catch(t){r(t)}console.info(`submitting Tx[${e.hash.toString()}]who: ${s} nonce: ${c.toString()} `);try{const n=await e.send((async u=>{if(console.info(`Tx[${e.hash.toString()}]who: ${s} nonce: ${c.toString()} => ${u.status.type}(${u.status.value.toString()})${function(t,e){if(!process.env.TX_VERBOSE)return"";const n=JSON.parse(e.method.toString()),a=JSON.stringify(n.args),i=t.registry.findMetaCall(e.method.callIndex);if("sudo"==i.method&&"sudo"==i.method){const a=e.method.args[0].callIndex,i=JSON.stringify(n.args.call.args),r=t.registry.findMetaCall(a);return` (sudo:: ${r.section}:: ${r.method}(${i})`}return` (${i.section}:: ${i.method}(${a}))`}(t,e)}`),a?.statusCallback?.(u),!u.status.isInBlock&&!u.status.isFinalized||o){if(u.isError){console.info("Transaction Error Result",JSON.stringify(u,null,2)),r(`Tx([${e.hash.toString()}]) Transaction error`);const n=await K.getNonce(t,s);p.setNonce(s,n)}}else{let d;o=!0,u.status.isInBlock?d=u.status.asInBlock.toString():u.status.isFinalized&&(d=u.status.asFinalized.toString());const l=(await t.rpc.chain.getHeader(d)).number.toBn(),y=l.addn(0),w=l.addn(10),g=y,m=await t.rpc.chain.subscribeNewHeads((async o=>{const u=o.number.toBn();if(g.gt(w)){m(),r(`Tx([${e.hash.toString()}])\n                      was not executed in blocks : ${y.toString()}..${w.toString()}`);const a=await K.getNonce(t,s);return p.setNonce(s,a),void n()}if(u.gte(g)){const r=await t.rpc.chain.getBlockHash(g),o=await t.rpc.chain.getHeader(r),u=(await t.rpc.chain.getBlock(o.hash)).block.extrinsics,d=await t.at(o.hash),l=await d.query.system.events();g.iaddn(1);const y=u.findIndex((t=>t.hash.toString()===e.hash.toString()));if(y<0)return void console.info(`Tx([${e.hash.toString()}]) not found in block ${g} $([${(t=>{if(!t)return"";const e=t.length;return t.substring(0,7)+"..."+t.substring(e-5,e)})(r.toString())}])`);m(),console.info(`Tx[${e.hash.toString()}]who:${s} nonce:${c.toString()} => Executed(${r.toString()})`);const w=l.filter((t=>t.phase.isApplyExtrinsic&&t.phase.asApplyExtrinsic.toNumber()===y)).map((e=>{const{event:n,phase:a}=e,i=n.typeDef,r=n.data.map(((t,e)=>({lookupName:i[e].lookupName,data:t})));return{event:n,phase:a,section:n.section,method:n.method,metaDocumentation:n.meta.docs.toString(),eventData:r,error:_(t,n.method,r)}}));a?.extrinsicStatus?.(w),i(w),n()}}))}}))}catch(e){const n=await K.getNonce(t,s);p.setNonce(s,n),r({data:e.message||e.description||e.data?.toString()||e.toString()})}})),_=(e,a,i)=>{if("ExtrinsicFailed"===a){const a=i.find((t=>t.lookupName.includes("DispatchError"))),s=a?.data?.toHuman?.(),o=s?.Module?.error,c=s?.Module?.index;if(!o||!c)return{documentation:["Unknown error"],name:"UnknownError"};try{const a=e.registry.findMetaError({error:t(o)?r(o):new n(o),index:new n(c)});return{documentation:a.docs,name:a.name}}catch(t){return{documentation:["Unknown error"],name:"UnknownError"}}}return null};class E{static async sendKusamaTokenFromRelayToParachain(t,e,a,i,r,o){const u=new c(t),d=await new s({provider:u,noInitWarn:!0}).isReady;await d.tx.xcmPallet.limitedReserveTransferAssets({V3:{parents:0,interior:{X1:{Parachain:r}}}},{V3:{parents:0,interior:{X1:{AccountId32:{id:d.createType("AccountId32",a).toHex()}}}}},{V3:[{id:{Concrete:{parents:0,interior:"Here"}},fun:{Fungible:i}}]},0,{Limited:{refTime:new n("298368000"),proofSize:0}}).signAndSend(e,{signer:o?.signer,nonce:o?.nonce})}static async sendKusamaTokenFromParachainToRelay(t,e,a,i,r){const s={V1:{parents:1,interior:{X1:{AccountId32:{network:"Any",id:t.createType("AccountId32",a).toHex()}}}}},o=$(new n("6000000000"),t.tx.xTokens.transfer);await t.tx.xTokens.transfer("4",i,s,o).signAndSend(e,{signer:r?.signer,nonce:r?.nonce})}static async sendTokenFromStatemineToMangata(...t){const[e,a,i,r,o,u,l,y]=t,w=new c(a),g=await new s({provider:w,noInitWarn:!0}).isReady,p=d(u,42),m=(await e.query.assetRegistry.metadata.entries()).filter((t=>JSON.stringify(t[1].toHuman()).includes(i)))[0],T=JSON.parse(JSON.stringify(m[1].toJSON()));T&&T.location&&await g.tx.polkadotXcm.limitedReserveTransferAssets({V3:{interior:{X1:{Parachain:2110}},parents:1}},{V3:{interior:{X1:{AccountId32:{id:g.createType("AccountId32",p).toHex()}}},parents:0}},{V3:[{fun:{Fungible:l},id:{Concrete:X(i,T.location)}}]},0,{Limited:{refTime:new n(r),proofSize:0}}).signAndSend(o,{signer:y?.signer,nonce:y?.nonce})}static async sendTokenFromParachainToMangata(...t){const[e,a,i,r,o,u,l,y]=t,w=new c(a),g=await new s({provider:w,noInitWarn:!0}).isReady,p=d(u,42),m=(await e.query.assetRegistry.metadata.entries()).filter((t=>JSON.stringify(t[1].toHuman()).includes(i)))[0],T=JSON.parse(JSON.stringify(m[1].toJSON()));if(T&&T.location){let t=null,e=null;["BNC","vBNC","ZLK","vsKSM","vKSM"].includes(i)?(t={V2:{id:{Concrete:X(i,T.location)},fun:{Fungible:l}}},e={V2:{parents:1,interior:{X2:[{Parachain:2110},{AccountId32:{network:"Any",id:g.createType("AccountId32",p).toHex()}}]}}}):(t={V3:{id:{Concrete:X(i,T.location)},fun:{Fungible:l}}},e={V3:{parents:1,interior:{X2:[{Parachain:2110},{AccountId32:{id:g.createType("AccountId32",p).toHex()}}]}}});const a={Limited:{refTime:new n(r),proofSize:0}};await g.tx.xTokens.transferMultiasset(t,e,a).signAndSend(o,{signer:y?.signer,nonce:y?.nonce})}}static async sendTokenFromMangataToParachain(...t){const[e,a,i,r,s,o,c,u]=t,l=d(o,42),y=(await e.query.assetRegistry.metadata.entries()).filter((t=>JSON.stringify(t[1].toHuman()).includes(a)))[0],w=JSON.parse(JSON.stringify(y[1].toJSON()));if(w&&w.location){const t=y[0].toHuman()[0].replace(/[, ]/g,""),o=["BNC","vBNC","ZLK","vsKSM","vKSM"];let d=null;d=o.includes(a)?{V1:{parents:1,interior:{X2:[{Parachain:r},{AccountId32:{network:"Any",id:e.createType("AccountId32",l).toHex()}}]}}}:{V3:{parents:1,interior:{X2:[{Parachain:r},{AccountId32:{id:e.createType("AccountId32",l).toHex()}}]}}};let w=null;w=o.includes(a)?$(new n(i),e.tx.xTokens.transfer):{Limited:{ref_time:new n(i),proof_size:0}},await C(e,e.tx.xTokens.transfer(t,c,d,w),s,u)}}static async sendTurTokenFromTuringToMangata(t,e,a,i,r,o){const u=new c(e),l=await new s({provider:u}).isReady,y=d(i,42),w={V1:{id:{Concrete:{parents:1,interior:{X1:{Parachain:2114}}}},fun:{Fungible:r}}},g={V1:{parents:1,interior:{X2:[{Parachain:2110},{AccountId32:{network:"Any",id:t.createType("AccountId32",y).toHex()}}]}}},p=$(new n("4000000000"),t.tx.xTokens.transferMultiasset);await l.tx.xTokens.transferMultiasset(w,g,p).signAndSend(a,{signer:o?.signer,nonce:o?.nonce})}static async sendTurTokenFromMangataToTuring(t,e,a,i,r){const s=d(a,42),o={V1:{parents:1,interior:{X2:[{Parachain:2114},{AccountId32:{network:"Any",id:t.createType("AccountId32",s).toHex()}}]}}};await C(t,t.tx.xTokens.transfer("7",i,o,new n("6000000000")),e,r)}static async activateLiquidity(t,e,n,a,i){return await C(t,t.tx.proofOfStake.activateLiquidity(n,a,null),e,i)}static async deactivateLiquidity(t,e,n,a,i){return await C(t,t.tx.proofOfStake.deactivateLiquidity(n,a),e,i)}static async claimRewardsAll(t,e,n,a){return await C(t,t.tx.proofOfStake.claimRewardsAll(n),e,a)}static async claimRewards(t,e,n,a,i){return await C(t,t.tx.xyk.claimRewardsV2(n,a),e,i)}static async createPool(t,e,n,a,i,r,s){return await C(t,t.tx.xyk.createPool(n,a,i,r),e,s)}static async sellAsset(t,e,n,a,i,r,s){return await C(t,t.tx.xyk.sellAsset(n,a,i,r),e,s)}static async buyAsset(t,e,n,a,i,r,s){return await C(t,t.tx.xyk.buyAsset(n,a,i,r),e,s)}static async mintLiquidity(t,e,n,a,i,r,s){return await C(t,t.tx.xyk.mintLiquidity(n,a,i,r),e,s)}static async burnLiquidity(t,e,n,a,i,r){return await C(t,t.tx.xyk.burnLiquidity(n,a,i),e,r)}static async transferToken(t,e,n,a,i,r){return await C(t,t.tx.tokens.transfer(a,n,i),e,r)}static async transferAllToken(t,e,n,a,i){return await C(t,t.tx.tokens.transferAll(a,n,!0),e,i)}}const z=l("0"),j=l("1"),D=l("10"),U=l("100"),W=l("1000"),Z=l("10000"),G=l("100000"),Q=l("1000000"),Y=l("10000000"),tt=l("100000000"),et=l("1000000000"),nt=l("10000000000"),at=l("100000000000"),it=l("1000000000000");l.PE=256,l.NE=-256,l.DP=40,l.RM=l.roundUp;const rt=D.pow(18),st=(t,e)=>{if(!t)return h;try{const a=l(t),i=e&&18!==e?D.pow(e):rt,r=a.mul(i).toString();return/\D/gm.test(r)?h:new n(r)}catch(t){return h}},ot=(t,e)=>{if(!t)return"0";try{const n=l(t.toString()),a=e&&18!==e?D.pow(e):rt,i=n.div(a);return i.toString()}catch(t){return"0"}};class ct{static async sendTokenFromParachainToMangataFee(...t){const[e,a,i,r,o,u,l]=t,y=new c(a),w=await new s({provider:y,noInitWarn:!0}).isReady,g=d(u,42),p=(await e.query.assetRegistry.metadata.entries()).filter((t=>JSON.stringify(t[1].toHuman()).includes(i)))[0];if(!Array.isArray(p)||!p.length)return"0";const m=JSON.parse(JSON.stringify(p[1].toJSON()));if(!m.location)return"0";const{location:T,decimals:f}=m;let k=null,h=null;["BNC","vBNC","ZLK","vsKSM","vKSM"].includes(i)?(k={V2:{id:{Concrete:{parents:"1",interior:X(i,T)}},fun:{Fungible:l}}},h={V2:{parents:1,interior:{X2:[{Parachain:2110},{AccountId32:{network:"Any",id:w.createType("AccountId32",g).toHex()}}]}}}):(k={V3:{id:{Concrete:X(i,m.location)},fun:{Fungible:l}}},h={V3:{parents:1,interior:{X2:[{Parachain:2110},{AccountId32:{id:w.createType("AccountId32",g).toHex()}}]}}});const A={Limited:{refTime:new n(r),proofSize:0}},S=await w.tx.xTokens.transferMultiasset(k,h,A).paymentInfo(o);return ot(new n(S.partialFee.toString()),Number(f))}static async sendTokenFromMangataToParachainFee(...t){const[e,a,i,r,s,o,c]=t,u=d(o,42),l=(await e.query.assetRegistry.metadata.entries()).filter((t=>JSON.stringify(t[1].toHuman()).includes(a)))[0];if(!Array.isArray(l)||!l.length)return"0";const y=l[0].toHuman()[0].replace(/[, ]/g,""),w=["BNC","vBNC","ZLK","vsKSM","vKSM"];let g=null;g=w.includes(a)?{V1:{parents:1,interior:{X2:[{Parachain:r},{AccountId32:{network:"Any",id:e.createType("AccountId32",u).toHex()}}]}}}:{V3:{parents:1,interior:{X2:[{Parachain:r},{AccountId32:{id:e.createType("AccountId32",u).toHex()}}]}}};let p=null;p=w.includes(a)?$(new n(i),e.tx.xTokens.transfer):{Limited:{ref_time:new n(i),proof_size:0}};const m=await e.tx.xTokens.transfer(y,c,g,p).paymentInfo(s);return ot(new n(m.partialFee.toString()))}static async sendTurTokenFromTuringToMangataFee(t,e,a,i,r){const o=new c(e),u=await new s({provider:o}).isReady,l=d(i,42),y={V1:{id:{Concrete:{parents:1,interior:{X1:{Parachain:2114}}}},fun:{Fungible:r}}},w={V1:{parents:1,interior:{X2:[{Parachain:2110},{AccountId32:{network:"Any",id:t.createType("AccountId32",l).toHex()}}]}}},g=$(new n("4000000000"),t.tx.xTokens.transferMultiasset),p=await u.tx.xTokens.transferMultiasset(y,w,g).paymentInfo(a);return ot(new n(p.partialFee.toString()),10)}static async sendTurTokenFromMangataToTuringFee(t,e,a,i){const r=d(a,42),s={V1:{parents:1,interior:{X2:[{Parachain:2114},{AccountId32:{network:"Any",id:t.createType("AccountId32",r).toHex()}}]}}},o=await t.tx.xTokens.transfer("7",i,s,new n("6000000000")).paymentInfo(e);return ot(new n(o.partialFee.toString()))}static async sendTokenFromStatemineToMangataFee(...t){const[e,a,i,r,o,u,l]=t,y=new c(a),w=await new s({provider:y,noInitWarn:!0}).isReady,g=d(u,42),p=(await e.query.assetRegistry.metadata.entries()).filter((t=>JSON.stringify(t[1].toHuman()).includes(i)))[0];if(!Array.isArray(p)||!p.length)return"0";const m=JSON.parse(JSON.stringify(p[1].toJSON()));if(!m.location)return"0";const{location:T}=m,f=await w.tx.polkadotXcm.limitedReserveTransferAssets({V3:{interior:{X1:{Parachain:2110}},parents:1}},{V3:{interior:{X1:{AccountId32:{id:w.createType("AccountId32",g).toHex()}}},parents:0}},{V3:[{fun:{Fungible:l},id:{Concrete:X(i,T)}}]},0,{Limited:{refTime:new n(r),proofSize:0}}).paymentInfo(o);return ot(new n(f.partialFee.toString()),12)}static async sendKusamaTokenFromRelayToParachainFee(t,e,a,i,r){const o=new c(t),u=await new s({provider:o,noInitWarn:!0}).isReady,d=u.tx.xcmPallet.limitedReserveTransferAssets({V3:{parents:0,interior:{X1:{Parachain:r}}}},{V3:{parents:0,interior:{X1:{AccountId32:{id:u.createType("AccountId32",a).toHex()}}}}},{V3:[{id:{Concrete:{parents:0,interior:"Here"}},fun:{Fungible:i}}]},0,{Limited:{refTime:new n("298368000"),proofSize:0}}),l=await d.paymentInfo(e);return ot(new n(l.partialFee.toString()),12)}static async sendKusamaTokenFromParachainToRelayFee(t,e,a,i){const r={V1:{parents:1,interior:{X1:{AccountId32:{network:"Any",id:t.createType("AccountId32",d(a,2)).toHex()}}}}},s=$(new n("6000000000"),t.tx.xTokens.transferMultiasset),o=await t.tx.xTokens.transfer("4",i,r,s).paymentInfo(e);return ot(new n(o.partialFee.toString()))}static async activateLiquidity(t,e,a,i){const r=await t.tx.proofOfStake.activateLiquidity(a,i,null).paymentInfo(e);return ot(new n(r.partialFee.toString()))}static async deactivateLiquidity(t,e,a,i){const r=await t.tx.proofOfStake.deactivateLiquidity(a,i).paymentInfo(e);return ot(new n(r.partialFee.toString()))}static async claimRewardsAllFee(t,e,a){const i=await t.tx.proofOfStake.claimRewardsAll(a).paymentInfo(e);return ot(new n(i.partialFee.toString()))}static async claimRewardsFee(t,e,a,i){const r=await t.tx.xyk.claimRewardsV2(a,i).paymentInfo(e);return ot(new n(r.partialFee.toString()))}static async createPoolFee(t,e,a,i,r,s){const o=await t.tx.xyk.createPool(a,i,r,s).paymentInfo(e);return ot(new n(o.partialFee.toString()))}static async sellAssetFee(t,e,a,i,r,s){const o=await t.tx.xyk.sellAsset(a,i,r,s).paymentInfo(e);return ot(new n(o.partialFee.toString()))}static async buyAssetFee(t,e,a,i,r,s){const o=await t.tx.xyk.buyAsset(a,i,r,s).paymentInfo(e);return ot(new n(o.partialFee.toString()))}static async mintLiquidityFee(t,e,a,i,r,s=new n(Number.MAX_SAFE_INTEGER)){const o=await t.tx.xyk.mintLiquidity(a,i,r,s).paymentInfo(e);return ot(new n(o.partialFee.toString()))}static async burnLiquidityFee(t,e,a,i,r){const s=await t.tx.xyk.burnLiquidity(a,i,r).paymentInfo(e);return ot(new n(s.partialFee.toString()))}static async transferTokenFee(t,e,a,i,r){const s=await t.tx.tokens.transfer(i,a,r).paymentInfo(e);return ot(new n(s.partialFee.toString()))}static async transferAllTokenFee(t,e,a,i){const r=await t.tx.tokens.transferAll(i,a,!0).paymentInfo(e);return ot(new n(r.partialFee.toString()))}}class ut{api;urls;static instanceMap=new Map;constructor(t){this.urls=t,this.api=(async()=>await this.connectToNode(t))()}async connectToNode(t){const e=new c(t,5e3);return await s.create(u({provider:e,throwOnConnect:!0,throwOnUnknown:!0,noInitWarn:!0}))}static getInstance(t){return ut.instanceMap.has(JSON.stringify(t))||ut.instanceMap.set(JSON.stringify(t),new ut(t)),ut.instanceMap.get(JSON.stringify(t))}async getApi(){return this.api||(this.api=this.connectToNode(this.urls)),this.api}getUrls(){return this.urls}async waitForNewBlock(t){let e=0;const n=await this.getApi(),a=t||2;return new Promise((async t=>{const i=await n.rpc.chain.subscribeNewHeads((()=>{++e===a&&(i(),t(!0))}))}))}async getChain(){const t=await this.getApi();return w.getChain(t)}async getNodeName(){const t=await this.getApi();return w.getNodeName(t)}async getNodeVersion(){const t=await this.getApi();return w.getNodeVersion(t)}async getNonce(t){const e=await this.getApi();return K.getNonce(e,t)}async disconnect(){const t=await this.getApi();await t.disconnect()}async sendTokenFromStatemineToMangataFee(t,e,n,a,i,r){const s=await this.getApi();return await ct.sendTokenFromStatemineToMangataFee(s,t,e,n,a,i,r)}async sendTokenFromStatemineToMangata(t,e,n,a,i,r,s){const o=await this.getApi();return await E.sendTokenFromStatemineToMangata(o,t,e,n,a,i,r,s)}async sendTokenFromParachainToMangata(t,e,n,a,i,r,s){const o=await this.getApi();return await E.sendTokenFromParachainToMangata(o,t,e,n,a,i,r,s)}async sendTokenFromMangataToParachain(t,e,n,a,i,r,s){const o=await this.getApi();return await E.sendTokenFromMangataToParachain(o,t,e,n,a,i,r,s)}async sendTokenFromParachainToMangataFee(t,e,n,a,i,r){const s=await this.getApi();return await ct.sendTokenFromParachainToMangataFee(s,t,e,n,a,i,r)}async sendTokenFromMangataToParachainFee(t,e,n,a,i,r){const s=await this.getApi();return await ct.sendTokenFromMangataToParachainFee(s,t,e,n,a,i,r)}async sendKusamaTokenFromRelayToParachain(t,e,n,a,i=2110,r){return await E.sendKusamaTokenFromRelayToParachain(t,e,n,a,i,r)}async sendKusamaTokenFromRelayToParachainFee(t,e,n,a,i=2110){return await ct.sendKusamaTokenFromRelayToParachainFee(t,e,n,a,i)}async sendKusamaTokenFromParachainToRelay(t,e,n,a){const i=await this.getApi();return await E.sendKusamaTokenFromParachainToRelay(i,t,e,n,a)}async sendKusamaTokenFromParachainToRelayFee(t,e,n){const a=await this.getApi();return await ct.sendKusamaTokenFromParachainToRelayFee(a,t,e,n)}async sendTurTokenFromTuringToMangata(t,e,n,a,i){const r=await this.getApi();return await E.sendTurTokenFromTuringToMangata(r,t,e,n,a,i)}async sendTurTokenFromMangataToTuring(t,e,n,a){const i=await this.getApi();return await E.sendTurTokenFromMangataToTuring(i,t,e,n,a)}async sendTurTokenFromTuringToMangataFee(t,e,n,a){const i=await this.getApi();return await ct.sendTurTokenFromTuringToMangataFee(i,t,e,n,a)}async sendTurTokenFromMangataToTuringFee(t,e,n){const a=await this.getApi();return await ct.sendTurTokenFromMangataToTuringFee(a,t,e,n)}async activateLiquidity(t,e,n,a){const i=await this.getApi();return await E.activateLiquidity(i,t,e,n,a)}async deactivateLiquidity(t,e,n,a){const i=await this.getApi();return await E.deactivateLiquidity(i,t,e,n,a)}async calculateFutureRewardsAmountForMinting(t,e,a){const i=await this.getApi();return await(async(t,e,a,i)=>{const r=new n("136986000000000000000000"),s=i.div(new n("1200")).mul(r),o=(await t.query.proofOfStake.promotedPoolRewards()).toHuman(),c=Object.values(o).reduce(((t,e)=>t.add(new n(e.weight))),new n(0)),u=new n(o[e].weight.toString()),d=s.mul(u).div(c),l=await t.query.proofOfStake.liquidityMiningActivePoolV2(e);return d.mul(a).div(new n(l.toString()).add(a))})(i,t,e,a)}async calculateRewardsAmount(t,e){const n=await this.getApi();return await w.calculateRewardsAmount(n,t,e)}async claimRewardsAllFee(t,e){const n=await this.getApi();return await ct.claimRewardsAllFee(n,t,e)}async claimRewardsFee(t,e,n){const a=await this.getApi();return await ct.claimRewardsFee(a,t,e,n)}async claimRewardsAll(t,e,n){const a=await this.getApi();return await E.claimRewardsAll(a,t,e,n)}async claimRewards(t,e,n,a){const i=await this.getApi();return await E.claimRewards(i,t,e,n,a)}async createPoolFee(t,e,n,a,i){const r=await this.getApi();return await ct.createPoolFee(r,t,e,n,a,i)}async createPool(t,e,n,a,i,r){const s=await this.getApi();return await E.createPool(s,t,e,n,a,i,r)}async sellAssetFee(t,e,n,a,i){const r=await this.getApi();return await ct.sellAssetFee(r,t,e,n,a,i)}async sellAsset(t,e,n,a,i,r){const s=await this.getApi();return await E.sellAsset(s,t,e,n,a,i,r)}async mintLiquidityFee(t,e,n,a,i){const r=await this.getApi();return await ct.mintLiquidityFee(r,t,e,n,a,i)}async mintLiquidity(t,e,n,a,i,r){const s=await this.getApi();return await E.mintLiquidity(s,t,e,n,a,i,r)}async burnLiquidityFee(t,e,n,a){const i=await this.getApi();return await ct.burnLiquidityFee(i,t,e,n,a)}async burnLiquidity(t,e,n,a,i){const r=await this.getApi();return await E.burnLiquidity(r,t,e,n,a,i)}async buyAssetFee(t,e,n,a,i){const r=await this.getApi();return await ct.buyAssetFee(r,t,e,n,a,i)}async buyAsset(t,e,n,a,i,r){const s=await this.getApi();return await E.buyAsset(s,t,e,n,a,i,r)}async calculateBuyPrice(t,e,n){const a=await this.getApi();return await w.calculateBuyPrice(a,t,e,n)}async calculateSellPrice(t,e,n){const a=await this.getApi();return await w.calculateSellPrice(a,t,e,n)}async getBurnAmount(t,e,n){const a=await this.getApi();return await w.getBurnAmount(a,t,e,n)}async calculateSellPriceId(t,e,n){const a=await this.getApi();return await w.calculateSellPriceId(a,t,e,n)}async calculateBuyPriceId(t,e,n){const a=await this.getApi();return await w.calculateBuyPriceId(a,t,e,n)}async getAmountOfTokenIdInPool(t,e){const n=await this.getApi();return await K.getAmountOfTokenIdInPool(n,t,e)}async getLiquidityTokenId(t,e){const n=await this.getApi();return await K.getLiquidityTokenId(n,t,e)}async getLiquidityPool(t){const e=await this.getApi();return await K.getLiquidityPool(e,t)}async transferTokenFee(t,e,n,a){const i=await this.getApi();return await ct.transferTokenFee(i,t,e,n,a)}async transferToken(t,e,n,a,i){const r=await this.getApi();return await E.transferToken(r,t,e,n,a,i)}async transferTokenAllFee(t,e,n){const a=await this.getApi();return await ct.transferAllTokenFee(a,t,e,n)}async transferTokenAll(t,e,n,a){const i=await this.getApi();return await E.transferAllToken(i,t,e,n,a)}async getTotalIssuance(t){const e=await this.getApi();return await K.getTotalIssuance(e,t)}async getTokenBalance(t,e){const n=await this.getApi();return await K.getTokenBalance(n,e,t)}async getNextTokenId(){const t=await this.getApi();return await K.getNextTokenId(t)}async getTokenInfo(t){const e=await this.getApi();return await K.getTokenInfo(e,t)}async getBlockNumber(){const t=await this.getApi();return await K.getBlockNumber(t)}async getOwnedTokens(t){const e=await this.getApi();return await K.getOwnedTokens(e,t)}async getLiquidityTokenIds(){const t=await this.getApi();return await K.getLiquidityTokenIds(t)}async getAssetsInfo(){const t=await this.getApi();return await K.getAssetsInfo(t)}async getBalances(){const t=await this.getApi();return await K.getBalances(t)}async getLiquidityTokens(){const t=await this.getApi();return await K.getLiquidityTokens(t)}async getPool(t){const e=await this.getApi();return await K.getPool(e,t)}async getInvestedPools(t){const e=await this.getApi();return await K.getInvestedPools(e,t)}async getPools(){const t=await this.getApi();return await K.getPools(t)}}const dt=(t,e)=>{const n=new RegExp(`^-?\\d+(?:\\.\\d{0,${e}})?`,"gm"),a=t.match(n),i=(a?.[0]||t).match(/^-?0*(\d+(?:\.(?:(?!0+$)\d)+)?)/gm);return i?.[0]??t},lt=t=>{const e=+t;return!(!t||isNaN(Number(t))||isNaN(e)||e<0)};class yt{static createKeyring(t){return new o({type:t})}static createKeyPairFromName(t,e=""){const n=e||"//testUser_"+y(),a=t.createFromUri(n);return t.addPair(a),a}static getPriceImpact(t,e,n,a){if(!(t&&e&&lt(n)&&lt(a)))return;const i=t.firstTokenBalance,r=t.secondTokenBalance,s=st(n,e.firstTokenDecimals),o=st(a,e.secondTokenDecimals);if(o.gte(r))return"";const c=i.add(s).mul(F).mul(r),u=r.sub(o).mul(i),d=c.div(u).sub(F).toString(),y=l(d);return dt(y.div(U).toString(),2)}}const wt=t=>{const e=t.filter((t=>"ExtrinsicSuccess"===t.method)).length,n=t.filter((t=>"SellAssetFailedDueToSlippage"===t.method)).length;return 1===e&&0===n},gt=t=>{const e=t.filter((t=>"ExtrinsicSuccess"===t.method)).length,n=t.filter((t=>"BuyAssetFailedDueToSlippage"===t.method)).length;return 1===e&&0===n};export{et as BIG_BILLION,U as BIG_HUNDRED,at as BIG_HUNDRED_BILLIONS,tt as BIG_HUNDRED_MILLIONS,G as BIG_HUNDRED_THOUSAND,Q as BIG_MILLION,j as BIG_ONE,D as BIG_TEN,nt as BIG_TEN_BILLIONS,Y as BIG_TEN_MILLIONS,Z as BIG_TEN_THOUSAND,W as BIG_THOUSAND,it as BIG_TRILLION,z as BIG_ZERO,q as BN_BILLION,H as BN_DIV_NUMERATOR_MULTIPLIER,L as BN_DIV_NUMERATOR_MULTIPLIER_DECIMALS,x as BN_HUNDRED,R as BN_HUNDRED_BILLIONS,v as BN_HUNDRED_MILLIONS,N as BN_HUNDRED_THOUSAND,P as BN_MILLION,A as BN_ONE,S as BN_TEN,O as BN_TEN_BILLIONS,b as BN_TEN_MILLIONS,F as BN_TEN_THOUSAND,I as BN_THOUSAND,M as BN_TRILLION,h as BN_ZERO,ut as Mangata,yt as MangataHelpers,ot as fromBN,gt as isBuyAssetTransactionSuccessful,wt as isSellAssetTransactionSuccessful,C as signTx,st as toBN,dt as toFixed};
