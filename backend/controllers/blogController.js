import blogModel from "../models/blog.js";
import mongoose from "mongoose";
import userModel from "../models/user.js";

export const createBlog = async (req, res) => {
  try {
    let { title, subTitle, content, topics } = req.body;
    const authorId = req.user.id;

    console.log("Request body:", req.body);

    // Ensure that none of the required fields are empty
    if (!title || !subTitle || !content) {
      return res
        .status(404)
        .json({ error: "Title, Subtitle, and Content are required." });
    }

    if (typeof topics === "string") {
      topics = JSON.parse(topics); // Convert back to an array
    }

    // Validate topics
    if (
      !Array.isArray(topics) ||
      !topics.every(mongoose.Types.ObjectId.isValid)
    ) {
      return res.status(400).json({ error: "Invalid topics format" });
    }

    // Parse the `content` field from the request body
    let parsedContent;
    try {
      parsedContent = JSON.parse(content); // Parse the content JSON string
    } catch (error) {
      return res.status(400).json({
        error: "Invalid content format. It should be a valid JSON array.",
      });
    }

    // Ensure content is an array and not empty
    if (!Array.isArray(parsedContent) || parsedContent.length === 0) {
      return res
        .status(400)
        .json({ error: "Content must be a non-empty array." });
    }

    // Process uploaded images and map them to the content array
    const images = req.files
      ? req.files.map((file) => `/blogImages/${file.filename}`)
      : [];

    // Update the parsed content with the image paths
    let imageIndex = 0; // Keep track of image assignment
    parsedContent.forEach((item) => {
      if (item.type === "image") {
        if (imageIndex < images.length) {
          // Assign the next available image
          item.value = images[imageIndex];
          imageIndex++; // Move to the next image
        } else {
          item.value = ""; // No image available for this slot
        }
      }
    });

    // Create a new blog post in the database
    const newBlog = new blogModel({
      title,
      subTitle,
      content: parsedContent,
      author: authorId,
      topics,
    });

    // Save the new blog post
    await newBlog.save();

    // Find the author and associate the blog with the author
    const author = await userModel.findById(authorId);
    if (!author) {
      return res.status(404).json({ error: "Author not found." });
    }
    author.blogs.push(newBlog._id);
    await author.save();

    // Respond with success
    res.status(200).json({ message: "Blog created successfully", newBlog });
  } catch (error) {
    console.error("Error while creating blog:", error);
    res.status(500).json({ error: "Failed to create blog" });
  }
};

export const editBlog = async (req, res) => {
  try {
    let { title, subTitle, content, topics } = req.body;

    const author = req.user.id;
    const blogId = req.params.id.trim();

    const blog = await blogModel.findById(blogId);

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Check if the logged-in user is the author of the blog
    if (blog.author.toString() !== author) {
      return res
        .status(403)
        .json({ error: "You are not authorized to edit this blog" });
    }

    // Ensure that none of the required fields are empty
    if (!title || !subTitle || !content) {
      return res
        .status(404)
        .json({ error: "Title, Subtitle, and Content are required." });
    }

    // Parse the `content` field
    let parsedContent = blog.content; // Use existing content if not provided
    if (content) {
      try {
        parsedContent = JSON.parse(content);
      } catch (error) {
        return res.status(400).json({
          error: "Invalid content format. It should be a valid JSON array.",
        });
      }

      // Ensure the content is a non-empty array
      if (!Array.isArray(parsedContent) || parsedContent.length === 0) {
        return res
          .status(400)
          .json({ error: "Content must be a non-empty array." });
      }
    }

    if (typeof topics === "string") {
      topics = JSON.parse(topics); // Convert back to an array
    }

    // Validate topics
    if (
      !Array.isArray(topics) ||
      !topics.every(mongoose.Types.ObjectId.isValid)
    ) {
      return res.status(400).json({ error: "Invalid topics format" });
    }

    // Process uploaded images and map them to the content array
    const images = req.files
      ? req.files.map((file) => `/blogImages/${file.filename}`)
      : [];

    let imageIndex = 0; // Index for new images
    parsedContent = parsedContent.map((item, idx) => {
      if (item.type === "image") {
        if (item.value.startsWith("/blogImages/")) {
          // Preserve existing image if not replaced
          return item;
        } else if (imageIndex < images.length) {
          // Replace with new image if available
          item.value = images[imageIndex];
          imageIndex++;
        } else {
          // No image available for this slot
          item.value = "";
        }
      }
      return item;
    });

    // Update blog fields
    if (title) blog.title = title;
    if (subTitle) blog.subTitle = subTitle;
    if (content) blog.content = parsedContent;
    if (topics) blog.topics = topics;

    const updatedBlog = await blog.save();

    res.status(200).json({
      message: "Blog updated successfully!",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ message: "Error updating blog", error });
  }
};

export const userBlogs = async (req, res) => {
  try {
    const userID = req.user.id;
    const blogs = await blogModel
      .find({ author: userID })
      .sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user blogs" });
  }
};

export const getLatestBlogs = async (req, res) => {
  try {
    const blogs = await blogModel
      .find()
      .populate("author", "name image")
      .populate("likes", " _id")
      .populate("comments", "_id")
      .sort({ createdAt: -1 })
      .lean();

    const homeBlogs = blogs.map((blog) => ({
      ...blog,
      likeCount: blog.likes.length,
      commentCount: blog.comments.length,
    }));

    res.status(200).json(homeBlogs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch latest blogs" });
  }
};

export const getBlogDetail = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await blogModel
      .findById(blogId)
      .populate("author", "name username image")
      .populate("topics", "name");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }
    res.status(200).json(blog);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch blog details" });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

    const blog = await blogModel.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const author = await userModel.findById(blog.author);

    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    // Remove the blog ID from the author's blogs array
    author.blogs = author.blogs.filter((id) => id.toString() !== blogId);
    await author.save();

    await blogModel.findByIdAndDelete(blogId);
    res.status(201).json({ message: "Blog Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Unable to delete blog" });
  }
};

export const getTrendingBlogs = async (req, res) => {
  try {
    // Fetch all blogs
    const blogs = await blogModel.find().populate("author", "name image");

    const trending = blogs
      .map((blog) => {
        blog.trendingScore = blog.likes.length + blog.comments.length;
        return blog;
      })
      .sort((a, b) => b.trendingScore - a.trendingScore) //descending order
      .slice(0, 5); //start at 0 and stop at 5 index of array
    res.status(200).json(trending);
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ error: "Failed to get trending blogs" });
  }
};
