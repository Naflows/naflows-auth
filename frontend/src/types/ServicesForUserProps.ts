

interface ServicesForUserProps {
    name: string; // Service name, used for display purposes
    id: string; // Service ID
    description?: string; // Service description, optional
    dns: string; // DNS of the service, used to identify the service
    active: "ACTIVE" | "INACTIVE" | "DEPRECATED"; // Service status, ACTIVE means the service is running, INACTIVE means the service is not running, DEPRECATED means the service is no longer supported
    banner?: string; // URL to the service banner, optional
    rights: "ADMINISTRATOR" | "DEVELOPER" | "USER"; // Role of the user in the service, e.g., "admin", "user", etc.
    joined_at: number; // Date when the user joined the service
    user_active: boolean; // Whether the user's account in the service is active
    created_at: number; // Date when the service was created
    data_preferences: {
        usage_data: "NONE" | "BASIC" | "FULL"; // Level of usage data the service can access
        personal_data: Array<"PHONE" | "EMAIL" | "FIRST AND LAST NAME" | "ADDRESS" | "BIRTHDATE" | "ACCOUNT SECURITY MEASURES" | "BILLING DETAILS">;
    }; // Data preferences of the service
    status: "ACTIVE" | "INACTIVE" | "DEPRECATED"; // Status of the service
    plan: {
        plan: "FREE" | "PRO" | "ENTERPRISE"; // Service plan name
        type: "CLOUD" | "CLOUD"; // Type of the plan
        size: string; // Size of the plan in GB
        used_space: number; // Used space in MB
    },
    settings: {
        rates: number; // Number of allowed operations per month
        allow_nass_payement_method: boolean; // Whether the service allows payment through NASS
        ram: string; // RAM allocated to the service
        cpu: string; // CPU allocated to the service
    };
    ip_address?: string; // IP address of the service, optional and may be omitted for non-admin users
    picture?: string; // URL to the service picture, optional
    public_settings: {
        allow_user_registration: boolean;
        allow_service_connections: boolean;
        allow_public_visibility: boolean;
        required_data?: Array<"PHONE" | "EMAIL" | "FIRST AND LAST NAME" | "ADDRESS" | "BIRTHDATE" | "ACCOUNT SECURITY MEASURES" | "BILLING DETAILS">; // What personal data is required for a user to register in the service
    },
    apiKey?: string; // API key of the service, optional and may be omitted for non-admin users
    details: {
        access_key?: string; // Developer access key, only present if the user is a developer
        users: number; // Number of users in the service
        official: boolean; // Whether the service is verified or not
        user_is_registered?: boolean; // Whether the user is registered in the service
        owner?: {
            username: string;
            profile_picture: string;
            verified: boolean;
            first_name?: string;
            last_name?: string;
        }
    }, public: {
        privacy_policy_url?: string;
        terms_of_service_url?: string;
        contact_email?: string;
    }

}

export type { ServicesForUserProps };