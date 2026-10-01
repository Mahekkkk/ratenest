import { useState } from "react";
import Alert from "../../components/Alert";
import Field from "../../components/Field";
import { createAdminUser } from "../../services/api";
import {
  hasErrors,
  validateAddress,
  validateEmail,
  validateName,
  validatePassword,
} from "../../utils/validation";

const VALIDATORS = {
  name: (value) => validateName(value, "Name"),
  email: validateEmail,
  address: validateAddress,
  password: validatePassword,
};

export default function AddUserForm({ onCreated }) {
  const [form, setForm] = useState({ name: "", email: "", address: "", password: "", role: "USER" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    if (errors[name]) setErrors((previous) => ({ ...previous, [name]: "" }));
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    if (VALIDATORS[name]) setErrors((previous) => ({ ...previous, [name]: VALIDATORS[name](value) }));
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
      await createAdminUser({
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
      });
      onCreated();
    } catch (err) {
      setServerError(err.message);
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <Field label="Full name" name="name" value={form.name} onChange={handleChange} onBlur={handleBlur} error={errors.name} hint="20 to 60 characters." maxLength={60} />
      <Field label="Email" type="email" name="email" value={form.email} onChange={handleChange} onBlur={handleBlur} error={errors.email} />
      <Field as="textarea" label="Address" name="address" value={form.address} onChange={handleChange} onBlur={handleBlur} error={errors.address} maxLength={400} />
      <div className="form-row">
        <Field
          label="Password"
          type="password"
          name="password"
          autoComplete="new-password"
          value={form.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.password}
          hint="8 to 16 characters, one uppercase, one special."
          maxLength={16}
        />
        <Field as="select" label="Role" name="role" value={form.role} onChange={handleChange}>
          <option value="USER">User</option>
          <option value="STORE_OWNER">Store owner</option>
          <option value="ADMIN">Administrator</option>
        </Field>
      </div>
      <Alert>{serverError}</Alert>
      <div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Creating…" : "Create user"}
        </button>
      </div>
    </form>
  );
}
