import { CentralContracts, CONTRACT_ENDING_REASON } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";
import secure from "../../global/dir";


export async function outdateContract(id : string, reason : CONTRACT_ENDING_REASON | CONTRACT_ENDING_REASON.FORCED) {
    const contract : CentralContracts = (await secure.contract.get(id)).data as CentralContracts;

    if (!contract) {
        return {
            status: 404,
            message: "Contract not found.",
            success: false
        };
    }

    // Update the contract 
    contract.time.modified_at = new Date().getTime();
    contract.time.completed_at = new Date().getTime();
    contract.status.active = false;
    contract.status.ending_reason = reason;

    await secure.contract.update(id, contract);

    return {
        status: 200,
        message: "Contract updated successfully.",
        success: true
    };
}