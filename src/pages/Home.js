import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Check for logged in user
  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (token && username) {
      setUser({ token, username });
    }

    setLoadingUser(false);
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col justify-center items-center text-white px-4"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/images/homebg.jpg')`,
      }}
    >
      <motion.div
        className="text-center max-w-2xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 drop-shadow-md">
          Grow Smarter with Your Garden Tracker 🌿
        </h1>
        <p className="text-lg sm:text-xl text-gray-200 mb-8">
          Monitor your plants, plan your seasons, and stay ahead with local weather integration.
        </p>

        {!loadingUser && !user ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-xl shadow-lg transition">
                Log In
              </button>
            </Link>
            <Link to="/register">
              <button className="bg-white text-green-800 font-semibold py-2 px-6 rounded-xl shadow-lg hover:bg-green-100 transition">
                Get Started
              </button>
            </Link>
          </div>
        ) : null}

        {user && (
          <div className="flex flex-col gap-4 justify-center">
            <h2 className="text-2xl font-bold text-green-100 mb-2">
              Welcome back, {user.username}! 🌱
            </h2>
            <Link to="/dashboard">
              <button className="bg-white text-green-800 font-semibold py-2 px-6 rounded-xl shadow-lg hover:bg-green-100 transition">
                Go to Dashboard
              </button>
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
