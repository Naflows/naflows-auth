import { ReplyType } from "../../../types/.types/reply.type";
import { software } from "../../dir";
import mailing from "../dir";


async function sendEmail(by = process.env.SMTP_USER, to, subject, content): Promise<ReplyType> {

  if (process.env.DEV_SKIP_MAILING === 'true') {
    console.log("DEV_SKIP_MAILING is enabled, skipping email sending.");
    console.log(`Email details - From: ${by}, To: ${to}, Subject: ${subject}, Content: ${content}`);
    return software.methods.serverReply(200, "Email sending skipped in development mode.");
  }

  try {
    const info = await mailing.config.transporter.sendMail({
      from: {
        name: by,
        address: process.env.SMTP_USER
      },
      to: to,
      subject: subject,
      html: content
    });

    if (!info) {
      return software.methods.serverReply(500, "Failed to send email for unknown reasons.");
    } else {
      return software.methods.serverReply(200, "Email sent successfully.");
    }

  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

export default sendEmail;