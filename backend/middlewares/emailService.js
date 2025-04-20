import nodemailer from "nodemailer";
import userModel from "../models/userModel.js";
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

export const sendCommentRemovalEmail = async (authorId) => {
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

    const subject =
      "Action Required: Comment Removal Due to Use of Slang Words";

    const text = `Dear ${user.name},  
      
      We hope you're doing well.  

      We would like to inform you that one of your recent comments contains slang words that do not align with our platform's community guidelines.  

      To maintain a respectful and professional environment for all users, we kindly request you to remove or edit the comment at your earliest convenience.  

      Please note that repeated use of inappropriate language may lead to further actions, including temporary restrictions on your account.  
      
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
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const sendUserDeactivateEmail = async (authorId) => {
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
    const subject =
      "Urgent: User Deactivation Request Due to Exceeded Warnings";

    const text = `Dear Admin,  

The following user has exceeded the allowed warning limit and requires deactivation review:  

- **Name:** ${user.name}  
- **Email:** ${user.email}  
- **Username:** ${user.username}  
- **Warning Count:** ${user.warnings}  
      
  Best regards,  
  Insights`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "rajkarnikarprayatna9@gmail.com",
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log(" email sent to admin");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
