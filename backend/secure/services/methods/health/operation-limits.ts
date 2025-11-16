import { software } from "../../../../software/dir";
import { ReplyType } from "../../../../types/.types/reply.type";
import { services } from "../../dir";


export async function serviceOperationLimits(service_id: string) : Promise<ReplyType> {
    const service = await services.service.get(service_id);
    if (!service) {
        return software.methods.serverReply(404, "Service not found.");
    }

    const s = service.data.service;
    const plan = await services.plan.get(s.plan.plan);
}