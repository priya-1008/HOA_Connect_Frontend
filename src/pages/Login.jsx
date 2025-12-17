import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  /* ================= LOGIN ================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        setUser({ token: data.token, role: data.role });

        if (data.role === "superadmin") navigate("/dashboard");
        else if (data.role === "admin") navigate("/admin-dashboard");
        else if (data.role === "resident") navigate("/resident-dashboard");
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch {
      setError("Server error! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FORGOT PASSWORD ================= */
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:5000/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotEmail }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setSuccess("Password reset link sent to your email.");
        setForgotEmail("");
      } else {
        setError(data.message || "Email not found");
      }
    } catch {
      setError("Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <img
        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
        alt="HOA"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-blue-900/50"></div>

      <div className="relative z-10 w-full max-w-xl bg-white rounded-2xl shadow-xl p-12">
        <h1 className="text-4xl font-bold text-center text-teal-700 mb-6">
          HOA CONNECT SYSTEM
        </h1>

        {/* ERROR / SUCCESS */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-center">
            {success}
          </div>
        )}

        {/* ================= LOGIN FORM ================= */}
        {!showForgot && (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-lg font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-lg font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                className="text-blue-600 font-semibold hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-700 text-white py-3 rounded-lg font-bold"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
        )}

        {/* ================= FORGOT PASSWORD FORM ================= */}
        {showForgot && (
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div>
              <label className="block text-lg font-medium mb-2">
                Enter your registered email
              </label>
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 text-white py-3 rounded-lg font-bold"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <button
              type="button"
              onClick={() => setShowForgot(false)}
              className="w-full text-gray-600 font-semibold hover:underline"
            >
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;