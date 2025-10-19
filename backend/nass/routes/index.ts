import { nassMiddleware } from "../../init/nass-middleware";
import nass from "../dir";

const express = require('express');
const router = express.Router();


router.use(async (req, res, next) => {
    nassMiddleware(req, res, next);
});

router.post('/dev/instance/init', async (req, res) => {
    nass.instance.init(req, res);
});

router.post('/dev/instance/init-test', async (req, res) => {
    nass.token.valid(req, res);
});


router.post('/dev/instance/tunnel/create', async (req, res) => {
    nass.tunnel.create(req, res);
})

router.post('/user/instance/connect', async (req, res) => {
    nass.instance.connection(req, res);
});


module.exports = router;
