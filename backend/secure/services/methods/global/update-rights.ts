import { User } from "../../../../types/.types/collections.type";
import { Request, Response } from "express";
import { services } from "../../dir";
import { software } from "../../../../software/dir";
import { ServiceRights } from "../../../../types/.types/tunneling.type";

export async function updateRightsRoute(req: Request, res: Response, user: User) {
    const userID = user.id;
    const service = await services.service.get(req.body.serviceID);
    if (!service) {
        return software.methods.directResponse(404, "Service not found.", res, req);
    }

    const hasRights = await services.service.user.hasRight(userID, service.data.service.id, "MANAGE_USERS");

    if (!hasRights) {
        return software.methods.directResponse(403, "Forbidden: You do not have permission to update user rights for this service.", res, req);
    }

    const rights = req.body.rights as ServiceRights[];
    const type = req.body.type || "order";

    if (!Array.isArray(rights)) {
        return software.methods.directResponse(400, "Bad Request: 'rights' must be an array.", res, req);
    }


    if (type === "order") {
        // Check that all rights have a different order number

        const orderSet = new Set<number>();
        for (const right of rights) {
            if (orderSet.has(right.order)) {
                return software.methods.directResponse(400, "Bad Request: All rights must have a unique order number.", res, req);
            }
            orderSet.add(right.order);
        }

        if (orderSet.size !== rights.length) {
            return software.methods.directResponse(400, "Bad Request: All rights must have a unique order number.", res, req);
        }


        rights.forEach(async (right) => {
            const r = await services.service.rights.get(right.id, service.data.service.id, "SERVICE_BY_NASS");
            if (!r) {
                return software.methods.directResponse(404, `Right with ID ${right.id} not found in the specified service.`, res, req);
            }

            if (r.order !== right.order) {
                console.log("Updating order for right:", right.name, "from", r.order, "to", right.order);
                r.order = right.order;
                const rt = await services.service.rights.update(right, user, service.data.service);
                if (!rt.success) {
                    return software.methods.directResponse(rt.status, `Failed to update right with ID ${right.id}.`, res, req);
                }
            }
        });

        return software.methods.directResponse(200, "Rights order updated successfully.", res, req);
    } else if (type == "single") {
        if (rights.length !== 1) {
            return software.methods.directResponse(400, "Bad Request: For 'single' type, exactly one right must be provided.", res, req);
        }

        const right = rights[0];
        const r = await services.service.rights.get(right.id, service.data.service.id, "SERVICE_BY_NASS");
        if (!r) {
            return software.methods.directResponse(404, `Right with ID ${right.id} not found in the specified service.`, res, req);
        }

        // Update only allowed fields (e.g., name, description)
        if (right.name.length < 3 || right.name.length > 50) {
            return software.methods.directResponse(400, "Bad Request: Right name must be between 3 and 50 characters.", res, req);
        }

        if (right.hue.length < 1 || right.hue.length > 3) {
            return software.methods.directResponse(400, "Bad Request: Right hue must be between 1 and 3 characters.", res, req);
        }

        if (right.rights.length < 1) {
            return software.methods.directResponse(400, "Bad Request: Right must have at least one permission.", res, req);
        }

        r.name = right.name;
        r.hue = right.hue;
        r.rights = right.rights;
        r.description = right.description;

        const rt = await services.service.rights.update(r, user, service.data.service);
        if (!rt.success) {
            return software.methods.directResponse(500, `Failed to update right with ID ${right.id}.`, res, req);
        }



        return software.methods.directResponse(200, "Right updated successfully.", res, req);
    } else {
        return software.methods.directResponse(400, "Bad Request: Invalid update type.", res, req);
    }
}