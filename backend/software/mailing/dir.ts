import { subscribeToMailingList } from "./list/subscribe";
import sendEmail from "./methods/send-email";
import transporter from "./nodemailer.config";
import customCodePattern from "./pattern/custom-code";
import customLinkPattern from "./pattern/custom-link";



const mailing = {
    config : {
        transporter : transporter
    },

    list : {
        subscribe : subscribeToMailingList
    },

    patterns : {
        customLink : customLinkPattern,
        customCode : customCodePattern
    },
    
    send : sendEmail
}

export default mailing;
