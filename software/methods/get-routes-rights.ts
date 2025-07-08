

export default async function getRoutesRights(): Promise<Object> {
    const fetched = fetch('../../middleware/_routes/authorization/nass.naflows.com.json').then(res => res.json()).catch(err => {
        console.error("Failed to fetch NASS routes rights:", err);
        return {};
    });
    const routesRights = await fetched;
    if (Object.keys(routesRights).length === 0) {
        console.warn("No routes rights found or failed to fetch.");
    }
    return routesRights;
}