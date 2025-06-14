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
var _a = require('@jest/globals'), test = _a.test, expect = _a.expect, describe = _a.describe;
var axios = require('axios');
var app = "http://localhost:3000/test";
var validUCR = {
    user: {
        ip: "192.168.1.111",
        agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
        session_id: "session123",
        token: "token",
        device_fingerprint: "fingerprint",
        user_origin: "/test/"
    },
    client: {
        ip: "127.0.0.1",
        dns: "local.nass.com",
        service: "Test Service : token is not expired",
        service_token: "test-service-token",
        service_token_birth: 1749676800
    },
    request: {
        method: "POST",
        url: "/test",
        headers: {
            "Content-Type": "application/json"
        },
        body: { key: "value" },
        query: { param: "value" },
        request_date: 1700000000
    }
};
test("UCR is valid (correct informations | token)", function () { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.post("" + app, validUCR)];
            case 1:
                response = _a.sent();
                // Expect status 200 with message "successful connection"
                expect(response.status).toBe(200);
                expect(response.data).toBe("Successful connection");
                return [2 /*return*/];
        }
    });
}); });
validUCR.user.ip = "1.1.1.1";
test("UCR is valid (correct informations | password + identifier)", function () { return __awaiter(void 0, void 0, void 0, function () {
    var ucr, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ucr = validUCR;
                delete ucr.user.token;
                ucr.user.identifier = "identifier";
                ucr.user.password = "password";
                return [4 /*yield*/, axios.post("" + app, ucr)];
            case 1:
                response = _a.sent();
                // Expect status 200 with message "successful connection"
                expect(response.status).toBe(200);
                expect(response.data).toBe("Successful connection");
                return [2 /*return*/];
        }
    });
}); });
validUCR.user.ip = "1.1.1.2";
test("UCR is invalid (password + token + identifier)", function () { return __awaiter(void 0, void 0, void 0, function () {
    var ucr, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ucr = validUCR;
                ucr.user.identifier = "identifier";
                ucr.user.password = "password";
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios.post("" + app, ucr)];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                expect(error_1.response.status).toBe(400);
                expect(error_1.response.data).toBe("Invalid request format.");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
validUCR.user.ip = "1.1.1.3";
test("UCR is invalid (missing random parameters)", function () { return __awaiter(void 0, void 0, void 0, function () {
    var ucr, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ucr = validUCR;
                ucr.user.device_fingerprint = undefined; // Missing device fingerprint
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios.post("" + app, ucr)];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                expect(error_2.response.status).toBe(400);
                expect(error_2.response.data).toBe("Invalid request format.");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
validUCR.user.ip = "1.1.1.4";
test("Service connection is invalid (incorrect service IP address)", function () { return __awaiter(void 0, void 0, void 0, function () {
    var ucr, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ucr = validUCR;
                ucr.client.ip = "123.123.123.1";
                ucr.client.service_token = "test-service-token"; // Valid token but incorrect IP
                ucr.user.device_fingerprint = "fingerprint"; // Valid fingerprint
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios.post("" + app, ucr)];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                expect(error_3.response.status).toBe(403);
                expect(error_3.response.data).toBe("Unauthorized service access.");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
validUCR.user.ip = "1.1.1.5";
test("Service connection is invalid (incorrect token creation time)", function () { return __awaiter(void 0, void 0, void 0, function () {
    var ucr, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ucr = validUCR;
                ucr.client.ip = "127.0.0.1";
                ucr.client.service_token_birth = 156321; // Token creation time is in the past
                ucr.client.service_token = "test-service-token"; // Valid token but incorrect creation time
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios.post("" + app, ucr)];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                expect(error_4.response.status).toBe(403);
                expect(error_4.response.data).toBe("Invalid or expired service token.");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
validUCR.user.ip = "1.1.1.6";
test("Service connection is invalid (incorrect token)", function () { return __awaiter(void 0, void 0, void 0, function () {
    var ucr, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ucr = validUCR;
                ucr.client.service_token = "invalid-token"; // Invalid service token
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios.post("" + app, ucr)];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                expect(error_5.response.status).toBe(403);
                expect(error_5.response.data).toBe("Invalid or expired service token.");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
validUCR.user.ip = "1.1.1.7";
test("Service is outdated (service is not active)", function () { return __awaiter(void 0, void 0, void 0, function () {
    var ucr, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ucr = validUCR;
                ucr.client.service = "Test Service : expired";
                ucr.client.service_token = "test-service-token-inactive"; // Valid token but service is not active
                ucr.client.service_token_birth = 1749676800;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios.post("" + app, ucr)];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_6 = _a.sent();
                expect(error_6.response.status).toBe(403);
                expect(error_6.response.data).toBe("Unauthorized service access.");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
validUCR.user.ip = "1.1.1.8";
test("Service token is expired (token is not valid anymore)", function () { return __awaiter(void 0, void 0, void 0, function () {
    var ucr, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ucr = validUCR;
                ucr.client.service = "Test Service : token is expired";
                ucr.client.service_token = "test-service-token-expired"; // Valid token but service token is expired
                ucr.client.service_token_birth = 123456789; // Token creation time is in the past
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios.post("" + app, ucr)];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_7 = _a.sent();
                expect(error_7.response.status).toBe(403);
                expect(error_7.response.data).toBe("Invalid or expired service token.");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Reseting the valid UCR for the next tests but changing IP adress 
var tmrUCR = {
    user: {
        ip: "135.215.3.111",
        agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
        session_id: "session123",
        token: "token",
        device_fingerprint: "fingerprint",
        user_origin: "/test/"
    },
    client: {
        ip: "127.0.0.1",
        dns: "local.nass.com",
        service: "Test Service : token is not expired",
        service_token: "test-service-token",
        service_token_birth: 1749676800
    },
    request: {
        method: "POST",
        url: "/test/too-many-requests",
        headers: {
            "Content-Type": "application/json"
        },
        body: { key: "value" },
        query: { param: "value" },
        request_date: 1700000000
    }
};
test("Rates limit exceeded (too many requests)", function () { return __awaiter(void 0, void 0, void 0, function () {
    var rates, ucr, i, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                rates = process.env.BLACKLIST_RATES ? parseInt(process.env.BLACKLIST_RATES) : 100;
                ucr = tmrUCR;
                i = 0;
                _a.label = 1;
            case 1:
                if (!(i < rates * 2)) return [3 /*break*/, 6];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, axios.post("" + app, ucr)];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                error_8 = _a.sent();
                if (error_8.response.status === 429) {
                    expect(error_8.response.data).toBe("Rate limit exceeded. Too many requests.");
                    return [3 /*break*/, 6];
                }
                return [3 /*break*/, 5];
            case 5:
                i++;
                return [3 /*break*/, 1];
            case 6: return [2 /*return*/];
        }
    });
}); });
