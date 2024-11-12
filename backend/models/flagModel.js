import mongoose from "mongoose";
const flagSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    required: true,
  },
});

const flagModel = mongoose.model("Flag", flagSchema);

export default flagModel;
