import { isUCRType } from "./methods/check-ucr";
import { NASS_Verification_Process } from "./main";
import { checkBlacklist } from "./methods/check-blacklist";
import { checkRequestOrigin } from "./methods/check-request-origin";
import { checkRates } from "./methods/check-rates";

const middleware = {
    main : NASS_Verification_Process,
    check : {
        ucr : isUCRType,
        blacklist : checkBlacklist,
        origin : checkRequestOrigin,
        rates : checkRates
    }
}

export default middleware;