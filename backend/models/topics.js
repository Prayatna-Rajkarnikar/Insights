import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

const topicModel = mongoose.model("Topic", topicSchema);

export default topicModel;
