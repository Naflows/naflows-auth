import secure from "../global/dir";

const express = require('express');
const router = express.Router();


router.post('/register', async (req,res) => {
    await secure.user.register(req, res);
})

module.exports = router;