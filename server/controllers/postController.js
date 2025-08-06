import Post from "../models/Post.js";

//Create a new post
export const createPost = async (req, res) => {
  const { content } = req.body;

  try {
    const newPost = await Post.create({
      content,
      author: req.userId,
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create post" });
  }
};

//Get all public posts (home feed)
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("author", "name bio");

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

// Get all posts by a specific user
export const getUserPosts = async (req, res) => {
  const { id } = req.params;

  try {
    const posts = await Post.find({ author: id })
      .sort({ createdAt: -1 })
      .populate("author", "name bio");

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user's posts" });
  }
};

//delete post by id
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json({
      message: "Post deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Error deleting post" });
  }
};
