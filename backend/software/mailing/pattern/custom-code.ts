import { User } from "../../../types/.types/collections.type";
require('dotenv').config();



const customCodePattern = async (
    code: string,
    user: User,
    serviceName: string
) => {

    console.log(`Fetching custom code pattern for user: ${user.first_name} ${user.last_name} at ${process.env.SELF_API_URL}/public/resources/mailing/pattern/custom-code.html`);
    const val = await fetch(`${process.env.SELF_API_URL}/public/resources/mailing/pattern/custom-code.html`).then((res) => res.text());


    return val.replace('[USER_NAME]', user.first_name + ' ' + user.last_name)
               .replace('[SERVICE_NAME]', serviceName)
               .replace('[CODE]', code);
}

export default customCodePattern;