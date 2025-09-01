import { crypt, hashID, verifyHash } from "./hash/hash";
import { blacklistIP } from "./ip/blacklist";
import findSessionByConnection from "./session/findByConnection";
import getSession from "./session/get";
import renewSessionId from "./session/renew-id";
import getToken from "./token/get";
import { createToken } from "./token/new-token";
import { isTokenValid } from "./token/token-valid";
import { updateTokenUse } from "./token/use-update";
import { checkUserCredentials } from "./user/checkCredentials";
import getUser from "./user/get";
import logUserIn from "./user/login";


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
        get : getUser,
        login : logUserIn
    },
    session : {
        renew : renewSessionId,
        get : getSession,
        find : findSessionByConnection
    }
};

export default secure;