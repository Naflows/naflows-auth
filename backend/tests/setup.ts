


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
            tries++;
            console.log(`WAITING FOR SERVER AT ${url}... (${(tries * 100) / maxTries}%).`);
            await new Promise((res) => setTimeout(res, interval));
        }
    }

    throw new Error(`❌ Server not reachable at ${url} after ${timeout}ms`);
};

module.exports = async () => {

    const appUrl = process.env.AUTH_API_URL || process.env.CONTRACTS_API_URL;
    if (!appUrl) {
        throw new Error("Test URL is not set. Please set it in your environment variables.");
    }
    await waitForServer(appUrl);

};
