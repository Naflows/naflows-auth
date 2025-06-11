"use strict";
exports.__esModule = true;
exports.isUCRType = void 0;
function isUCRType(obj) {
    return typeof obj === 'object' &&
        obj !== null &&
        typeof obj.user === 'object' &&
        typeof obj.user.ip === 'string' &&
        typeof obj.user.agent === 'string' &&
        typeof obj.user.session_id === 'string' &&
        (obj.user.token === undefined || typeof obj.user.token === 'string') &&
        (obj.user.identifier === undefined || typeof obj.user.identifier === 'string') &&
        (obj.user.password === undefined || typeof obj.user.password === 'string') &&
        typeof obj.user.device_fingerprint === 'string' &&
        typeof obj.user.user_origin === 'string' &&
        typeof obj.client === 'object' &&
        typeof obj.client.ip === 'string' &&
        typeof obj.client.dns === 'string' &&
        typeof obj.client.service === 'string' &&
        typeof obj.client.service_token === 'string' &&
        typeof obj.client.service_token_birth === 'number' &&
        (obj.client.service_status === undefined || typeof obj.client.service_status === 'string') &&
        typeof obj.request === 'object' &&
        typeof obj.request.method === 'string' &&
        typeof obj.request.url === 'string' &&
        typeof obj.request.headers === 'object' &&
        obj.request.headers !== null &&
        !Array.isArray(obj.request.headers) &&
        Object.values(obj.request.headers).every(function (val) { return typeof val === 'string'; }) &&
        (obj.request.body === undefined || true) &&
        (obj.request.query === undefined || (typeof obj.request.query === 'object' &&
            obj.request.query !== null &&
            !Array.isArray(obj.request.query) &&
            Object.values(obj.request.query).every(function (val) { return typeof val === 'string'; }))) &&
        typeof obj.request.request_date === 'number';
}
exports.isUCRType = isUCRType;
