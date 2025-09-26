import UCRType from "./ucr.type";

// Self explanatory
export interface Blacklist {
  ip: string;
  userAgent: string;
  reason: string;
  date: Date;
  associated_service?: string;
}

// Requests are related to counting the number of requests made by a user or an IP address
// to the NASS services, this is used for rate limiting and abuse detection
export interface UserRequest {
  last_requests: Array<number>; // Timestamp of the request
  request_number: number;
  ip: string;
  userAgent: string;
}
export interface Requests {
  requests: Array<UserRequest>;
  device_fingerprint: string; // Device fingerprint of the user, used for security purposes
  associated_service: string;
  associated_service_key: string;
}
// User chooses how the APIs are using their data
export interface UserDataPreferences {
  usage_data: "NONE" | "USAGE_ONLY" | "FULL"; // How the user wants their usage data to be handled. None means no data is sent by the NASS to the API, which means the user will not be able to use the API. Usage only means only usage data is sent, which means the API will know how many requests the user has made but not who they are. Full means all personal data is sent except for the user's password / identifier.
  personal_data: Array<"PHONE" | "EMAIL" | "FIRST AND LAST NAME" | "ADDRESS" | "BIRTHDATE" | "ACCOUNT SECURITY MEASURES" | "BILLING DETAILS">;
}
export interface User {
  id: string; // User ID
  identifier: string; // PRE-HASHED identifier, a secure way of connecting set before the user is created
  password: string; // PRE-HASHED password, a secure way of connecting set before the user is created
  email: string; // User email, used for notifications and password recovery
  created_at: number; // Date when the user was created
  last_login: number; // Date when the user last logged in
  last_update: number; // Date when the user was last updated
  services: {
    [key: number]: {
      rights: Array<"ADMINISTRATOR" | "DEVELOPER" | "USER">;
      joined_at: number;
      active: boolean;
      data_preferences: UserDataPreferences;
    };
  };
  username: string; // Username, used for display purposes
  first_name?: string; // First name of the user, optional
  last_name?: string; // Last name of the user, optional
  profile_picture?: string; // URL to the user's profile picture, optional
  country?: string; // Country of the user, optional
  language?: string; // Language of the user, optional
  postal_code?: string; // Postal code of the user, optional
  address_complement?: string; // Address complement of the user, optional
  city?: string; // City of the user, optional
  address?: string; // Address of the user, optional
  phone_number?: string; // Phone number of the user, optional
  phone_verified?: boolean; // Whether the user's phone number is verified, optional
  email_verified?: boolean; // Whether the user's email is verified, optional
  birthdate?: Date; // Birthdate of the user, optional
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
  service_id: string;
  active: boolean;
  device_fingerprint: string; // Device fingerprint of the user, used for security purposes
  supertest?: boolean;
}

export type TokenRights =
  | "USER_READ_OWN" // Read own user data
  | "USER_EDIT_OWN" // Edit own user data
  | "TOKEN_RENEWAL" // Note : for token renewal, token max use is 1
  | "SESSION_RENEWAL" // Note : for session renewal, token max use is 1
  | "SESSION_CONFIRMATION" // Confirm a session, used to check if a session is valid
  | "API_REGISTRATION" // Register a user in an API


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
  data?: {
    apiIDForRegistration?: string;
  };
  enabled: boolean; // Whether the token is enabled or not, if not, it cannot be used
  frozen_until?: number; // UNIX TIMESTAMP, if the token is frozen, this is the amount of seconds until it can be unfrozen
  frozen_at?: number; // If the token is frozen, this is the date when it was frozen,
  uses: number; // How many times the token has been use
  max_uses?: number; // How many times the token can be used, if not set, it can be used indefinitely
  rights: TokenRights[]; // Rights of the token, used to determine what the token can do
}

export interface ServicePlan {
  plan: "FREE" | "PRO" | "ENTERPRISE";
  type: "LOCAL" | "CLOUD";
  size: 5 | 10 | 25 | 50; // in GB
  used_space: number; // in MB

}
export interface ServiceSettings {
  rates: 100 | 500 | 1000 | 10000;
  allow_nass_payement_method: boolean; // Whether the service allows payment through NASS

}
export interface Service {
  id: string; // Service ID
  name: string; // Service name, used for display purposes
  description?: string; // Service description, optional
  created_at: number; // Date when the service was created
  created_by: string; // User ID of the user who created the service
  status: "ACTIVE" | "INACTIVE" | "DEPRECATED"; // Service status, ACTIVE means the service is running, INACTIVE means the service is not running, DEPRECATED means the service is no longer supported
  dns: string; // DNS of the service, used to identify the service
  ip_address: string; // IP address of the service
  service_token: string; // Service token, a secure way of connecting to the service
  plan: ServicePlan;
  settings: ServiceSettings;
  picture?: string; // URL to the service picture, optional
  banner?: string; // URL to the service banner, optional
  public_settings: {
    allow_user_registration: boolean; // Whether the service allows user registration or not
    allow_service_connection: boolean; // Whether the service allows connection from other services or not
    allow_public_visibility: boolean; // Whether the service is visible in the public services list or not
    required_data?: UserDataPreferences["personal_data"]; // What personal data is required for a user to register in the service
  },
  details: {
    users: number; // Number of users in the service
    official?: boolean; // Whether the service is verified or not, verified services are services that have been verified by the NASS team to be legitimate and secure
    user_is_registered? : boolean; // Whether the user is registered in the service
    owner? : {
      username : string;
      profile_picture : string;
      verified : boolean;
      first_name? : string;
      last_name? : string;
    },
    public : {
      privacy_policy_url? : string;
      terms_of_service_url? : string;
      contact_email? : string;
    }
  },
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
  creation_method: "AUTO" | "MANUAL";
  uses: number
}

// This service token type is only available for the NASS services, which are aware of their token but not the death of it
export interface ServiceToken {
  id: string;
  token: string; // The service token, a secure way of connecting to the service
  created_at: number; // Date when the token was created
}



export interface SecurityCode {
  id: string; // Code ID
  user_id: string; // User ID, the user that owns the code
  code: string; // The code, a secure way of verifying the user, hashed
  created_at: number; // Date when the code was created
  expires_at: number; // Date when the code expires
  used: boolean; // Whether the code has been used or not
  used_at?: number; // Date when the code was used, if used is true
  purpose: "EMAIL_VERIFICATION" | "PASSWORD_RESET" | "TWO_FACTOR_AUTHENTICATION"; // Purpose of the code
  associated_service: string; // Service ID, the service that requested the code, if any
}