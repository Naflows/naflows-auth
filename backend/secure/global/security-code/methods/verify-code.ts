import { SecurityCode, Service, User } from "../../../../types/.types/collections.type";
import secure from "../../dir";


export async function verifySecurityCode(code : SecurityCode, user : User, serviceID : string, purpose: SecurityCode["purpose"]) : Promise<boolean> {

    return secure.verify(user.id, code.user_id) && secure.verify(serviceID, code.associated_service) && !code.used && code.expires_at > new Date().getTime() && code.purpose === purpose;

}