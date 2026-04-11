import "dotenv/config.js";


import { serve } from "./public/method/serve";
import secure from "./secure/global/dir";
import mongoose, { Collection } from 'mongoose';
import middleware from "./middleware/dir";
import { Request, Response } from 'express';
import { ReplyType } from "./types/.types/reply.type";
import { connectToDatabase } from "./init/mongo-connect";
import { useApp } from "./init/app-use";
import { services } from "./secure/services/dir";
import path from "path";
import { software } from "./software/dir";
import { Service, ServiceAlert, ServicePlan, User } from "./types/.types/collections.type";
import mailing from "./software/mailing/dir";
import express from "express";
import bodyParser from "body-parser";
import notifications from "./software/notifications/dir";
import { uploadPicture } from "./software/data-management/manage-pictures";
import getPicture from "./software/data-management/get-picture";


const nass = require('./nass/routes/index');
const servicesRoutes = require('./secure/routes/services.ts');
const TwoFARoutes = require('./secure/routes/2fa.ts');
const userRoutes = require('./secure/routes/user.ts');

const app = express();
const router = express.Router();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));


connectToDatabase();

// Keep this before app.use 
app.get('/client', (req, res) => {
    res.send('Welcome to the Auth API');
});

useApp(app);
app.use('/nass', nass);
app.use('/client', servicesRoutes);
app.use('/client/secure/2FA', TwoFARoutes);
app.use('/client/secure/user', userRoutes);









app.get('/public/resources/mailing/pattern/custom-code.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'resources', 'mailing', 'pattern', 'custom-code.html'));
});


app.get('/client/account/confirm', async (req, res) => {
    const token = req.query.tokenvalue;
    const tokenID = req.query.tokenid;

    console.log(token, tokenID);
    const c = await secure.session.confirm(token as string, tokenID as string);

    res.status(c.status).json(c);
});

app.post('/client/login', async (req, res) => {
    const lR: ReplyType = await secure.user.login(req, res);
    if (lR.status === 200 && lR.data) {
        const data = lR.data as { session: string; token: string, user_id: string };
        // Send cookie of session and token
        console.log("Setting cookies:", data);
        res.cookie("session", JSON.stringify(data.session), { httpOnly: true });
        res.cookie("token", JSON.stringify(data.token), { httpOnly: true });
        res.cookie("uid", JSON.stringify(data.user_id), { httpOnly: true });
    }
    res.status(lR.status).json(lR);
});


app.post('/client/logout', async (req, res) => {
    const lR: ReplyType = await secure.user.logout(req, res);
    if (lR.status === 200) {
        // Remove cookies
        res.clearCookie("session");
        res.clearCookie("token");
        res.clearCookie("uid");
    }
    res.status(lR.status).json(lR);
});


app.post('/client/secure/data/services', async (req, res) => {
    const user = await secure.user.manageConnection(req, res);
    const userServices = await services.service.user.getAllService(user.id, true);

    res.status(200).json({
        status: 200,
        message: "Secure data access granted",
        success: true,
        data: {
            middleware: req.middleware.data,
            services: userServices.data.services,
        }
    });
});



