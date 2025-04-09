import userModel from "../models/user.js";
import jwt from "jsonwebtoken";

export const getUserInfo = async (req, res) => {
  const { token } = req.cookies;
  const { userId } = req.params;

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    // Verify token synchronously
    const userInfo = jwt.verify(token, process.env.JWT_SECRET);

    const idToFetch = userId || userInfo.id;

    // Fetch user from the database
    const user = await userModel.findById(idToFetch).populate("blogs");
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
  } catch (error) {
    console.error("Token Verification/Error Fetching User:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
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
          message: "Username is already taken.",
        });
      }
    }

    user.name = name || user.name;
    user.username = username || user.username;
    if (bio !== undefined) user.bio = bio;

    if (req.file) {
      user.image = `/images/${req.file.filename}`;
    }

    const updatedProfile = await user.save();

    res
      .status(201)
      .json({ message: "Profile Updated successfully", user: updatedProfile });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      message: "Error updating profile",
      error: error.message || error,
    });
  }
};
