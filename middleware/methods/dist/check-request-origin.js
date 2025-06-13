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
exports.checkRequestOrigin = void 0;
var __1 = require("../..");
function checkRequestOrigin(UCR) {
    return __awaiter(this, void 0, Promise, function () {
        var servicesCollection, servicesToken, queriedService, serviceToken;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    servicesCollection = __1.db.collection("services");
                    servicesToken = __1.db.collection("service_tokens");
                    if (!(servicesCollection && servicesToken)) return [3 /*break*/, 5];
                    console.log("Searching for service in the database with:\nIP: " + UCR.client.ip + "\nDNS: " + UCR.client.dns + "\nService: " + UCR.client.service);
                    return [4 /*yield*/, servicesCollection.findOne({
                            ip_address: UCR.client.ip,
                            dns: UCR.client.dns,
                            name: UCR.client.service
                        })];
                case 1:
                    queriedService = _a.sent();
                    console.log("Queried service:", queriedService);
                    if (!(queriedService && queriedService.status === "ACTIVE")) return [3 /*break*/, 3];
                    console.log("Service " + queriedService.name + " is active, checking service token...");
                    console.log("Token parameters are:\nService ID: " + queriedService.id + "\nToken: " + UCR.client.service_token + "\nCreated at: " + UCR.client.service_token_birth);
                    return [4 /*yield*/, servicesToken.findOne({
                            service_id: queriedService.id,
                            token: UCR.client.service_token,
                            created_at: UCR.client.service_token_birth
                        })];
                case 2:
                    serviceToken = _a.sent();
                    console.log("The following service token are related to " + queriedService.name + ": ", serviceToken);
                    if (serviceToken &&
                        serviceToken.created_at + serviceToken.lifespan < Date.now() &&
                        (process.env.SERVICE_TOKEN_MAXIMAL_RATES && serviceToken.uses < parseInt(process.env.SERVICE_TOKEN_MAXIMAL_RATES))) {
                        return [2 /*return*/, {
                                status: 200,
                                message: "Service access granted.",
                                success: true,
                                data: {
                                    service: queriedService,
                                    token: serviceToken
                                }
                            }];
                    }
                    else {
                        return [2 /*return*/, {
                                status: 403,
                                message: "Invalid or expired service token.",
                                success: false
                            }];
                    }
                    return [3 /*break*/, 4];
                case 3: return [2 /*return*/, {
                        status: 403,
                        message: "Unauthorized service access.",
                        success: false
                    }];
                case 4: return [3 /*break*/, 6];
                case 5: return [2 /*return*/, {
                        status: 500,
                        message: "Internal server error. Services collections not found.",
                        success: false
                    }];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.checkRequestOrigin = checkRequestOrigin;
