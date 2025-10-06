import { createAPIKey } from "./keys/create";
import { getKeyByIPID } from "./keys/get-by-api";
import { getKeyByValue } from "./keys/get-by-value";
import { devLogin } from "./methods/dev/dev-check";
import { isDevFromService } from "./methods/dev/is-dev";
import { registerServiceDev } from "./methods/dev/register-dev";
import { generateBasicServiceTunnels } from "./methods/generate-basic-service-tunnels";
import { generateApiID } from "./methods/generate-key";
import { getPlans } from "./methods/get-plans";
import { getPublicServiceDetails } from "./methods/get-public-details";
import { getService } from "./methods/get-service";
import { registerService } from "./methods/register.service";
import { createService } from "./methods/service-create.user";
import { updateService } from "./methods/update-service";
import checkServiceToken from "./services-token/secure-tokenization/check.token";
import { generateServiceToken } from "./services-token/secure-tokenization/generate.token";
import getAPIToken from "./services-token/secure-tokenization/get-api.token";
import { isUserInService } from "./user-registration/isUserIn";
import registerUserInAPI from "./user-registration/register";
import isRegistrationTokenValid from "./user-registration/token-valid";



export const services = {
    service: {
        register : registerService,
        get : getService,
        build : createService,
        generateID : generateApiID,
        update: updateService,
        user: {
            register : registerUserInAPI,
            isIn : isUserInService,
            isDev : isDevFromService
        },
        dev : {
            register : registerServiceDev,
            login : devLogin
        },
        key : {
            getByApi : getKeyByIPID,
            getByValue : getKeyByValue,
            create : createAPIKey
        },
        setup : {
            basic : generateBasicServiceTunnels
        },
        getPlans: getPlans,
        getPublicDetails : getPublicServiceDetails
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