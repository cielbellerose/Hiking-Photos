import { useState } from "react";
import styles from "../css/ProfileForm.module.css";
import toast from "react-hot-toast";
import Server from "../modules/ServerConnector.js";

export default function EditProfileForm({
  currentUsername,
  onClose,
  onUpdate,
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!username.trim() && !password.trim()) {
      toast.error("Please enter a new username or password");
      setLoading(false);
      return;
    }

    try {
      const data = await Server.updateProfile(username, password);
      toast.success("Profile updated successfully!");
      onUpdate(data.username);
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>Edit Profile</h2>
      <p className={styles.text}>Current username: {currentUsername}</p>

      <input
        type="text"
        placeholder="Update username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className={styles.input}
      />

      <input
        type="password"
        placeholder="Update password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={styles.input}
      />

      <div className={styles.buttonGroup}>
        <button type="submit" className="accent-button">
          {loading ? "Updating..." : "Update Profile"}
        </button>
        <button className="secondary-button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
}
