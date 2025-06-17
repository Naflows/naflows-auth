import { crypt, verifyHash } from "./hash/hash";
import { blacklistIP } from "./ip/blacklist";


const secure = {
    crypt : crypt,
    verify : verifyHash,
    blacklist : blacklistIP,
};

export default secure;