"use strict";
exports.__esModule = true;
exports.isUCRType = void 0;
function isUCRType(obj) {
    function isValidUser(user) {
        return (user != undefined &&
            user.ip != undefined &&
            user.agent != undefined &&
            user.session_id != undefined &&
            user.device_fingerprint != undefined &&
            user.user_origin != undefined &&
            (user.token != undefined || (user.identifier != undefined && user.password != undefined)) &&
            typeof user.ip === 'string' &&
            typeof user.agent === 'string' &&
            typeof user.session_id === 'string' &&
            typeof user.device_fingerprint === 'string' &&
            typeof user.user_origin === 'string' &&
            (typeof user.token === 'string' || (typeof user.identifier === 'string' && typeof user.password === 'string')));
    }
    function isValidClient(client) {
        return (client != undefined &&
            client.ip != undefined &&
            client.dns != undefined &&
            client.service != undefined &&
            client.service_token != undefined &&
            client.service_token_birth != undefined &&
            typeof client.ip === 'string' &&
            typeof client.dns === 'string' &&
            typeof client.service === 'string' &&
            typeof client.service_token === 'string' &&
            typeof client.service_token_birth === 'number' &&
            (client.service_status === undefined || typeof client.service_status === 'string'));
    }
    function isValidRequest(request) {
        return (request != undefined &&
            request.method != undefined &&
            request.url != undefined &&
            request.headers != undefined &&
            request.request_date != undefined &&
            typeof request.method === 'string' &&
            typeof request.url === 'string' &&
            typeof request.headers === 'object' &&
            (request.body === undefined || typeof request.body === 'object') &&
            (request.query === undefined || typeof request.query === 'object') &&
            typeof request.request_date === 'number' &&
            (request.request_additional === undefined || typeof request.request_additional === 'string'));
    }
    var userValid = isValidUser(obj.user);
    var clientValid = isValidClient(obj.client);
    var requestValid = isValidRequest(obj.request);
    // console.log("UCR validation results:", {
    //     userValid,
    //     clientValid,
    //     requestValid
    // });
    return (userValid &&
        clientValid &&
        requestValid);
}
exports.isUCRType = isUCRType;
