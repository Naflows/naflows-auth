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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.checkRates = void 0;
var uuid_1 = require("uuid");
var __1 = require("../..");
function checkRates(UCR) {
    return __awaiter(this, void 0, Promise, function () {
        var ratesCollection, reqRates, requestsArray, timeoutSeconds, timeoutMs_1, lastRequests;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ratesCollection = __1.db.collection("requests");
                    if (!ratesCollection) return [3 /*break*/, 7];
                    return [4 /*yield*/, ratesCollection.findOne({
                            ip: UCR.user.ip,
                            userAgent: UCR.user.agent,
                            device_fingerprint: UCR.user.device_fingerprint
                        })];
                case 1:
                    reqRates = _a.sent();
                    if (!!reqRates) return [3 /*break*/, 3];
                    // If no rates found, create a new one
                    return [4 /*yield*/, ratesCollection.insertOne({
                            id: uuid_1.v4(),
                            ip: UCR.user.ip,
                            userAgent: UCR.user.agent,
                            device_fingerprint: UCR.user.device_fingerprint,
                            requests: [{ date: Date.now(), request: UCR }],
                            lastRequest: Date.now(),
                            firstRequest: Date.now()
                        })];
                case 2:
                    // If no rates found, create a new one
                    _a.sent();
                    return [2 /*return*/, {
                            status: 200,
                            message: "Rate limit not exceeded, request recorded.",
                            success: true
                        }];
                case 3:
                    requestsArray = Array.isArray(reqRates.requests) ? reqRates.requests : [];
                    timeoutSeconds = process.env.BLACKLIST_RATES_TIMEOUT ? parseInt(process.env.BLACKLIST_RATES_TIMEOUT) : 60;
                    timeoutMs_1 = timeoutSeconds * 1000;
                    lastRequests = requestsArray.filter(function (req) {
                        return (req.date >
                            Date.now() - timeoutMs_1);
                    });
                    if (!(lastRequests.length >= (process.env.BLACKLIST_RATES ? parseInt(process.env.BLACKLIST_RATES) : 100))) return [3 /*break*/, 4];
                    return [2 /*return*/, {
                            status: 429,
                            message: "Rate limit exceeded. Too many requests.",
                            success: false
                        }];
                case 4: return [4 /*yield*/, ratesCollection.updateOne({ _id: reqRates._id }, {
                        $set: {
                            lastRequest: Date.now(),
                            requests: __spreadArrays(reqRates.requests, [
                                { date: Date.now(), request: UCR },
                            ])
                        }
                    })];
                case 5:
                    _a.sent();
                    return [2 /*return*/, {
                            status: 200,
                            message: "Rate limit not exceeded, request recorded.",
                            success: true
                        }];
                case 6: return [3 /*break*/, 8];
                case 7: return [2 /*return*/, {
                        status: 500,
                        message: "Internal server error. Rates collection not found.",
                        success: false
                    }];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.checkRates = checkRates;
