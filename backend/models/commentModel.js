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
      count: { type: Number, default: 0 }, // Number of times this comment has been flagged
      isBlurred: { type: Boolean, default: false }, // True if the comment contains slang words and should be blurred
    },
  },
  { timestamps: true }
);

const commentModel = mongoose.model("Comment", commentSchema);

export default commentModel;
