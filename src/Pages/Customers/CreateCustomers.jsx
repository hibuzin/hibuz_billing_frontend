import { useState, useRef } from "react";
import styles from "./CreateCustomers.module.css";
import Toast from "../../components/Toast";
import { API } from "../../constants/api";

function CreateCustomer() {

  const nameRef = useRef(null);
const phoneRef = useRef(null);
const emailRef = useRef(null);
const addressRef = useRef(null);

const handleEnter = (e, nextRef) => {
  if (e.key === "Enter") {
    e.preventDefault();

    if (nextRef) {
      nextRef.current.focus();
    } else {
      handleSubmit(e);
    }
  }
};

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    message: "",
    type: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showToast = (message, type) => {
    setToast({ message, type });

    setTimeout(() => {
      setToast({
        message: "",
        type: "",
      });
    }, 2500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      const res = await fetch(
        API.customers,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to create customer"
        );
      }

      showToast(
        "Customer created successfully",
        "success"
      );

      setForm({
        name: "",
        phone: "",
        email: "",
        address: "",
      });

    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast
        message={toast.message}
        type={toast.type}
      />

      <div className={styles.container}>
        <div className={styles.card}>

          <div className={styles.header}>
            <h2>Create Customer</h2>

            <p>
              Add customer details to your system
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className={styles.form}
          >
            <div className={styles.grid}>

              <div className={styles.field}>
                <label>Customer Name</label>

                <input
  ref={nameRef}
  autoFocus
  type="text"
  name="name"
  value={form.name}
  onChange={handleChange}
  onKeyDown={(e) =>
    handleEnter(e, phoneRef)
  }
  required
/>
              </div>

              <div className={styles.field}>
                <label>Phone Number</label>

                <input
  ref={phoneRef}
  type="text"
  name="phone"
  value={form.phone}
  onChange={handleChange}
  onKeyDown={(e) =>
    handleEnter(e, emailRef)
  }
  required
/>
              </div>

              <div className={styles.field}>
                <label>Email Address</label>

                <input
  ref={emailRef}
  type="email"
  name="email"
  value={form.email}
  onChange={handleChange}
  onKeyDown={(e) =>
    handleEnter(e, addressRef)
  }
/>
              </div>

              <div
                className={`${styles.field} ${styles.full}`}
              >
                <label>Address</label>

                <textarea
  ref={addressRef}
  name="address"
  value={form.address}
  onChange={handleChange}
  onKeyDown={(e) =>
    handleEnter(e, null)
  }
  required
/>
              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className={styles.btn}
            >
              {loading
                ? "Creating..."
                : "Create Customer"}
            </button>

          </form>
        </div>
      </div>
    </>
  );
}

export default CreateCustomer;