import blogModel from "../models/blogModel.js";
import commentModel from "../models/commentModel.js";
import userModel from "../models/userModel.js";
import {
  sendCommentRemovalEmail,
  sendUserDeactivateEmail,
} from "../middlewares/emailService.js";
import { filterSlangword } from "./slangwordController.js";

export const createComment = async (req, res) => {
  try {
    const { blogId, content } = req.body;
    const author = req.user.id;

    const blogPost = await blogModel.findById(blogId);
    if (!blogPost) {
      return res.status(404).json({ error: "Blog not found" });
    }

    if (!content) {
      return res.status(404).json({ error: "Please fill the field." });
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

    let updatedUser = null;

    if (isBlurred && author) {
      // Increment warnings and get updated user data
      updatedUser = await userModel.findByIdAndUpdate(
        author,
        {
          $push: { flaggedComments: newComment.id },
          $inc: { warnings: 1 },
        },
        { new: true } // This ensures the updated user object
      );

      setImmediate(() => sendCommentRemovalEmail(author));
    }

    if (updatedUser?.warnings % 3 === 0) {
      await sendUserDeactivateEmail(updatedUser);
    }

    res
      .status(201)
      .json({ message: "Comment created successfully", comment: newComment });
  } catch (error) {
    console.error("Error creating comment:", error);
    res
      .status(500)
      .json({ error: "Failed to create comment", details: error.message });
  }
};

export const hideComment = async (req, res) => {
  try {
    const commentId = req.params.id;

    const comment = await commentModel.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "comment not found" });
    }
    comment.isHidden = true;
    await comment.save();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to hide comment", details: error.message });
  }
};

export const getComments = async (req, res) => {
  try {
    const { blogId } = req.params;
    const comments = await commentModel
      .find({ blog: blogId, isHidden: false })
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
    const totalComments = await commentModel.countDocuments({
      blog: blogId,
      isHidden: { $ne: true },
    });
    res.status(200).json({ totalComments });
  } catch (error) {
    res.status(500).json({ error: "Failed to get total comments" });
  }
};
