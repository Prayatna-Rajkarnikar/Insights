let slangwords = [];
let slangSet = new Set();

export const setSlangwords = (words) => {
  slangwords = words;
  slangSet = new Set(words);
};

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

export const filterSlangword = async (content) => {
  try {
    if (slangSet.size === 0) {
      return { filteredText: content, isBlurred: false };
    }

    // Split by word boundaries to ensure punctuation is handled properly
    let words = content.split(/\b/);
    let foundSlangs = false;

    for (let i = 0; i < words.length; i++) {
      const lowerWord = words[i].toLowerCase();

      // If the word is in the slangSet, apply filtering
      if (slangSet.has(lowerWord)) {
        foundSlangs = true;
        words[i] =
          lowerWord.length > 2
            ? lowerWord[0] +
              "*".repeat(lowerWord.length - 2) +
              lowerWord[lowerWord.length - 1]
            : "*".repeat(lowerWord.length);
      }
    }

    return { filteredText: words.join(""), isBlurred: foundSlangs };
  } catch (error) {
    console.error("Error filtering slang words:", error);
    return { filteredText: content, isBlurred: false };
  }
};

export const getSlangwordList = async (req, res) => {
  try {
    const wordsList = await slangwordModel.find();
    res.status(200).json({ list: wordsList });
  } catch (error) {
    res
      .satus(500)
      .json({ error: "Failed to create comment", details: error.message });
  }
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
