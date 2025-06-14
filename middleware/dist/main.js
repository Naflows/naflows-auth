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
exports.NASS_Verification_Process = void 0;
var dir_1 = require("../software/dir");
var dir_2 = require("./dir");
function NASS_Verification_Process(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var isUCRCorrect, ratesCheck, ip, isBlackListed, isRequestOriginValid, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('\x1b[34m%s\x1b[0m', "------ INCOMING REQUEST at " + req.body.request.url + "  ------");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 10, , 11]);
                    console.log("NASS Verification Process started.");
                    if (!(process.env.NASS_SCV_ENABLED !== "true")) return [3 /*break*/, 2];
                    console.log("NASS SCV is disabled, skipping verification process.");
                    return [2 /*return*/, next()];
                case 2:
                    if (process.env.NASS_UCR_ENABLED === "true") {
                        isUCRCorrect = dir_2["default"].check.ucr(req.body);
                        if (!isUCRCorrect) {
                            console.log('\x1b[31m%s\x1b[0m', "Invalid UCR.");
                            return [2 /*return*/, dir_1.software.methods.manageErrorCode({
                                    status: 400,
                                    message: "Invalid request format.",
                                    success: false
                                }, res)];
                        }
                    }
                    if (!(process.env.NASS_RATES_LIMIT_ENABLED === "true")) return [3 /*break*/, 4];
                    return [4 /*yield*/, dir_2["default"].check.rates(req.body)];
                case 3:
                    ratesCheck = _a.sent();
                    if (!ratesCheck.success) {
                        console.log('\x1b[31m%s\x1b[0m', "Rate limit exceeded, exiting NASS Verification Process.");
                        return [2 /*return*/, dir_1.software.methods.manageErrorCode(ratesCheck, res)];
                    }
                    _a.label = 4;
                case 4:
                    if (!(process.env.NASS_BLACKLIST_ENABLED === "true")) return [3 /*break*/, 6];
                    ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
                    return [4 /*yield*/, dir_2["default"].check.blacklist(res, ip)];
                case 5:
                    isBlackListed = _a.sent();
                    if (!isBlackListed.success) {
                        return [2 /*return*/, dir_1.software.methods.manageErrorCode(isBlackListed, res)];
                    }
                    _a.label = 6;
                case 6:
                    if (!(process.env.NASS_SERVICE_FILTER === "true")) return [3 /*break*/, 8];
                    return [4 /*yield*/, dir_2["default"].check.origin(req.body)];
                case 7:
                    isRequestOriginValid = _a.sent();
                    if (!isRequestOriginValid.success) {
                        return [2 /*return*/, dir_1.software.methods.manageErrorCode(isRequestOriginValid, res)];
                    }
                    _a.label = 8;
                case 8:
                    console.log('\x1b[32m%s\x1b[0m', "NASS Verification Process completed successfully.");
                    return [2 /*return*/, next()];
                case 9: return [3 /*break*/, 11];
                case 10:
                    error_1 = _a.sent();
                    console.error('\x1b[31m%s\x1b[0m', "Unexpected error during NASS Verification Process:", error_1);
                    return [2 /*return*/, dir_1.software.methods.manageErrorCode({
                            status: 500,
                            message: "Internal server error during NASS Verification Process.",
                            success: false
                        }, res)];
                case 11: return [2 /*return*/];
            }
        });
    });
}
exports.NASS_Verification_Process = NASS_Verification_Process;
