import { analyze2FAContext } from "./methods/analyze-context";
import { generate2FACode } from "./methods/generate-code";
import { generate2FARequest } from "./methods/generate-request";
import { createTwoFALog } from "./methods/log/createLog";
import { get2FALogs } from "./methods/log/getLog";
import { updateTwoFALogState } from "./methods/log/updateState";


export const twoFA = {
    generateRequest : generate2FARequest,
    generateCode:  generate2FACode,
    analysis : {
        context :analyze2FAContext
    },
    logs : {
        get : get2FALogs,
        create : createTwoFALog,
        update : updateTwoFALogState
    }
}