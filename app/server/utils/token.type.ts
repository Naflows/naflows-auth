

interface TToken {
    id : number;
    user_id : number;
    session_token : string;
    created_at : Date;
    ip : string;
    signature : string;
    user_agent : string;
    expires_at : Date;
}

export default TToken;