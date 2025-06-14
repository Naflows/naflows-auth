import UCRType from "./ucr.type";


// Self explanatory
export interface Blacklist {
    ip : string,
    userAgent : string,
    reason : string,
    date : Date
}




// Requests are related to counting the number of requests made by a user or an IP address
// to the NASS services, this is used for rate limiting and abuse detection
export interface Requests {
    ip : string;
    userAgent: string;
    requests: Array<{
        date: number; // Timestamp of the request
        request : UCRType;
    }>;
    lastRequest: number;
    firstRequest: number;
    device_fingerprint: string; // Device fingerprint of the user, used for security purposes
}

export interface User {
    id : string; // User ID
    identifier : string; // PRE-HASHED identifier, a secure way of connecting set before the user is created
    password : string; // PRE-HASHED password, a secure way of connecting set before the user is created
    email : string; // User email, used for notifications and password recovery
    created_at : Date; // Date when the user was created
    last_login : Date; // Date when the user last logged in
    last_update : Date; // Date when the user was last updated
    rights : Array<
        "ADMINISTRATOR" | "DEVELOPER" | "USER"
    >;
    username: string; // Username, used for display purposes
    first_name?: string; // First name of the user, optional
    last_name?: string; // Last name of the user, optional
    profile_picture?: string; // URL to the user's profile picture, optional
    country?: string; // Country of the user, optional
    language?: string; // Language of the user, optional
    postal_code?: string; // Postal code of the user, optional
    adress?: string; // Address of the user, optional
    phone_number?: string; // Phone number of the user, optional
    phone_verified?: boolean; // Whether the user's phone number is verified, optional
    email_verified?: boolean; // Whether the user's email is verified, optional
}

export interface UserSession {
    id : string; // Session ID
    user_id : string; // User ID, the user that owns the session
    created_at : Date; // Date when the session was created
    last_activity : Date; // Date when the session was last active
    expires_at: Date; // Date when the session expires, if not set, it never expires
    token_id : string; // Token ID, the token that is used to authenticate the session
    ip: string; // IP address of the user, used for security purposes
    user_agent: string; // User agent of the user, used for security purposes
    device_fingerprint: string; // Device fingerprint of the user, used for security purposes
    user_origin: string; // Origin of the user, used for security purposes
}


export interface Tokens {
    id : string;
    token : string;
    user_id : string;
    session_id : string;
    created_at : Date;
    expires_at: Date;
    renewable : boolean;
    frozen_until?: number; // UNIX TIMESTAMP, if the token is frozen, this is the amount of seconds until it can be unfrozen
    frozen_at?: Date; // If the token is frozen, this is the date when it was frozen,
    uses : number; // How many times the token has been use
    max_uses?: number; // How many times the token can be used, if not set, it can be used indefinitely
    rights : Array<
        "USER_READ_OWN" | // Read own user data
        "USER_EDIT_OWN" | // Edit own user data
        "TOKEN_RENEWAL" | // Note : for token renewal, token max use is 1
        "SERVICES_VIEW" | // View the different NASS services
        "SERVICES_EDIT" | // Edit the different NASS services
        "SERVICES_CREATE" | // Create new NASS services
        "SERVICES_DELETE" | // Delete NASS services
        "BLACKLIST_VIEW" | // View blacklisted IPs
        "BLACKLIST_EDIT" | // Edit blacklisted IPs
        "BLACKLIST_CREATE" | // Create new blacklisted IPs
        "DATA_VIEW" | // View database data
        "DATA_EDIT" | // Edit database data
        "DATA_CREATE" | // Create new database data
        "DATA_DELETE"  // Delete database data
    >; 
}

export interface Service {
    id: string; // Service ID
    name: string; // Service name, used for display purposes
    description?: string; // Service description, optional
    created_at: Date; // Date when the service was created
    created_by: string; // User ID of the user who created the service
    status: "ACTIVE" | "INACTIVE" | "DEPRECATED"; // Service status, ACTIVE means the service is running, INACTIVE means the service is not running, DEPRECATED means the service is no longer supported
    dns: string; // DNS of the service, used to identify the service
    ip_address: string; // IP address of the service, optional
    service_token: string; // Service token, a secure way of connecting to the service, optional
}



export interface CentralContracts {
    id : string;
    issued_at : Date; // Date when the contract was issued
    issued_by : string; // Origin of the contract, usually the service that issued it
    completed_at?: Date; // Date when the contract was completed, optional
    completed : boolean;
    service : string; // Destination service of the contract, usually the service that is being contracted
    type : "ISSUED_REQUEST" | "TOKEN_RENEWAL" | "USER_AUTHENTIFICATION" | "DATA_MANIPULATION" | "USER_MANAGEMENT" | "SERVICE_MANAGEMENT" | "BLACKLIST_MANAGEMENT" | "REQUESTS_MANAGEMENT" | "SERVICE_CONNECTION";
    req : string; // JSON stringified request, the request that was made to the service
    res? : string; // JSON stringified response, the response that was received from the service
    routes : string[]; // Concerned API(s) routes, the routes that were used in the request
    forced : boolean; // Whether the contract was forced or not, true means the NASS is the one that forced the contract
    linked_contract: string; // Each time a contract is created, a second is created for the other service, this is the ID of that contract
    contract_type : "ISSUED" | "RECEIVED"; // Whether the contract is issued or received
    ending_reason? : "COMPLETED" | "CANCELED" | "EXPIRED" | "FORCED"; // The reason why the contract ended, if it ended
}



// This service token type is only available in the NASS itself
// NASS Service Token is found under the service_tokens collection
export interface NassServiceToken {
    id : string; // Service token ID
    service_id : string; // Service ID, the service that owns the token
    token : string; // The service token, a secure way of connecting to the service
    created_at : number; // Date when the token was created
    expires_at: number; // Date when the token expires, if not set, it never expires
    lifespan: number; // How long the token is valid for, in seconds, if not set, it never expires
    uses : number; // How many times the token has been used
}

// This service token type is only available for the NASS services, which are aware of their token but not the death of it 
export interface ServiceToken {
    id : string;
    token : string; // The service token, a secure way of connecting to the service
    created_at: Date; // Date when the token was created
}

