import slangwordModel from "../models/slangwordModel.js";

export const addSlangWord = async (req, res) => {
  try {
    const { word } = req.body;
    if (!word) {
      return res.status(400).json({ error: "The word field is required." });
    }

    const wordExist = await slangwordModel.findOne({ word });
    if (wordExist) {
      return res.status(400).json({ error: "This word already exists." });
    }

    const newWord = new slangwordModel({ word });

    await newWord.save();
    res.status(201).json({ message: "Slang word added successfully", newWord });
  } catch (error) {}
};

export const getTotalWords = async (req, res) => {
  try {
    const totalWords = await slangwordModel.countDocuments();
    res.status(200).json({ totalWords });
  } catch (error) {
    res.status(500).json({ message: "Failed to get total words" });
  }
};

export const deleteWords = async (req, res) => {
  try {
    const { word } = req.body;
    const slangword = await slangwordModel.findOneAndDelete({ word });

    if (!slangword) {
      return res.status(404).json({ message: "Word not found" });
    }

    res.status(200).json({ message: "Word deleted successfully", slangword });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete word", error: error.message });
  }
};
