export interface TunnelingByInstanceRight {
    name : string; // Name of the right, e.g., "READ", "WRITE", "DELETE", or custom right like "MANAGE_TUNNELS"
    service_id : string; // The service this right belongs to
    created_at : number;
    updated_at : number;
    created_by : string; // User ID of the creator
}

export interface ServiceRights {
    id : string;
    service_id : string;
    rights : (
        "MANAGE_TUNNELS" | "MANAGE_DEVS" | "VIEW_STATS" | "READ" | "WRITE" | "DELETE" | "MANAGE_USERS" | "MANAGE_ROLES" | "MANAGE_SERVICE" | "MANAGE_SETTINGS" | "VIEW_USERS" | "VIEW_ROLES" | "VIEW_SERVICE" | "VIEW_SETTINGS" | "DEV_TOKEN_CREATION" | "PROD_TOKEN_CREATION"
    )[] | string[]; // Warning: non-custom rights are ONLY for services with type "SERVICE_BY_NASS". Otherwise, custom rights can be used.
    
    created_at : number;
    updated_at : number;
    created_by : string; // User ID of the creator, null if created by system
    name : string; // Name of the rights set, e.g., "Default Rights"
    deletable : boolean; // Whether this rights set can be deleted
    hue : string; // Color hue for UI representation
    usersPerRights? : { id: string; username: string; first_name: string; last_name: string; profile_picture: string | null }[]; // Added field to map rights to users

    description?: string;
    type : "SERVICE_BY_NASS" | "TUNNELING_BY_INSTANCE"; // Type of service rights, view documentation for more info
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