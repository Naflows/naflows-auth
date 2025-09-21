import { software } from "../../../software/dir";


export async function getPlans() {



    return software.methods.serverReply(200, "Plans fetched successfully", {
        plans: [
            {
                "id": 0,
                "name": "Free",
                "price": 0,
                "features": [
                    {
                        "feature": "Rate-limited token generation",
                        "icon": "token"
                    },
                    {
                        "feature" : "5GB Storage for service data",
                        "icon": "storage"
                    },
                    {
                        "feature": "Basic analytics",
                        "icon": "analytics"
                    },
                    {
                        "feature": "Community support",
                        "icon": "community"
                    }
                ],
                "RPS": 100,
                "type": "cloud",
                "storage": "5GB",
                "description": "Ideal for individuals and small projects starting out."
            },
            {
                "id": 1,
                "name": "Pro",
                "price": 20 * 1.07,
                "features": [
                    {"feature": "Unlimited token generation", "icon": "token"},
                    {"feature" : "10GB Storage for service data", "icon": "storage"},
                    {"feature": "Multiple users for service management", "icon": "users"},
                    {"feature": "Advanced analytics", "icon": "analytics"},
                    {"feature": "Priority support", "icon": "support"}
                ],
                "RPS": 1000,
                "type": "cloud",
                "storage": "10GB",
                "description": "Perfect for growing teams and businesses needing more resources."
            },
            {
                "id": 2,
                "name": "Enterprise",
                "price": 50 * 1.07,
                "features": [
                    {"feature": "Unlimited token generation", "icon": "token"},
                    {"feature" : "25GB Storage for service data", "icon": "storage"},
                    {"feature": "Custom integrations", "icon": "integration"},
                    {"feature": "Multiple users with role-based access", "icon": "users"},
                    {"feature": "Advanced security features", "icon": "security"},
                    {"feature": "Dedicated support", "icon": "support"}
                ],
                "RPS": 10000,
                "description": "Custom solutions for large organizations with specific needs.",
                "type": "cloud",
                "storage": "50GB"
            }
        ]
    });
}