import * as crypto from 'crypto';



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

