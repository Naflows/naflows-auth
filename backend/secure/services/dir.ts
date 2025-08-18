import { getService } from "./get-service";
import { registerService } from "./register.service";
import { createService } from "./service-create.user";
import { generateServiceToken } from "./services-token/secure-tokenization/generate.token";



export const services = {
    service: {
        register : registerService,
        get : getService,
        build : createService
    },
    token : {
        new : generateServiceToken
    }
}