import UCRType from "./ucr.type";

// Self explanatory
export interface Blacklist {
  ip: string;
  userAgent: string;
  reason: string;
  date: Date;
}

// Requests are related to counting the number of requests made by a user or an IP address
// to the NASS services, this is used for rate limiting and abuse detection
export interface Requests {
  ip: string;
  userAgent: string;
  requests: Array<{
    date: number; // Timestamp of the request
    request: UCRType;
  }>;
  lastRequest: number;
  firstRequest: number;
  device_fingerprint: string; // Device fingerprint of the user, used for security purposes
}

export interface User {
  id: string; // User ID
  identifier: string; // PRE-HASHED identifier, a secure way of connecting set before the user is created
  password: string; // PRE-HASHED password, a secure way of connecting set before the user is created
  email: string; // User email, used for notifications and password recovery
  created_at: Date; // Date when the user was created
  last_login: Date; // Date when the user last logged in
  last_update: Date; // Date when the user was last updated
  rights: Array<"ADMINISTRATOR" | "DEVELOPER" | "USER">;
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
  id: string; // Session ID
  user_id: string; // User ID, the user that owns the session
  created_at: number; // Date when the session was created
  last_activity: number; // Date when the session was last active
  expires_at: number; // Date when the session expires, if not set, it never expires
  token_id: string; // Token ID, the token that is used to authenticate the session
  ip: string; // IP address of the user, used for security purposes
  agent: string; // User agent of the user, used for security purposes
  device_fingerprint: string; // Device fingerprint of the user, used for security purposes
  user_origin: string; // Origin of the user, used for security purposes
}

export type TokenRights =
  | "USER_READ_OWN" // Read own user data
  | "USER_EDIT_OWN" // Edit own user data
  | "TOKEN_RENEWAL" // Note : for token renewal, token max use is 1
  | "SESSION_RENEWAL" // Note : for session renewal, token max use is 1
  | "SESSION_CONFIRMATION" // Confirm a session, used to check if a session is valid


  // The following rights are for the NASS Administrative Instances
  | "NASS_SECURE_CHECK" // Check if a connection is secure and accepted
  | "NASS_SECURITY_ADD" // Add a new secure connection
  | "NASS_SECURITY_DEACTIVE" // Deactivate a secure connection
  | "NASS_VIEW_STRUCTURE" // View the NASS structure
  | "NASS_TEAM_ADD" // Add a new user to the NASS team
  | "NASS_TEAM_REVOKE" // Revoke a user from the NASS
  | "NASS_TEAM_UPDATE" // Update a user in the NASS team


  | "SERVICES_VIEW" // View the different NASS services
  | "SERVICES_EDIT" // Edit the different NASS services
  | "SERVICES_CREATE" // Create new NASS services
  | "SERVICES_DELETE" // Delete NASS services / tokens (may trigger a new service token creation)


  | "BLACKLIST_VIEW" // View blacklisted IPs
  | "BLACKLIST_EDIT" // Edit blacklisted IPs
  | "BLACKLIST_CREATE" // Create new blacklisted IPs

  | "DATA_VIEW" // View database data
  | "DATA_EDIT" // Edit database data
  | "DATA_CREATE" // Create new database data

  | "NASS_LOGS_VIEW" // View NASS logs

  | "LOGS_VIEW"; // View NASS logs

export interface Tokens {
  id: string;
  token: string;
  user_id: string;
  session_id: string;
  created_at: number;
  expires_at: number;
  renewable: boolean;
  supertest?: boolean; // If the token is a supertest token, it can be used for testing purposes
  enabled: boolean; // Whether the token is enabled or not, if not, it cannot be used
  frozen_until?: number; // UNIX TIMESTAMP, if the token is frozen, this is the amount of seconds until it can be unfrozen
  frozen_at?: number; // If the token is frozen, this is the date when it was frozen,
  uses: number; // How many times the token has been use
  max_uses?: number; // How many times the token can be used, if not set, it can be used indefinitely
  rights: TokenRights[]; // Rights of the token, used to determine what the token can do
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

export enum CONTRACTED {
  API = "API",
  USER = "USER"
}
export enum CONTRACTOR {
  API = "API",
  NASS = "NASS"
}
export enum CONTRACT_TYPE {
  TOKEN_RENEWAL = "TOKEN_RENEWAL",
  USER_AUTHENTIFICATION = "USER_AUTHENTIFICATION",
  DATA_MANIPULATION = "DATA_MANIPULATION",
  USER_MANAGEMENT = "USER_MANAGEMENT",
  SERVICE_MANAGEMENT = "SERVICE_MANAGEMENT",
  BLACKLIST_MANAGEMENT = "BLACKLIST_MANAGEMENT",
  REQUESTS_MANAGEMENT = "REQUESTS_MANAGEMENT",
  SERVICE_CONNECTION = "SERVICE_CONNECTION"
}
export enum CONTRACT_ENDING_REASON {
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
  EXPIRED = "EXPIRED",
  FORCED = "FORCED"
}
export interface CentralContracts {
  my_type: "ISSUER" | "RECEIVER";
  id: string,

  signature: {
    contracted: CONTRACTED,
    contractor: CONTRACTOR,
    contractor_id: string,
    associated_contract: string,
    api_key: string | null,
  },
  details: {
    route: string,
    user: User | null, // User that is associated with the contract, if any
    session: UserSession | null, // Session that is associated with the contract, if any
    contract_type: CONTRACT_TYPE
  },
  status: {
    active: boolean,
    force_action: boolean, // Meaning the contracted has no choice but to execute the action (e.g. for token removal by administrator of any API)
    ending_reason: CONTRACT_ENDING_REASON | null
  },
  time: {
    issued_at: number,
    completed_at: number | null
    modified_at: number | null
  }
}

// This service token type is only available in the NASS itself
// NASS Service Token is found under the service_tokens collection
export interface NassServiceToken {
  id: string; // Service token ID
  service_id: string; // Service ID, the service that owns the token
  token: string; // The service token, a secure way of connecting to the service
  created_at: number; // Date when the token was created
  expires_at: number; // Date when the token expires, if not set, it never expires
  lifespan: number; // How long the token is valid for, in seconds, if not set, it never expires
  uses: number; // How many times the token has been used
}

// This service token type is only available for the NASS services, which are aware of their token but not the death of it
export interface ServiceToken {
  id: string;
  token: string; // The service token, a secure way of connecting to the service
  created_at: Date; // Date when the token was created
}
