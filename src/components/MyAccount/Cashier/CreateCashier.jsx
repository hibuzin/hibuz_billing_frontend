import styles from "./CreateCashier.module.css";
import Toast from "../../Toast";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../../constants/api";

function CreateCashier() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateCashier = async () => {

    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.password
    ) {
      setMessage("Please fill all fields");
      setMessageType("error");
      return;
    }

    const token =
      localStorage.getItem("token");

    if (!token) {
      setMessage("Please login first");
      setMessageType("error");

      navigate("/login");
      return;
    }

    try {

      setLoading(true);

      const res = await fetch(
        "http://192.168.31.181:5000/api/super-admin/create-user",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: form.name,
            email: form.email,
            phone: form.phone,
            password: form.password,
            role: "cashier",
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to create cashier"
        );
      }

      setMessage(
        data.message ||
          "Cashier created successfully"
      );

      setMessageType("success");

      setForm({
        name: "",
        email: "",
        phone: "",
        password: "",
      });

      setTimeout(() => {
        navigate("/cashier");
      }, 1200);

    } catch (error) {

      console.log(error);

      setMessage(
        error.message ||
          "Server error"
      );

      setMessageType("error");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>

      <Toast
        message={message}
        type={messageType}
      />

      <div className={styles.formBox}>

        <h1>CREATE CASHIER</h1>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <button
          onClick={handleCreateCashier}
          disabled={loading}
        >
          {loading
            ? "Creating..."
            : "CREATE CASHIER"}
        </button>

      </div>
    </div>
  );
}

export default CreateCashier;