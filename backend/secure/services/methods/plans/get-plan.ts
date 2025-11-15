import { ServicePlan } from "../../../../types/.types/collections.type";
import { services } from "../../dir";


export async function getPlan(plan_id : number) : Promise<ServicePlan | null> {
    const plans = await services.service.plan.getAll();
    if (!plans.success) return null;

    const plan = plans.data.plans.find((p: ServicePlan) => p.id === plan_id);
    return plan || null;
}