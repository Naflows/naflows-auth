import { SecurityCode, Service, User } from "../../../../types/.types/collections.type";
import secure from "../../dir";


export async function verifySecurityCode(code : SecurityCode, user : User, serviceID : string, purpose: SecurityCode["purpose"]) : Promise<boolean> {

    const userOK = await secure.verify(user.id, code.user_id);
    const serviceOK = await secure.verify(serviceID, code.associated_service);

    const codeExpiresAt = code.expires_at > new Date().getTime();
    const purposeOK = code.purpose === purpose;

    console.log("Verifying security code:", { userOK, serviceOK, codeExpiresAt, purposeOK, used: code.used });

    return userOK && serviceOK && codeExpiresAt && purposeOK;

}