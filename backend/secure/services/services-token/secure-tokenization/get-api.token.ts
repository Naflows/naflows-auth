import { software } from "../../../../software/dir";
import { Service } from "../../../../types/.types/collections.type";
import { ReplyType } from "../../../../types/.types/reply.type";
import secure from "../../../global/dir";
import { services } from "../../dir";




export default async function getAPIToken(
    userID: string, serviceID: string, password: string, identifier: string
) {

    // const API: Service = await services.service.get(serviceID).then(res => res.data as Service);


    // console.log(userID, password, identifier)
    // const credentialsValid = await secure.user.credentials(userID, password, identifier)
    // if (credentialsValid && API && API.created_by == userID) {
    //     const token : ReplyType = await services.token.new(serviceID,  "MANUAL") ;
    //     if (token.success) {
    //         return token;
    //     } else {
    //         return software.methods.serverReply(token.status, token.message);
    //     }
    // } else {
    //     return software.methods.serverReply(401, "Unauthorized: Invalid credentials.");
    // }
}