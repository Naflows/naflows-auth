import { software } from "../../../software/dir";
import { User } from "../../../types/.types/collections.type";
import secure from "../dir";

const manageConnection = async (req, res): Promise<User> => {
    const userID = req.middleware.data.user_id;
    if (!userID) {
        res.status(401).json(software.methods.serverReply(401, "Unauthorized: No user ID in middleware data."));
    }
    const user = await secure.user.get(userID, false);
    if (!user) {
        res.status(404).json(software.methods.serverReply(404, "User not found."));
    }

    return user;
}

export default manageConnection;