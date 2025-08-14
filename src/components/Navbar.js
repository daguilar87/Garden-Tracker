import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Home, LogIn, UserPlus, Grid, Leaf, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems = [
    { label: "Home", to: "/", icon: <Home size={20} /> },
    ...(token
      ? [
          { label: "Dashboard", to: "/dashboard", icon: <Grid size={20} /> },
          { label: "Garden", to: "/garden", icon: <Leaf size={20} /> },
          { label: "Logout", onClick: handleLogout, icon: <LogOut size={20} /> },
        ]
      : [
          { label: "Login", to: "/login", icon: <LogIn size={20} /> },
          { label: "Register", to: "/register", icon: <UserPlus size={20} /> },
        ]),
  ];

  return (
    <nav className="sticky top-0 z-50 bg-green-100 shadow-md">
      <div className="w-full px-4 py-3 flex justify-between items-center">
        
                <Link to="/" className="text-xl font-bold text-green-900 flex items-center gap-2">
          🌱 Garden Tracker
        </Link>

     
        <div className="flex items-center">
          <ul className="hidden md:flex gap-6 items-center">
            {menuItems.map((item) =>
              item.to ? (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="flex items-center gap-1 text-green-800 font-semibold hover:text-green-600 transition"
                  >
                    {item.icon} {item.label}
                  </Link>
                </li>
              ) : (
                <li key={item.label}>
                  <button
                    onClick={item.onClick}
                    className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    {item.icon} {item.label}
                  </button>
                </li>
              )
            )}
          </ul>

          <button
            className="md:hidden text-green-800 ml-4"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
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
              {menuItems.map((item) =>
                item.to ? (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="flex items-center gap-1 text-green-800 font-semibold hover:text-green-600 transition"
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.icon} {item.label}
                    </Link>
                  </li>
                ) : (
                  <li key={item.label}>
                    <button
                      onClick={() => {
                        item.onClick();
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      {item.icon} {item.label}
                    </button>
                  </li>
                )
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
