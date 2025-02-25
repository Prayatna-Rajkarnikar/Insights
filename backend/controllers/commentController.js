import blogModel from "../models/blog.js";
import commentModel from "../models/commentModel.js";
import userModel from "../models/user.js";

import { filterSlangword } from "./slangwordController.js";

export const createComment = async (req, res) => {
  try {
    const { blogId, content } = req.body;
    const author = req.user.id;

    const blogPost = await blogModel.findById(blogId);
    if (!blogPost) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const { filteredText, isBlurred } = await filterSlangword(content);

    const newComment = new commentModel({
      content: filteredText,
      author: author,
      blog: blogId,
      flags: { isBlurred: isBlurred },
    });

    await newComment.save();

    // Add the comment's ID to the blog's comments array
    blogPost.comments.push(newComment.id);
    await blogPost.save();

    if (isBlurred && author) {
      // Add the comment's ID to the user's flaggedComments array
      await userModel.findByIdAndUpdate(author, {
        $push: { flaggedComments: newComment.id },
      });

      // Increment the flags.count for the new comment
      await commentModel.findByIdAndUpdate(newComment.id, {
        $inc: { "flags.count": 1 },
      });
    }
    res
      .status(201)
      .json({ message: "Comment created successfully", comment: newComment });
  } catch (error) {
    console.error("Error creating comment:", error); // Log the actual error
    res
      .status(500)
      .json({ error: "Failed to create comment", details: error.message });
  }
};

export const getComments = async (req, res) => {
  try {
    const { blogId } = req.params;
    const comments = await commentModel
      .find({ blog: blogId })
      .populate("author", "email name image")
      .sort({ createdAt: -1 })
      .exec();
    res.status(200).json({ comments });
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments", error });
  }
};

export const getTotalComments = async (req, res) => {
  try {
    const { blogId } = req.params;
    const totalComments = await commentModel.countDocuments({ blog: blogId });
    res.status(200).json({ totalComments });
  } catch (error) {
    res.status(500).json({ error: "Failed to get total comments in blog" });
  }
};
