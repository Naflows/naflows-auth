export interface UserBodyProps {
    _id: string;
    id: string; // User ID
    identifier: string; // PRE-HASHED identifier, a secure way of connecting set before the user is created
    password: string; // PRE-HASHED password, a secure way of connecting set before the user is created
    email: string; // User email, used for notifications and password recovery
    created_at: string; // Date when the user was created
    last_login: string; // Date when the user last logged in
    last_update: string; // Date when the user was last updated
    username: string; // Username, used for display purposes
    first_name?: string; // First name of the user, optional
    last_name?: string; // Last name of the user, optional
    profile_picture?: string; // URL to the user's profile picture, optional
    city?: string; // City of the user, optional
    country?: string; // Country of the user, optional
    language?: string; // Language of the user, optional
    postal_code?: string; // Postal code of the user, optional
    address_complement?: string; // Address complement of the user, optional
    address?: string; // Address of the user, optional
    phone_number?: string; // Phone number of the user, optional
    phone_verified?: boolean; // Whether the user's phone number is verified, optional
    email_verified?: boolean; // Whether the user's email is verified, optional
    bio ?: string; // Short bio of the user, optional
}

