import { useState } from "react";
import Login from "./components/Login";
import UserDashboard from "./components/UserDashboard";

function App() {
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
    return <Login onLogin={handleLogin} />;
  }

  if (user.role === "USER") {
    return (
      <UserDashboard
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