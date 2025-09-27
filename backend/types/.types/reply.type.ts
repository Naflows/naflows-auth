import { Service } from "./collections.type";

export interface ReplyType {
    status : number;
    message: string;
    success: boolean;
    data? : {
        code? : string;
        service? : Service
    };
}