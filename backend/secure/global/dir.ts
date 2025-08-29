import { crypt, hashID, verifyHash } from "./hash/hash";
import { blacklistIP } from "./ip/blacklist";
import getSession from "./session/get";
import renewSessionId from "./session/renew-id";
import { checkUserCredentials } from "./user-token/methods/check-credentials";
import { createToken } from "./user-token/methods/new-token";
import { isTokenValid } from "./user-token/methods/token-valid";
import { updateTokenUse } from "./user-token/methods/use-update";
import getToken from "./user-token/token/get";
import getUser from "./user-token/user/get";


const secure = {
    crypt : crypt,
    verify : verifyHash,
    hash : hashID,
    blacklist : blacklistIP,
    token : {
        valid : isTokenValid,
        create : createToken,
        updateUse : updateTokenUse,
        get : getToken
    },
    user: {
        credentials : checkUserCredentials,
        get : getUser
    },
    session : {
        renew : renewSessionId,
        get : getSession
    }
};

export default secure;