app.post('/client/secure/data/services/service-informations', async (req, res) => {
    const user = await secure.user.manageConnection(req, res);
    const userData = await secure.user.get(user.id, false);
    if (!userData) {
        console.log("User data not found");
        return res.status(404).json(software.methods.serverReply(404, "User not found.", {
            middleware: req.middleware.data,
        }));
    }

    const service = userData.services[req.body.service.id] || null;
    if (!service) {
        console.log("Service not found in user's services");
        return res.status(404).json(software.methods.serverReply(404, "Service not found in user's services.", {
            middleware: req.middleware.data,
        }));
    }

    const serviceData = service ? await services.service.get(req.body.service.id) : null;

    if (!service || !serviceData || !serviceData.success) {
        return res.status(404).json(software.methods.serverReply(404, "Service not found.", {
            middleware: req.middleware.data,
        }));
    }

    const serviceInfo = serviceData.data.service as Service;

    console.log('>>> Service ID requested:', serviceInfo.id);

    serviceInfo.plan = await services.service.plan.get(serviceInfo.plan as unknown as number) as unknown as ServicePlan;


    const isUserDev: ReplyType = await services.service.user.isDev(user.id, serviceInfo.id);
    console.log("Is user a developer for this service?", isUserDev)
    if (isUserDev.success) {
        serviceInfo.details.access_key = isUserDev.data.access_key;

        serviceInfo.alerts = (await services.service.getAlerts(serviceInfo.id)).data.alerts as unknown as ServiceAlert[];

    } else { 
        delete serviceInfo.ip_address;
        delete serviceInfo.plan;
        delete serviceInfo.settings;
    }

    serviceInfo.user_authorizations = await services.service.dev.authorizations(user.id, serviceInfo.id);





    console.log("Sending service information for service:",serviceInfo.name, "to user:", user.username);
    res.status(200).json({
        status: 200,
        message: "Secure data access granted",
        success: true,
        data: {
            middleware: req.middleware.data,
            service: {
                ...serviceData.data,
                ...service,
                ...serviceInfo,
                user_active: service.active,
            }
        }
    });
});

app.post('/client/secure/user/register-in-api', async (req, res) => {
    const user = await secure.user.manageConnection(req, res);
    const apiID = req.body.serviceID || "Naflows Auth API";
    const code = req.body.code || null;

    const register = await services.service.user.register(user, apiID, code, false, ["USER"]);
    res.status(register.status).json({
        status: register.status,
        message: register.message,
        success: register.success,
        data: {
            middleware: req.middleware.data,
            ...register.data,
        }
    });
});

app.post('/public/global/user/id/', async (req, res) => {
    const userID = req.body.userID || "";

    if (userID.length === 0) {
        return res.status(400).json({
            status: 400,
            message: "User ID must be provided.",
            success: false,
            data: {
                users: [],
            }
        });
    }

    const user = await secure.user.get(userID, false);
    if (!user) {
        return res.status(404).json({
            status: 404,
            message: "User not found.",
            success: false,
            data: {
                users: [],
            }
        });
    }

    // Remove sensitive information
    const safeUser = {
        id: user.id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_picture: await getPicture(user.id, "user") || null,
    };

    res.status(200).json({
        status: 200,
        message: "User retrieved successfully.",
        success: true,
        data: {
            users: [safeUser],
        }
    });
});

app.post('/public/global/user/', async (req, res) => {
    const username = req.body.username || "";

    if (username.length < 3) {
        return res.status(400).json({
            status: 400,
            message: "Username must be at least 3 characters long.",
            success: false,
            data: {
                users: [],
            }
        });
    }

    const usersCollection = db.collection("users") as Collection<User>;
    // Get all users whose username matches a part of the username param (case insensitive)
    const users = await usersCollection.find({ username: { $regex: new RegExp(username, 'i') } }).toArray();
    // Remove sensitive information
    const safeUsers = await Promise.all(users.map(async (user: User) => {
        return {
            id: user.id,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            profile_picture: await getPicture(user.id, "user") || null,
        };
    }));
    res.status(200).json({
        status: 200,
        message: "Users retrieved successfully.",
        success: true,
        data: {
            users: safeUsers,
        }
    });
})

app.post('/client/secure/user/send-verification-code', async (req, res) => {
    const user = await secure.user.manageConnection(req, res);
    const serviceID = req.body.serviceID || "Naflows Auth API";
    const sendCode: ReplyType = await secure.user.sendVerificationCode(user.id, serviceID);
    res.status(sendCode.status).json({
        status: sendCode.status,
        message: sendCode.message,
        success: sendCode.success,
        data: {
            middleware: req.middleware.data,
        }
    });
});

app.post('/client/secure/user/notifications/mark-as-read', async (req, res) => {
    const user = await secure.user.manageConnection(req, res);
    const notificationId = req.body.notificationId;
    const markAsRead: ReplyType = await notifications.setRead(user.id, notificationId);
    res.status(markAsRead.status).json({
        status: markAsRead.status,
        message: markAsRead.message,
        success: markAsRead.success,
        data: {
            middleware: req.middleware.data,
        }
    });
});

