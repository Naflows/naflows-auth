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


export { fakeRes };