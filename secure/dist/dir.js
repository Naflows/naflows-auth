"use strict";
exports.__esModule = true;
var hash_1 = require("./hash/hash");
var blacklist_1 = require("./ip/blacklist");
var secure = {
    check: 0,
    add: 0,
    deactivate: 0,
    block: 0,
    crypt: hash_1.crypt,
    blacklist: blacklist_1.blacklistIP
};
exports["default"] = secure;
