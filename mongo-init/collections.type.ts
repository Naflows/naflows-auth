

export interface Blacklist {
    ip : string,
    userAgent : string,
    reason : string,
    date : Date
}

export interface RequestsTypes {
    ip : string;
    userAgent: string;
    count: number;
    lastRequest: Date;
    firstRequest: Date;
}