import sendEmail from "./methods/send-email";
import transporter from "./nodemailer.config";
import customLinkPattern from "./pattern/custom-link";



const mailing = {
    config : {
        transporter : transporter
    },

    patterns : {
        customLink : customLinkPattern
    },
    
    send : sendEmail
}

export default mailing;
