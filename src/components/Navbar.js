import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-green-100 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
       
        <Link to="/" className="text-xl font-bold text-green-900">
          🌱 Garden Tracker
        </Link>

        <ul className="hidden md:flex gap-6 items-center">
          <li>
            <Link
              to="/"
              className="text-green-800 font-semibold hover:text-green-600 transition"
            >
              Home
            </Link>
          </li>
          {token ? (
            <>
              <li>
                <Link
                  to="/dashboard"
                  className="text-green-800 font-semibold hover:text-green-600 transition"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/garden"
                  className="text-green-800 font-semibold hover:text-green-600 transition"
                >
                  Garden
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  className="text-green-800 font-semibold hover:text-green-600 transition"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-green-800 font-semibold hover:text-green-600 transition"
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>

     
        <button
          className="md:hidden text-green-800"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

     
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden bg-green-50 border-t border-green-200 shadow-md"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <ul className="flex flex-col gap-4 p-4">
              <li>
                <Link
                  to="/"
                  className="block text-green-800 font-semibold hover:text-green-600 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              {token ? (
                <>
                  <li>
                    <Link
                      to="/dashboard"
                      className="block text-green-800 font-semibold hover:text-green-600 transition"
                      onClick={() => setMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/garden"
                      className="block text-green-800 font-semibold hover:text-green-600 transition"
                      onClick={() => setMenuOpen(false)}
                    >
                      Garden
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/login"
                      className="block text-green-800 font-semibold hover:text-green-600 transition"
                      onClick={() => setMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="block text-green-800 font-semibold hover:text-green-600 transition"
                      onClick={() => setMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
