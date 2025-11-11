// components/EditProfileForm.jsx
import { useState } from "react";
import styles from "../css/ProfileForm.module.css";
import toast from "react-hot-toast";
import Server from "../modules/ServerConnector.js"

export default function EditProfileForm({
  currentUsername,
  onClose,
  onUpdate,
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() && !password.trim()) {
      toast.error("Please enter a new username or password");
      return;
    }

    try {
      const response = await fetch(Server.serverName + "/api/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Profile updated successfully!");
        onUpdate(data.username);
        onClose();
      } else {
        toast.error(data.error || "Failed to update profile");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
      console.error("Error updating profile:", err);
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
        <button type="submit" className={styles.submitButton}>
          {"Update Profile"}
        </button>
        <button type="button" onClick={onClose} className={styles.cancelButton}>
          Cancel
        </button>
      </div>
    </form>
  );
}
