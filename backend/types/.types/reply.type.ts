import { APIKey, Service, ServiceToken, User, UserSession } from "./collections.type";
import { ServiceTraffic } from "./traffic.type";
import { DeveloperSecureAccess, ServiceRights } from "./tunneling.type";

export interface ReplyType {
    status: number;
    message: string;
    success: boolean;
    data?: {
        code?: string;
        service?: Service,
        key?: APIKey,
        serviceToken?: ServiceToken,
        access_key?: string,
        devKey?: DeveloperSecureAccess;
        user?: User;
        right?: ServiceRights;
        trafficLog?: ServiceTraffic;
        session: UserSession;
        token?: string;
        token_id?: string;
        serviceUsers?: {
            id: string;
            username: string;
            email: string;
            profile_picture: string;
            joined_on: number;
            last_updated: number;
            rights: {
                id: string;
                name: string;
                hue: string;
                description: string;
            }[];
        }[];
        services?: Service[];
        alerts? : string[];

    };
}