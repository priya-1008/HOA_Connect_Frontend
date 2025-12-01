import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

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

        // Role-based navigation
        if (data.role === "superadmin") {
          navigate("/dashboard");
        } else if (data.role === "admin") {
          navigate("/admin-dashboard");
        } else if (data.role === "resident") {
          navigate("/resident-dashboard");
        } else {
          setError("Unknown role!");
        }
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      console.error(err);
      setError("Server error! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Full-page Background Image */}
      <img
        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
        alt="Homeowner Association"
        className="absolute inset-0 w-full h-screen object-cover z-0"
      />
      {/* Overlay */}
      <div className="absolute inset-0 w-full h-screen bg-blue-900 bg-opacity-50 z-10"></div>
      {/* Sign In Card */}
      <div className="relative z-20 w-full max-w-xl min-h-[600px] mx-auto bg-white rounded-2xl shadow-xl p-12 border border-gray-100 flex flex-col justify-center">
        <h1 className="text-4xl font-bold text-center text-gray-400 mb-8">
          HOA CONNECT SYSTEM
        </h1>
        <h2 className="text-4xl font-bold text-center text-teal-700 mb-8">
          Sign In 
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-2 mb-4 rounded-lg text-md text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-7">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none text-lg"
              required
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none text-lg"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-700 text-white py-3 rounded-lg font-semibold hover:bg-teal-800 transition duration-300 shadow-md text-lg"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="text-md text-center text-gray-500 mt-8">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 font-bold hover:underline"
          >Register Here </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
