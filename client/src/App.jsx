import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import { useAuth } from "./hooks/useAuth";
import { HOME_BY_ROLE } from "./utils/roles";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ChangePassword from "./pages/ChangePassword";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminUserDetails from "./pages/admin/UserDetails";
import AdminStores from "./pages/admin/Stores";
import UserStores from "./pages/user/Stores";
import OwnerDashboard from "./pages/owner/Dashboard";

function Home() {
  const { user } = useAuth();
  return <Navigate to={user ? HOME_BY_ROLE[user.role] : "/login"} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route element={<RoleRoute roles={["ADMIN"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/users/:id" element={<AdminUserDetails />} />
            <Route path="/admin/stores" element={<AdminStores />} />
          </Route>

          <Route element={<RoleRoute roles={["USER"]} />}>
            <Route path="/stores" element={<UserStores />} />
          </Route>

          <Route element={<RoleRoute roles={["STORE_OWNER"]} />}>
            <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          </Route>

          <Route element={<RoleRoute roles={["USER", "STORE_OWNER"]} />}>
            <Route path="/change-password" element={<ChangePassword />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Home />} />
    </Routes>
  );
}
