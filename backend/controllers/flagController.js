import commentModel from "../models/commentModel.js";
import userModel from "../models/user.js";
import { sendEmail } from "../middlewares/emailService.js";

export const flagComment = async (req, res) => {
  try {
    const { commentId } = req.body;
    const userId = req.user.id;
    const comment = await commentModel.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Ensure flaggedComments is an array before using includes()
    if (!Array.isArray(user.flaggedComments)) {
      user.flaggedComments = [];
    }
    // Check if the user has already flagged this comment
    if (user.flaggedComments.includes(commentId)) {
      return res
        .status(400)
        .json({ message: "You have already flagged this comment." });
    }
    user.flaggedComments.push(commentId);
    await user.save();
    // Increment the flag count
    comment.flags.count += 1;
    await comment.save();
    // If comment is flagged 3 times, increase author's warning count
    if (comment.flags.count % 3 === 0) {
      const author = await userModel.findById(comment.author);
      if (author) {
        // Increase warning count
        author.warnings += 1;
        await author.save();
        console.log("Author id:", author._id);

        // if (author.warnings % 3 === 0) {
        //   await sendEmail(author._id);
        // }
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
