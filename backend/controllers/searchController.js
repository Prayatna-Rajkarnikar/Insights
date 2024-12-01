import topicModel from "../models/topics.js";
import blogModel from "../models/blog.js";

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
    const blog = await blogModel.find({
      title: { $regex: query, $options: "i" },
    });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: "Failed to get blogs." });
  }
};
