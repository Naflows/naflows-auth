import "dotenv/config.js";


import { serve } from "./public/method/serve";
import secure from "./secure/global/dir";
import mongoose from 'mongoose';
import middleware from "./middleware/dir";
import { Request, Response } from 'express';
import { ReplyType } from "./types/.types/reply.type";
import { connectToDatabase } from "./init/mongo-connect";
import { useApp } from "./init/app-use";
import { services } from "./secure/services/dir";
import path from "path";
import { software } from "./software/dir";
import { Service, User } from "./types/.types/collections.type";
import mailing from "./software/mailing/dir";
import express from "express";
import bodyParser from "body-parser";
import notifications from "./software/notifications/dir";


const nass = require('./nass/routes/index');
const servicesRoutes = require('./secure/routes/index');


const app = express();
const router = express.Router();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));


connectToDatabase();
useApp(app);
app.use('/nass', nass);
app.use('/client', servicesRoutes);



app.post('/client/build/service', async (req: Request, res: Response) => {
    const { userID, password, identifier, details } = req.body;
    const builtService: ReplyType = await services.service.build(
        userID, password, identifier, details
    );

    if (!builtService.success) {
        return res.status(builtService.status).json(builtService);
    }

    res.status(200).json(builtService.data);
})

// app.post('/contract-debug/get-api-key', async (req, res) => {
//     const { userID, serviceID, password, identifier } = req.body;
//     const token = await services.token.get(userID, serviceID, password, identifier)
//     res.status(token.status).json(token);
// })
app.post('/contract-debug/validate-token', async (req, res) => {
    const { serviceID, token, creation_date } = req.body;
    const t: boolean = await services.token.check(serviceID, token, creation_date)
    res.status(t ? 200 : 403).json(t);
})

app.post('/test', (req: Request, res: Response) => {
    const newSessionID = (req as any).newSessionID;
    const newTokenID = (req as any).newTokenID;
    const retryAfter = (req as any).retry_after;
    const token = (req as any).token;
    const data: ReplyType = {
        status: 200,
        message: "Successful connection",
        success: true,
    };
    // I don't like when there are duplicated lines ugh
    if (newSessionID) {
        data.data = data.data || {};
        data.data['session'] = newSessionID;
    }
    if (newTokenID) {
        data.data = data.data || {};
        data.data['token'] = newTokenID;
    }
    if (token) {
        data.data = data.data || {};
        data.data['token'] = token;
    }
    if (retryAfter) {
        data.data = data.data || {};
        data.data['retry_after'] = retryAfter;
    }
    res.status(200).json(data);
});


app.get('/client', (req, res) => {
    res.send('Welcome to the Auth API');
});


/*

    WARNING : THIS PART IS THE ONLY ONE THAT IS NOT 
    SUBMITTED TO THE NASS. 

*/
app.post('/team/add/service/post', async (req, res) => {
    // Handle the request to add a service that comes from a form
    const body = req.body;
    if (body.db_username != process.env.MONGO_INITDB_ROOT_USERNAME || body.db_password != process.env.MONGO_INITDB_ROOT_PASSWORD) {
        await secure.blacklist(mongoose, req, res, "Invalid MongoDB credentials provided when trying to add a new session to the NASS.");
    } else {
        const usersCollection = mongoose.connection.collection('users');
        const user = await usersCollection.findOne({
            identifier: secure.crypt(body.user_identifier),
        });
        if (
            !user ||
            user === null ||
            user === undefined ||
            (user && user.password !== secure.crypt(body.user_password) && user.password !== body.user_password)
        ) {
            await secure.blacklist(mongoose, req, res, "Invalid user credentials provided when trying to add a new service to the NASS.");
        } else {
            // Add connection and service token
            return res.status(200).send(`Service ${body.name} added successfully`);
        }

    }
})


app.get('/team/add/service', (req, res) => {
    serve("Add service", "form-style.css", "add-service.html", res);
})



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




app.post('/client/secure/data/services', async (req, res) => {
    const user = await secure.user.manageConnection(req, res);
    const userServices = user.services || [];
    const sentServices = await Promise.all(
        Object.keys(userServices).map(async (key) => {
            const serviceRt: ReplyType = await services.service.get(key);
            const service: Service = serviceRt.data as Service;
            if (service) {
                console.log("Pushing service to sentServices:", service);
                return {
                    name: service.name,
                    id: service.id,
                    description: service.description,
                    dns: service.dns,
                    status: service.status,
                    rights: userServices[key].rights,
                    joined_at: userServices[key].joined_at,
                    user_active: userServices[key].active,
                    picture: service.picture,
                    banner: service.banner,
                    details: service.details,
                };
            }
            return null; // Return null for invalid services
        })
    );

    const validServices = sentServices.filter(service => service !== null);

    console.log("Sending services to user:", validServices);

    res.status(200).json({
        status: 200,
        message: "Secure data access granted",
        success: true,
        data: {
            middleware: req.middleware.data,
            services: validServices,
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

    const serviceInfo = serviceData.data as Service;

    console.log('>>> Service ID requested:', serviceInfo.id);




    const isUserDev: ReplyType = await services.service.user.isDev(user.id, serviceInfo.id);
    console.log("Is user a developer for this service?", isUserDev);
    if (isUserDev.success) {
        serviceInfo.details.access_key = isUserDev.data.access_key;
    } else {
        delete serviceInfo.ip_address;
        delete serviceInfo.created_by;
        delete serviceInfo.plan;
        delete serviceInfo.settings;
    }



    console.log("Sending service information for service:", serviceInfo.name, "to user:", user.username);
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
    user.profile_picture = req.body.userDetails.profile_picture || user.profile_picture;
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



app.post('/client/secure/data/services/build', async (req, res) => {

    console.log("Request to build service received:", req.body);

    const service = req.body.service;
    if (!service) {
        console.log("Bad Request: Missing service details.");
        return res.status(400).json(software.methods.serverReply(400, "Bad Request: No service data provided.", {
            middleware: req.middleware.data,
        }));
    }
    const create: ReplyType = await services.service.register({
        id: service.public.id,
        name: service.public.name,
        description: service.public.description || null,
        ip_address: service.configuration.config.ip_address,
        dns: service.configuration.config.dns,
        picture: service.public.profileImage || null,
        banner: service.public.bannerImage || null,
    }, {
        rates: service.configuration.plans.RPS || 100,
    }, {
        allow_public_visibility: service.public.allow_public_visibility || false,
        allow_user_registration: service.public.allow_user_registration || false,
    }, {
        id: service.configuration.plans
    }, req, res);
    res.status(create.status).json({
        status: create.status,
        message: create.message,
        success: create.success,
        data: {
            middleware: req.middleware.data,
        }
    });


})

app.post('/client/secure/data/user', async (req, res) => {

    const user = await secure.user.manageConnection(req, res);

    // Remove sensitive information
    delete user.password;
    delete user.services;
    delete user.identifier;

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
    const plans = await services.service.getPlans();
    res.status(plans.status).json(plans);
});







const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`NASS is running on http://localhost:${PORT}`);
});

export const db = mongoose.connection;
export const appInstance = app;
export const appRouter = router;