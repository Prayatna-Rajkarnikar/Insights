import userModel from "../models/user.js";

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
