import { isUCRType } from "./methods/check-ucr";
import { NASS_Verification_Process } from "./main";
import { checkBlacklist } from "./methods/check-blacklist";

const middleware = {
    main : NASS_Verification_Process,
    check : {
        isUCR : isUCRType,
        blacklist : checkBlacklist
    }
}

export default middleware;