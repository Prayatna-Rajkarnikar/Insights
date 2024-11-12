import CommentModel from "../models/commentModel.js";
import blogModel from "../models/blog.js";
import commentModel from "../models/commentModel.js";
import mongoose from "mongoose";

// // List of bad words (extend this list as needed)
// // const badWords = ["badword1", "badword3"];

// // Function to filter and replace bad words
// const filterBadWords = (comment) => {
//   const words = comment.split(" ");
//   const filteredWords = words.map((word) =>
//     badWords.includes(word.toLowerCase()) ? blurWord(word) : word
//   );
//   return filteredWords.join(" ");
// };

// // Blurring method for bad words (replaces characters with asterisks)
// const blurWord = (word) => {
//   return word[0] + "*".repeat(word.length - 2) + word[word.length - 1];
// };

// // Controller to handle comment submission
// export const submitComment = async (req, res) => {
//   try {
//     let { text } = req.body;

//     // Filter bad words
//     const filteredText = filterBadWords(text);

//     // Create and save new comment
//     const newComment = new CommentModel({ text: filteredText });
//     await newComment.save();

//     res
//       .status(201)
//       .json({ message: "Comment submitted successfully", comment: newComment });
//   } catch (error) {
//     res.status(500).json({ message: "Error submitting comment", error });
//   }
// };

export const createComment = async (req, res) => {
  try {
    const { blogId, content } = req.body;
    const author = req.user.id;

    const blogPost = await blogModel.findById(blogId);
    if (!blogPost) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const newComment = new commentModel({
      content,
      author,
      blog: blogId,
    });

    await newComment.save();

    // Add the comment's ID to the blog's comments array
    blogPost.comments.push(newComment.id);
    await blogPost.save();
    res
      .status(201)
      .json({ message: "Comment created successfully", comment: newComment });
  } catch (error) {
    res.status(500).json({ error: "Failed to create comment" });
  }
};

export const getComments = async (req, res) => {
  try {
    const { blogId } = req.params;
    const comments = await CommentModel.find({ blog: blogId })
      .populate("author", "name image")
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
