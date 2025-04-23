import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validate } from "email-validator";

import userModel from "../models/userModel.js";

export const validDetails = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
      return res.status(401).json({ error: "Please fill all the fields" });
    }

    // Remove any extra spaces
    const trimmedEmail = email.trim();

    if (!validate(trimmedEmail)) {
      return res.status(400).json({ error: "Email is not valid." });
    }

    const emailStartChar = trimmedEmail[0];
    if (!/^[a-zA-Z0-9]/.test(emailStartChar)) {
      return res
        .status(400)
        .json({ error: "Email cannot start with special characters." });
    }

    // Check if email already exists in the database
    const emailExist = await userModel.findOne({ email: trimmedEmail });
    if (emailExist) {
      return res.status(400).json({ error: "Email already exists." });
    }

    // Ensure password meets length
    if (password.length < 8) {
      return res.status(400).json({
        error: "Password must be at least 8 characters long.",
      });
    }

    // to validate if the password has at least one lowercase, one uppercase letter, and one number
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=[A-Za-z\d@_]*$)[A-Za-z\d@_]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error: "Invalid Password",
      });
    }

    // Ensure password and confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        error: "Password and Confirm password don't match.",
      });
    }

    return res.status(202).json({ message: "Valid details." });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, username, password, role } = req.body;

    if (!name || !username) {
      return res.status(401).json({ error: "Please fill all the fields" });
    }

    //Trim Inputs
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedUsername = username.trim();

    //It ensures that it can contain only Letters and Spaces
    const nameRegex = /^[a-zA-Z\s]*$/;
    if (!nameRegex.test(trimmedName)) {
      return res.status(400).json({
        error: "Name cannot contain any numbers/symbols.",
      });
    }

    if (username.length < 4 || username.length > 20) {
      return res.status(400).json({
        error: "Username must be 4-20 characters long.",
      });
    }

    //It ensures that username can contain only uppercase, lowercase and underscores.
    const usernameRegex = /^[a-zA-Z0-9_]*$/;
    if (!usernameRegex.test(trimmedUsername)) {
      return res.status(400).json({
        error: "Username must only have letters, numbers, and (_).",
      });
    }

    //It checks if same username exist in database.
    const userNameExist = await userModel.findOne({
      username: trimmedUsername,
    });
    if (userNameExist) {
      return res.status(400).json({ error: "Username already exists." });
    }

    // It ensures that passoword and confirm passoword field matches.
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      name: trimmedName,
      email: trimmedEmail,
      username: trimmedUsername,
      password: hashedPassword,
      role: role || "Reader",
    });
    await newUser.save();
    res.status(200).json({ message: "Registered Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    // Destructure email and password from req.body
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({ error: "Please fill all the fields" });
    }

    //Trim Inputs
    const trimmedEmail = email.trim();

    const emailValidation = validate(trimmedEmail);
    if (!emailValidation) {
      return res.status(400).json({ error: "Email is not valid" });
    }

    // It ensures that email is present in database.
    const user = await userModel.findOne({ email: trimmedEmail });
    if (!user) {
      return res.status(404).json({ error: "Email does not exist" });
    }

    //It ensures password input by user matches the password in database.
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid Password" });
    }

    if (!user.isActive) {
      return res.status(403).json({
        error: "Your account has been deactivated. Please contact support.",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        email: user.email,
        id: user._id,
        name: user.name,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      path: "/",
    });

    res.status(200).json({ message: "Login Successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const forgetPassword = async (req, res) => {
  try {
    const { email, newPassword, verifyNewPassword } = req.body;
    if (!email || !newPassword || !verifyNewPassword) {
      return res.status(401).json({ error: "Please fill all the fields" });
    }

    const trimmedEmail = email.trim();

    // It ensures that email is valid
    const emailValidation = validate(trimmedEmail);
    if (!emailValidation) {
      return res.status(400).json({ error: "Email is not valid" });
    }

    //It ensures that email is present in database.
    const emailExist = await userModel.findOne({ email: trimmedEmail });
    if (!emailExist) {
      return res.status(404).json({ error: "Email doesn't exist." });
    }

    //It ensures the length of password is greater than 8.
    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters long" });
    }

    //It ensures that password can must contain at least one uppercase, one lowercase and one number.
    //It ensures that only @ or underscores are allowed.
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=[a-zA-Z\d@_]*$)[a-zA-Z\d@_]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        error: "Invalid Password",
      });
    }

    if (newPassword !== verifyNewPassword) {
      return res
        .status(400)
        .json({ error: "Password and Confirm password doesn't match." });
    }

    //Hash the password for security.
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await userModel.updateOne(
      { email: trimmedEmail },
      { password: hashedPassword }
    );
    res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  //clear the cookie named token
  res.clearCookie("token");
  res.status(200).json({ message: "Logout Successful" });
};
