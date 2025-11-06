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
  device_fingerprint: string | object; // Device fingerprint of the user, used for security purposes
}
export interface Requests {
  requests: Array<UserRequest>;
  associated_service: string;
  id : string;
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
  bio ?: string; // Short bio of the user, optional
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

export interface ServiceAlert {
  title: string;
  message: string;
  instructions ?: string; // Optional instructions to resolve the alert
  type: "info" | "warning" | "error" | "success";
  link ?: string; // Optional link to more information about the alert
}
export interface Service {
  id: string; // Service ID
  name: string; // Service name, used for display purposes
  description?: string; // Service description, optional
  created_at: number; // Date when the service was created
  created_by: string; // User ID of the user who created the service
  status: "ACTIVE" | "INACTIVE" | "DEPRECATED"; // Service status, ACTIVE means the service is running, INACTIVE means the service is not running, DEPRECATED means the service is no longer supported
  dns: string; // DNS of the service, used to identify the service
  ip_address: string[]; // IP address of the service
  plan: ServicePlan;
  settings: ServiceSettings;
  apiKey?: string; // The API key associated with the service
  picture?: string; // URL to the service picture, optional
  banner?: string; // URL to the service banner, optional
  approved : boolean; // Whether the service has been approved by the NASS team or not
  public_settings: {
    allow_user_registration: boolean; // Whether the service allows user registration or not
    allow_service_connection: boolean; // Whether the service allows connection from other services or not
    allow_public_visibility: boolean; // Whether the service is visible in the public services list or not
    required_data?: UserDataPreferences["personal_data"]; // What personal data is required for a user to register in the service
  },
  details: {
    access_key? : string; // Secure key for developer access
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
      privacy_policy_url? : {
        url : string,
        approved : boolean
      };
      terms_of_service_url? : {
        url : string,
        approved : boolean
      };
      contact_email? : {
        email : string,
        approved : boolean
      };
    }
  },
  alerts? : ServiceAlert[]; // List of alerts related to the service
}

export interface ServiceLog {
  id: string; // Log ID
  service_id: string; // Service ID, the service that owns the log
  message: string; // Log message
  type : "USER" | "SERVICE" | "SECURITY" | "SYSTEM" | "OTHER" | "SETTINGS" | "DEVELOPERS"; // Type of log
  level: "INFO" | "WARNING" | "ERROR"; // Log level
  created_at: number; // Date when the log was created
  metadata?: {
    user? : string;
    userData? : {
      username?: string;
      picture?: string | null;
      first_name?: string | null;
      last_name?: string | null;
      rights? : { id : string; name : string; hue : string; }[];
    },
  }; // Additional metadata for the log, optional
}




export interface APIKey {
  id: string;
  key: string;
  
  issuerId: string;
  apiId: string;
    
  // Timing
  issuedAt: number;
  expiresAt: number;  
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
  uses: number,
  invalidated?: boolean; // Whether the token has been invalidated or not
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
  purpose: "EMAIL_VERIFICATION" | "PASSWORD_RESET" | "TWO_FACTOR_AUTHENTICATION" | "SELF_SERVICE_MANAGEMENT"; // Purpose of the code
  associated_service: string; // Service ID, the service that requested the code, if any
}


export interface Notification {
  id: string;
  user_id: string; // User ID, the user that owns the notification
  title: string; // Title of the notification
  message: string; // Message of the notification
  link?: string; // Link associated with the notification, optional
  created_at: number; // Date when the notification was created
  read: boolean; // Whether the notification has been read or not
  read_at?: number; // Date when the notification was read, if read is true
  type: "INFO" | "WARNING" | "ALERT"; // Type of the notification
  associated_service?: string; // Service ID, the service that generated the notification, if any
}




