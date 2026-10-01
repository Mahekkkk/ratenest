import { useState } from "react";
import Alert from "../../components/Alert";
import Field from "../../components/Field";
import { useAsync } from "../../hooks/useAsync";
import { createAdminStore, getStoreOwners } from "../../services/api";
import { hasErrors, validateAddress, validateEmail, validateName } from "../../utils/validation";

const VALIDATORS = {
  name: (value) => validateName(value, "Store name"),
  email: validateEmail,
  address: validateAddress,
};

export default function AddStoreForm({ onCreated }) {
  const [form, setForm] = useState({ name: "", email: "", address: "", ownerId: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: owners, error: ownersError } = useAsync(getStoreOwners);

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
      await createAdminStore({
        name: form.name.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        ownerId: form.ownerId ? Number(form.ownerId) : null,
      });
      onCreated();
    } catch (err) {
      setServerError(err.message);
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <Field label="Store name" name="name" value={form.name} onChange={handleChange} onBlur={handleBlur} error={errors.name} hint="20 to 60 characters." maxLength={60} />
      <Field label="Store email" type="email" name="email" value={form.email} onChange={handleChange} onBlur={handleBlur} error={errors.email} />
      <Field as="textarea" label="Address" name="address" value={form.address} onChange={handleChange} onBlur={handleBlur} error={errors.address} maxLength={400} />
      <Field
        as="select"
        label="Store owner"
        name="ownerId"
        value={form.ownerId}
        onChange={handleChange}
        hint="Only users with the store owner role can be linked."
      >
        <option value="">No owner</option>
        {(owners?.data || []).map((owner) => (
          <option key={owner.id} value={owner.id}>
            {owner.name} ({owner.email})
          </option>
        ))}
      </Field>
      <Alert>{ownersError || serverError}</Alert>
      <div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Creating…" : "Create store"}
        </button>
      </div>
    </form>
  );
}
