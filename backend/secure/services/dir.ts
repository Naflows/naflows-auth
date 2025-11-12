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
import { getApiKey } from "./methods/global/get-api-key";
import { checkUserAccess } from "./methods/global/check-user-access";
import { setTrafficLogs } from "./logs/set-traffic-log";
import { getTrafficLogRoute } from "./methods/global/get-traffic-log";
import { getTrafficLog } from "./logs/get-traffic-log";
import { getKeyByUser } from "./methods/dev/key-by-user";
import { getServiceAlerts } from "./methods/get-service-alerts";
import { getServiceUsers } from "./methods/get-users";
import { getUsers } from "./methods/global/get-users";
import { userHasRight } from "./rights/methods/hasRight";
import { canUserManageOthers } from "./rights/methods/can-user-manage-others";
import { assignRights } from "./methods/global/assign-rights";
import { updateRights } from "./rights/methods/update-rights";
import { getUserServices } from "./methods/get-own-services";
import { unregisterDev } from "./methods/dev/unregister-dev";
import { NassAuthorForDev } from "./methods/dev/all-nass-author";
import { updateRightsRoute } from "./methods/global/update-rights";
import { updateLiteralRight } from "./rights/methods/update-right";
import { canUserEdit } from "./rights/methods/can-user-edit";



export const services = {
    routes: {
        update: updateServiceRoute,
        logs: getLogsRoutes,
        getRights: getRights,
        createRights : createRights,
        serviceKey : getApiKey,
        canAccess : checkUserAccess,
        traffic : getTrafficLogRoute,
        getUsers : getUsers,
        assignRights : assignRights,
        updateRights:  updateRightsRoute
    },
    service: {
        register: registerService,
        get: getService,
        build: createService,
        generateID: generateApiID,
        getAlerts : getServiceAlerts,
        global: {
            update: updateService,
        },
        user: {
            register: registerUserInAPI,
            isIn: isUserInService,
            isDev: isDevFromService,
            getKeyByValue: getDevKeyByValue,
            getRights : getRightsByUser,
            getAll : getServiceUsers,
            hasRight : userHasRight,
            canManageUserInService : canUserManageOthers,
            updateRights : updateRights,
            getAllService : getUserServices
        },
        logs: {
            create: createServiceLogEntry,
            get: getServiceLogs,
            getTraffic : getTrafficLog,
            setTraffic : setTrafficLogs
        },
        dev: {
            register: registerServiceDev,
            login: devLogin,
            getUserByKey: getUserByKey,
            getKey : getKeyByUser,
            unregister : unregisterDev,
            authorizations: NassAuthorForDev
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
            getAll: getAllRights,
            update : updateLiteralRight,
            canUserEdit : canUserEdit
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