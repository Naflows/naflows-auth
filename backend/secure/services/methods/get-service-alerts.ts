import { software } from "../../../software/dir";
import { ServiceAlert } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";
import { services } from "../dir";


export async function getServiceAlerts(serviceId: string) : Promise<ReplyType> {
    const service = await services.service.get(serviceId);
    if (!service.success) {
        return software.methods.serverReply(500, "Failed to retrieve service.");
    }

    const serviceData = service.data.service;

    const alerts : ServiceAlert[] = [];

    if (
        !serviceData.approved 
    ) {
        alerts.push({
            title: "Service Not Approved",
            message: "Your service is not approved yet.",
            type: "warning",
            instructions : "Please ensure all required information is provided and complies with our guidelines.",
            link : "/account/services/"+serviceData.id+"/settings"
        });
    }

    if (
        serviceData.public_settings.allow_user_registration === false
    ) {
        alerts.push({
            title: "User Registration Disabled",
            message: "User registration is currently disabled for this service.",
            type: "info",
            instructions : "Enable user registration in the service settings to allow new users to sign up.",
            link : "/account/services/"+serviceData.id+"/settings"
        });
    }

    if (serviceData.details.public.privacy_policy_url.approved === false) {
        alerts.push({
            title: "Privacy Policy Not Approved",
            message: "The privacy policy URL for this service is not approved. Please provide a valid file.",
            type: "warning",
            instructions : "Upload a valid privacy policy document to comply with regulations.",
            link : "/account/services/"+serviceData.id+"/legal"
        });
    }

    if (serviceData.details.public.terms_of_service_url.approved === false) {
        alerts.push({
            title: "Terms of Service Not Approved",
            message: "The terms of service URL for this service is not approved. Please provide a valid file.",
            type: "warning",
            instructions : "Upload a valid terms of service document to ensure users are informed.",
            link : "/account/services/"+serviceData.id+"/legal"
        });
    }

    if (serviceData.details.public.contact_email.approved === false) {
        alerts.push({
            title: "Contact Email Not Approved",
            message: "The contact email for this service is not approved. Please provide a valid email address.",
            type: "warning",
            instructions : "Update the contact email to a valid address for user support.",
            link : "/account/services/"+serviceData.id+"/legal"
        });
    }
    

    

    // If we reach this point, the service is approved
    return software.methods.serverReply(201, "Service alerts retrieved successfully.", { alerts });
}