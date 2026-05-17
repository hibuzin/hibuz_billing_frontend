import styles from "./Login.module.css";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../Toast";
import { API } from "../../constants/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(""), 2500);
      return () => clearTimeout(t);
    }
  }, [message]);

  const showToast = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
  };

  const handleKeyDownEmail = (e) => {
    if (e.key === "Enter") passwordRef.current.focus();
  };

  const handleKeyDownPassword = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  //Login fetch 
  const handleLogin = async () => {
  if (!email) {
    showToast("Email is required", "error");
    return;
  }

  if (!password) {
    showToast("Password is required", "error");
    return;
  }
  try {
    setLoading(true);
    const res = await fetch(API.login, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      showToast(data.message || "Invalid email or password", "error");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    showToast("Login successful!", "success");

    setTimeout(() => {
      window.location.href = "/";
    }, 1000);

  } catch (error) {
    console.error(error);
    showToast("Server error. Try again later", "error");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className={styles.container}>

      
      {message && <Toast message={message} type={messageType} />}

      <div className={styles.formBox}>
        <h1>Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          ref={emailRef}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDownEmail}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          ref={passwordRef}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDownPassword}
        />

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className={styles.signupText}>
          <span onClick={() => navigate("/register")}>Forgot password?</span>
        </p>
      </div>
    </div>
  );
}

export default Login;