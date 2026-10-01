import { useEffect, useState } from "react";
import { createAdminStore, getStoreOwners } from "../api";

function AddStoreForm({ onStoreCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: "",
  });

  const [owners, setOwners] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadOwners = async () => {
      try {
        const data = await getStoreOwners();
        setOwners(data.data);
      } catch (error) {
        setError(error.message);
      }
    };

    loadOwners();
  }, []);

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

      await createAdminStore({
        ...formData,
        ownerId: formData.ownerId
          ? Number(formData.ownerId)
          : null,
      });

      setMessage("Store created successfully.");

      setFormData({
        name: "",
        email: "",
        address: "",
        ownerId: "",
      });

      onStoreCreated();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Add Store</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Store Name</label>
          <br />
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            minLength={20}
            maxLength={60}
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
          <label>Address</label>
          <br />
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            maxLength={400}
            required
          />
        </div>

        <br />

        <div>
          <label>Store Owner</label>
          <br />

          <select
            name="ownerId"
            value={formData.ownerId}
            onChange={handleChange}
          >
            <option value="">No owner</option>

            {owners.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {owner.name} — {owner.email}
              </option>
            ))}
          </select>
        </div>

        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Store"}
        </button>
      </form>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </div>
  );
}

export default AddStoreForm;