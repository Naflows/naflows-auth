import { crypt, verifyHash } from "./hash/hash";
import { blacklistIP } from "./ip/blacklist";
import { createToken } from "./user-token/new-token";
import { isTokenValid } from "./user-token/token-valid";
import { updateTokenUse } from "./user-token/use-update";


const secure = {
    crypt : crypt,
    verify : verifyHash,
    blacklist : blacklistIP,
    token : {
        valid : isTokenValid,
        create : createToken,
        updateUse : updateTokenUse
    }
};

export default secure;