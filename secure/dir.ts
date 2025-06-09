import { crypt } from "./hash/hash";
import { blacklistIP } from "./ip/blacklist";


const secure = {
    check : 0,
    add : 0,
    deactivate : 0,
    block : 0,
    crypt : crypt,
    blacklist : blacklistIP
};

export default secure;