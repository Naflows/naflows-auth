import axios from "axios";
import type { ServiceRights } from "../../../../../../../../types/TunnelingTypes";



export async function updateRightsList(serviceID : string, rights : ServiceRights[], type = "order") : Promise<boolean> {
    try {
        axios.post(`${process.env.DUMMY_API_URL_DEV}/user/secure/service/rights/update`, {
            serviceID: serviceID,
            rights: rights,
            type: type
        }, {
            withCredentials: true,
        }).then((response) => {
            if (response.status === 200) {
                console.log("Rights list updated successfully.");
                return true;
            } else {
                console.error("Failed to update rights list.");
                return false;
            }
        }).catch((error) => {
            console.error("Error response:", error.response);
            return false;
        });
        return true;
    } catch (error) {
        console.error("Error updating rights list:", error);
        return false;
    }
}