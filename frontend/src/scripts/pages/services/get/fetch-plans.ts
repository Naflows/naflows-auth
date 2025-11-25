import type { ServiceConfigurationProps } from "../../../../pages/services/create/sub-components/configuration";


export async function fetchPlansFromNass(): Promise<ServiceConfigurationProps["plans"][] | undefined> {
    try {
        const res = await fetch(`${process.env.DUMMY_API_URL_DEV}/public/data/plans.json`);
        const data = await res.json();
        console.log("Plans state updated:", data.data.plans);
        return data.data.plans as ServiceConfigurationProps["plans"][];
    } catch (error) {
        console.error("Error fetching plans:", error);
        return undefined;
    }
}