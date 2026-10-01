import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { HOME_BY_ROLE } from "../utils/roles";
import { ROLE_LABELS } from "../utils/validation";

const NAV_BY_ROLE = {
  ADMIN: [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/stores", label: "Stores" },
  ],
  USER: [
    { to: "/stores", label: "Stores" },
    { to: "/change-password", label: "Password" },
  ],
  STORE_OWNER: [
    { to: "/owner/dashboard", label: "My store" },
    { to: "/change-password", label: "Password" },
  ],
};

export default function AppShell() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="topbar">
        <div className="topbar-inner">
          <NavLink to={HOME_BY_ROLE[user.role]} className="brand">
            <img src="/favicon.svg" alt="" width="24" height="24" />
            RateNest
          </NavLink>

          <nav aria-label="Main" className="nav">
            {NAV_BY_ROLE[user.role].map((item) => (
              <NavLink key={item.to} to={item.to} className="nav-link">
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="topbar-user">
            <div className="who">
              <span className="who-name">{user.name}</span>
              <span className="who-role">{ROLE_LABELS[user.role]}</span>
            </div>
            <button type="button" className="btn btn-ghost btn-sm" onClick={handleSignOut}>
              Log out
            </button>
          </div>
        </div>
      </header>

      <main id="main" className="container">
        <Outlet />
      </main>
    </>
  );
}
