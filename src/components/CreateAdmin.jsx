import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CreateAdmin.module.css";
import Toast from "../components/Toast";

function CreateAdmin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      const res = await fetch(
        "http://192.168.31.181:5000/api/auth/create-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
            role: "admin", 
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create admin");
      }

      setMessage("Admin created successfully");
      setMessageType("success");

      setTimeout(() => {
        navigate("/admin");
      }, 1500);
    } catch (err) {
      setMessage(err.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Toast message={message} type={messageType} />

      <div className={styles.box}>
        <h2 className={styles.title}>CREATE ADMIN</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateAdmin;