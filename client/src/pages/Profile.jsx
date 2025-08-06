import axios from "axios";
import { useCallback } from "react";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Avatar from "../components/Avatar";
import { useAuth } from "../context/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { useParams } from "react-router-dom";

const Profile = () => {
  const [posts, setPosts] = useState([]);
  const [fetchingPosts, setFetchingPosts] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [profileUser, setProfileUser] = useState(null);
  const [deletingPostId, setDeletingPostId] = useState(null);
  const { user } = useAuth();
  const { id: profileUserId } = useParams();

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

  // Delete post function
  const handleDeletePost = async (postId) => {
    try {
      setDeletingPostId(postId);

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/posts/${postId}`,
        {
          withCredentials: true,
        }
      );

      // Remove post from UI immediately
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));

      showToast("Post deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting post:", error);
      showToast(
        error.response?.data?.message || "Failed to delete post",
        "error"
      );
    } finally {
      setDeletingPostId(null);
    }
  };

  // BACKEND INTEGRATION POINT 1: Fetch posts on component mount
  const fetchUsersPosts = useCallback(async () => {
    try {
      setFetchingPosts(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/posts/user/${profileUserId}`,
        {
          withCredentials: true,
        }
      );
      const postsData = response.data;

      // Extract author info from first post if exists
      if (postsData.length > 0) {
        setProfileUser(postsData[0].author); // safely extract name & bio
      }

      // Format each post to include timestamp
      const formattedPosts = postsData.map((post) => ({
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
  }, [profileUserId]);

  useEffect(() => {
    fetchUsersPosts();
  }, [fetchUsersPosts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      {/* Toast Container */}
      <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50 space-y-2 max-w-xs sm:max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center p-3 sm:p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-0 ${
              toast.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            <div className="flex items-center space-x-2 sm:space-x-3">
              {toast.type === "success" ? (
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
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
                  className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
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
              <span className="text-xs sm:text-sm font-medium break-words">
                {toast.message}
              </span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 sm:ml-4 text-white hover:text-gray-200 transition-colors flex-shrink-0"
            >
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4"
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

      <Navbar />

      {/* Profile Content */}
      <div className="flex justify-center px-2 sm:px-4 py-4 sm:py-6">
        <div className="w-full max-w-xs sm:max-w-lg md:max-w-xl lg:max-w-2xl space-y-4 sm:space-y-6">
          {/* Profile Header */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6">
              {/* Large Profile Avatar */}
              <div className="relative">
                <Avatar name={profileUser?.name || "User"} size="120" />
                {/* Optional: Add online status indicator */}
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-400 border-4 border-white rounded-full shadow-lg"></div>
              </div>

              {/* Profile Info */}
              <div className="space-y-3 sm:space-y-4 w-full max-w-xs sm:max-w-md">
                <div className="space-y-2 sm:space-y-3">
                  <div className="bg-gray-50/80 backdrop-blur-sm rounded-lg sm:rounded-xl px-4 sm:px-6 py-3 sm:py-4 border border-gray-200/50">
                    <p className="text-lg sm:text-xl font-semibold text-gray-900">
                      {profileUser?.name || "Your Name"}
                    </p>
                  </div>
                  <div className="bg-gray-50/80 backdrop-blur-sm rounded-lg sm:rounded-xl px-4 sm:px-6 py-3 sm:py-4 border border-gray-200/50">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      {profileUser?.bio || "Your bio goes here..."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Posts Section Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Posts</h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {posts.length} {posts.length === 1 ? "post" : "posts"}
            </span>
          </div>

          {/* Posts Section */}
          {fetchingPosts ? (
            <div className="space-y-3 sm:space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6 animate-pulse"
                >
                  <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-3 sm:h-4 bg-gray-200 rounded w-24 sm:w-32"></div>
                      <div className="h-2 sm:h-3 bg-gray-200 rounded w-16 sm:w-24"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 sm:h-4 bg-gray-200 rounded"></div>
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Posts List */
            <div className="space-y-4 sm:space-y-6">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6 hover:shadow-xl transition-all duration-300"
                >
                  {/* Post Header */}
                  <div className="flex items-start space-x-3 mb-3 sm:mb-4">
                    <Avatar name={post.author.name} size="40" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                          {post.author.name}
                        </h3>
                        <span className="text-gray-400 text-xs sm:text-sm">
                          •
                        </span>
                        <span className="text-gray-500 text-xs sm:text-sm">
                          {post.timestamp}
                        </span>
                      </div>
                      {post.author.bio && (
                        <p className="text-xs sm:text-sm text-gray-600 truncate">
                          {post.author.bio}
                        </p>
                      )}
                    </div>
                    {/* Post Menu and Delete Icon */}
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      {/* Delete Icon - only show if it's user's own post */}
                      {post.author._id === user._id && (
                        <button
                          onClick={() => handleDeletePost(post._id)}
                          disabled={deletingPostId === post._id}
                          className="p-1.5 sm:p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete post"
                        >
                          {deletingPostId === post._id ? (
                            <svg
                              className="w-4 h-4 sm:w-5 sm:h-5 animate-spin"
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
                          ) : (
                            <svg
                              className="w-4 h-4 sm:w-5 sm:h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          )}
                        </button>
                      )}
                      <button className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5"
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
                  </div>
                  {/* Post Content */}
                  <div className="mb-3 sm:mb-4">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                      {post.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!fetchingPosts && posts.length === 0 && (
            <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-white/20 p-8 sm:p-12 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400"
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
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                No posts yet
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Share your first post to get started!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
