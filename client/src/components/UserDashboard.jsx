import { useState } from "react";
import {
    getStores,
    submitRating,
    updateRating,
  } from "../api";
  import ChangePassword from "./ChangePassword";

function UserDashboard({ user, onLogout }) {
  const [stores, setStores] = useState([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [ratingValues, setRatingValues] = useState({});
const [ratingError, setRatingError] = useState("");

  const loadStores = async (filters = {}) => {
    try {
      setLoading(true);
      setError("");

      const data = await getStores(filters);
      setStores(data.data);
      setHasLoaded(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();

    loadStores({
      name,
      address,
    });
  };
  const handleRating = async (storeId, existingRating) => {
    const rating = Number(ratingValues[storeId]);
  
    if (!rating || rating < 1 || rating > 5) {
      setRatingError("Please select a rating from 1 to 5.");
      return;
    }
  
    try {
      setRatingError("");
  
      if (existingRating) {
        await updateRating(storeId, rating);
      } else {
        await submitRating(storeId, rating);
      }
  
      await loadStores({
        name,
        address,
      });
  
      setRatingValues((previous) => ({
        ...previous,
        [storeId]: "",
      }));
    } catch (error) {
      setRatingError(error.message);
    }
  };

  return (
    <div>
      <h1>RateNest</h1>

      <h2>Welcome, {user.name}</h2>

      <button onClick={onLogout}>Logout</button>
      <ChangePassword />

      <hr />

      <h3>Find Stores</h3>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by store name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <input
          type="text"
          placeholder="Search by address"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
        />

        <button type="submit">Search</button>
      </form>

      <button onClick={() => loadStores()}>
        Load Stores
      </button>

      <hr />

      {loading && <p>Loading stores...</p>}

      {error && <p>{error}</p>}

      {!loading && hasLoaded && stores.length === 0 && (
        <p>No stores found.</p>
      )}
      {ratingError && <p>{ratingError}</p>}

      {!loading &&
        stores.map((store) => (
          <div key={store.id}>
            <h3>{store.name}</h3>

            <p>
              <strong>Address:</strong> {store.address}
            </p>

            <p>
              <strong>Overall Rating:</strong>{" "}
              {store.overall_rating}
            </p>

            <p>
              <strong>Your Rating:</strong>{" "}
              {store.user_rating ?? "Not rated yet"}
            </p>

            <select
  value={ratingValues[store.id] || ""}
  onChange={(event) =>
    setRatingValues((previous) => ({
      ...previous,
      [store.id]: event.target.value,
    }))
  }
>
  <option value="">Select rating</option>
  <option value="1">1 ⭐</option>
  <option value="2">2 ⭐</option>
  <option value="3">3 ⭐</option>
  <option value="4">4 ⭐</option>
  <option value="5">5 ⭐</option>
</select>

<button
  onClick={() =>
    handleRating(store.id, store.user_rating)
  }
>
  {store.user_rating ? "Update Rating" : "Submit Rating"}
</button>

            <hr />
          </div>
        ))}
    </div>
  );
}


export default UserDashboard;