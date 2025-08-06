import { Routes, Route, Navigate } from "react-router-dom";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Feed from "./pages/Feed";
import { useAuth } from "./context/AuthContext";
import Profile from "./pages/Profile";

function App() {
  const { loading, isAuthenticated } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/signin"
        element={isAuthenticated ? <Navigate to="/feed" replace /> : <Signin />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/feed" replace /> : <Signup />}
      />

      {/* Protected routes */}
      <Route
        path="/feed"
        element={isAuthenticated ? <Feed /> : <Navigate to="/signin" replace />}
      />

      {/* Protected routes */}
      <Route
        path="/profile/:id"
        element={
          isAuthenticated ? <Profile /> : <Navigate to="/signin" replace />
        }
      />

      {/* Default route */}
      <Route
        path="/"
        element={
          <Navigate to={isAuthenticated ? "/feed" : "/signin"} replace />
        }
      />
    </Routes>
  );
}

export default App;
