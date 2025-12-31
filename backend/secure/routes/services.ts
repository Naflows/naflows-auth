 import { software } from "../../software/dir";
import { ReplyType } from "../../types/.types/reply.type";
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

router.post('/secure/services/rights/update', async (req, res) => {
    const user = await secure.user.manageConnection(req, res);
    services.routes.updateRights(req, res, user);
});

router.post('/secure/services/rights/create', async (req, res) => {
    const user = await secure.user.manageConnection(req, res);
    services.routes.createRights(req, res, user);
})

router.post('/secure/services/service/key', async (req, res) => {
    const user = await secure.user.manageConnection(req, res);
    services.routes.serviceKey(req, res, user);
});

router.post('/secure/services/user/check-access', async (req,res) => {
    const user = await secure.user.manageConnection(req, res);
    services.routes.canAccess(req, res, user);
})

router.post('/secure/services/rights/assign', async (req, res) => {
    const user = await secure.user.manageConnection(req, res);
    services.routes.assignRights(req, res, user);
});

router.post('/secure/services/rights/delete', async (req, res) => {
    const user = await secure.user.manageConnection(req, res);
    services.routes.deleteRight(req, res, user);
});

router.post('/secure/services/update/description', async (req, res) => {
    const user = await secure.user.manageConnection(req, res);
    services.routes.update(req, res, user);
});


// Update service data
router.post('/secure/services/data/update/', async (req, res) => {
    const user = await secure.user.manageConnection(req, res);
    const serviceId = req.body.service_id;
    const markdown = req.body.markdown;
    const type = req.body.type; // "privacy_policy_url" | "terms_of_service_url" | "contact_email"
    const replyType : ReplyType = await services.service.global.updateLegal(serviceId, user, markdown, type);
    return software.methods.directResponse(replyType.status, replyType.message, res, req, replyType.data);
});




module.exports = router;