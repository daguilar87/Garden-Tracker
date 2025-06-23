import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PlantCard from "../components/PlantCard";

export default function Home() {
  const [user, setUser] = useState(null);
  const [samplePlants, setSamplePlants] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true); // ✅ add loading

  // Check for logged in user
  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (token && username) {
      setUser({ token, username });
    }

    setLoadingUser(false); // ✅ mark as finished
  }, []);

  // Fetch plants if logged in
  useEffect(() => {
    if (user) {
      fetch("/api/plants", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setSamplePlants(data))
        .catch((err) => console.error("Error fetching plants:", err));
    }
  }, [user]);

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

        {/* ✅ Fix: Only show login/register if loading is done */}
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
          <>
            <div className="flex justify-center mb-6">
              <Link to="/dashboard">
                <button className="bg-white text-green-800 font-semibold py-2 px-6 rounded-xl shadow-lg hover:bg-green-100 transition">
                  Go to Dashboard
                </button>
              </Link>
            </div>

            <motion.div
              className="w-full max-w-4xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <h2 className="text-2xl font-bold text-green-100 mb-4">
                Welcome back, {user.username}! 🌱
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {samplePlants.slice(0, 6).map((plant) => (
                  <PlantCard key={plant.id} plant={plant} />
                ))}
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}
