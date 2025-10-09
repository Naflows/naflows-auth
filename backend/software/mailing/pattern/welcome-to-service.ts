import { Service, User } from "../../../types/.types/collections.type";
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';


const welcomeToServicePattern = async (
    link : string,
    user: User,
    service: Service
) => {

    const filePath = path.join(__dirname, '../../../resources/mailing/pattern/welcome-to-service.html');
    const val = fs.readFileSync(filePath, 'utf-8');


    return val.replace('[USER_NAME]', user.first_name + ' ' + user.last_name)
              .replace(/\[SERVICE_NAME\]/g, service.name)
              .replace(/\[SERVICE_LOGO\]/g, service.picture).replace(/\[USER_PROFILE_PICTURE\]/g, user.profile_picture ? user.profile_picture : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y').replace(/\[SERVICE_BANNER\]/g, service.banner).replace('[SERVICE_LINK]', link);
}

export default welcomeToServicePattern;