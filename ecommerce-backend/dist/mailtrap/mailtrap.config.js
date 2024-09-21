import nodemailer from "nodemailer";
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate.js";
const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
        user: "aryah144@gmail.com",
        pass: "rsxf orlm mtax fkhy",
    },
});
const sendMail = async (receiverEmail, verificationToken) => {
    try {
        const emailTemplate = VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken);
        let info = await transporter.sendMail({
            from: '"Tech Heaven" <aryah144@gmail.com>',
            to: receiverEmail,
            subject: "Verify your email address",
            html: emailTemplate,
        });
        console.log("Email sent: " + info.response);
    }
    catch (error) {
        console.error("Error sending email: ", error);
    }
};
export default sendMail;
