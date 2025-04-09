import topicModel from "../models/topics.js";
import blogModel from "../models/blog.js";
import userModel from "../models/user.js";
import roomModel from "../models/roomModel.js";

export const searchTopic = async (req, res) => {
  try {
    const { query } = req.query;
    const topic = await topicModel.find({
      name: { $regex: query, $options: "i" },
    });
    res.json(topic);
  } catch (error) {
    res.status(500).json({ error: "Failed to get topic." });
  }
};

export const searchBlogs = async (req, res) => {
  try {
    const { query } = req.query;
    const blog = await blogModel
      .find({
        title: { $regex: query, $options: "i" },
      })
      .populate("author", "name");
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: "Failed to get blogs." });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const loggedInUserId = req.user.id;

    const users = await userModel.find({
      _id: { $ne: loggedInUserId },
      role: { $ne: "Admin" },
      username: { $regex: query, $options: "i" },
    });

    res.json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const searchAllChat = async (req, res) => {
  try {
    const { query } = req.query;

    const rooms = await roomModel.find({
      name: { $regex: query, $options: "i" },
    });

    res.json(rooms);
  } catch (error) {
    console.error("Error searching rooms:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const searchUserChat = async (req, res) => {
  try {
    const { query } = req.query;
    const loggedInUserId = req.user.id;

    const rooms = await roomModel.find({
      name: { $regex: query, $options: "i" },
      members: { $in: [loggedInUserId] },
    });

    res.json(rooms);
  } catch (error) {
    console.error("Error searching rooms:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
