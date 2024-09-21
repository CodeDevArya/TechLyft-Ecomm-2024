import nodemailer from "nodemailer";
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE, } from "./emailTemplate.js";
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
        user: "techlyft.official@gmail.com",
        pass: process.env.NODEMAILER_AUTH_PASS,
    },
});
export const sendMail = async (receiverEmail, verificationToken) => {
    try {
        const emailTemplate = VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken);
        let info = await transporter.sendMail({
            from: '"TechLyft" <techlyft.official@gmail.com>',
            to: receiverEmail,
            subject: "Verify your email address",
            html: emailTemplate,
        });
        console.log("Email sent: " + info.response);
    }
    catch (error) {
        console.error("Error sending email: ", error);
        throw new Error(`Error sending verification email: ${error}`);
    }
};
export const sendWelcomeEmail = async (receiverEmail, userName) => {
    try {
        const emailTemplate = WELCOME_EMAIL_TEMPLATE.replace("{userName}", userName);
        let info = await transporter.sendMail({
            from: '"TechLyft" <techlyft.official@gmail.com>',
            to: receiverEmail,
            subject: "Welcome to TechLyft",
            html: emailTemplate,
        });
        console.log("Email sent: " + info.response);
    }
    catch (error) {
        console.error("Error sending email: ", error);
        throw new Error(`Error sending welcome email: ${error}`);
    }
};
export const sendPasswordResetEmail = async (receiverEmail, ResetUrl) => {
    try {
        const emailTemplate = PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", ResetUrl);
        let info = await transporter.sendMail({
            from: '"TechLyft" <techlyft.official@gmail.com>',
            to: receiverEmail,
            subject: "Reset Password",
            html: emailTemplate,
        });
        console.log("Email sent: " + info.response);
    }
    catch (error) {
        console.error("Error sending email: ", error);
        throw new Error(`Error sending password reset email: ${error}`);
    }
};
export const sendResetSuccessEmail = async (receiverEmail) => {
    try {
        const emailTemplate = PASSWORD_RESET_SUCCESS_TEMPLATE;
        let info = await transporter.sendMail({
            from: '"TechLyft" <techlyft.official@gmail.com>',
            to: receiverEmail,
            subject: "Reset Password",
            html: emailTemplate,
        });
        console.log("Email sent: " + info.response);
    }
    catch (error) {
        console.error("Error sending email: ", error);
        throw new Error(`Error sending password reset success email: ${error}`);
    }
};
export const EnquiryMail = async (senderEmail, EmailBody, senderName) => {
    try {
        let info = await transporter.sendMail({
            from: `"TechLyft USER ENQUIRY" <$techlyft.official@gmail.com>`,
            to: "techlyft.official@gmail.com",
            subject: "User Enquiry",
            html: `User enquiry from '${senderName}' using email address '${senderEmail}' : ${EmailBody}`,
        });
        console.log("Email sent: " + info.response);
    }
    catch (error) {
        console.error("Error sending email: ", error);
        throw new Error(`Error sending enquiry email: ${error}`);
    }
};
