import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/user.js";
import { validate } from "email-validator";

export const validDetails = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    const trimmedEmail = email.trim();
    //It ensures that email is in correct format.
    const emailValidation = validate(trimmedEmail);
    if (!emailValidation) {
      return res.status(400).json({ error: "Email is not valid." });
    }

    //It checks if same email exist in database.
    const emailExist = await userModel.findOne({ email: trimmedEmail });
    if (emailExist) {
      return res.status(400).json({ error: "Email already exists." });
    }

    //It ensures the length of password is greater or equal to 8.
    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters long." });
    }

    //It ensures that password can must contain at least one uppercase, one lowercase and one number.
    //It ensures that only @ or underscores are allowed.
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=[A-Za-z\d@_]*$)[A-Za-z\d@_]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error: "Invalid Password.",
      });
    }

    // It ensures that passoword and confirm passoword field matches.
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ error: "Password and Confirm password doesn't match." });
    }

    return res.status(202).json({ message: "Valid details." });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const registerUser = async (req, res) => {
  try {
    // This pulls the user's input data directly from the request body,
    // allowing us to access email and password as variables
    const { name, email, username, password, role, verifyPassword } = req.body;

    //It ensures that fields are not empty.
    if (!name || !email || !username || !password || !verifyPassword) {
      return res.status(400).json({ error: "Please fill all the fields" });
    }

    //Trim Inputs
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedUsername = username.trim();

    //It ensures that name can contain only Letters and Spaces
    const nameRegex = /^[a-zA-Z\s]*$/;
    if (!nameRegex.test(trimmedName)) {
      return res.status(400).json({
        error: "Name cannot contain any numbers/symbols.",
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
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    // Destructure email and password from req.body
    // This pulls the user's input data directly from the request body,
    // allowing us to access email and password as variables
    const { email, password } = req.body;

    //It ensures that fields are not empty.

    if (!email || !password) {
      return res.status(401).json({ error: "Please fill all the fields" });
    }

    //Trim Inputs
    const trimmedEmail = email.trim();

    //It ensures that email is in correct format.
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

    //It ensures the length of password is greater or equal to 8.
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
    // It ensures that passoword and confirm passoword field matches.

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
  res.clearCookie("token");
  res.json({ message: "Logout Sucessful" });
};
