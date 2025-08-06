import axios from "axios";
import { useCallback } from "react";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Avatar from "../components/Avatar";
import { useAuth } from "../context/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

const Feed = () => {
  const [postContent, setPostContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingPosts, setFetchingPosts] = useState(true);
  const [toasts, setToasts] = useState([]);
  const { user } = useAuth();

  // Toast system
  const showToast = (message, type = "success") => {
    const id = Date.now();
    const toast = { id, message, type };

    setToasts((prev) => [...prev, toast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // BACKEND INTEGRATION POINT 1: Fetch posts on component mount
  const fetchPosts = useCallback(async () => {
    try {
      setFetchingPosts(true);

      const response = await axios.get(
        // `${import.meta.env.VITE_API_URL}/api/posts/feed`,
        "/api/posts/feed",
        {
          withCredentials: true,
        }
      );

      // Format each post to include timestamp
      const formattedPosts = response.data.map((post) => ({
        ...post,
        timestamp: formatDistanceToNow(new Date(post.createdAt), {
          addSuffix: true,
        }),
      }));

      setPosts(formattedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      showToast("Failed to load posts", "error");
    } finally {
      setFetchingPosts(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // BACKEND INTEGRATION POINT 2: Create new post
  const handleCreatePost = async () => {
    if (!postContent.trim()) {
      showToast("Please write something before posting", "error");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        // `${import.meta.env.VITE_API_URL}/api/posts/create`,
        "/api/posts/create",
        { content: postContent },
        { withCredentials: true }
      );

      const newPost = {
        id: response.data._id,
        author: {
          name: user.name,
          bio: user.bio || "No bio",
        },
        content: response.data.content,
        timestamp: formatDistanceToNow(new Date(), { addSuffix: true }),
      };

      setPosts((prev) => [newPost, ...prev]);
      setPostContent("");
      showToast("Post shared successfully!", "success");
    } catch (error) {
      console.error("Error creating post:", error);
      showToast("Failed to create post", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-0 ${
              toast.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            <div className="flex items-center space-x-3">
              {toast.type === "success" ? (
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-4 text-white hover:text-gray-200 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* REPLACE THIS BLOCK WITH YOUR NAVBAR COMPONENT */}
      <Navbar />

      {/* Feed Content */}
      <div className="flex justify-center px-4 py-6">
        <div className="w-full max-w-2xl space-y-6">
          {/* Create Post Box */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Avatar name={user.name} size="40" />
              <h2 className="text-lg font-semibold text-gray-800">
                Share your thoughts
              </h2>
            </div>

            <textarea
              placeholder="What's happening in your professional world?"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className="w-full h-28 p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 placeholder-gray-400"
              maxLength={500}
            />

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2 text-gray-500">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
                <span className="text-sm">Add text content</span>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-xs text-gray-400">
                  {postContent.length}/500
                </span>

                <button
                  onClick={handleCreatePost}
                  disabled={loading || !postContent.trim()}
                  className={`px-6 py-2 rounded-xl text-white font-semibold transition-all duration-200 transform ${
                    loading || !postContent.trim()
                      ? "bg-gray-400 cursor-not-allowed scale-95"
                      : "bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <svg
                        className="animate-spin w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          className="opacity-25"
                        ></circle>
                        <path
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          className="opacity-75"
                        ></path>
                      </svg>
                      <span>Posting...</span>
                    </div>
                  ) : (
                    "Share"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Posts Loading State */}
          {fetchingPosts ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 animate-pulse"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Posts List */
            <div className="space-y-6">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300"
                >
                  {/* Post Header */}
                  <div className="flex items-start space-x-3 mb-4">
                    <Avatar name={post.author.name} size="40" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900 truncate">
                          <Link
                            to={`/profile/${post.author._id}`}
                            className=" hover:underline hover:text-blue-500"
                          >
                            {post.author.name}
                          </Link>
                        </h3>
                        <span className="text-gray-400 text-sm">•</span>
                        <span className="text-gray-500 text-sm">
                          {post.timestamp}
                        </span>
                      </div>
                      {post.author.bio && (
                        <p className="text-sm text-gray-600 truncate">
                          {post.author.bio}
                        </p>
                      )}
                    </div>

                    {/* Post Menu */}
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Post Content */}
                  <div className="mb-4">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {post.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!fetchingPosts && posts.length === 0 && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No posts yet
              </h3>
              <p className="text-gray-600">
                Be the first to share something with your network!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;
