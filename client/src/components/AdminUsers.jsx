import { useState } from "react";
import {
  getAdminUsers,
  getAdminUserById,
} from "../api";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
  });
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminUsers({
        ...filters,
        sortBy,
        order,
      });

      setUsers(data.data);
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

  const handleViewDetails = async (userId) => {
    try {
      setDetailsLoading(true);
      setDetailsError("");

      const data = await getAdminUserById(userId);

      setSelectedUser(data.data);
    } catch (error) {
      setDetailsError(error.message);
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <div>
      <h2>Users</h2>

      <div>
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

        <select
          name="role"
          value={filters.role}
          onChange={handleFilterChange}
        >
          <option value="">All roles</option>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
          <option value="STORE_OWNER">Store Owner</option>
        </select>

        <button onClick={loadUsers}>
          Search
        </button>
      </div>

      <hr />

      {loading && <p>Loading users...</p>}

      {error && <p>{error}</p>}

      {hasLoaded && users.length === 0 && (
        <p>No users found.</p>
      )}

      {hasLoaded && users.length > 0 && (
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
                <button onClick={() => handleSort("role")}>
                  Role
                </button>
              </th>

              <th>Store</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.address}</td>
                <td>{user.role}</td>

                <td>
                  {user.role === "STORE_OWNER"
                    ? user.store_name || "No store"
                    : "-"}
                </td>

                <td>
                  <button
                    onClick={() =>
                      handleViewDetails(user.id)
                    }
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {detailsLoading && <p>Loading user details...</p>}

      {detailsError && <p>{detailsError}</p>}

      {selectedUser && (
        <div>
          <hr />

          <h3>User Details</h3>

          <p>
            <strong>Name:</strong> {selectedUser.name}
          </p>

          <p>
            <strong>Email:</strong> {selectedUser.email}
          </p>

          <p>
            <strong>Address:</strong> {selectedUser.address}
          </p>

          <p>
            <strong>Role:</strong> {selectedUser.role}
          </p>

          {selectedUser.role === "STORE_OWNER" && (
            <>
              <p>
                <strong>Store:</strong>{" "}
                {selectedUser.store_name || "No store"}
              </p>

              <p>
                <strong>Store Rating:</strong>{" "}
                {selectedUser.store_rating}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
