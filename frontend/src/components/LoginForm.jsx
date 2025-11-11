import { useNavigate } from "react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import styles from "../css/LoginForm.module.css";
import Server from "../modules/ServerConnector.js"

export default function LoginForm({ onSignupSelection }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // for switching page after login

  const handleSubmitForm = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      console.log("Sending login request to:", "/api/login");

      const res = await fetch(Server.serverName + "/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      console.log("Response status:", res.status);

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Server error:", errorData);
        toast.error(errorData.error || "Login failed");
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Login failed");
        setLoading(false);
        return;
      }
      toast.success("Login successful!");
      console.log("Login successful", data);
      navigate("/"); // switch to edit trail page after successful login
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
