import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

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
      className="relative min-h-screen bg-cover bg-center flex flex-col justify-center items-center text-white px-4"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/images/homebg.jpg')",
      }}
    >

      <Helmet>
        <title>Garden Tracker</title>
      </Helmet>

      <motion.main
        className="relative z-10 text-center max-w-2xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="text-5xl sm:text-6xl font-extrabold mb-6 drop-shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Grow Smarter with Your Garden Tracker 🌿
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl text-gray-200 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Monitor your plants, plan your seasons, and stay ahead with local weather integration.
        </motion.p>

        {loadingUser ? (
          <p className="text-gray-300 animate-pulse text-lg">Checking login status...</p>
        ) : !user ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-xl shadow-lg transition"
                aria-label="Log in to your account"
              >
                Log In
              </motion.button>
            </Link>

            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto bg-white text-green-800 font-semibold py-2 px-6 rounded-xl shadow-lg hover:bg-green-100 transition"
                aria-label="Create a new account"
              >
                Get Started
              </motion.button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div>
              <motion.h2
                className="text-2xl font-bold text-green-100 mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Welcome back, {user.username}! 🌱
              </motion.h2>
            </div>
            <Link to="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto bg-white text-green-800 font-semibold py-2 px-6 rounded-xl shadow-lg hover:bg-green-100 transition"
                aria-label="Go to your dashboard"
              >
                Go to Dashboard
              </motion.button>
            </Link>
          </div>
        )}
      </motion.main>

<footer className="absolute bottom-4 text-gray-400 text-sm">
  © {new Date().getFullYear()} Garden Tracker
</footer>
    </div>
  );
}
