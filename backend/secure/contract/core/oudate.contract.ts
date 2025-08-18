import { software } from "../../../software/dir";
import { CentralContracts, CONTRACT_ENDING_REASON } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";
import secure from "../../global/dir";


export async function outdateContract(id : string, reason : CONTRACT_ENDING_REASON | CONTRACT_ENDING_REASON.FORCED) {
    const contract : CentralContracts = (await secure.contract.get(id)).data as CentralContracts;

    if (!contract) {
        return software.methods.serverReply(404, "Contract not found.");
    }

    // Update the contract 
    contract.time.modified_at = new Date().getTime();
    contract.time.completed_at = new Date().getTime();
    contract.status.active = false;
    contract.status.ending_reason = reason;

    await secure.contract.update(id, contract);

    return software.methods.serverReply(200, "Contract updated successfully.");
}