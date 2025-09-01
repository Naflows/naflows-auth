import { User } from "../../../types/.types/collections.type";
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';


const customLinkPattern = async (
    link : string,
    user: User,
    serviceName: string
) => {

    const filePath = path.join(__dirname, '../../../resources/mailing/pattern/custom-link.html');
    const val = fs.readFileSync(filePath, 'utf-8');


    return val.replace('[USER_NAME]', user.first_name + ' ' + user.last_name)
              .replace('[SERVICE_NAME]', serviceName)
              .replace(/\[LINK\]/g, link);
}

export default customLinkPattern;