import express from 'express';
import { Request, Response } from 'express';
import run from './server/start';
import auth from './server/auth-dir';
import TReply from './server/utils/reply.type';


const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the Admin Auth API');
});

app.post('/auth/build', async (req: Request, res: Response) => {
    const { username, ipAdress, userAgent, passphrase, password } = req.body;
    try {
        const reply: TReply = await auth.build(username, ipAdress, userAgent, passphrase, password);
        if (reply.success) {
            res.status(200).json(reply);
        } else {
            console.error('Error in /auth/build:', reply.message, reply.infos?.error);
            res.status(400).json(reply);
        }
    } catch (error) {
        console.error('Unexpected error in /auth/build:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});


run(app);

export default app;
