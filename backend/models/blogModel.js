import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subTitle: { type: String, required: true },
    content: [
      {
        type: { type: String, enum: ["text", "image"], required: true },
        value: { type: mongoose.Schema.Types.Mixed, required: true },
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Like" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    topics: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },
    ],
  },
  { timestamps: true }
);

const blogModel = mongoose.model("Blog", blogSchema);

export default blogModel;
