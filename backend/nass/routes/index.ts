import nass from "../dir";

const express = require('express');
const router = express.Router();

router.post('/instance/init', async (req, res) => {
    nass.instance.init(req, res);
});

router.post('/instance/init-test', async (req, res) => {
    nass.token.valid(req, res);
});


router.post('/dev/instance/tunnel/create', async (req, res) => {
    res.send({ success: true, message: "Not implemented yet." });
})

router.post('/user/instance/connect', async (req, res) => {
    nass.instance.connection(req, res);
});


module.exports = router;
