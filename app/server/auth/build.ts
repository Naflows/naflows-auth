/*

    Building the AUTH means setting up a custom token 
    for the user.

    In order to generate a custom token for the user,
    we need to gather the user information, the IP,
    the user agent, and the password, plus a passphrase if 
    the user sent one.

    Importante note: the password must be given. 

*/

import pool from "../../db";
import auth from "../auth-dir";
import TReply from "../utils/reply.type";
import TToken from "../utils/token.type";
import TUser from "../utils/user.type";
import getUser from "./user/get-user";
import crypto from 'crypto';

const build = async (
    username: string,
    ipAdress: string,
    userAgent: string,
    passphrase: string | null,
    password: string | null
): Promise<TReply> => {
    if (!username || !ipAdress || !userAgent || !password) {
        return {
            success: false,
            message: 'Missing required parameters.'
        };
    }

    const userQuery: TReply = await auth.getters.user(username, password);
    if (!userQuery.success) {
        return { success: false, message: userQuery.message };
    }


    const user: TUser = userQuery.infos as TUser;
    const t: TReply = await auth.getters.token(
        user.username,
        user.password,
        userAgent,
        ipAdress,
        passphrase
    );
    console.log("Token query result:", t);
    if (t && t.success && t.infos) {
        const token: TToken = t.infos.token;
        if (token) {
            return {
                success: true,
                message: 'User authenticated successfully.',
                infos: {
                    token: token.session_token
                }
            }
        }
    }

    // Generating a custom token for the user
    // The token is a random string of 64 characters
    const token = crypto.randomBytes(32).toString('hex');



    // Get now's UTC date
    const expiringDate = new Date(Date.now());


    // Token expiration is 15mn for admin users, 1h for regular users
    if (user.rights == 'admin') {
        expiringDate.setMinutes(expiringDate.getMinutes() + 15);
    } else if (user.rights == 'user') {
        expiringDate.setHours(expiringDate.getHours() + 1);
    }


    try {
        await pool.execute(
            `INSERT INTO sessions 
                (user_id, session_token, created_at, ip, user_agent, expires_at, signature) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `,
            [
                user.id,
                token,
                new Date(), // created_at
                auth.hash(ipAdress), // ip
                auth.hash(userAgent), // user_agent
                expiringDate, // expires_at
                passphrase ? auth.hash(passphrase) : "" // signature, use null if no passphrase
            ]
        );
    } catch (error) {
        console.error('Database query error:', error);
        return {
            success: false,
            message: 'Database error.',
            infos : {
                error : error instanceof Error ? error.message : 'Unknown error'
            }
        };
    }



    return {
        success: true,
        message: 'User authenticated successfully.',
        infos: {
            token: token
        }
    };
}

export { build };