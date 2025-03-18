import topicModel from "../models/topics.js";
import blogModel from "../models/blog.js";
import userModel from "../models/user.js";

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
        // $or Operator:
        // Combines multiple conditions.
        // At least one of the conditions in the $or array must be true for a document to match.
        $or: [
          { title: { $regex: query, $options: "i" } },
          // { subTitle: { $regex: query, $options: "i" } },
        ],
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

    const user = await userModel.find({
      role: { $ne: "Admin" },
      $or: [
        // { name: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
      ],
    });
    res.json(user);
  } catch (error) {}
};
