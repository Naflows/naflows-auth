import { subscribeToMailingList } from "./list/subscribe";
import sendEmail from "./methods/send-email";
import transporter from "./nodemailer.config";
import customCodePattern from "./pattern/custom-code";
import customLinkPattern from "./pattern/custom-link";
import customNotificationPattern from "./pattern/custom-notification";



const mailing = {
    config : {
        transporter : transporter
    },

    list : {
        subscribe : subscribeToMailingList
    },

    patterns : {
        customLink : customLinkPattern,
        customCode : customCodePattern,
        customNotification : customNotificationPattern
    },
    
    send : sendEmail
}

export default mailing;
