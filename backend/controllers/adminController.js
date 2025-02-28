import userModel from "../models/user.js";
import blogModel from "../models/blog.js";

export const toggleUserStatus = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      message: `User ${
        user.isActive ? "activated" : "deactivated"
      } successfully`,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update user status",
      error: error.message,
    });
  }
};

export const getTotalUsers = async (req, res) => {
  try {
    const countUser = await userModel.countDocuments();

    res.status(200).json({ totalUsers: countUser });
  } catch (error) {
    res.status(500).json({ message: "Failed to get number of users" });
  }
};

export const getUserList = async (req, res) => {
  try {
    const userList = await userModel.find({ role: "Reader" });
    res.status(200).json({ list: userList });
  } catch (error) {
    res.status(500).json({ message: "Failed to get user list." });
  }
};

export const getTotalBlogs = async (req, res) => {
  try {
    const totalBlogs = await blogModel.countDocuments();
    res.status(200).json({ totalBlogs });
  } catch (error) {
    res.status(500).json({ message: "Failed to get total blogs" });
  }
};

export const getBlogList = async (req, res) => {
  try {
    const blogList = await blogModel.find().populate("author", "name");
    res.status(200).json({ list: blogList });
  } catch (error) {
    res.status(500).json({ message: "Failed to get blog list." });
  }
};
