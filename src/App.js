import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Garden from "./pages/Garden";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import { refreshAccessToken, isTokenExpired } from "./services/authUtils";


function AppWrapper({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      const publicRoutes = ["/", "/login", "/register"];
      const currentPath = window.location.pathname;

     
      if (publicRoutes.includes(currentPath)) {
        return;
      }

      const token = localStorage.getItem("token");

      if (!token || isTokenExpired(token)) {
        const newToken = await refreshAccessToken();
        if (!newToken) {
          localStorage.clear();
          navigate("/login");
        }
      }
    };

    initializeAuth();
  }, [navigate]);

  return <>{children}</>;
}


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/garden"
          element={
            <ProtectedRoute>
              <Garden />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}


export default function AppWithAuth() {
  return (
    <AppWrapper>
      <App />
    </AppWrapper>
  );
}
