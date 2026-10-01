import { useState } from "react";
import { registerUser } from "../api";

function Signup({ onBackToLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
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
    setMessage("");
    setError("");

    try {
      setLoading(true);

      await registerUser(formData);

      setMessage("Account created! You can now log in.");

      setFormData({
        name: "",
        email: "",
        address: "",
        password: "",
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>RateNest</h1>
      <h2>Create Account</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name</label>
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
          <label>Password</label>
          <br />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            minLength={8}
            maxLength={16}
            pattern="(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}"
            title="Use 8–16 characters, including an uppercase letter and a special character."
            required
          />
        </div>

        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}

      <button onClick={onBackToLogin}>
        Back to Login
      </button>
    </div>
  );
}

export default Signup;