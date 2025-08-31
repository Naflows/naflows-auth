import sendEmail from "./methods/send-email";
import transporter from "./nodemailer.config";
import customCodePattern from "./pattern/custom-code";



const mailing = {
    config : {
        transporter : transporter
    },

    patterns : {
        customCode : customCodePattern
    },
    
    send : sendEmail
}

export default mailing;
