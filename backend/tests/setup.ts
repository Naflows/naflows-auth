

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}


const waitForServer = async (url: string, timeout = 20000) => {
    const interval = 500;
    const maxTries = Math.ceil(timeout / interval);
    let tries = 0;

    while (tries < maxTries) {
        try {
            await fetch(url);
            console.log(`SERVER IS UP AT ${url}.`);
            return;
        } catch (err) {
            if (err instanceof Error && (err.message.includes('ECONNREFUSED') || err.message.includes('Failed to fetch'))) {
                tries++;
                console.log(`WAITING FOR SERVER AT ${url}... (${(tries * 100) / maxTries}%).`);
                await new Promise((res) => setTimeout(res, interval));
            } else {
                console.log("Server is up.");

                return;
            }
        }
    }

    throw new Error(`❌ Server not reachable at ${url} after ${timeout}ms`);
};

module.exports = async () => {

    // const appUrl = process.env.AUTH_API_URL || process.env.SERVICES_API_URL || "http://auth-api-1:3000";
    // if (!appUrl) {
    //     throw new Error("Test URL is not set. Please set it in your environment variables.");
    // }
    // await waitForServer(appUrl);

    sleep(5000); // Extra wait time to ensure the server is fully ready

};
