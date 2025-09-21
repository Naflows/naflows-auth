import { generateApiID } from "./methods/generate-key";
import { getPlans } from "./methods/get-plans";
import { getService } from "./methods/get-service";
import { registerService } from "./methods/register.service";
import { createService } from "./methods/service-create.user";
import checkServiceToken from "./services-token/secure-tokenization/check.token";
import { generateServiceToken } from "./services-token/secure-tokenization/generate.token";
import getAPIToken from "./services-token/secure-tokenization/get-api.token";
import registerUserInAPI from "./user-registration/register";
import isRegistrationTokenValid from "./user-registration/token-valid";



export const services = {
    service: {
        register : registerService,
        get : getService,
        build : createService,
        generateID : generateApiID,
        user: {
            register : registerUserInAPI
        },
        getPlans: getPlans
    },
    token : {
        new : generateServiceToken,
        get : getAPIToken,
        check : checkServiceToken
    },
    userRegistration : {
        isTokenValid : isRegistrationTokenValid
    }
}