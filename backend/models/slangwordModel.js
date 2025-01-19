import mongoose from "mongoose";

const slangwordSchema = new mongoose.Schema({
  word: { type: String, unique: true, required: true },
});

const slangwordModel = new mongoose.model("Slangword", slangwordSchema);

export default slangwordModel;
