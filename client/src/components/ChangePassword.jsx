import { useState } from "react";
import { changePassword } from "../api";

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      setLoading(true);

      await changePassword(currentPassword, newPassword);

      setMessage("Password changed successfully.");

      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h3>Change Password</h3>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Current Password</label>
          <br />
          <input
            type="password"
            value={currentPassword}
            onChange={(event) =>
              setCurrentPassword(event.target.value)
            }
            required
          />
        </div>

        <br />

        <div>
          <label>New Password</label>
          <br />
          <input
            type="password"
            value={newPassword}
            onChange={(event) =>
              setNewPassword(event.target.value)
            }
            minLength={8}
            maxLength={16}
            pattern="(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}"
            title="Use 8–16 characters, including an uppercase letter and a special character."
            required
          />
        </div>

        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Change Password"}
        </button>
      </form>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </section>
  );
}

export default ChangePassword;