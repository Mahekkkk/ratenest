import { useState } from "react";
import { createAdminUser } from "../api";

function AddUserForm({ onUserCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "USER",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage("");
      setError("");

      await createAdminUser(formData);

      setMessage("User created successfully.");

      setFormData({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "USER",
      });

      onUserCreated();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Add User</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <br />
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Password</label>
          <br />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Address</label>
          <br />
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Role</label>
          <br />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="USER">Normal User</option>
            <option value="ADMIN">Admin</option>
            <option value="STORE_OWNER">Store Owner</option>
          </select>
        </div>

        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create User"}
        </button>
      </form>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </div>
  );
}

export default AddUserForm;