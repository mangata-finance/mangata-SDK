"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.getPools = void 0;
var getAssetsInfoWithIds_1 = require("../../utils/getAssetsInfoWithIds");
var getLiquidityAssets_1 = require("../../utils/getLiquidityAssets");
var getLiquidityPromotedPools_1 = require("../../utils/getLiquidityPromotedPools");
var getPoolsBalance_1 = require("../../utils/getPoolsBalance");
var getRatio_1 = require("../../utils/getRatio");
var getPools = function (instancePromise) { return __awaiter(void 0, void 0, void 0, function () {
    var api, _a, assetsInfo, liquidityAssets, liquidityTokensPromoted, poolBalances;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, instancePromise];
            case 1:
                api = _b.sent();
                return [4 /*yield*/, Promise.all([
                        (0, getAssetsInfoWithIds_1.getAssetsInfoWithIds)(api),
                        (0, getLiquidityAssets_1.getLiquidityAssets)(api),
                        (0, getLiquidityPromotedPools_1.getLiquidityPromotedPools)(api)
                    ])];
            case 2:
                _a = _b.sent(), assetsInfo = _a[0], liquidityAssets = _a[1], liquidityTokensPromoted = _a[2];
                return [4 /*yield*/, (0, getPoolsBalance_1.getPoolsBalance)(api, liquidityAssets)];
            case 3:
                poolBalances = _b.sent();
                return [2 /*return*/, Object.values(assetsInfo)
                        .reduce(function (acc, asset) {
                        return Object.values(liquidityAssets).includes(asset.id)
                            ? acc.concat(asset)
                            : acc;
                    }, [])
                        .map(function (asset) {
                        var _a = poolBalances[asset.id], firstTokenAmount = _a[0], secondTokenAmount = _a[1];
                        return {
                            firstTokenId: asset.symbol.split("-")[0],
                            secondTokenId: asset.symbol.split("-")[1],
                            firstTokenAmount: firstTokenAmount,
                            secondTokenAmount: secondTokenAmount,
                            liquidityTokenId: asset.id,
                            firstTokenRatio: (0, getRatio_1.getRatio)(firstTokenAmount, secondTokenAmount),
                            secondTokenRatio: (0, getRatio_1.getRatio)(secondTokenAmount, firstTokenAmount),
                            isPromoted: liquidityTokensPromoted.includes(asset.id)
                        };
                    })];
        }
    });
}); };
exports.getPools = getPools;
