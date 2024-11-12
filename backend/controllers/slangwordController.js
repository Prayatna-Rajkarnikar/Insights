import slangwordModel from "../models/slangwordModel.js";

export const addWord = async (req, res) => {
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
