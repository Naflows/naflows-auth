import { get } from "mongoose";
import { createAPIKey } from "./keys/create";
import { getKeyByIPID } from "./keys/get-by-api";
import { getKeyByValue } from "./keys/get-by-value";
import { createServiceLogEntry } from "./logs/create";
import { getServiceLogs } from "./logs/get";
import { devLogin } from "./methods/dev/dev-check";
import { getUserByKey } from "./methods/dev/get-user-by-key";
import { isDevFromService } from "./methods/dev/is-dev";
import { getDevKeyByValue } from "./methods/dev/key-by-value";
import { registerServiceDev } from "./methods/dev/register-dev";
import { generateBasicServiceTunnels } from "./methods/generate-basic-service-tunnels";
import { generateApiID } from "./methods/generate-key";
import { getPlans } from "./methods/get-plans";
import { getPublicServiceDetails } from "./methods/get-public-details";
import { getService } from "./methods/get-service";
import { getLogsRoutes } from "./methods/global/get-logs";
import { updateServiceRoute } from "./methods/global/update-service";
import { registerService } from "./methods/register.service";
import { createService } from "./methods/service-create.user";
import { updateService } from "./methods/update-service";
import { assignServiceRights } from "./rights/methods/assign";
import { createServiceRights } from "./rights/methods/create";
import { getRight } from "./rights/methods/get";
import { getAllRights } from "./rights/methods/get-all-rights";
import checkServiceToken from "./services-token/secure-tokenization/check.token";
import { generateServiceToken } from "./services-token/secure-tokenization/generate.token";
import getAPIToken from "./services-token/secure-tokenization/get-api.token";
import { isUserInService } from "./user-registration/isUserIn";
import registerUserInAPI from "./user-registration/register";
import isRegistrationTokenValid from "./user-registration/token-valid";
import { getRights } from "./methods/global/get-rights";
import { getRightsByUser } from "./rights/methods/get-by-user";
import { createRights } from "./methods/global/create-rights";



export const services = {
    routes: {
        update: updateServiceRoute,
        logs: getLogsRoutes,
        getRights: getRights,
        createRights : createRights
    },
    service: {
        register: registerService,
        get: getService,
        build: createService,
        generateID: generateApiID,
        global: {
            update: updateService,
        },
        user: {
            register: registerUserInAPI,
            isIn: isUserInService,
            isDev: isDevFromService,
            getKeyByValue: getDevKeyByValue,
            getRights : getRightsByUser
        },
        logs: {
            create: createServiceLogEntry,
            get: getServiceLogs
        },
        dev: {
            register: registerServiceDev,
            login: devLogin,
            getUserByKey: getUserByKey
        },
        key: {
            getByApi: getKeyByIPID,
            getByValue: getKeyByValue,
            create: createAPIKey
        },
        setup: {
            basic: generateBasicServiceTunnels
        },
        rights: {
            create: createServiceRights,
            get: getRight,
            assign: assignServiceRights,
            getAll: getAllRights
        },
        getPlans: getPlans,
        getPublicDetails: getPublicServiceDetails
    },
    token: {
        new: generateServiceToken,
        get: getAPIToken,
        check: checkServiceToken
    },
    userRegistration: {
        isTokenValid: isRegistrationTokenValid
    }
}