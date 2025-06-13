require('dotenv').config();

import { Blacklist } from "./mongo-init/collections.type";
import { serve } from "./public/method/serve";
import secure from "./secure/dir";
import mongoose from 'mongoose';
import { blacklistIP } from "./secure/ip/blacklist";
import middleware from "./middleware/dir";

const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');


// Connect to the mongo database
const mongoURI = process.env.MONGO_URL || `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@mongo:27017/nass?authSource=admin`;
console.log("Connecting to MongoDB at:", mongoURI);
// Authenticate and connect to MongoDB
if (!process.env.MONGO_INITDB_ROOT_USERNAME || !process.env.MONGO_INITDB_ROOT_PASSWORD) {
    console.error('MongoDB credentials are not set in environment variables');
    process.exit(1);
}
mongoose.connect(mongoURI);

mongoose.connection.on('error', (err: Error) => {
    console.error(`MongoDB connection error: ${err}`);
});

// Confirm successful connection
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
});



app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.use(async (req, res, next) => {
    // Middleware to log requests
    console.log(`${req.method} request for '${req.url}'`);
    // Log all req informations 
    console.log('Request Headers:', req.headers);
    console.log('Request Body:', req.body);

    /*

        * Must externalize this middleware
        * First UCR
        * Then blacklist
        * Then requests rates
        * Then service/client
        * Then user
        * Then token
        * Then ok

    */

    if (process.env.NASS_SCV_ENABLED === "false") {
        console.log("NASS Service Client Validation is disabled, skipping middleware.");
        return next();
    } else {
        console.log(`NASS UCR Verification is ${process.env.NASS_UCR_ENABLED === "true" ? "enabled" : "disabled"}`);
        if (middleware.check.isUCR(req.body) == false && process.env.NASS_UCR_ENABLED === "true") {
            return res.status(400).send("Invalid request format.");
        } else {
            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const blacklistCollection = mongoose.connection.collection("blacklist");
            const requestsCollection = mongoose.connection.collection("requests");


            /*
                Collections must be loaded for the middleware. 
                Unauthorized access must be filtered or request is canceled.
            */

            if (blacklistCollection && requestsCollection) {
                const blacklistedIP: any | null = await blacklistCollection.findOne({
                    ip: ip
                });
                if (blacklistedIP && process.env.NASS_BLACKLIST_ENABLED === "true") {
                    serve("IP Blacklisted", "blacklist.css", "blacklist.html", res, {
                        "blacklist_date": blacklistedIP.date.toISOString(),
                        "blacklist_reason": blacklistedIP.reason
                    });
                    return;
                } else {
                    next();
                }
            } else {
                res.status(500).send("Internal server error.")
            }

        }
    }



});

app.post('/test', (req, res) => {
    res.status(200).send("Successful connection");
});
app.get('/blacklist', (req, res) => {
    // Serve the blacklist page 
    serve("IP Blacklisted", "blacklist.css", "blacklist.html", res, {
        "blacklist_date": new Date().toISOString(),
        "blacklist_reason": "No reason provided",
    });
});

app.get('/', (req, res) => {
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
