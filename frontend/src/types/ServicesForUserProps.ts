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
export interface UserDataPreferences {
  usage_data: "NONE" | "USAGE_ONLY" | "FULL"; // How the user wants their usage data to be handled. None means no data is sent by the NASS to the API, which means the user will not be able to use the API. Usage only means only usage data is sent, which means the API will know how many requests the user has made but not who they are. Full means all personal data is sent except for the user's password / identifier.
  personal_data: Array<"PHONE" | "EMAIL" | "FIRST AND LAST NAME" | "ADDRESS" | "BIRTHDATE" | "ACCOUNT SECURITY MEASURES" | "BILLING DETAILS">;
}

export interface ServiceUser {
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
    type: "SERVICE_BY_NASS" | "TUNNELING_BY_INSTANCE";
  }[];
  you_can_manage: boolean;
  you: boolean;
}


export interface ServiceAlert {
  title: string;
  message: string;
  instructions?: string; // Optional instructions to resolve the alert
  type: "info" | "warning" | "error" | "success";
  link?: string; // Optional link to more information about the alert
}
interface ServicesForUserProps {
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
  approved: boolean; // Whether the service has been approved by the NASS team or not
  public_settings: {
    allow_user_registration: boolean; // Whether the service allows user registration or not
    allow_service_connection: boolean; // Whether the service allows connection from other services or not
    allow_public_visibility: boolean; // Whether the service is visible in the public services list or not
    required_data?: UserDataPreferences["personal_data"]; // What personal data is required for a user to register in the service
  },
  is_user_developer: boolean; // Whether the user is a developer of the service
  details: {
    access_key?: string; // Secure key for developer access
    users: number; // Number of users in the service
    official?: boolean; // Whether the service is verified or not, verified services are services that have been verified by the NASS team to be legitimate and secure
    user_is_registered?: boolean; // Whether the user is registered in the service
    owner?: {
      username: string;
      profile_picture: string;
      verified: boolean;
      first_name?: string;
      last_name?: string;
    },
    public: {
      privacy_policy_url?: {
        url: string,
        approved: boolean
      };
      terms_of_service_url?: {
        url: string,
        approved: boolean
      };
      contact_email?: {
        email: string,
        approved: boolean
      };
    }
  },
  user_authorizations?: Record<string, boolean>; // Map of user IDs to whether they are authorized developers for the service

  alerts?: ServiceAlert[]; // Alerts related to the service
}
export type { ServicesForUserProps };