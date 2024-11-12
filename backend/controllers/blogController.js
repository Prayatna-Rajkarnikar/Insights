import blogModel from "../models/blog.js";
import userModel from "../models/user.js";

export const createBlog = async (req, res) => {
  try {
    const { title, subTitle, content } = req.body;
    const authorId = req.user.id;

    // Map is necessary when you want to transform the array of uploaded files into an array of image paths.
    const images = req.files
      ? req.files.map((file) => `/blogImages/${file.filename}`)
      : [];

    const newBlog = new blogModel({
      title,
      subTitle,
      content,
      author: authorId,
      images,
    });
    await newBlog.save();

    const author = await userModel.findById(authorId);
    if (!author) {
      return res.status(404).json({ error: "Author not found" });
    }

    //Add new blog in respective user array
    author.blogs.push(newBlog._id);
    await author.save();

    res.status(200).json({ message: "Blog Created sucessfully", newBlog });
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

    res.status(201).json(blog);
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
