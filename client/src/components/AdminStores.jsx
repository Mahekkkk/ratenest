import { useState } from "react";
import { getAdminStores } from "../api";

function AdminStores() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
  });
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadStores = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminStores({
        ...filters,
        sortBy,
        order,
      });

      setStores(data.data);
      setHasLoaded(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder((previous) =>
        previous === "asc" ? "desc" : "asc"
      );
    } else {
      setSortBy(field);
      setOrder("asc");
    }
  };

  return (
    <div>
      <h2>Stores</h2>

      <input
        name="name"
        placeholder="Search by name"
        value={filters.name}
        onChange={handleFilterChange}
      />

      <input
        name="email"
        placeholder="Search by email"
        value={filters.email}
        onChange={handleFilterChange}
      />

      <input
        name="address"
        placeholder="Search by address"
        value={filters.address}
        onChange={handleFilterChange}
      />

      <button onClick={loadStores}>Search</button>

      <hr />

      {loading && <p>Loading stores...</p>}

      {error && <p>{error}</p>}

      {hasLoaded && stores.length === 0 && (
        <p>No stores found.</p>
      )}

      {hasLoaded && stores.length > 0 && (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>
                <button onClick={() => handleSort("name")}>
                  Name
                </button>
              </th>

              <th>
                <button onClick={() => handleSort("email")}>
                  Email
                </button>
              </th>

              <th>
                <button onClick={() => handleSort("address")}>
                  Address
                </button>
              </th>

              <th>
                <button onClick={() => handleSort("rating")}>
                  Rating
                </button>
              </th>
            </tr>
          </thead>

          <tbody>
            {stores.map((store) => (
              <tr key={store.id}>
                <td>{store.name}</td>
                <td>{store.email}</td>
                <td>{store.address}</td>
                <td>{store.overall_rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminStores;