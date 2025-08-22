import { getService } from "./get-service";
import { registerService } from "./register.service";
import { createService } from "./service-create.user";
import checkServiceToken from "./services-token/secure-tokenization/check.token";
import { generateServiceToken } from "./services-token/secure-tokenization/generate.token";
import getAPIToken from "./services-token/secure-tokenization/get-api.token";



export const services = {
    service: {
        register : registerService,
        get : getService,
        build : createService
    },
    token : {
        new : generateServiceToken,
        get : getAPIToken,
        check : checkServiceToken
    }
}