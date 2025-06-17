"use strict";
exports.__esModule = true;
exports.verifyHash = exports.crypt = void 0;
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
function verifyHash(value, hash) {
    var _a = hash.split(':'), iterations = _a[0], salt = _a[1], originalHash = _a[2];
    var keylen = 64;
    var digest = 'sha512';
    // Recompute the hash with the same parameters
    var computedHash = crypto.pbkdf2Sync(value, salt, parseInt(iterations), keylen, digest).toString('hex');
    return computedHash === originalHash;
}
exports.verifyHash = verifyHash;
