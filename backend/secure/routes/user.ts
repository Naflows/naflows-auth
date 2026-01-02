import { software } from "../../software/dir";
import { ReplyType } from "../../types/.types/reply.type";
import secure from "../global/dir";

const express = require('express');
const router = express.Router();


router.post('/register', async (req, res) => {
    const {
        email, password, passwordConfirm, firstName, lastName, birthdate, acceptEmails
    } = req.body;
    const reply: ReplyType = await secure.user.register(
        `${firstName} ${lastName}`, password, passwordConfirm, email, firstName, lastName, birthdate, acceptEmails
    );
    software.methods.directResponse(reply.status, reply.message, res, reply);
})

module.exports = router;