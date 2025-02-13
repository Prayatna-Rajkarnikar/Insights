import nodemailer from "nodemailer";
import userModel from "../models/user.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (authorId) => {
  try {
    const user = await userModel.findById(authorId);

    if (!mongoose.Types.ObjectId.isValid(authorId)) {
      console.error("Invalid userId");
      return;
    }
    if (!user) {
      console.error("User not found");
      return;
    }

    const subject = "Important Notice: Multiple Flags on Your Account";

    const text = `Dear ${user.name},  
      
      We hope this email finds you well.  
      
      We would like to inform you that your account has received multiple flags due to reported comments. As a result, your warning count has exceeded the allowed limit.  
      
      We kindly request you to review your recent activity and ensure compliance with our platform's guidelines. Continued violations may result in further actions, including temporary suspension or account restrictions.  
      
      If you believe this was a mistake or require any clarification, please do not hesitate to contact our support team.  
      
      Best regards,  
      Insights`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log("Warning email sent to user");
    // }
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
