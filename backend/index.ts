require('dotenv').config();

import { serve } from "./public/method/serve";
import secure from "./secure/dir";
import mongoose from 'mongoose';
import middleware from "./middleware/dir";
import { Request, Response } from 'express';
import { ReplyType } from "./types/.types/reply.type";
import { connectToDatabase } from "./init/mongo-connect";
import { useApp } from "./init/app-use";

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();


connectToDatabase();
useApp(app);

app.post('/contract-debug/generate', async (req, res) => {
    try {
        const { aim_id, aim_type, type, forced, details } = req.body;
        const result  : ReplyType = await secure.contract.create(
            aim_id,
            aim_type,
            type,
            forced,
            details
        );
        res.status(result.status).json((result.data as {received:Object}).received);
    } catch (error) {
        console.error("Error generating contract:", error);
        res.status(500).json({
            success: false,
            status: 500,
            message: "Internal Server Error"
        });
    }
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
    console.log('Received request to add service:', body);
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
            console.log(`Service added: ${body.name} - ${body.description}`);
            // Add connection and service token
            return res.status(200).send(`Service ${body.name} added successfully`);
        }

    }
})


app.get('/team/add/service', (req, res) => {
    serve("Add service", "form-style.css", "add-service.html", res);
})





const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`NASS is running on http://localhost:${PORT}`);
});

export const db = mongoose.connection;
export const appRouter = router;