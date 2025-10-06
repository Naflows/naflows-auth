import { services } from "../../secure/services/dir";


export async function checkTokenValidity(req,res) {
    const { apiID, token, tokenBirth } = req.body;

    const check = await services.token.check(apiID, token, tokenBirth);
    if (!check) {
        return res.status(403).json({ success: false, message: "Invalid or expired token. Please renew your API key." });
    }

    return res.status(200).json({ success: true, message: "Test instance initialized successfully."});
}