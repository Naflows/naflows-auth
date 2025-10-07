import { APIKey, Service, ServiceToken, User } from "./collections.type";
import { DeveloperSecureAccess, ServiceRights } from "./tunneling.type";

export interface ReplyType {
    status : number;
    message: string;
    success: boolean;
    data? : {
        code? : string;
        service? : Service,
        key? : APIKey,
        serviceToken? : ServiceToken,
        access_key? : string,
        devKey? : DeveloperSecureAccess;
        user? : User;
        right? : ServiceRights;
    };
}