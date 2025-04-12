import topicModel from "../models/topics.js";
import blogModel from "../models/blog.js";

export const addTopic = async (req, res) => {
  try {
    const { name } = req.body;

    const trimmedName = name.trim();

    if (!trimmedName) {
      return res.status(404).json({ error: "Topic name is must." });
    }

    const topicExist = await topicModel.findOne({ name: trimmedName });
    if (topicExist) {
      return res.status(400).json({ error: "Topic already exist" });
    }

    const newTopic = new topicModel({
      name: trimmedName,
    });

    await newTopic.save();

    res.status(200).json({ message: "Topic added successfully", newTopic });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to add topic" });
  }
};

export const getMostUsedTopics = async (req, res) => {
  try {
    const blogs = await blogModel.find({}, "topics").populate("topics", "name");

    const topicCount = {};

    // Count occurrences of each topic in the blogs
    blogs.forEach((blog) => {
      blog.topics.forEach((topic) => {
        topicCount[topic.name] = (topicCount[topic.name] || 0) + 1;
      });
    });

    // Convert the object to an array, sort by count, and get the top 5
    const sortedTopics = Object.entries(topicCount)
      .sort((a, b) => b[1] - a[1]) // Sort in descending order of frequency
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    res.status(200).json(sortedTopics);
  } catch (error) {
    console.error("Error fetching topics:", error);
    res.status(500).json({ error: "Failed to get most used topic" });
  }
};
