require('dotenv').config();

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


const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();

connectToDatabase();
useApp(app);



app.post('/client/build/service', async (req:  Request, res: Response) => {
    const { userID, password, identifier, details } = req.body;
    const builtService : ReplyType = await services.service.build(
        userID, password, identifier, details
    );

    if (!builtService.success) {
        return res.status(builtService.status).json(builtService);
    }

    res.status(200).json(builtService.data);
})

app.post('/contract-debug/get-api-key', async (req, res) => {
    const { userID, serviceID, password, identifier } = req.body;
    const token = await services.token.get(userID, serviceID, password, identifier)
    res.status(token.status).json(token);
})
app.post('/contract-debug/validate-token', async (req,res) => {
    const { serviceID, token, creation_date } = req.body;
    const t : boolean = await services.token.check(serviceID, token, creation_date)
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
   const lR : ReplyType = await secure.user.login(req,res);
   if (lR.status === 200 && lR.data) {
    const data = lR.data as { session : string; token : string, user_id : string };
    // Send cookie of session and token
    console.log("Setting cookies:", data);
    res.cookie("session", JSON.stringify(data.session), { httpOnly: true });
    res.cookie("token", JSON.stringify(data.token), { httpOnly: true });
    res.cookie("uid", JSON.stringify(data.user_id), { httpOnly: true });
   }
   res.status(lR.status).json(lR);
});



app.post('/client/secure/data' , async (req, res) => {    
   res.status(200).json({
    status: 200,
    message: "Secure data access granted",
    success: true,
    data: req.middleware.data
   })
})



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`NASS is running on http://localhost:${PORT}`);
});

export const db = mongoose.connection;
export const appRouter = router;