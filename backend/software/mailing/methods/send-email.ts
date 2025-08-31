import mailing from "../dir";


async function sendEmail(to, subject, content) {
  try {
    const info = await mailing.config.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: to,
      subject: subject,
      html: content
    });
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

export default sendEmail;