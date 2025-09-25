
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
    joined_at: string; // Date when the user joined the service
    user_active: boolean; // Whether the user's account in the service is active
    public_settings?: object; // Public settings of the service, optional and may be omitted for non-admin users
}