import { Tokens, UserSession } from "./collections.type";

export default interface TwoFALog {
    id: string;
    user_id: string;
    cryptographic_token : string; // 256-bit cryptographic token associated with the 2FA log
    state: "REQUEST_GENERATED" | "REQUEST_SENT" | "REQUEST_COMPLETED" | "REQUEST_FAILED" | "REQUEST_EXPIRED" | "REQUEST_FULLFILLED"; // Completed = code sent and used, fullfilled = action completed
    action : "TRANSFER_OWNERSHIP" | "CHANGE_SECURITY_SETTINGS" | "DELETE_ACCOUNT" | "CUSTOM_ACTION";
    data? : {
        [key: string] : any;
    };
    created_at: number;
    used : {
        at? : number;
        is_used : boolean;
    },
    code : string; // Crypted 2FA code sent to the user
    attempts : number; // Number of attempts made to use this 2FA log
}