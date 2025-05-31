import pool from "../../../db"
import auth from "../../auth-dir"
import TReply from "../../utils/reply.type";
import TToken from "../../utils/token.type";
import crypto from 'crypto';

const getToken = async (
    username : string,
    password : string,
    userAgent : string,
    ipAdress : string,
    passphrase : string | null
) : Promise<TReply> => {
    
    const c : TReply = await auth.getters.user(username, password);
    const user = c.infos;
    if (user) {
        const [tokens] : any[] = await pool.query(`
            SELECT * FROM sessions WHERE 
            user_id = ? AND 
            user_agent = ? AND
            ip = ? AND 
            signature = ?   
        `, [user.id, auth.hash(userAgent), auth.hash(ipAdress), passphrase ? auth.hash(passphrase) : ""]);
        if (tokens.length > 0) {
            const token : TToken = tokens[0] as TToken;
            const expirationDate : Date = token.expires_at;
            const currentDate : Date = new Date();
            if (expirationDate.getTime() < currentDate.getTime()) {
                return {
                    success : false,
                    message : "Token found under the given parameters, but is expired."
                }
            } else {
                return {
                    success : true,
                    message : "Token exists under the given parameters.",
                    infos: {
                        token : token
                    }
                }
            }
        } else {
            return {
                success : false,
                message : "No token found under the given parameters."
            }
        }
    } else {
        return {
            success : false,
            message : "Error: user does not exist"
        }
    }
}

export default getToken;