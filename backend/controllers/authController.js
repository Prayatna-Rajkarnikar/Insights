import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/user.js";
import { validate } from "email-validator";

export const registerUser = async (req, res) => {
  try {
    const { name, email, username, password, role, verifyPassword } = req.body;

    //It ensures that fields are not empty.
    if (!name || !email || !username) {
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
        error: "Name cannot contain any numbers or special characters.",
      });
    }

    //It ensures that email is in correct format.
    const emailValidation = validate(trimmedEmail);
    if (!emailValidation) {
      return res.status(400).json({ error: "Email is not valid" });
    }

    //It checks if same email exist in database.
    const emailExist = await userModel.findOne({ email: trimmedEmail });
    if (emailExist) {
      return res.status(400).json({ error: "Email already exists" });
    }

    //It ensures that username can contain only uppercase, lowercase and underscores.
    const usernameRegex = /^[a-zA-Z0-9_]*$/;
    if (!usernameRegex.test(trimmedUsername)) {
      return res.status(400).json({
        error:
          "Username can only contain uppercase, lowercase and underscores(_)",
      });
    }

    //It checks if same username exist in database.
    const userNameExist = await userModel.findOne({
      username: trimmedUsername,
    });
    if (userNameExist) {
      return res.status(400).json({ error: "Username already exists" });
    }

    //It ensures the length of password is greater or equal to 8.
    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters long" });
    }

    //It ensures that password can must contain at least one uppercase, one lowercase and one number.
    //It ensures that only @ or underscores are allowed.
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=[A-Za-z\d@_]*$)[A-Za-z\d@_]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must contain at least one uppercase, one lowercase and one number. Password can only contain @ or underscores(_).",
      });
    }

    if (password !== verifyPassword) {
      return res
        .status(400)
        .json({ error: "Password and Confirm password doesn't match." });
    }

    //Hash the password for security.
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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({ error: "Please fill all the fields" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Email does not exist" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid Password" });
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
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUser = async (req, res) => {
  const { token } = req.cookies;

  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET, async (error, userInfo) => {
        if (error) {
          console.error("Token Verification Error:", error);
          return res.status(401).json({ error: "Invalid token" });
        }

        // Fetch user from the database
        const user = await userModel.findById(userInfo.id);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        // Send user data
        res.json({
          name: user.name,
          email: user.email,
          username: user.username,
          image: `${user.image}`,
          role: user.role,
          bio: user.bio,
        });
      });
    } catch (error) {
      return res.status(500).json({ error: "Failed to provide user info" });
    }
  } else {
    res.status(401).json({ error: "No token provided" });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout Sucessful" });
};

export const getUserNumbers = async (req, res) => {
  try {
    const countUser = await userModel.countDocuments();

    res.status(200).json({ totalUsers: countUser });
  } catch (error) {
    res.status(500).json({ message: "Failed to get number of users" });
  }
};

export const getUserList = async (req, res) => {
  try {
    const userList = await userModel.find();
    res.status(200).json({ list: userList });
  } catch (error) {
    res.status(500).json({ message: "Failed to get user list." });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOneAndDelete({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete user", error: error.message });
  }
};

export const editProfile = async (req, res) => {
  try {
    const { name, username, bio } = req.body;
    const userId = req.user.id;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    //If the username is the same as the current one, then check or update.
    if (username && username !== user.username) {
      const usernameExist = await userModel.findOne({ username });

      // to ensure updated username is unique
      if (usernameExist && usernameExist._id.toString() !== userId) {
        return res.status(400).json({
          message: "Username is already taken, please use another username.",
        });
      }
    }

    user.name = name || user.name;
    user.username = username || user.username;
    user.bio = bio || user.bio;

    if (req.file) {
      user.image = `/images/${req.file.filename}`;
    }

    const updatedProfile = await user.save();

    res
      .status(201)
      .json({ message: "Profile Updated successfully", user: updatedProfile });
  } catch (error) {
    console.error("Error updating profile:", error); // Log the error
    res.status(500).json({
      message: "Error updating profile",
      error: error.message || error,
    });
  }
};
