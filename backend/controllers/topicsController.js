import topicModel from "../models/topics.js";

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
