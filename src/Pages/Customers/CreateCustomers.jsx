import { useState, useEffect, useRef } from "react";
import styles from "./CreateCustomers.module.css";
import Toast from "../../components/Toast";
import { API } from "../../constants/api";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

function CreateCustomer() {

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

  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const emailRef = useRef(null);
  const addressRef = useRef(null);
  const submitRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const handleEnter = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (nextRef?.current) {
        nextRef.current.focus();
      } else {
        handleSubmit(e);
      }
    }
  };

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

      const res = await fetch(API.customers, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(form),
      });

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

      nameRef.current?.focus();

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

        <div className={styles.header}>
  <button
    type="button"
    className={styles.backBtn}
    onClick={() => navigate("/customers")}
  >
    <FiArrowLeft size={18} />
  </button>

  <h2>Create Customer</h2>
</div>

        <form
          onSubmit={handleSubmit}
          className={styles.form}
        >

          <div className={styles.sectionTitle}>
            General Details
          </div>

          <div className={styles.grid}>

            <div className={styles.field}>
              <label>Customer Name</label>

              <input
                ref={nameRef}
                type="text"
                name="name"
                value={form.name}
                placeholder="Enter customer name"
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
                placeholder="Enter phone number"
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
                placeholder="Enter email address"
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
                placeholder="Enter address"
                onChange={handleChange}
                onKeyDown={(e) =>
                  handleEnter(e, submitRef)
                }
                required
              />
            </div>

            <div className={styles.buttonField}>
              <button
                ref={submitRef}
                type="submit"
                disabled={loading}
                className={styles.btn}
              >
                {loading
                  ? "Creating..."
                  : "Create Customer"}
              </button>
            </div>

          </div>

        </form>
      </div>
    </>
  );
}

export default CreateCustomer;