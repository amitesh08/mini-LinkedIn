import { useState } from "react";
import Avatar from "../components/Avatar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [toasts, setToasts] = useState([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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

  const handleLogout = () => {
    showToast("Logging you out...", "success");
    setShowDropdown(false);
    setTimeout(() => {
      logout();
    }, 1000);
  };

  const handleProfile = () => {
    showToast("Navigating to profile...", "success");
    setShowDropdown(false);
    navigate(`/profile/${user._id}`);
  };

  return (
    <>
      {/* Toast Container - Higher z-index */}
      <div className="fixed top-4 right-4 z-[100] space-y-2">
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

      <nav className="sticky top-0 z-40 w-full flex justify-center bg-transparent py-2 backdrop-blur-md">
        <div className="w-full max-w-2xl flex items-center justify-between bg-white/90 shadow-lg rounded-xl px-4 py-2 border border-white/40 backdrop-blur-sm">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              mini-linkedin
            </h1>
          </Link>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded-lg transition-all duration-200 group"
              >
                <Avatar name={user.name} />
                <svg
                  className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                  {/* User Info Header */}
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>

                  {/* Profile Option */}
                  {user?._id && (
                    <button
                      onClick={handleProfile}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span>Profile</span>
                    </button>
                  )}

                  <a
                    href="https://github.com/amitesh08/mini-LinkedIn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                  >
                    <svg
                      className="w-4 h-4 text-gray-700"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 0C5.373 0 0 5.373 0 12c0 5.303 3.438 
                            9.8 8.205 11.387.6.113.82-.258.82-.577 
                            0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.082-.729.082-.729 
                            1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 
                            2.807 1.305 3.492.998.108-.775.418-1.305.762-1.605-2.665-.3-5.467-1.332-5.467-5.932 
                            0-1.31.468-2.382 1.235-3.222-.123-.303-.535-1.523.117-3.176 
                            0 0 1.008-.322 3.3 1.23a11.52 11.52 0 013.003-.404c1.02.005 
                            2.045.138 3.003.404 2.29-1.552 3.297-1.23 
                            3.297-1.23.653 1.653.241 2.873.12 
                            3.176.77.84 1.233 1.912 1.233 3.222 
                            0 4.61-2.807 5.628-5.48 5.922.43.37.823 
                            1.102.823 2.222 0 1.606-.015 2.898-.015 
                            3.293 0 .32.216.694.825.576C20.565 21.796 
                            24 17.3 24 12c0-6.627-5.373-12-12-12z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>GitHub Repo</span>
                  </a>

                  <div className="border-t border-gray-100 mt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
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
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowDropdown(false)}
        ></div>
      )}
    </>
  );
};

export default Navbar;
