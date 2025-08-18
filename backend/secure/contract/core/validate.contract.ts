import { CentralContracts, CONTRACT_ENDING_REASON } from "../../../types/.types/collections.type";
import { ReplyType } from "../../../types/.types/reply.type";
import secure from "../../global/dir";


export async function isContractValid(id : string) : Promise<boolean> {
    const contract : CentralContracts = (await secure.contract.get(id)).data as CentralContracts;

    if (!contract) {
        return false;
    }
    
    const associatedContract : CentralContracts = (await secure.contract.get(contract.signature.associated_contract)).data as CentralContracts;

    if (
        // Make sure the two contracts are the same
        associatedContract.signature.associated_contract !== contract.id &&
        // Make sure the contract is active
        associatedContract.status.active
    ) {
        if (associatedContract.time.issued_at + (process.env.CONTRACT_LIFESPAN ? parseInt(process.env.CONTRACT_LIFESPAN) * 1000 : 60 * 1000) < Date.now()) {
            const outdateContract : ReplyType = await secure.contract.oudate(id, CONTRACT_ENDING_REASON.EXPIRED);
            
            if (outdateContract.success) {
                return true;
            } else {
                console.error("Something went wrong while outdating the contract.");
                return false;
            }
        } else {
            return true;
        }
    } else {
        return false;
    }
}