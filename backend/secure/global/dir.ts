import renewToken from "../../middleware/methods/stv/renew-token";
import { crypt, hashID, verifyHash } from "./hash/hash";
import { blacklistIP } from "./ip/blacklist";
import confirmSession from "./session/confirmSession";
import { createSession } from "./session/create";
import findSessionByConnection from "./session/findByConnection";
import getSession from "./session/get";
import renewSessionId from "./session/renew-id";
import { updateSession } from "./session/update";
import deleteToken from "./token/delete";
import getToken from "./token/get";
import { createToken } from "./token/new-token";
import updateToken from "./token/renew-token";
import { isTokenValid } from "./token/token-valid";
import { updateWholeToken } from "./token/update";
import { updateTokenUse } from "./token/use-update";
import { checkUserCredentials } from "./user/check-credentials";
import getUser from "./user/get";
import { hiddenLogin } from "./user/hidden-login";
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
        get : getToken,
        delete : deleteToken,
        renew : updateToken,
        update : updateWholeToken
    },
    user: {
        credentials : checkUserCredentials,
        get : getUser,
        login : logUserIn,
        hiddenLogin : hiddenLogin
    },
    session : {
        renew : renewSessionId,
        get : getSession,
        find : findSessionByConnection,
        create : createSession,
        confirm : confirmSession,
        update : updateSession
    }
};

export default secure;