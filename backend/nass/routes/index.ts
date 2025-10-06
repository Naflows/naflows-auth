import nass from "../dir";

const express = require('express');
const router = express.Router();

router.post('/dev/init', async (req, res) => {
    nass.instance.init(req, res);
});

router.post('/dev/init-test', async (req, res) => {
    nass.token.valid(req, res);
});

router.post('/user/instance/connect', async (req, res) => {
    nass.instance.connection(req, res);
});


module.exports = router;
