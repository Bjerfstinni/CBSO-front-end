import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import backgroundImage from "../../assets/login_bg.png";
import logoImage from "../../assets/logo1.png";
import { loginUser } from '../../api/auth';

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username === "") {
      toast.error("Username is a required field!", {
        position: "top-right", // Updated to use string value
      });
      return;
    }
    if (password === "") {
      toast.error("Password is a required field!", {
        position: "top-right", // Updated to use string value
      });
      return;
    }

    try {
      const data = await loginUser(username, password);

      localStorage.setItem('token', data.token);
      toast.success("Login successful!", { position: "top-right" });
      window.location.href = "/"
    } catch (error) {
      toast.error("Login failed. Please check your credentials.", {
        position: "top-right", // Updated to use string value
      });
      console.error("Error during login:", error);
    }
  };



  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-gray-100 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Logo */}
      <img
        src={logoImage}
        alt="logo"
        className="absolute top-1 left-6 w-80 h-40 object-contain"
      />

      {/* Content */}
      <div className="relative z-10 bg-white p-6 rounded-lg shadow-lg w-96">
        <h1 className="text-[27px] mb-4 font-bold text-gray-700">Sign in to your account</h1>
        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="tracking-wide font-sans text-md font-normal shadow border border-gray-400 rounded w-full h-11 py-1 px-3 text-gray-700 focus:shadow-outline focus:outline-none focus:ring-2 ring-gray-500 ring-offset-1"
              id="username"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password Field */}
          <div className="mb-6 relative">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="tracking-wide font-sans text-md font-normal shadow border border-gray-400 rounded w-full h-11 py-1 px-3 text-gray-700 focus:shadow-outline focus:outline-none focus:ring-2 ring-gray-500 ring-offset-1"
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute w-16 h-11 bg-gray-200 right-0 uppercase text-gray-500 font-semibold text-xs px-2 border border-gray-300 rounded-r"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded w-full hover:bg-blue-500"
          >
            Login
          </button>
        </form>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}

export default LoginPage;
