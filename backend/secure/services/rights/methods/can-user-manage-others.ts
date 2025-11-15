import { ServiceRights } from "../../../../types/.types/tunneling.type";
import secure from "../../../global/dir";
import { services } from "../../dir";


export async function canUserManageOthers(
    managerUserId: string,
    targetUserId: string,
    serviceId: string
) : Promise<boolean> {
    // Order : OWNER > ADMIN > MODERATOR > USER
    const roleHierarchy = ["User","Developer","Administrator","Owner"];

    const service = await services.service.get(serviceId);
    if (!service || !service.data.service) {
        return false;
    }

    const getHighestRoleIndex = async (userID : string) => {
        if (service.data.service && service.data.service.created_by === userID) {
            return roleHierarchy.indexOf("Owner");
        }

        const roles = await services.service.user.getRights(userID, serviceId, true, 'SERVICE_BY_NASS');


        if (!roles || roles.length === 0) {
            return -1; // Return -1 if roles are empty or undefined
        }

        let highestIndex = -1;
        for (const role of roles) {
            const roleName = role.name?.trim() || ""; // Ensure `name` exists, is trimmed, or defaults to an empty string
            const index = roleHierarchy.indexOf(roleName);
            if (index !== -1 && index > highestIndex) { // Ensure the role exists in the hierarchy
                highestIndex = index;
            }
        }
        return highestIndex;
    };

    const managerHighestRoleIndex = await getHighestRoleIndex(managerUserId);
    const targetHighestRoleIndex = await getHighestRoleIndex(targetUserId);

    console.log(`Manager ${managerUserId} highest role index: ${managerHighestRoleIndex}`);
    console.log(`Target ${targetUserId} highest role index: ${targetHighestRoleIndex}`);

    // A user can manage another user only if their highest role is greater
    return managerHighestRoleIndex > targetHighestRoleIndex;
}