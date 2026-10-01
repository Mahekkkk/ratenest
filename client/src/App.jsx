import { useState } from "react";
import Login from "./components/Login";
import UserDashboard from "./components/UserDashboard";
import OwnerDashboard from "./components/OwnerDashboard";
import AdminDashboard from "./components/AdminDashboard";
import Signup from "./components/Signup";

function App() {
  const [showSignup, setShowSignup] = useState(false);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (!user) {
    if (showSignup) {
      return (
        <Signup
          onBackToLogin={() => setShowSignup(false)}
        />
      );
    }
  
    return (
      <Login
        onLogin={handleLogin}
        onShowSignup={() => setShowSignup(true)}
      />
    );
  }

  if (user.role === "USER") {
    return (
      <UserDashboard
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  if (user.role === "STORE_OWNER") {
    return (
      <OwnerDashboard
        user={user}
        onLogout={handleLogout}
      />
    );
  }
  if (user.role === "ADMIN") {
    return (
      <AdminDashboard
        user={user}
        onLogout={handleLogout}
      />
    );
  }
  
  return (
    <div>
      <h1>RateNest</h1>
      <p>Role: {user.role}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default App;