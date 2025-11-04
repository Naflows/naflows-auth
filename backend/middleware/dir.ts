import { isUCRType } from "./methods/scv/check-ucr";
import { NASS_Verification_Process } from "./main";
import { checkBlacklist } from "./methods/scv/check-blacklist";
import { checkRequestOrigin } from "./methods/scv/check-request-origin";
import { checkRates } from "./methods/scv/rates/check";
import { scv } from "./process/scv";
import { ssv } from "./process/ssv";
import { sessionRenewal } from "./methods/ssv/session-renewal";
import { stv } from "./process/stv";
import renewToken from "./methods/stv/renew-token";
import { checkRenewalViaUCR } from "./methods/stv/renewal.via-ucr";
import { checkTokenRights } from "./methods/stv/check-rights";
import createRateRecordForService from "./methods/scv/rates/create-service-rates";

const middleware = {
    main: NASS_Verification_Process,
    check: {
        ucr: isUCRType,
        blacklist: checkBlacklist,
        origin: checkRequestOrigin,
        rates: checkRates,
    },
    rates: {
        create: createRateRecordForService,
        check: checkRates
    },
    session: {
        renewal: sessionRenewal
    },
    token: {
        renewal: renewToken,
        ucrRenewal: checkRenewalViaUCR,
        rights: checkTokenRights
    },
    process: {
        scv: scv,
        ssv: ssv,
        stv: stv
    }
}

export default middleware;