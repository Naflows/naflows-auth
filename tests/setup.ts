


const waitForServer = async (url: string, timeout = 20000) => {
    const interval = 500;
    const maxTries = Math.ceil(timeout / interval);
    let tries = 0;

    while (tries < maxTries) {
        try {
            await fetch(url);
            console.log(`✅ Server is up at ${url}`);
            return;
        } catch (err) {
            tries++;
            console.log(`⏳ Waiting for server at ${url}... (${tries}/${maxTries})`);
            await new Promise((res) => setTimeout(res, interval));
        }
    }

    throw new Error(`❌ Server not reachable at ${url} after ${timeout}ms`);
};

module.exports = async () => {
    const appUrl = process.env.AUTH_API_URL || "http://localhost:3000/test";
    if (!appUrl) {
        throw new Error("AUTH_API_URL is not set. Please set it in your environment variables.");
    }
    await waitForServer(appUrl);
};
