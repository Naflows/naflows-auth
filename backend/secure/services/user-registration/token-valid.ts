import { Service, Tokens } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";
import secure from "../../global/dir";
import { services } from "../dir";


export default async function isRegistrationTokenValid(tokenID: string): Promise<boolean> {
    const token: Tokens = await secure.token.get(tokenID);
    if (token.data.apiIDForRegistration) {
        const apiRT: ReplyType = await services.service.get(token.data.apiIDForRegistration);

        if (!apiRT.success) {
            return false;
        } 

        const api = apiRT.data.service as Service;


        return (
            token.enabled &&
            token.expires_at > Date.now() && token.uses < token.max_uses &&
            (!token.supertest || token.supertest === null) &&
            api && api.status === "ACTIVE"
        )
    } else {
        return false;
    }


}