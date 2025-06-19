import { isUCRType } from "./methods/scv/check-ucr";
import { NASS_Verification_Process } from "./main";
import { checkBlacklist } from "./methods/scv/check-blacklist";
import { checkRequestOrigin } from "./methods/scv/check-request-origin";
import { checkRates } from "./methods/scv/check-rates";
import { scv } from "./process/scv";
import { ssv } from "./process/ssv";

const middleware = {
    main : NASS_Verification_Process,
    check : {
        ucr : isUCRType,
        blacklist : checkBlacklist,
        origin : checkRequestOrigin,
        rates : checkRates
    },
    process : {
        scv : scv,
        ssv : ssv
    }
}

export default middleware;