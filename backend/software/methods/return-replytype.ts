import { ReplyType } from "../../types/.types/reply.type";



export function returnReplyType(code, message, data?, skipLog: boolean = false): ReplyType {
    const r = {} as ReplyType;
    r.status = code;
    r.message = message;
    if (data) {
        r.data = data;
    }
    r.success = code >= 200 && code < 300;


    if (!skipLog) {
        process.stdout.write(
            r.success
                ? `\x1b[32mSuccess (${r.status}) - ${r.message}\x1b[0m\n`
                : `\x1b[31mError (${r.status}) - ${r.message}\x1b[0m\n`
        );
    }
    if (data && process.env.DEV_SKIP_LOGGING_METADATA !== "true") {
        process.stdout.write(`\x1b[90mData: ${JSON.stringify(data)}\x1b[0m\n`);
    }
    return r;
}