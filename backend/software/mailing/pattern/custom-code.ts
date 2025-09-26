import { User } from "../../../types/.types/collections.type";
import fs from 'fs';
import path from 'path';


const customCodePattern = async (
    user: User,
    serviceName: string,
    code: string,
) => {

    const filePath = path.join(__dirname, '../../../resources/mailing/pattern/custom-code.html');
    const val = fs.readFileSync(filePath, 'utf-8');


    return val.replace('[USER_NAME]', user.first_name + ' ' + user.last_name)
              .replace('[SERVICE_NAME]', serviceName)
              .replace('[CODE]', code);
}

export default customCodePattern;