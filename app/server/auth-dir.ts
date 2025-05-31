/*

    The AUTH directory is the starting point of 
    the NAFLOWS authentication system.

*/

import { build } from "./auth/build";
import getToken from "./auth/token/get-token";
import getUser from "./auth/user/get-user";
import crypto from 'crypto';

const auth = {
    build : build,
    getters : {
        user : getUser,
        token : getToken
    },
    hash : (data: string): string => {
        const hash = crypto.createHash('sha256');
        hash.update(data);
        return hash.digest('hex');
    }
};

export default auth;