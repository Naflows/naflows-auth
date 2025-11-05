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
import { createToken } from "./token/create";
import updateToken from "./token/renew-token";
import { isTokenValid } from "./token/token-valid";
import { updateWholeToken } from "./token/update";
import { updateTokenUse } from "./token/use-update";
import { checkUserCredentials } from "./user/check-credentials";
import getUser from "./user/get";
import logUserIn from "./user/login/index";
import { hiddenLogin } from "./user/login/hidden-login";
import { isSessionValid } from "./session/valid";
import { updateUser } from "./user/update";
import { getTokenByValue } from "./token/getByValue";
import getSystemStatus from "../health/getSystemStatus";
import manageConnection from "./user/manage-connection";
import { sendVerificationCode } from "./user/send-code";
import { createSecurityCode } from "./security-code/methods/create-code";
import { verifySecurityCode } from "./security-code/methods/verify-code";
import { getSecurityCode } from "./security-code/methods/get-code";
import { invalidateSecurityCode } from "./security-code/methods/invalidate-code";
import { logout } from "./user/logout";
import deleteSession from "./session/delete";
import { getUserByUsername } from "./user/get-by-username";


const secure = {
    crypt : crypt,
    verify : verifyHash,
    hash : hashID,
    blacklist : blacklistIP,
    system : {
        status : getSystemStatus
    },
    token : {
        valid : isTokenValid,
        create : createToken,
        updateUse : updateTokenUse,
        get : getToken,
        getByValue : getTokenByValue,
        delete : deleteToken,
        renew : updateToken,
        update : updateWholeToken
    },
    code : {
        create :  createSecurityCode,
        check : verifySecurityCode,
        get: getSecurityCode,
        invalidate : invalidateSecurityCode
    },
    user: {
        credentials : checkUserCredentials,
        get : getUser,
        login : logUserIn,
        hiddenLogin : hiddenLogin,
        update : updateUser,
        manageConnection : manageConnection,
        sendVerificationCode : sendVerificationCode,
        logout : logout,
        getByUsername : getUserByUsername
    },
    session : {
        renew : renewSessionId,
        get : getSession,
        find : findSessionByConnection,
        create : createSession,
        confirm : confirmSession,
        update : updateSession,
        valid : isSessionValid,
        delete : deleteSession,
    }
};

export default secure;