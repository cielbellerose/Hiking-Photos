import { useNavigate } from "react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import styles from "../css/LoginForm.module.css";
import Server from "../modules/ServerConnector.js"

export default function RegisterForm({ onLoginSelection }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // for switching page after signup

  const handleSubmitForm = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(Server.serverName + "/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Signup failed");
        setLoading(false);
        return;
      }

      toast.success("Account created successfully!");
      console.log("Signup successful", data);
      navigate("/"); // switch to edit trail page after successful sign up
    } catch (error) {
      toast.error("Error signing up");
      console.error("Signup error:", error);
      setLoading(false);
    }
  };
  return (
    <>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Register</h2>
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
            value={loading ? "Loading" : "Register"}
          />
        </form>
        <div>
          <button className={styles.switchButton} onClick={onLoginSelection}>
            Go to Login
          </button>
        </div>
      </div>
    </>
  );
}
