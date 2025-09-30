
// name: service.name,
// id: service.id,
// description: service.description,
// domain: service.dns,
// active: service.status,
// user_role: userServices[key].rights,
// joined_at: userServices[key].joined_at,
// user_active: userServices[key].active,

export interface ServicesBodyProps {
    name: string; // Service name, used for display purposes
    id: string; // Service ID
    description?: string; // Service description, optional 
    dns: string; // DNS of the service, used to identify the service
    picture: string; // URL to the service's picture or logo
    banner: string; // URL to the service's banner image
    status: "ACTIVE" | "INACTIVE" | "DEPRECATED"; // Service status, ACTIVE means the service is running, INACTIVE means the service is not running, DEPRECATED means the service is no longer supported
    rights: "ADMINISTRATOR" | "DEVELOPER" | "USER"; // Role of the user in the service, e.g., "admin", "user", etc.
    joined_at: number; // Date when the user joined the service
    user_active: boolean; // Whether the user's account in the service is active
    created_at?: number;
    public_settings?: {
        required_data?: Array<"PHONE" | "EMAIL" | "FIRST AND LAST NAME" | "ADDRESS" | "BIRTHDATE" | "ACCOUNT SECURITY MEASURES" | "BILLING DETAILS">; // What personal data is required for a user to register in the service
        allow_public_visibility: boolean; // Whether the service is publicly visible in the Naflows services directory
    }; // Public settings of the service, optional and may be omitted for non-admin users
    details: {
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