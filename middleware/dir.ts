import { isUCRType } from "./methods/check-ucr";
import { NASS_Verification_Process } from "./main";
import { checkBlacklist } from "./methods/check-blacklist";
import { checkRequestOrigin } from "./methods/check-request-origin";

const middleware = {
    main : NASS_Verification_Process,
    check : {
        ucr : isUCRType,
        blacklist : checkBlacklist,
        origin : checkRequestOrigin
    }
}

export default middleware;