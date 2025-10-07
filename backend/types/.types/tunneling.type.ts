

export interface ServiceRights {
    id : string;
    service_id : string;
    rights : ("MANAGE_TUNNELS" | "MANAGE_DEVS" | "VIEW_STATS" | "READ" | "WRITE" | "DELETE")[];
    created_at : number;
    updated_at : number;
    name : string; // Name of the rights set, e.g., "Default Rights"
    deletable : boolean; // Whether this rights set can be deleted
}

export interface UserRights {
    id : string;
    user_id : string;
    service_id : string;
    rights : string[]; // e.g., ["READ", "WRITE", "DELETE"] & must be a subset of the service rights
    created_at : number;
    updated_at : number;
}

export interface DeveloperSecureAccess {
    developer_id : string;
    service_id : string;
    access_key : string; // Secure key for developer access
    created_at : number;
    updated_at : number;
}

export interface ServiceTunneling {
    service_id : string;
    target_url : string; // The URL to which requests will be tunneled
    allowed_methods : string[]; // e.g., ["GET", "POST"]
    allowed_rights : string[]; // e.g., ["READ", "WRITE"] & must be a subset of the service rights
    created_at : number;
    updated_at : number;
}