import { TokenRights } from './collections.type';


export type levels = "ADMINISTRATOR" | "DEVELOPER" | "USER";

export default interface NASSRoutes {
    rights : TokenRights[];
    method : "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    open : boolean;
    levels: levels[];
    path : string;
}