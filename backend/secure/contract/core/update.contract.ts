import { db } from "../../..";
import { CentralContracts } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";
import secure from "../../dir";


export async function updateContract(id: string, contract: CentralContracts): Promise<ReplyType> {
    const existingContract: CentralContracts = (await secure.contract.get(id)).data as CentralContracts;


    try {
        // Update the contract
        Object.assign(existingContract, contract);
        const change = await db.collection("contracts").updateOne({ id }, { $set: existingContract });

        if (change.modifiedCount === 0) {
            return {
                status: 404,
                message: "Contract not correctly updated.",
                success: false
            };
        }

        return {
            status: 200,
            message: "Contract updated successfully.",
            success: true
        };
    } catch (error) {
        return {
            status: 500,
            message: "Internal server error: " + error.message,
            success: false
        };
    }
}