import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import AuthLayout from "../components/AuthLayout";
import Field from "../components/Field";
import { useAuth } from "../hooks/useAuth";
import { loginUser } from "../services/api";
import { HOME_BY_ROLE } from "../utils/roles";

export default function Login() {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={HOME_BY_ROLE[user.role]} replace />;

  const handleChange = (event) =>
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(form.email.trim(), form.password);
      signIn(data.token, data.user);

      const from = location.state?.from;
      navigate(from || HOME_BY_ROLE[data.user.role], { replace: true });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Log in"
      subtitle="Use the email and password for your RateNest account."
      footer={
        <>
          New here? <Link to="/register">Create an account</Link>
        </>
      }
    >
      {location.state?.registered && (
        <Alert kind="success">Account created. Log in to continue.</Alert>
      )}
      <form className="form" onSubmit={handleSubmit} noValidate>
        <Field
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <Field
          label="Password"
          type="password"
          name="password"
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <Alert>{error}</Alert>
        <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>
    </AuthLayout>
  );
}
