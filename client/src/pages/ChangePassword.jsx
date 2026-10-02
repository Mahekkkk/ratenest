import { useState } from "react";
import Alert from "../components/Alert";
import Field from "../components/Field";
import PageHeader from "../components/PageHeader";
import { useToast } from "../hooks/useToast";
import { changePassword } from "../services/api";
import { validatePassword } from "../utils/validation";

const EMPTY = { currentPassword: "", newPassword: "" };

export default function ChangePassword() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const { notify } = useToast();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: "" }));
    setDone(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError("");
    setDone(false);

    const nextErrors = {
      currentPassword: form.currentPassword ? "" : "Enter your current password.",
      newPassword: validatePassword(form.newPassword),
    };

    if (!nextErrors.newPassword && form.newPassword === form.currentPassword) {
      nextErrors.newPassword = "New password must differ from the current one.";
    }

    setErrors(nextErrors);
    if (nextErrors.currentPassword || nextErrors.newPassword) return;

    setLoading(true);

    try {
      await changePassword(form.currentPassword, form.newPassword);
      setForm(EMPTY);
      setDone(true);
      notify("Password updated.");
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader title="Change password" description="Choose a new password for your account." />
      <form className="panel panel-narrow form" onSubmit={handleSubmit} noValidate>
        <Field
          label="Current password"
          type="password"
          name="currentPassword"
          autoComplete="current-password"
          value={form.currentPassword}
          onChange={handleChange}
          error={errors.currentPassword}
        />
        <Field
          label="New password"
          type="password"
          name="newPassword"
          autoComplete="new-password"
          value={form.newPassword}
          onChange={handleChange}
          error={errors.newPassword}
          hint="8 to 16 characters with one uppercase letter and one special character."
          maxLength={16}
        />
        <Alert>{serverError}</Alert>
        {done && <Alert kind="success">Password updated.</Alert>}
        <div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Saving…" : "Update password"}
          </button>
        </div>
      </form>
    </>
  );
}
