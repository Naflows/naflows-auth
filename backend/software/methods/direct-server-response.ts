import { Response, Request } from 'express';

export async function directServerResponse(status: number, message: string, res : Response, req : Request, data: any = {}) {
    return res.status(status).json({
        success: status >= 200 && status < 300,
        message,
        status,
        data: {
            ...data,
            status,
            success: status >= 200 && status < 300,
            message,
            middleware : req.middleware.data
        }
    })
}