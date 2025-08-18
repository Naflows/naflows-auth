import { v4 } from "uuid";
import { CentralContracts, CONTRACT_TYPE, CONTRACTED, CONTRACTOR, Service, ServiceToken, User, UserSession } from "../../../types/.types/collections.type";
import { db } from "../../..";
import { Collection } from "mongoose";
import { ReplyType } from "../../../types/.types/reply.type";
import crypto from "crypto";
import secure from "../../global/dir";
import { software } from "../../../software/dir";
import { getService } from "../../services/get-service";

export async function issueContract(
    aim_id: string, // The ID of the concerned API or user,
    aim_type: CONTRACTED,
    type: CONTRACT_TYPE,
    force: boolean,
    details: {
        route: string,
        user: User,
        session: UserSession
    } | null
): Promise<ReplyType> {
    let contract: CentralContracts;
    let API: Service | null;
    let APIToken: ServiceToken | null;
    const contractID: string = crypto.randomUUID();

    if (aim_type === CONTRACTED.API) {
        const serviceToken: Collection<ServiceToken> = db.collection("service_tokens") as Collection<ServiceToken>;
        const services: Collection<Service> = db.collection("services") as Collection<Service>;

        console.log("Checking service token and API existence...");
        console.log(`Looking for service token with ID: ${aim_id}`);
        console.log(`Looking for API with ID: ${aim_id}`);

        if (!serviceToken || !services) {
            return software.methods.serverReply(500, "Internal Server Error: Service token or API collection not found.");
        }

        APIToken = await serviceToken.findOne({
            service_id: aim_id
        });
        API = ((await getService(aim_id)).data) as Service;

        if (!API || !APIToken) {
            return software.methods.serverReply(404, "API or Service token not found.");
        }

        console.log("Service token and API existence check complete.");
        console.log(`Service token found: ${JSON.stringify(APIToken)}`);
        console.log(`API found: ${JSON.stringify(API)}`);
    }

    // The built contract is made from the issuer;
    contract = {
        my_type: "ISSUER",
        id: secure.crypt(contractID),

        signature: {
            contracted: aim_type,
            contractor: CONTRACTOR.NASS,
            contractor_id: "<nass_global_network>",
            associated_contract: "<associated_contract_id>",
            api_key: APIToken.token ? secure.crypt(APIToken.token) : null,
        },
        details: {
            route: details?.route || null,
            user: details?.user || null,
            session: details?.session || null,
            contract_type: type
        },
        status: {
            active: true,
            force_action: force,
            ending_reason: null
        },
        time: {
            issued_at: Date.now(),
            completed_at: null,
            modified_at: Date.now()
        }
    };

    let contract2: CentralContracts = structuredClone(contract);
    contract2.my_type = "RECEIVER";
    contract2.id = crypto.randomUUID();
    console.log(`Generated ID for contract2: ${contract2.id} =/= ${contract.id}`);
    contract2.signature.associated_contract = contractID;
    contract.signature.associated_contract = contract2.id;




    console.log(`IDs ${contract.id} and ${contract2.id} generated.`);

    try {
        const contracts: Collection<CentralContracts> = db.collection("nass_contracts") as Collection<CentralContracts>;

        if (!contracts) {
            throw new Error("Internal Server Error: Contracts collection not found.");
        }

        console.log("Inserting contracts into the database...");
        await contracts.insertMany([contract, contract2]);

        console.log("Contracts inserted successfully.");

        delete (contract as any)._id;
        delete (contract2 as any)._id;

        return software.methods.serverReply(200, "Contract issued successfully.", {
            received: contract2
        });
    } catch (error) {
        console.error("Error inserting contracts:", error);
        return software.methods.serverReply(500, "Internal Server Error: Failed to issue contract.");
    }


}