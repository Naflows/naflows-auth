import { software } from "../../../../software/dir";




export async function getPlans() {

    /*

        Since stripe gets 0.7% off every transaction, we add +2% to the price to cover the fees.

    */

    return software.methods.serverReply(200, "Plans fetched successfully", {
        plans: [
            {
                "id": 0,
                "name": "FREE",
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
                "type": "CLOUD",
                "storage": 5,
                "description": "Ideal for individuals and small projects starting out."
            },
            {
                "id": 1,
                "name": "PRO",
                "price": Math.round(20 * 1.2),
                "features": [
                    {"feature": "Unlimited token generation", "icon": "token"},
                    {"feature" : "10GB Storage for service data", "icon": "storage"},
                    {"feature": "Multiple users for service management", "icon": "users"},
                    {"feature": "Advanced analytics", "icon": "analytics"},
                    {"feature": "Priority support", "icon": "support"}
                ],
                "RPS": 1000,
                "type": "CLOUD",
                "storage": 10,
                "description": "Perfect for growing teams and businesses needing more resources."
            },
            {
                "id": 2,
                "name": "ENTERPRISE",
                "price": Math.round(50 * 1.2),
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
                "type": "CLOUD",
                "storage": 50
            }
        ]
    });
}