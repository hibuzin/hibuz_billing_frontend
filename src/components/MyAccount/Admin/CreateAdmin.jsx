import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CreateAdmin.module.css";
import Toast from "../../Toast";

function CreateAdmin() {

  const navigate = useNavigate();

  const [form, setForm] =
    useState({
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

  // INPUT CHANGE

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });

  };

  // SUBMIT

  const handleSubmit = async (e) => {

    e.preventDefault();

    const token =
      localStorage.getItem(
        "token"
      );

    if (!token) {

      setMessage(
        "Token not found"
      );

      setMessageType("error");

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

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({

            name: form.name,

            email: form.email,

            phone: form.phone,

            password:
              form.password,

            role: "admin",
          }),
        }
      );

      const data =
        await res.json();

      if (
        !res.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to create admin"
        );
      }

      setMessage(
        "Admin created successfully"
      );

      setMessageType(
        "success"
      );

      setForm({
        name: "",
        email: "",
        phone: "",
        password: "",
      });

      setTimeout(() => {

        navigate("/admin");

      }, 1200);

    } catch (err) {

      setMessage(
        err.message
      );

      setMessageType(
        "error"
      );

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

      <div className={styles.box}>

        <h2 className={styles.title}>
          CREATE ADMIN
        </h2>

        <form
          onSubmit={handleSubmit}
          className={styles.form}
        >

          {/* NAME */}

          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          {/* EMAIL */}

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          {/* PHONE */}

          <input
            type="text"
            name="phone"
            placeholder="Enter Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
          />

          {/* PASSWORD */}

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={form.password}
            onChange={handleChange}
            required
          />

        

          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create Admin"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default CreateAdmin;