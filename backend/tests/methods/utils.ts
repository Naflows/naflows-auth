interface FakeResponse {
    status: (code: number) => {
        json: (data: any) => { code: number; data: any };
    };
    send: (data: any) => any;
}

const fakeRes: FakeResponse = {
    status: (code: number) => {
        return {
            json: (data: any) => {
                return { code, data };
            }
        };
    },
    send: (data: any) => {
        return data;
    }
};

const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};


const fakeUCR = (userOverride = {}) => ({
    user: {
        ip: "1.1.1.2",
        agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
        session_id: "1",
        token: "test-token",
        identifier: "dummy",
        password: "dummy",
        user_id: "2",
        device_fingerprint: { device: "desktop", os: "windows", browser: "chrome" },
        ...userOverride
    },
    client: {
        ip: "::ffff:172.18.0.6",
        dns: "local.nass.com",
        service: "1",
        service_token: "test-service-token",
        service_token_birth: 1750658147765
    },
    request: {
        method: "POST",
        url: "/test",
        headers: { "Content-Type": "application/json" },
        body: { key: "value" },
        query: { param: "value" },
        request_date: 1700000000
    },
    data: {}
});



export { fakeRes, fakeUCR, sleep };