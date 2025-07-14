

export default async function getRoutesRights(): Promise<Object> {
    let routesRights = {};
    try {
        const response = await import('../../middleware/_routes/authorization/nass.naflows.com.json')
        routesRights = response.default || {};
    } catch (err) {
        console.error("Failed to fetch NASS routes rights:", err);
    }
    if (Object.keys(routesRights).length === 0) {
        console.warn("No routes rights found or failed to fetch.");
    }
    return routesRights;
}