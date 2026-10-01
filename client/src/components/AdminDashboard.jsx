import { useState } from "react";
import { getAdminDashboard } from "../api";
import AdminUsers from "./AdminUsers";
import AddUserForm from "./AddUserForm";
import AdminStores from "./AdminStores";
import AddStoreForm from "./AddStoreForm";
import ChangePassword from "./ChangePassword";

function AdminDashboard({ user, onLogout }) {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminDashboard();

      setDashboard(data.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>RateNest</h1>

      <h2>Admin Dashboard</h2>

      <p>Welcome, {user.name}</p>

      <button onClick={onLogout}>Logout</button>
      <hr />

<ChangePassword />

      <hr />

      <button onClick={loadDashboard}>
        Load Dashboard
      </button>

      {loading && <p>Loading dashboard...</p>}

      {error && <p>{error}</p>}

      {dashboard && (
        <>
          <h3>Total Users</h3>
          <p>{dashboard.totalUsers}</p>

          <h3>Total Stores</h3>
          <p>{dashboard.totalStores}</p>

          <h3>Total Ratings</h3>
          <p>{dashboard.totalRatings}</p>
        </>
      )}
     <AddUserForm
  onUserCreated={() => {
    window.location.reload();
  }}
/>

<hr />

<AdminUsers />

<hr />

<AddStoreForm
  onStoreCreated={() => {
    window.location.reload();
  }}
/>

<hr />

<AdminStores />
    </div>
    
  );
}

export default AdminDashboard;