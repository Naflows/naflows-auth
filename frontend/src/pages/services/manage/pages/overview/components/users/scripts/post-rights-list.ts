import axios from "axios";


export async function postRightsList(userID : string, serviceID : string, rightsIDs : string[]) {
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
            console.error("Error response:", error.response);
            return { success: false, message: "Failed to update rights." };
        });



    } catch (error) {
        console.error("Error posting rights list:", error);
        return { success: false, message: "An error occurred while updating rights." };
    }
}