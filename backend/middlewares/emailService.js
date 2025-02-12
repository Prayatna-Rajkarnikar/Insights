import nodemailer from "nodemailer";
import userModel from "../models/user.js";
import dotenv from "dotenv";

dotenv.config();

// Set up the transporter
const transporter = nodemailer.createTransport({
  service: "Gmail", // You can use other email services like SMTP
  auth: {
    user: process.env.EMAIL_USER, // Your email (e.g., your-email@gmail.com)
    pass: process.env.EMAIL_PASS, // Your email password or App password
  },
});

export const sendEmail = async () => {
  try {
    // Fetch the user from the database
    // const user = await userModel.findById(userId);

    // if (!mongoose.Types.ObjectId.isValid(userId)) {
    //   console.error("Invalid userId");
    //   return;
    // }
    // if (!user) {
    //   console.error("User not found");
    //   return;
    // }

    // Check if the user's warnings exceed the threshold (3)
    // if (user.warnings % 3 === 0 && user.warnings > 0) {
    const subject = "Warning: Your account has received multiple flags";
    const text =
      "Hello \n\nYour account has received multiple flags on comments, and your warning count has exceeded the limit. Please review your actions.";

    const mailOptions = {
      from: process.env.EMAIL_USER, // sender address
      to: "prayatna.rajkarnikar@gmail.com", // recipient address
      subject, // email subject
      text, // email content
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Warning email sent to user");
    // }
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
