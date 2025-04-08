import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext"; // Import useAuth instead of AuthContext
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { resetPassword } = useAuth(); // Use useAuth hook to get resetPassword
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setMessage("");
      await resetPassword(email);
      setMessage("Password reset email sent! Check your inbox.");
      setTimeout(() => navigate("/login"), 3000); // Redirect to login after 3 seconds
    } catch (err) {
      setError("Failed to send reset email. Please try again.");
      console.error("Password reset error:", err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Reset Your Password
        </h2>
        {message && (
          <p className="text-green-600 text-center mb-4">{message}</p>
        )}
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Send Reset Email
          </button>
        </form>
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/login")}
            className="text-blue-500 hover:underline focus:outline-none"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
