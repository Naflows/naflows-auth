import pool from "../../../db";
import TReply from "../../utils/reply.type";
import TUser from "../../utils/user.type";


const getUser = async (username: string, password : string) : Promise<TReply>  => {
    try {
        const [rows]  : any[] = await pool.query('SELECT * FROM users WHERE username = ? AND PASSWORD = ?',
             [username, password]);
        if (rows.length === 0) {
            return { success: false, message: 'User not found or invalid credentials.' };
        }

        return { 
            success: true, 
            message: 'User retrieved successfully.', 
            infos: rows[0]
         };
    } catch (error) {
        console.error('Database query error:', error);
        return { success: false, message: 'Database error.' };
    }
}

export default getUser;



