import { Collection } from "mongodb";
import { db } from "../../../..";
import { SecurityCode } from "../../../../types/.types/collections.type";
import secure from "../../dir";


export async function getSecurityCode(codeID: string, codeNumber: string | null): Promise<SecurityCode | null> {
    const codeCollection = await db.collection<SecurityCode>('security_codes');

    const allCodes = await codeCollection.find({}).toArray();
    // Compare with secure.verify
    const code = allCodes.find(c => c.code && (c.id === codeID || (codeNumber && secure.verify(codeNumber, c.code))));
    if (code) {
        return code;

    }
    return code;
}