import { Collection } from "mongoose";
import { db } from "../../../..";
import TwoFALog from "../../../../types/.types/twoFA.type";
import secure from "../../../global/dir";


export async function get2FALogs(user_id: string, action: TwoFALog["action"], cryptographic_token: string, data?: { [key: string]: any }): Promise<TwoFALog[]> {
    const collection = db.collection('2fa_logs') as Collection<TwoFALog>;


    const logs = await collection.find({
        action: { $in: [action] },
        ...(data ? { data } : {})
    }).toArray();

    console.log("Fetched 2FA logs from DB:", logs);

    const filteredLogs = logs.filter(log => {
        const isUserMatch = secure.verify(user_id, log.user_id);
        const isTokenMatch = secure.verify(cryptographic_token, log.cryptographic_token);
        console.log(`Verifying log ${log.id}: User Match: ${isUserMatch}, Token Match: ${isTokenMatch}`);
        return isUserMatch && isTokenMatch;
    });

    console.log("Filtered 2FA logs after verification:", filteredLogs);

    return filteredLogs;
}