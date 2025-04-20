import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    blog: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
    flags: {
      count: { type: Number, default: 0 },
      isBlurred: { type: Boolean, default: false },
    },
    isHidden: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const commentModel = mongoose.model("Comment", commentSchema);

export default commentModel;
