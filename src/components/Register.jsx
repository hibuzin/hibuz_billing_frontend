import styles from "./Register.module.css";
import Toast from "./Toast";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../constants/api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 2500);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setMessage("Please fill all fields");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
       API.registerSuperAdmin,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage(data.message || "Registered successfully");
        setMessageType("success");

        setName("");
        setEmail("");
        setPassword("");

        setTimeout(() => {
          navigate("/login");
        }, 1200);
      } else {
        setMessage(data.message || "Registration failed");
        setMessageType("error");
      }
    } catch (error) {
      console.error(error);
      setMessage("Server error");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Toast message={message} type={messageType} />

      <div className={styles.formBox}>
        <h1>REGISTER</h1>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleRegister} disabled={loading}>
          {loading ? "Registering..." : "REGISTER"}
        </button>
      </div>
    </div>
  );
}

export default Register;