import { executeContract } from "../contract/core/execute.contract";
import { getContractByID } from "../contract/core/get.contract";
import { issueContract } from "../contract/core/issuing.contract";
import { outdateContract } from "../contract/core/oudate.contract";
import { updateContract } from "../contract/core/update.contract";
import { isContractValid } from "../contract/core/validate.contract";
import { crypt, hashID, verifyHash } from "./hash/hash";
import { blacklistIP } from "./ip/blacklist";
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
    },
    contract : {
        create : issueContract,
        get : getContractByID,
        execute : executeContract,
        isValid : isContractValid,
        oudate : outdateContract,
        update : updateContract
    }
};

export default secure;