app.put('/client/secure/user/update', async (req, res) => {
    let user = await secure.user.manageConnection(req, res);
    if (!user) {
        return res.status(404).json(software.methods.serverReply(404, "User not found.", {
            middleware: req.middleware.data,
        }));
    }
    console.log("Updating user data for user:", user.username, user.id, "with data:", req.body.userDetails);
    user.first_name = req.body.userDetails.first_name || user.first_name;
    user.last_name = req.body.userDetails.last_name || user.last_name;
    user.username = req.body.userDetails.username || user.username;
    user.profile_picture = await uploadPicture(user.id, req.body.userDetails.profile_picture || "", "user") || user.profile_picture;
    user.country = req.body.userDetails.country || user.country || "";
    user.city = req.body.userDetails.city || user.city || "";
    user.postal_code = req.body.userDetails.postal_code || user.postal_code || "";
    user.address = req.body.userDetails.address || user.address || "";
    user.address_complement = req.body.userDetails.address_complement || user.address_complement || "";

    const change = await secure.user.update(user.id, user);
    res.status(change.status).json({
        status: change.status,
        message: change.message,
        success: change.success,
        data: {
            middleware: req.middleware.data,
        }
    });
});



app.post('/client/secure/session-check', async (req, res) => {
    return res.status(200).json({
        status: 200,
        message: "Session is valid.",
        success: true
    });
});

app.post('/client/secure/data/user', async (req, res) => {

    const user = await secure.user.manageConnection(req, res);

    // Remove sensitive information
    delete user.password;
    delete user.services;
    delete user.identifier;

    user.profile_picture = await getPicture(user.profile_picture, "user") || null;

    res.status(200).json({
        status: 200,
        message: "Secure data access granted",
        success: true,
        data: {
            middleware: req.middleware.data,
            user: user
        }
    })
})

app.post('/client/secure/data/notifications', async (req, res) => {
    const user = await secure.user.manageConnection(req, res);
    const start = req.body.start || 0;
    const nos = await notifications.get(user.id, 20, start);

    res.status(200).json({
        status: 200,
        message: "Secure data access granted",
        success: true,
        data: {
            middleware: req.middleware.data,
            notifications: nos,
        }
    });
})

app.post('/public/services/service-informations', async (req, res) => {
    const getter = await services.service.getPublicDetails(req.body.service.id, req.body.service.userID || null);
    console.log("Retrieved public service information:", getter.data);
    res.status(getter.status).json({
        status: getter.status,
        message: getter.message,
        success: getter.success,
        data: {
            service: getter.data,
            middleware: req.middleware.data,
        }
    });
});


// Get OS details for public display (RAM, CPU, Disk, etc.)
app.post('/public/status', async (req, res) => {
    const status = await secure.system.status();
    console.log("System status requested:", status);
    res.status(status.status).json(status);
});

app.post('/public/mailing/subscribe', async (req, res) => {
    const result = await mailing.list.subscribe(req.body.email);
    res.status(result.status).json(result);
});

app.post('/public/services/generate-api-id', async (req, res) => {
    // This generates API IDs for third-party services to connect to Naflows when creating a service
    const newKey = await services.service.generateID();
    res.status(newKey.status).json(newKey);
});


app.post('/public/services/plans', async (req, res) => {
    const plans = await services.service.plan.getAll();
    res.status(plans.status).json(plans);
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Naflows Authentication Secure System is running on http://localhost:${PORT}`);

    if (process.env.DEV_SEND_SENSITIVE_DATA === "true") {
        console.log("WARNING: DEV_SEND_SENSITIVE_DATA is enabled. Sensitive data may be exposed in responses.");
        // Close after 10 seconds
        setTimeout(() => {
            console.log("Shutting down Naflows Authentication Secure System due to DEV_SEND_SENSITIVE_DATA being enabled.");
            process.exit(0);
        }, 10000);
    }
});

export const db = mongoose.connection;
export const appInstance = app;
export const appRouter = router;