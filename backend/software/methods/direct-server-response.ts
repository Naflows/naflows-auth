import { Response, Request } from 'express';

export async function directServerResponse(status: number, message: string, res : Response, req : Request, data: any = {}) {
    const success = status >= 200 && status < 300;
    const additionalMiddlewareData = data.middleware || {};
    
    // Merge any additional middleware data into req.middleware.data
    if (req.middleware) {
        req.middleware.data = {
            ...req.middleware.data,
            ...additionalMiddlewareData
        };
    }

    return res.status(status).json({
        // These are data sent to the backend client
        success,
        message,
        status,
        data: {
            // These are data sent to the frontend client
            ...data,
            status,
            success,
            message,
            middleware : req.middleware ? req.middleware.data : {}
        }
    })
}