import { db } from "../../../..";
import { software } from "../../../../software/dir";
import { User } from "../../../../types/.types/collections.type";
import { ReplyType } from "../../../../types/.types/reply.type";
import secure from "../../dir";
import { checkPasswordStrength } from "./password-check";


export async function registerUser(
    username : string,
    password : string,
    passwordConfirm : string,
    email : string,
    firstName : string,
    lastName : string,
    birthdate : string,
    acceptEmails: boolean
)  : Promise<ReplyType> {

    if (!username || !password || !passwordConfirm || !email || !firstName || !lastName || !birthdate) {
        return software.methods.serverReply(400, "Missing required fields.");
    }

    const birthdateObj = new Date(birthdate);
    if (isNaN(birthdateObj.getTime())) {
        return software.methods.serverReply(400, "Invalid birthdate provided.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return software.methods.serverReply(400, "Invalid email format.");
    }

    if (password !== passwordConfirm) {
        return software.methods.serverReply(400, "Passwords do not match.");
    }

    if (!checkPasswordStrength(password)) {
        return software.methods.serverReply(400, "Password does not meet strength requirements.");
    }

    const users = db.collection("users");
    const existingUser = await users.findOne({ 
        $or: [
            { username: { $regex: `^${username}$`, $options: "i" } }, 
            { email: { $regex: `^${email}$`, $options: "i" } }, 
            { firstName: { $regex: `^${firstName}$`, $options: "i" }, lastName: { $regex: `^${lastName}$`, $options: "i" } }
        ] 
    });


    if (existingUser) {
        return software.methods.serverReply(409, "User with provided username, email, or name already exists.");  
    }

    // If the 

    const cryptedPassword = secure.crypt(password);
    const newUser : User = {
        id: await secure.system.generateID("users"),
        username,
        password: cryptedPassword,
        email,
        first_name: firstName,
        created_at: new Date().getTime(),
        last_name: lastName,
        last_update: new Date().getTime(),
        identifier: email,
        last_login: null,
        birthdate: new Date(birthdate),
        services: {},
        privacy: {
            acceptEmails: acceptEmails
        }
    };

    const change = await users.insertOne(newUser);

    if (!change.acknowledged) {
        return software.methods.serverReply(500, "Failed to register user due to a server error.");
    }

    return software.methods.serverReply(201, "User registered successfully.", { userId: newUser.id });
}