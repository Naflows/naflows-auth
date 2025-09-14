
export interface ServicesCompleteBodyProps {
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
    picture?: string; // URL to the service picture, optional

}
