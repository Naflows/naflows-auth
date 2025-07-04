const crypto = require('crypto');


export function crypt(value: string | undefined): string {
    if (!value) {
        throw new Error('Value must be defined for hashing');
    }
    // Use PBKDF2 with SHA-512 for secure password hashing
    const salt = crypto.randomBytes(16).toString('hex');
    const iterations = 100_000;
    const keylen = 64;
    const digest = 'sha512';

    const hash = crypto.pbkdf2Sync(value, salt, iterations, keylen, digest).toString('hex');
    // Store salt and hash together for verification
    return `${iterations}:${salt}:${hash}`;
}

export function verifyHash(value: string, hash: string): boolean {
    const [iterations, salt, originalHash] = hash.split(':');
    const keylen = 64;
    const digest = 'sha512';

    // Recompute the hash with the same parameters
    const computedHash = crypto.pbkdf2Sync(value, salt, parseInt(iterations), keylen, digest).toString('hex');
    return computedHash === originalHash;
}


