import { Collection } from "mongoose";
import { CentralContracts } from "../../../types/.types/collections.type";
import { db } from "../../..";
import { ReplyType } from "../../../types/.types/reply.type";



export async function getContractByID(id : string) : Promise<ReplyType> {
    const contractsCollection : Collection<CentralContracts>= db.collection("nass_contracts") as Collection<CentralContracts>;

    if (!contractsCollection) {
        return {
            status : 500,
            message : "Contracts Collection not found.",
            success : false
        }
    }

    const contract : CentralContracts = await contractsCollection.findOne({ id });

    if (!contract) {
        return {
            status : 404,
            message : "Contract not found.",
            success : false
        }
    }

    return {
        status : 200,
        message : "Contract retrieved successfully.",
        success : true,
        data : contract
    }

}