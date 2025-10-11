

export type ServiceOverviewTabs = "settings" | "users" | "network" | "safety" | "logs" | "rights";
export const SERVICE_OVERVIEW_TABS: { id: ServiceOverviewTabs; label: string }[] = [
    { id: "settings", label: "Settings" },
    { id: "users", label: "Users" },
    { id: "network", label: "Network" },
    { id: "safety", label: "Safety" },
    { id: "logs", label: "Logs" }
];