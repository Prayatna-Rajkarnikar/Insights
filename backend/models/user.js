import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  image: {
    type: String,
    default: "/images/default-user.png",
  },
  role: {
    type: String,
    enum: ["Admin", "Reader"],
    default: "Reader",
  },
  bio: { type: String, default: "" },
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
  warnings: {
    type: Number,
    default: 0,
  },
  flaggedComments: {
    type: Number,
    default: 0,
  },
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
