import topicModel from "../models/topics.js";

export const searchTopic = async (req, res) => {
  try {
    const { query } = req.query; // Get the search query from the request
    const topic = await topicModel.find({
      name: { $regex: query, $options: "i" },
    }); // Search with regex
    res.json(topic);
  } catch (error) {
    res.status(500).json({ error: "Failed to get topic." });
  }
};
