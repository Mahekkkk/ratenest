import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { HOME_BY_ROLE } from "../utils/roles";

/** Only renders children for the listed roles. Others go to their own home. */
export default function RoleRoute({ roles }) {
  const { user } = useAuth();

  if (!roles.includes(user.role)) {
    return <Navigate to={HOME_BY_ROLE[user.role] || "/login"} replace />;
  }

  return <Outlet />;
}
