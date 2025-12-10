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

// Used by the client to check if a 2FA is required and valid for the current action (prevents unnecessary re-run of 2FA)
router.post('/socket-status', async (req, res) => {
    const user = await secure.user.manageConnection(req, res);
    const ucr = req.body as UCRType;

    console.log("UCR received for 2FA socket-status:", ucr);

    const result = await twoFA.analysis.context(
        user,
        {
            action: req.body.action,
            data: req.body.data
        },
        ucr.user.cryptographic_token || ""
    );

    if (!result.existing) {
        console.log("No existing 2FA log found for socket-status.");
        return software.methods.directResponse(404, result.reason || "No matching 2FA request found.",res,req, {});
    }

    console.log("2FA socket-status result:", result);
    return software.methods.directResponse(result.valid ? 200 : 401, result.reason || "",res,req,  {});
});



router.post('/verify-code', async (req, res) => {
    const user = await secure.user.manageConnection(req, res);
    const ucr = req.body as UCRType;

    console.log("UCR received for 2FA check-code:", ucr);

    const result = await twoFA.validateRequest(
        user,
        ucr.user.cryptographic_token || "",
        {
            action: req.body.action,
            data: req.body.data
        },
        req.body.code
    );

    console.log("2FA check-code result:", result);
    return software.methods.directResponse(result.status, result.message,res,req, result.data);
});

module.exports = router;