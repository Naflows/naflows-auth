

interface ServicesForUserProps {
    name: string; // Service name, used for display purposes
    id: string; // Service ID
    description?: string; // Service description, optional
    dns: string; // DNS of the service, used to identify the service
    active: "ACTIVE" | "INACTIVE" | "DEPRECATED"; // Service status, ACTIVE means the service is running, INACTIVE means the service is not running, DEPRECATED means the service is no longer supported
    rights: "ADMINISTRATOR" | "DEVELOPER" | "USER"; // Role of the user in the service, e.g., "admin", "user", etc.
    joined_at: string; // Date when the user joined the service
    user_active: boolean; // Whether the user's account in the service is active
    created_at: string; // Date when the service was created
    data_preferences: {
        usage_data: "NONE" | "BASIC" | "FULL"; // Level of usage data the service can access
        personal_data: Array<"PHONE" | "EMAIL" | "FIRST AND LAST NAME" | "ADDRESS" | "BIRTHDATE" | "ACCOUNT SECURITY MEASURES" | "BILLING DETAILS">;
    }; // Data preferences of the service
    status: "ACTIVE" | "INACTIVE" | "DEPRECATED"; // Status of the service
    storage : {
        plan: string; // Storage plan of the service, e.g., "BASIC", "PRO", "ENTERPRISE"
        type: string; // Type of storage, e.g., "LOCAL", "CLOUD"
        size: string; // Total storage size in GB
        used_space: number; // Used storage space in MB
    };
    settings : {
        rates: number; // Number of allowed operations per month
        allow_nass_payement_method : boolean; // Whether the service allows payment through NASS
        ram : string; // RAM allocated to the service
        cpu : string; // CPU allocated to the service
    };
    ip_address?: string; // IP address of the service, optional and may be omitted for non-admin users
    picture?: string; // URL to the service picture, optional
    public_settings : {
        allow_user_registration : boolean;
        allow_service_connections : boolean;
        allow_public_visibility : boolean;

    }
}

export type { ServicesForUserProps };