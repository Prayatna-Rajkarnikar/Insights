import commentModel from "../models/commentModel.js";
import userModel from "../models/user.js";

export const flagComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;
    const comment = await commentModel.findById(commentId);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!Array.isArray(user.flaggedComments)) {
      user.flaggedComments = [];
    }

    if (user.flaggedComments.includes(commentId)) {
      return res
        .status(400)
        .json({ message: "You have already flagged this comment." });
    }

    // Add comment ID to flagged comments
    user.flaggedComments.push(commentId);
    await user.save();

    // Increment the flag count
    comment.flags.count += 1;

    // Check if flag count reaches 3
    if (comment.flags.count >= 3) {
      comment.isHidden = true; // Hide the comment
    }

    await comment.save(); // Save after updating flag count and isHidden status

    // If comment is hidden, increase author's warnings
    if (comment.isHidden) {
      const author = await userModel.findById(comment.author);
      if (author) {
        author.warnings += 1;
        await author.save();
      }
    }

    res.status(200).json({ message: "Comment flagged successfully", comment });
  } catch (error) {
    console.error("Error flagging comment:", error);
    res
      .status(500)
      .json({ message: "Error flagging comment", details: error.message });
  }
};
