import blogModel from "../models/blogModel.js";
import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import topicModel from "../models/topicModel.js";

export const createBlog = async (req, res) => {
  try {
    let { title, subTitle, content, topics } = req.body;
    const authorId = req.user.id;

    if (!title || !subTitle || !content) {
      return res.status(404).json({ error: "Please fill all the fields." });
    }

    if (typeof topics === "string") {
      topics = JSON.parse(topics); // Convert json string to js object/array
    }

    // Validate topics
    if (
      !Array.isArray(topics) ||
      !topics.every(mongoose.Types.ObjectId.isValid)
    ) {
      return res.status(400).json({ error: "Invalid topics format" });
    }

    // Parse the content from the request body
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
    let imageIndex = 0;
    parsedContent.forEach((item) => {
      if (item.type === "image") {
        if (imageIndex < images.length) {
          item.value = images[imageIndex];
          imageIndex++;
        } else {
          item.value = "";
        }
      }
    });

    const newBlog = new blogModel({
      title,
      subTitle,
      content: parsedContent,
      author: authorId,
      topics,
    });

    await newBlog.save();

    const author = await userModel.findById(authorId);
    if (!author) {
      return res.status(404).json({ error: "Author not found." });
    }
    author.blogs.push(newBlog._id);
    await author.save();

    res.status(200).json({ message: "Blog created successfully", newBlog });
  } catch (error) {
    console.error("Error while creating blog:", error);
    res.status(500).json({ error: "Failed to create blog" });
  }
};

export const editBlog = async (req, res) => {
  try {
    let { title, subTitle, content } = req.body;

    const author = req.user.id;
    const blogId = req.params.id.trim();

    const blog = await blogModel.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    if (blog.author.toString() !== author) {
      return res
        .status(403)
        .json({ error: "You are not authorized to edit this blog" });
    }

    if (!title || !subTitle || !content) {
      return res.status(400).json({ error: "Please fill all the fields." });
    }

    let parsedContent = [];
    try {
      parsedContent = JSON.parse(content);
    } catch (error) {
      return res.status(400).json({
        error: "Invalid content format. It should be a valid JSON array.",
      });
    }

    if (!Array.isArray(parsedContent) || parsedContent.length === 0) {
      return res.status(400).json({ error: "Please fill the content field." });
    }

    // Check if there's an image section, but it's optional
    const firstImage = parsedContent.find(
      (section) => section.type === "image"
    )?.value;

    if (firstImage) {
      // Validate image if found
      if (typeof firstImage !== "string" || firstImage.trim().length === 0) {
        return res.status(400).json({
          error: "Image section found, but it's empty or invalid",
        });
      }
    }

    // Validate content sections
    const hasInvalidSection = parsedContent.some((section) => {
      if (section.type === "text" || section.type === "bullet") {
        const content =
          typeof section.value === "string" ? section.value.trim() : "";
        return !content || content === "•";
      }

      if (section.type === "image") {
        const imageUri =
          typeof section.value === "object"
            ? section.value?.uri
            : section.value;
        return (
          !imageUri ||
          typeof imageUri !== "string" ||
          imageUri.trim().length === 0
        );
      }

      return true; // Unknown section type is invalid
    });

    if (hasInvalidSection) {
      return res.status(400).json({
        error: "Please fill all content fields properly.",
      });
    }

    // Process uploaded images (if any)
    const images = req.files
      ? req.files.map((file) => `/blogImages/${file.filename}`)
      : [];

    let imageIndex = 0;
    parsedContent = parsedContent.map((item) => {
      if (item.type === "image") {
        if (
          typeof item.value === "string" &&
          item.value.startsWith("/blogImages/") &&
          !item.value.startsWith("/blogImages/") // Checking if it's an old image
        ) {
          return item; // Already has image or placeholder
        } else if (imageIndex < images.length) {
          item.value = images[imageIndex];
          imageIndex++;
        } else {
          item.value = ""; // Optional image handling (if no image provided)
        }
      }
      return item;
    });

    // Save updated blog
    blog.title = title;
    blog.subTitle = subTitle;
    blog.content = parsedContent;

    const updatedBlog = await blog.save();

    console.log("Updated Blog:", updatedBlog);

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
      .populate("topics", "name")
      .sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user blogs" });
  }
};

export const userBlogsById = async (req, res) => {
  try {
    const { userId } = req.params;
    const blogs = await blogModel
      .find({ author: userId })
      .populate("topics", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blogs by user ID" });
  }
};

export const getLatestBlogs = async (req, res) => {
  try {
    const blogs = await blogModel
      .find()
      .populate("author", "name image")
      .populate("likes", " _id")
      .populate({
        path: "comments",
        match: { isHidden: { $ne: true } },
        select: "_id",
      })
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
    const blogs = await blogModel
      .find()
      .populate("author", "name image")
      .populate("likes", "_id")
      .populate({
        path: "comments",
        match: { isHidden: { $ne: true } },
        select: "_id",
      })
      .lean();

    if (!blogs || blogs.length === 0) {
      return res.status(404).json({ message: "No blogs found" });
    }

    const trending = blogs
      .map((blog) => ({
        ...blog,
        likeCount: blog.likes.length,
        commentCount: blog.comments.length,
        trendingScore: blog.likes.length + blog.comments.length,
      }))
      .sort((a, b) => b.trendingScore - a.trendingScore)[0];

    res.status(200).json(trending);
  } catch (error) {
    console.error("Error fetching trending blog:", error);
    res.status(500).json({ error: "Failed to get trending blog" });
  }
};

export const getBlogsByTopic = async (req, res) => {
  try {
    const { topic: topicName } = req.query;

    let blogs;

    if (!topicName) {
      // No topic specified then return all blogs
      blogs = await blogModel
        .find()
        .populate("topics", "name")
        .populate("author", "name image");
    } else {
      const topic = await topicModel.findOne({ name: topicName });

      if (!topic) {
        return res
          .status(404)
          .json({ error: `Topic '${topicName}' not found` });
      }

      blogs = await blogModel
        .find({ topics: topic._id })
        .populate("topics", "name")
        .populate("author", "name image");
    }

    return res.status(200).json(blogs);
  } catch (error) {
    console.error("Error fetching blogs by topic:", error.message);
    res.status(500).json({ error: "An error occurred while fetching blogs." });
  }
};
