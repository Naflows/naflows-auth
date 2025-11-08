import UCRType from "../../../types/.types/ucr.type";

export function isUCRType(obj: any): boolean {
    function isValidUser(user : any) {
        return (
            user != undefined &&
            user.ip != undefined && 
            user.agent != undefined &&
            user.user_id != undefined &&
            (user.token != undefined || (user.identifier != undefined && user.password != undefined)) &&
            !(user.token != undefined && (user.identifier != undefined || user.password != undefined)) &&
            typeof user.ip === 'string' &&
            typeof user.agent === 'string' &&
            (
                typeof user.session_id === 'string' ||
                typeof user.session_id === 'undefined' ||
                user.session_id === null
            ) &&
            typeof user.user_id === 'string' &&
            (
                typeof user.device_fingerprint === 'object' ||
                typeof user.device_fingerprint === 'undefined'
            ) &&
            (typeof user.token === 'string' || (typeof user.identifier === 'string' && typeof user.password === 'string'))
        )
    }

    function isValidClient(client : any) {
        return (
            client != undefined &&
            client.ip != undefined &&
            client.service != undefined &&
            client.service_token != undefined &&
            client.service_token_birth != undefined &&
            typeof client.ip === 'string' &&
            typeof client.service === 'string' &&
            typeof client.service_token === 'string' &&
            typeof client.service_token_birth === 'number' &&
            (client.service_status === undefined || typeof client.service_status === 'string')
        )
    }

    function isValidRequest(request : any) {
        return (
            request != undefined &&
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
            (request.request_additional === undefined || typeof request.request_additional === 'string')
        )
    }

    const userValid = isValidUser(obj.user);
    const clientValid = isValidClient(obj.client);
    const requestValid = isValidRequest(obj.request);

    return (
        userValid &&
        clientValid &&
        requestValid
    );
}
