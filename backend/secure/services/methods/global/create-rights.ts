import { Request, Response } from "express";
import { User } from "../../../../types/.types/collections.type";
import { services } from "../../dir";


export async function createRights(req: Request, res: Response, user: User) {
    const {
        service_id,
        name,
        type,
        deletable,
        rights
    } = req.body;

    const re = await services.service.rights.create(service_id, name, rights, deletable, type, user.id);
    if (re.success) {
        return res.status(200).json({
            success: true,
            message: "Rights set created successfully.",
            data: {
                right: res.data,
                middleware: req.middleware.data,
            }
        });
    } else {
        return res.status(re.status).json({
            success: false,
            message: re.message || "Failed to create rights set.",
            data: {
                middleware: req.middleware.data,
            }
        });
    }

}