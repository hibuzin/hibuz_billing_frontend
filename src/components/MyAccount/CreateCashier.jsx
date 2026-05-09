import styles from "./CreateCashier.module.css";
import Toast from "../Toast";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CreateUser() {
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

  const handleCreateUser = async () => {
   if (!name || !email || !password) {
      setMessage("Please fill all fields");
      setMessageType("error");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login first");
      setMessageType("error");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "http://192.168.31.181:5000/api/auth/create-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
         body: JSON.stringify({
  name,
  email,
  password,
  role: "cashier", 
}),
        }
      );

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid JSON response");
      }

      if (res.ok && data.success) {
        setMessage(data.message || "User created successfully");
        setMessageType("success");

        // Reset form
        setName("");
        setEmail("");
        setPassword("");

        // Redirect
        setTimeout(() => {
          navigate("/cashier");
        }, 1200);
      } else {
        setMessage(data.message || "Failed to create user");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Create User Error:", error);
      setMessage("Server error or CORS issue");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Toast message={message} type={messageType} />

      <div className={styles.formBox}>
        <h1>CREATE CASHIER</h1>

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

        <button onClick={handleCreateUser} disabled={loading}>
          {loading ? "Creating..." : "CREATE CASHIER"}
        </button>
      </div>
    </div>
  );
}

export default CreateUser;