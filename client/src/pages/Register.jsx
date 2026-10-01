import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import AuthLayout from "../components/AuthLayout";
import Field from "../components/Field";
import { useAuth } from "../hooks/useAuth";
import { registerUser } from "../services/api";
import { HOME_BY_ROLE } from "../utils/roles";
import {
  hasErrors,
  validateAddress,
  validateEmail,
  validateName,
  validatePassword,
} from "../utils/validation";

const VALIDATORS = {
  name: (value) => validateName(value, "Name"),
  email: validateEmail,
  address: validateAddress,
  password: validatePassword,
};

export default function Register() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", address: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={HOME_BY_ROLE[user.role]} replace />;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    if (errors[name]) setErrors((previous) => ({ ...previous, [name]: "" }));
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setErrors((previous) => ({ ...previous, [name]: VALIDATORS[name](value) }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError("");

    const nextErrors = Object.fromEntries(
      Object.keys(VALIDATORS).map((key) => [key, VALIDATORS[key](form[key])]),
    );
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    setLoading(true);

    try {
      await registerUser({
        name: form.name.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        password: form.password,
      });
      navigate("/login", { replace: true, state: { registered: true } });
    } catch (err) {
      setServerError(err.message);
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Normal user accounts only. Store owners and administrators are added by an administrator."
      footer={
        <>
          Already registered? <Link to="/login">Log in</Link>
        </>
      }
    >
      <form className="form" onSubmit={handleSubmit} noValidate>
        <Field
          label="Full name"
          name="name"
          autoComplete="name"
          value={form.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.name}
          hint="20 to 60 characters."
          maxLength={60}
        />
        <Field
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email}
        />
        <Field
          as="textarea"
          label="Address"
          name="address"
          autoComplete="street-address"
          value={form.address}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.address}
          hint="Up to 400 characters."
          maxLength={400}
        />
        <Field
          label="Password"
          type="password"
          name="password"
          autoComplete="new-password"
          value={form.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.password}
          hint="8 to 16 characters with one uppercase letter and one special character."
          maxLength={16}
        />
        <Alert>{serverError}</Alert>
        <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
}
