

export type ServiceOverviewTabs = "settings" | "users" | "network" | "safety" | "logs" | "rights" | "overview";
export const SERVICE_OVERVIEW_TABS: { id: ServiceOverviewTabs; label: string }[] = [
    { id : "overview", label: "Overview" },
    { id: "settings", label: "Settings" },
    { id: "users", label: "Users" },
    { id : "rights", label: "Rights" },
    { id: "network", label: "Network" },
    { id: "safety", label: "Safety" },
    { id: "logs", label: "Logs" }
];