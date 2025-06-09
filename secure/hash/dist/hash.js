"use strict";
exports.__esModule = true;
exports.crypt = void 0;
var crypto = require("crypto");
function crypt(value) {
    if (!value) {
        throw new Error('Value must be defined for hashing');
    }
    // Use PBKDF2 with SHA-512 for secure password hashing
    var salt = crypto.randomBytes(16).toString('hex');
    var iterations = 100000;
    var keylen = 64;
    var digest = 'sha512';
    var hash = crypto.pbkdf2Sync(value, salt, iterations, keylen, digest).toString('hex');
    // Store salt and hash together for verification
    return iterations + ":" + salt + ":" + hash;
}
exports.crypt = crypt;
