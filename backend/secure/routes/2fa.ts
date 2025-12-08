import { software } from "../../software/dir";
import UCRType from "../../types/.types/ucr.type";
import { twoFA } from "../2FA/dir";
import secure from "../global/dir";

const express = require('express');
const router = express.Router();


router.post('/generate-request', async (req, res) => {
    const user = await secure.user.manageConnection(req, res);
    const ucr = req.body as UCRType;


    console.log("UCR received for 2FA generate-request:", ucr);

    const result = await twoFA.generateRequest(user, ucr.user.cryptographic_token || "", {
        action: req.body.action,
        data: req.body.data
    });

    console.log("2FA generate-request result:", result);
    return software.methods.directResponse(result.status, result.message,res,req, result.data);
});

router.post('/generate-code', async (req, res) => {
    const user = await secure.user.manageConnection(req, res);
    const ucr = req.body as UCRType;

    console.log("UCR received for 2FA generate-code:", ucr);

    const result = await twoFA.generateCode(user, ucr.user.cryptographic_token || "", {
        action: req.body.action,
        data: req.body.data
    });

    console.log("2FA generate-code result:", result);
    return software.methods.directResponse(result.status, result.message,res,req, result.data);
});

module.exports = router;