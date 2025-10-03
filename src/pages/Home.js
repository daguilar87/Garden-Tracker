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
      className="min-h-screen bg-cover bg-center flex flex-col justify-center items-center text-white px-4"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/images/homebg.jpg')`,
        backgroundColor: "#1a202c",
      }}
    >
      <Helmet>
        <title>Garden Tracker</title>
      </Helmet>

      <motion.div
        className="text-center max-w-2xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 drop-shadow-md">
          Grow Smarter with Your Garden Tracker 🌿
        </h1>

        <p className="text-lg sm:text-xl text-gray-200 mb-6">
          Monitor your plants, plan your seasons, and stay ahead with local weather integration.
        </p>

        {loadingUser ? (
          <p className="text-gray-300 animate-pulse text-lg">Checking login status...</p>
        ) : !user ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/login">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-xl shadow-lg transition"
                aria-label="Log in to your account"
              >
                Log In
              </motion.button>
            </Link>
            <Link to="/register">
              <motion.button
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
              <h2 className="text-2xl font-bold text-green-100 mb-2">
                Welcome back, {user.username}! 🌱
              </h2>
{/* <p className="text-sm text-gray-300 italic mb-4">
  You're in USDA Zone 8b – perfect time to plant tomatoes! 🍅
</p> */}

            </div>
            <Link to="/dashboard">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto bg-white text-green-800 font-semibold py-2 px-6 rounded-xl shadow-lg hover:bg-green-100 transition"
                aria-label="Go to your dashboard"
              >
                Go to Dashboard
              </motion.button>
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
