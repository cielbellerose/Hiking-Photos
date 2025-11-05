import LoginForm from "../components/LoginForm";
import TrailNavbar from "../components/NavBar";
import RegisterForm from "../components/RegisterForm";
import { useState } from "react";
import styles from "../css/LoginPage.module.css";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      <TrailNavbar />
      <div className={styles.contentContainer}>
        <div className={styles.container}>
          {isLogin ? (
            <LoginForm onSignupSelection={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onLoginSelection={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </>
  );
}
