import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "resident",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/auth/register",
        form
      );
      if (response.data) {
        alert("Registration successful! Please login.");
        navigate("/login");
      }
    } catch (err) {
      console.error("Registration failed:", err);
      setError(
        err.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Full-page background image */}
      <img
        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
        alt="Homeowner Association"
        className="absolute inset-0 w-full h-screen object-cover z-0"
      />

      {/* Optional dark overlay to make form readable */}
      <div className="absolute inset-0 w-full h-screen bg-blue-900 bg-opacity-40 z-10"></div>

      {/* Transparent form card with light border */}
      <div className="relative z-20 w-full max-w-2xl mx-auto rounded-2xl border border-white/60 bg-white/100 backdrop-blur-md shadow-xl p-10 md:p-12">
        <h1 className="text-4xl font-bold text-center text-gray-400 mb-8">
          HOA CONNECT SYSTEM
        </h1>
         <h2 className="text-4xl font-bold text-center text-teal-700 mb-8">
          Sign Up 
        </h2>

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-lg font-medium mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border bg-transparent rounded-lg focus:ring-2 focus:ring-teal-300 focus:outline-none text-lg"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-lg font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border bg-transparent rounded-lg focus:ring-2 focus:ring-teal-300 focus:outline-none text-lg"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-lg font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border bg-transparent rounded-lg focus:ring-2 focus:ring-teal-300 focus:outline-none text-lg"
              placeholder="Enter your password"
            />
          </div>

          <div>
            <label className="block text-lg font-medium mb-2">Role</label>
            <input
              type="text"
              name="role"
              value="resident"
              readOnly
              className="w-full px-4 py-3 border bg-transparent  rounded-lg focus:outline-none text-lg"
            />
          </div>

          {error && (
            <p className="bg-red-50/80 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-md text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600/90 hover:bg-teal-700 text-white py-3 rounded-lg font-semibold transition duration-300 shadow-md text-lg"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-md text-center mt-8">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 font-bold hover:underline"
          >
            Login Here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
