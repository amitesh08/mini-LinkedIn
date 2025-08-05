import Post from "../models/Post.js";

export const isPostAuthor = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    next(); // user is the owner
  } catch (err) {
    res.status(500).json({ message: "Server error in post authorization" });
  }
};
