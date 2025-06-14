"use strict";
exports.__esModule = true;
var check_ucr_1 = require("./methods/check-ucr");
var main_1 = require("./main");
var check_blacklist_1 = require("./methods/check-blacklist");
var check_request_origin_1 = require("./methods/check-request-origin");
var check_rates_1 = require("./methods/check-rates");
var middleware = {
    main: main_1.NASS_Verification_Process,
    check: {
        ucr: check_ucr_1.isUCRType,
        blacklist: check_blacklist_1.checkBlacklist,
        origin: check_request_origin_1.checkRequestOrigin,
        rates: check_rates_1.checkRates
    }
};
exports["default"] = middleware;
