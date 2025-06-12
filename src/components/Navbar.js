import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="p-4 bg-green-100 shadow-md">
      <ul className="flex gap-4 items-center list-none">
        {token ? (
          <>
            <li>
              <Link to="/dashboard" className="text-green-800 font-semibold">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/garden" className="text-green-800 font-semibold">
                Garden
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="text-red-600 font-bold hover:underline"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" className="text-green-800 font-semibold">
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="text-green-800 font-semibold">
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
