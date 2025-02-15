import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ManagerDashboard from "./pages/ManagerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";

function AppContent() {
  const [user, setUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:8080/api/user/getProfile", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setUser(res.data);
          setSelectedRole(res.data.roleList?.[0] || "USER"); // Default role is USER
        })
        .catch(() => setUser(null));
    }
  }, []);

  // This effect handles navigation when the selectedRole changes
  useEffect(() => {
    if (user) {
      if (selectedRole === "MANAGER") {
        navigate("/dashboard");
      } else if (selectedRole === "ADMIN") {
        navigate("/admin-dashboard");
      } else {
        navigate("/profile");
      }
    }
  }, [selectedRole, user, navigate]);

  return (
    <>
      <Navbar 
        user={user} 
        setUser={setUser} 
        selectedRole={selectedRole} 
        setSelectedRole={setSelectedRole} 
      />

      <div>
        <Routes>
          <Route 
            path="/" 
            element={!user ? <Login setUser={setUser} /> : <Navigate to="/profile" />} 
          />
          <Route 
            path="/dashboard" 
            element={selectedRole === "MANAGER" ? <ManagerDashboard user={user} /> : <Navigate to="/profile" />} 
          />
          <Route 
            path="/admin-dashboard" 
            element={selectedRole === "ADMIN" ? <AdminDashboard user={user} /> : <Navigate to="/profile" />} 
          />
          <Route 
            path="/profile" 
            element={user ? <Profile user={user} /> : <Navigate to="/" />} 
          />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
