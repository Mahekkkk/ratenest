import { useState } from "react";
import { getOwnerDashboard } from "../api";

function OwnerDashboard({ user, onLogout }) {
  const [stores, setStores] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getOwnerDashboard();

      setStores(data.data.stores);
      setRatings(data.data.ratings);
      setHasLoaded(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>RateNest</h1>

      <h2>Store Owner Dashboard</h2>

      <p>Welcome, {user.name}</p>

      <button onClick={onLogout}>Logout</button>

      <hr />

      <button onClick={loadDashboard}>
        Load Dashboard
      </button>

      {loading && <p>Loading dashboard...</p>}

      {error && <p>{error}</p>}

      {hasLoaded && (
        <>
          <h3>Your Stores</h3>

          {stores.length === 0 ? (
            <p>No stores assigned to you.</p>
          ) : (
            stores.map((store) => (
              <div key={store.id}>
                <h4>{store.name}</h4>

                <p>
                  <strong>Address:</strong> {store.address}
                </p>

                <p>
                  <strong>Average Rating:</strong>{" "}
                  {store.average_rating}
                </p>

                <hr />
              </div>
            ))
          )}

          <h3>Users Who Rated Your Store</h3>

          {ratings.length === 0 ? (
            <p>No ratings yet.</p>
          ) : (
            ratings.map((rating) => (
              <div key={`${rating.store_id}-${rating.user_id}-${rating.created_at}`}>
                <p>
                  <strong>Store:</strong> {rating.store_name}
                </p>

                <p>
                  <strong>User:</strong> {rating.user_name}
                </p>

                <p>
                  <strong>Email:</strong> {rating.user_email}
                </p>

                <p>
                  <strong>Rating:</strong> {rating.rating} ⭐
                </p>

                <hr />
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}

export default OwnerDashboard;