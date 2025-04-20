import likeModel from "../models/likeModel.js";
import blogModel from "../models/blogModel.js";

export const toggleLike = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = req.user.id;

    const blogPost = await blogModel.findById(blogId);
    if (!blogPost) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const existingLike = await likeModel.findOne({
      user: userId,
      blog: blogId,
    });

    if (existingLike) {
      await likeModel.findByIdAndDelete(existingLike._id);
      blogPost.likes.pull(existingLike._id);
    } else {
      const newLike = new likeModel({ user: userId, blog: blogId });
      await newLike.save();
      blogPost.likes.push(newLike._id);
    }

    await blogPost.save();

    const likeCount = await likeModel.countDocuments({ blog: blogId });
    res.status(201).json({ isLiked: !existingLike, likeCount: likeCount });
  } catch (error) {
    console.error("failed", error);
    res.status(500).json({ error: "Failed to toggle like.", error });
  }
};

export const getUserLikes = async (req, res) => {
  try {
    const { blogId } = req.params;

    const likeList = await likeModel
      .find({ blog: blogId })
      .populate("user", "name image username")
      .sort({ createdAt: -1 })
      .exec();
    res.status(201).json({ likeList });
  } catch (error) {
    res.status(500).json({ error: "Failed to get user like." });
  }
};

export const getTotalLikes = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = req.user.id;

    const likeCount = await likeModel.countDocuments({ blog: blogId });
    const isLiked = await likeModel.exists({ user: userId, blog: blogId });

    res.status(200).json({ likeCount, isLiked: Boolean(isLiked) });
  } catch (error) {
    res.status(500).json({ error: "Failed to get total likes." });
  }
};
