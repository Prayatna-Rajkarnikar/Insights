import commentModel from "../models/commentModel.js";
import userModel from "../models/user.js";

export const flagComment = async (req, res) => {
  try {
    const { commentId } = req.body;
    const loggedUser = req.user.id;

    const comment = await commentModel.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // if (loggedUser.flaggedComments.includes(commentId)) {
    //   return res
    //     .status(400)
    //     .json({ message: "You have already flagged this comment." });
    // }

    // Increment the flag count for the comment
    comment.flags.count += 1;
    await comment.save();

    if (comment.flags.count === 3) {
      const user = await userModel.findById(comment.author);
      if (user) {
        user.warnings += 1;
        await user.save();
      }
    }

    res.status(200).json({ message: "Comment flagged successfully", comment });
  } catch (error) {
    console.error("Error flagging comment:", error);
    res.status(500).json({ message: "Error flagging comment", error });
  }
};
