import secure from "../global/dir";
import { services } from "../services/dir";

const express = require('express');
const router = express.Router();

router.put('/secure/services/update', async (req, res) => {
    const user = await secure.user.manageConnection(req, res);
    services.routes.update(req, res, user);
});

router.post('/secure/services/get-logs', async (req, res) => {
    const user = await secure.user.manageConnection(req, res);
    services.routes.logs(req, res, user);
});

router.post('/secure/services/rights/get', async (req, res) => {
    const user = await secure.user.manageConnection(req, res);
    services.routes.getRights(req, res, user);
});



module.exports = router;