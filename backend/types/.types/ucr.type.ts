interface UCRType {

    user : {
        ip : string; // PRE-HASHED
        agent: string; 

        session_id : string;
        user_id : string;
        token? : string;

        identifier? : string; // PRE-HASHED
        password? : string; // PRE-HASHED

        device_fingerprint : object;
    };

    client : {
        ip: string; // PRE-HASHED
        service: string;
        service_token: string; // PRE-HASHED
        service_token_birth: number; // UNIX TIMESTAMP
        service_status?: string; // Idk what to use it for rn 
    };

    data? : {
        tokens? : {
            serviceRegistration? : string;
        };
    };

    request : {
        method: string; // GET, POST, PUT, DELETE, etc.
        url: string; // The URL of the request
        headers: Record<string, string>; // Headers of the request
        body?: any; // Body of the request, if applicable
        query?: Record<string, string>; // Query parameters of the request
        request_date: number; // UNIX TIMESTAMP
        request_additional? : 'TOKEN_RENEWAL';
    }
}

export default UCRType ;