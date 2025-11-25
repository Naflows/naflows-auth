
export interface Log {
    id: string;
    service_id: string;
    message: string;
    type: "USER" | "SERVICE" | "SECURITY" | "SYSTEM" | "OTHER" | "SETTINGS" | "DEVELOPERS";
    level: "INFO" | "WARNING" | "ERROR"; // Log level
    metadata?: {
        userData?: {
            username?: string;
            picture?: string | null;
            first_name?: string | null;
            last_name?: string | null;
            rights?: { id: string; name: string; hue: string; }[];
        },
        message?: string
    };
    created_at: number;
}

export interface Filters {
    dateFrom?: number | null;
    dateTo?: number | null;
    type?: string | null;
    level?: string | null;
    user?: string | null;
}