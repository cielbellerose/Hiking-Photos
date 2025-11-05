import { useNavigate } from "react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import styles from "../css/LoginForm.module.css";

export default function LoginForm({ onSignupSelection }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // For changing page after login

  const handleSubmitForm = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || "Login failed");
        setLoading(false);
        return;
      }
      toast.success("Login successful!");
      console.log("Login successful", data);
      navigate("/"); // Bring to edit trail landing page after successful login
    } catch (error) {
      toast.error("Error logging in");
      console.error("Login error:", error);
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Login</h2>

        <form className={styles.form} onSubmit={handleSubmitForm}>
          <input
            type="text"
            placeholder="Username"
            className={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="submit"
            className={styles.submitButton}
            value={loading ? "Loading" : "Login"}
          />
        </form>

        <div>
          <button className={styles.switchButton} onClick={onSignupSelection}>
            Sign Up
          </button>
        </div>
      </div>
    </>
  );
}
