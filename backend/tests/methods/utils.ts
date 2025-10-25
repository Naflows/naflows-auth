import { json } from "stream/consumers";
import { UserSession } from "../../types/.types/collections.type";


/* Fake Response object for testing purposes */
interface FakeResponse {
    status: (code: number) => {
        json: (data: any) => { code: number; data: any };
    };
    send: (data: any) => any;
}


const getFakeRes = () => {
    return {
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
    } as unknown as Response;
};

/* Fake req object for testing purposes */

interface FakeRequestOptions {
    body?: any;
    headers?: Record<string, string>;
    method?: string;
    params?: any;
    query?: any;
    url?: string;
}

const getFakeReq = (bodyContent: any): Request => {
    const req = {
        body: bodyContent,
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        params: {},
        query: {},
        url: '/test',
        path: '/test',
        get: function(headerName: string) {
            return this.headers?.[headerName.toLowerCase()];
        },
        header: function(headerName: string) {
            return this.get(headerName);
        },
        accepts: () => false,
        acceptsCharsets: () => false,
        acceptsEncodings: () => false,
        acceptsLanguages: () => false,
        range: () => undefined,
        param: () => undefined,
        is: () => false,
        socket : {
            remoteAddress: '127.0.0.1',
            remotePort: 12345,
            localAddress: '127.0.0.1',
            localPort: 54321,
            // Add any other properties or methods you need for testing
        },
        protocol: 'http',
        secure: false,
        ip: '127.0.0.1',
        ips: [],
        subdomains: [],
        hostname: 'localhost',
        host: 'localhost',
        fresh: false,
        stale: true,
        xhr: false,
        route: {},
        baseUrl: '',
        originalUrl: '/test',
        cookies: {},
        signedCookies: {},
        // Add EventEmitter methods that Express Request extends
        on: () => req as any,
        once: () => req as any,
        off: () => req as any,
        emit: () => false,
        addListener: () => req as any,
        removeListener: () => req as any,
        removeAllListeners: () => req as any,
        setMaxListeners: () => req as any,
        getMaxListeners: () => 0,
        listeners: () => [],
        rawListeners: () => [],
        listenerCount: () => 0,
        prependListener: () => req as any,
        prependOnceListener: () => req as any,
        eventNames: () => [],
    } as unknown as Request;

    return req;
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

const fakeUserSession : UserSession = {
    id: "1",
    user_id: "2",
    ip: "1.1.1.2",
    agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
    last_activity: Date.now(),
    expires_at: Date.now() + 3600000,
    active: true,
    service_id: "1",
    created_at: Date.now(),
    token_id: "test-token-id",
    device_fingerprint: '{ device: "desktop", os: "windows", browser: "chrome" }'
}




export { getFakeRes, fakeUCR, sleep, fakeUserSession, getFakeReq };