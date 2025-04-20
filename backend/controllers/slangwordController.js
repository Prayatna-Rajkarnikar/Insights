import path from "path";
import fs from "fs";

const __dirname = path.resolve();
const filePath = path.join(__dirname, "slangwords.json");

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

    const lowerWord = word.toLowerCase();

    if (slangSet.has(lowerWord)) {
      return res.status(400).json({ error: "This word already exists." });
    }

    slangwords.push(lowerWord);
    slangSet.add(lowerWord);

    fs.writeFile(
      filePath,
      JSON.stringify(slangwords, null, 2),
      "utf8",
      (err) => {
        if (err) {
          console.error("Error writing to slangwords.json:", err);
          return res.status(500).json({ error: "Failed to save slang word." });
        }
        res
          .status(201)
          .json({ message: "Slang word added successfully", word: lowerWord });
      }
    );
  } catch (error) {
    console.error("Error adding slang word:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const filterSlangword = async (content) => {
  try {
    if (slangSet.size === 0) {
      return { filteredText: content, isBlurred: false };
    }

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
    if (!fs.existsSync(filePath)) {
      return res.status(200).json({ list: [] });
    }

    const data = fs.readFileSync(filePath, "utf8");
    const wordsList = JSON.parse(data);

    res.status(200).json({ list: wordsList });
  } catch (error) {
    console.error("Error reading slangwords.json:", error.message);
    res.status(500).json({
      error: "Failed to retrieve slang words",
      details: error.message,
    });
  }
};

export const getTotalWords = async (req, res) => {
  try {
    if (!fs.existsSync(filePath)) {
      return res.status(200).json({ totalWords: 0 });
    }

    const data = fs.readFileSync(filePath, "utf8");
    const wordsList = JSON.parse(data);

    res.status(200).json({ totalWords: wordsList.length });
  } catch (error) {
    console.error("Error reading slangwords.json:", error.message);
    res
      .status(500)
      .json({ message: "Failed to get total words", details: error.message });
  }
};

export const deleteSlangword = async (req, res) => {
  try {
    const { word } = req.body;

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "No slang words found" });
    }

    const data = fs.readFileSync(filePath, "utf8");
    let wordsList = JSON.parse(data);

    const filteredWords = wordsList.filter(
      (w) => w.toLowerCase() !== word.toLowerCase()
    );

    if (wordsList.length === filteredWords.length) {
      return res.status(404).json({ message: "Word not found" });
    }

    fs.writeFileSync(filePath, JSON.stringify(filteredWords, null, 2), "utf8");

    res
      .status(200)
      .json({ message: "Word deleted successfully", deletedWord: word });
  } catch (error) {
    console.error("Error deleting slang word:", error.message);
    res
      .status(500)
      .json({ message: "Failed to delete word", error: error.message });
  }
};

export const searchSlangword = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Search query is required." });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "No slang words found." });
    }

    const data = fs.readFileSync(filePath, "utf8");
    const wordsList = JSON.parse(data);

    // Filter words that match the query
    const matchedWords = wordsList.filter((word) =>
      word.toLowerCase().includes(query.toLowerCase())
    );

    res.json(matchedWords);
  } catch (error) {
    console.error("Error searching slang words:", error.message);
    res
      .status(500)
      .json({ error: "Failed to search slang words.", details: error.message });
  }
};
