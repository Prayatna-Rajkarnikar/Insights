import blogModel from "../models/blog.js";
import userModel from "../models/user.js";

export const createBlog = async (req, res) => {
  try {
    const { title, subTitle, content } = req.body;
    const authorId = req.user.id;

    // Ensure that none of the required fields are empty
    if (!title || !subTitle || !content) {
      return res
        .status(404)
        .json({ error: "Title, Subtitle, and Content are required." });
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

    // Log and respond with the new blog content
    console.log("New blog content:", newBlog.content);

    // Respond with success
    res.status(200).json({ message: "Blog created successfully", newBlog });
  } catch (error) {
    console.error("Error while creating blog:", error); // Log the error details
    res.status(500).json({ error: "Failed to create blog" });
  }
};

export const editBlog = async (req, res) => {
  try {
    const { title, subTitle, content } = req.body;
    const author = req.user.id;
    const blogId = req.params.id;

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

    // Update the blog post fields
    blog.title = title || blog.title;
    blog.subTitle = subTitle || blog.subTitle;
    blog.content = content || blog.content;

    // Update images only if new files are provided
    if (req.files && req.files.length > 0) {
      blog.images = req.files.map((file) => `/blogImages/${file.filename}`);
    }

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

export const homeBlogs = async (req, res) => {
  try {
    const blogs = await blogModel.find().sort({ createdAt: -1 }).limit(5);
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch latest blogs" });
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
    res.status(500).json({ error: "Failed to fetch latest blogs" });
  }
};

export const blogDetail = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await blogModel
      .findById(blogId)
      .populate("author", "name username image");

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

    await blogModel.findByIdAndDelete(blogId);
    res.status(201).json({ message: "Blog Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Unable to delete blog" });
  }
};
