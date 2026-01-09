import { services } from "../../dir";


export async function isServiceGloballyApproved(serviceId: string): Promise<boolean> {
    const service = await services.service.get(serviceId, false);
    if (!service) {
        return false;
    }

    const serviceData = service.data.service;
    return serviceData.approved && serviceData.details.public.contact_email.approved === true &&
        serviceData.details.public.privacy_policy_url.approved === true &&
        serviceData.details.public.terms_of_service_url.approved === true;
}