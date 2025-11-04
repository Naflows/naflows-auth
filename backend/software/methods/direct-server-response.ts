import { Response, Request } from 'express';

export async function directServerResponse(status: number, message: string, res : Response, req : Request, data: any = {}) {
    const success = status >= 200 && status < 300;
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