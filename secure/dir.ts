import { crypt, hashID, verifyHash } from "./hash/hash";
import { blacklistIP } from "./ip/blacklist";
import { getSession } from "./session/get";
import renewSessionId from "./session/renew-id";
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
    session : {
        renew : renewSessionId
    }
};

export default secure;