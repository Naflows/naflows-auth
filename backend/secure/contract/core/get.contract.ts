import { Collection } from "mongoose";
import { CentralContracts } from "../../../types/.types/collections.type";
import { db } from "../../..";
import { ReplyType } from "../../../types/.types/reply.type";
import { software } from "../../../software/dir";



export async function getContractByID(id : string) : Promise<ReplyType> {
    const contractsCollection : Collection<CentralContracts>= db.collection("nass_contracts") as Collection<CentralContracts>;

    if (!contractsCollection) {
        return software.methods.serverReply(500, "Internal server error. Contracts collection not found.");
    }

    const contract : CentralContracts = await contractsCollection.findOne({ id });

    if (!contract) {
        return software.methods.serverReply(404, "Contract not found.");
    }

    return software.methods.serverReply(200, "Contract retrieved successfully.", contract);

}