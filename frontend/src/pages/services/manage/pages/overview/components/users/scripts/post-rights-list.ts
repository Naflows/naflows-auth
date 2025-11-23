import axios from "axios";


export async function postRightsList(userID : string, serviceID : string, rightsIDs : {type: "SERVICE_BY_NASS" | "TUNNELING_BY_INSTANCE", id: string, update_type: "ADD" | "REMOVE"}[]) : Promise<{ success: boolean; message?: string }> {
    // Logic to post the updated rights list for the user
    try {
        axios.post(`${process.env.DUMMY_API_URL_DEV}/user/secure/service/rights/assign`, {
            rightsIDs: rightsIDs,
            serviceID: serviceID,
            userID: userID,
        }, {
            withCredentials: true,
        }).then((response) => {
            if (response.status === 200) {
                console.log("Rights updated successfully.");
            } else {
                console.error("Failed to update rights.");
            }


            return { success: true, message: "Rights updated successfully." };
        }).catch((error) => {
            console.error("Error response:", error);
            return { success: false, message: "Failed to update rights." };
        });



    } catch (error) {
        console.error("Error posting rights list:", error);
        return { success: false, message: "An error occurred while updating rights." };
    }

    return { success: true, message: "Rights updated successfully." };
}