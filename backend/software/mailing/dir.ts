import { subscribeToMailingList } from "./list/subscribe";
import sendEmail from "./methods/send-email";
import transporter from "./nodemailer.config";
import customCodePattern from "./pattern/custom-code";
import customLinkPattern from "./pattern/custom-link";
import customNotificationPattern from "./pattern/custom-notification";
import welcomeToServicePattern from "./pattern/welcome-to-service";



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
        customNotification : customNotificationPattern,
        welcomeToService : welcomeToServicePattern
    },
    
    send : sendEmail
}

export default mailing;
