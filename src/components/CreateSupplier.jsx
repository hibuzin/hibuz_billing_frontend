import { useState } from "react";
import styles from "./CreateSupplier.module.css";
import Toast from "./Toast";
import { API } from "../constants/api";

function CreateSupplier() {
  const [form, setForm] = useState({
    supplierName: "",
    mobile: "",
    gstNumber: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
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
        API.createsupplier,
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
          data.message || "Failed to create supplier"
        );
      }

      showToast(
        data.message || "Supplier created successfully",
        "success"
      );

      setForm({
        supplierName: "",
        mobile: "",
        gstNumber: "",
        email: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
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
            <h2>Create Supplier</h2>

            <p>
              Add supplier details
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className={styles.form}
          >
            <div className={styles.grid}>

              <div className={styles.field}>
                <label>Supplier Name</label>

                <input
                  type="text"
                  name="supplierName"
                  value={form.supplierName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.field}>
                <label>Mobile</label>

                <input
                  type="text"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.field}>
                <label>GST Number</label>

                <input
                  type="text"
                  name="gstNumber"
                  value={form.gstNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.field}>
                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div
                className={`${styles.field} ${styles.full}`}
              >
                <label>Address</label>

                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.field}>
                <label>City</label>

                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.field}>
                <label>State</label>

                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.field}>
                <label>Pincode</label>

                <input
                  type="text"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
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
                : "Create Supplier"}
            </button>

          </form>
        </div>
      </div>
    </>
  );
}

export default CreateSupplier;