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

router.post('/secure/services/get-users', async (req, res) => {
    const user = await secure.user.manageConnection(req, res);
    services.routes.getUsers(req, res, user);
});

router.post('/secure/services/get-traffic', async (req, res) => {
    const user = await secure.user.manageConnection(req, res);
    services.routes.traffic(req, res, user);
});

router.post('/secure/services/rights/get', async (req, res) => {
    const user = await secure.user.manageConnection(req, res);
    services.routes.getRights(req, res, user);
});

router.post('/secure/services/rights/create', async (req, res) => {
    const user = await secure.user.manageConnection(req, res);
    services.routes.createRights(req, res, user);
})

router.post('/secure/services/service/key', async (req, res) => {
    const user = await secure.user.manageConnection(req, res);
    services.routes.serviceKey(req, res, user);
});


// Can user access the whole service management?
router.post('/secure/services/user/check-access', async (req,res) => {
    const user = await secure.user.manageConnection(req, res);
    services.routes.canAccess(req, res, user);
})

router.post('/secure/services/rights/assign', async (req, res) => {
    const user = await secure.user.manageConnection(req, res);
    services.routes.assignRights(req, res, user);
});



module.exports = router;