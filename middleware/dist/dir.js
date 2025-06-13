"use strict";
exports.__esModule = true;
var check_ucr_1 = require("./methods/check-ucr");
var main_1 = require("./main");
var check_blacklist_1 = require("./methods/check-blacklist");
var middleware = {
    main: main_1.NASS_Verification_Process,
    check: {
        isUCR: check_ucr_1.isUCRType,
        blacklist: check_blacklist_1.checkBlacklist
    }
};
exports["default"] = middleware;
