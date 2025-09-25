import { User } from "../../../types/.types/collections.type";
import secure from "../../global/dir";



export async function isUserInService(serviceID: string, userID : string) : Promise<boolean> {
    const user : User = await secure.user.get(userID,false) as User;

    if (!user) {
        return false;
    }


    return user.services[serviceID] && user.services[serviceID].active;
}