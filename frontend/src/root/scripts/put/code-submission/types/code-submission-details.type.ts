

export type CodeSubmissionDetails = {
    valueOnSuccess: string;
    data: {
        [key: string]: object | string | number | boolean | null | undefined;
        code?: string;
    };
    inputLabel: string;
    route: string;
    redirectOnSuccess?: string;
};