import { db } from "../../..";
import { software } from "../../../software/dir";
import { CentralContracts } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";
import secure from "../../global/dir";


export async function updateContract(id: string, contract: CentralContracts): Promise<ReplyType> {
    const existingContract: CentralContracts = (await secure.contract.get(id)).data as CentralContracts;


    try {
        // Update the contract
        Object.assign(existingContract, contract);
        const change = await db.collection("contracts").updateOne({ id }, { $set: existingContract });

        if (change.modifiedCount === 0) {
            return software.methods.serverReply(404, "Contract not correctly updated.");
        }

        return software.methods.serverReply(200, "Contract updated successfully.");
    } catch (error) {
        return software.methods.serverReply(500, "Internal server error: " + error.message);
        
    }
}