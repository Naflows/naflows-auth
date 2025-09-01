import axios from 'axios';
import cors from 'cors';
require('dotenv').config();

const express = require('express');
const router = express.Router();
const app = express();

app.use(express.json());
app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello from Dummy API');
});


app.post('/send-login-request', async (req, res) => {
    const { user_id, password, identifier } = req.body;

    try {
        const f = await axios.post(`${process.env.AUTH_API_URL_DEV}/client/login`, {
            user: {
                user_id,
                password,
                identifier,
                user_ip: req.ip,
                agent : req.headers['user-agent']
            },
            service : {
                ip : "dummy-api", // TODO : Get real IP
                service : "naflows_backend",
                service_token : "naflows_backend_token",
                service_token_birth : new Date("2025-09-01").getTime()
            }
        });

        res.status(f.status).json(f.data);
    } catch (error: any) {
        res.status(error?.response?.status || 500).json({
            error: error?.response?.data || 'Internal Server Error'
        });
    }
});

const PORT = 3005;
app.listen(PORT, () => {
    console.log(`Dummy API is running on http://localhost:${PORT}\nCommunication with NASS : ${process.env.AUTH_API_URL_DEV}`);
});

