import nodemailer from "nodemailer";
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate.js";
const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
        user: "techlyft.official@gmail.com",
        pass: "tuny uvil mbeo zacd",
    },
});
const sendMail = async (receiverEmail, verificationToken) => {
    try {
        const emailTemplate = VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken);
        let info = await transporter.sendMail({
            from: '"TechLyft" <aryah144@gmail.com>',
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
