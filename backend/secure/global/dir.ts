import { crypt, hashID, verifyHash } from "./hash/hash";
import { blacklistIP } from "./ip/blacklist";
import renewSessionId from "./session/renew-id";
import { checkUserCredentials } from "./user-token/methods/check-credentials";
import { createToken } from "./user-token/methods/new-token";
import { isTokenValid } from "./user-token/methods/token-valid";
import { updateTokenUse } from "./user-token/methods/use-update";


const secure = {
    crypt : crypt,
    verify : verifyHash,
    hash : hashID,
    blacklist : blacklistIP,
    token : {
        valid : isTokenValid,
        create : createToken,
        updateUse : updateTokenUse
    },
    user: {
        credentials : checkUserCredentials
    },
    session : {
        renew : renewSessionId
    }
};

export default secure;