

interface TReply {
    success : boolean;
    message : string;
    infos? : any; // Optional, can be used to return additional information
}

export default TReply;