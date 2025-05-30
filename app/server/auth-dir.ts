/*

    The AUTH directory is the starting point of 
    the NAFLOWS authentication system.

*/

import { build } from "./auth/build";
import getToken from "./auth/token/get-token";
import getUser from "./auth/user/get-user";

const auth = {
    build : build,
    getters : {
        user : getUser,
        token : getToken
    }
};

export default auth;