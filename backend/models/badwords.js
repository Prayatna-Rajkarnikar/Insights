import mongoose from "mongoose";
const badWordSchema = new mongoose.Schema({
  word: { type: String, required: true },
});

const BadWord = mongoose.model("BadWord", badWordSchema);
