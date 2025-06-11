"use strict";
exports.__esModule = true;
var check_ucr_1 = require("./methods/check-ucr");
var middleware = {
    check: {
        isUCR: check_ucr_1.isUCRType
    }
};
exports["default"] = middleware;
