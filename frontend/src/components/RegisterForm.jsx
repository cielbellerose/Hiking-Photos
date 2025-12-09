import { useNavigate } from "react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import styles from "../css/LoginForm.module.css";
import Server from "../modules/ServerConnector.js";

export default function RegisterForm({ onLoginSelection }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmitForm = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const data = await Server.signupUser(username, password);

      toast.success("Account created successfully!");
      console.log("Signup successful", data);

      setUsername("");
      setPassword("");

      navigate("/");
    } catch (error) {
      toast.error("Error signing up");
      console.error("Signup error:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>New User</h2>
        <form className={styles.form} onSubmit={handleSubmitForm}>
          <input
            type="text"
            placeholder="Username"
            className={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            required
          />
          <input
            type="submit"
            className={styles.submitButton}
            value={loading ? "Creating Account..." : "Register"}
            disabled={loading}
          />
        </form>
        <div>
          <button
            className={styles.switchButton}
            onClick={onLoginSelection}
            disabled={loading}
          >
            Go to Login
          </button>
        </div>
      </div>
    </>
  );
}
