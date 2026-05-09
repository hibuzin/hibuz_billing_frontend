import { useState } from "react";
import styles from "./CreateSupplier.module.css";
import Toast from "../components/Toast";

function CreateSupplier() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 2500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      const res = await fetch(
        "http://192.168.31.181:5000/api/supplier/",
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
        throw new Error(data.message || "Failed to create supplier");
      }

      showToast("Supplier created successfully", "success");

      setForm({
        name: "",
        phone: "",
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
      <Toast message={toast.message} type={toast.type} />

      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h2>Create Supplier</h2>
            <p>Add supplier details</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.grid}>

              <div className={styles.field}>
                <label>Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.field}>
                <label>Phone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={`${styles.field} ${styles.full}`}>
                <label>Address</label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            <button type="submit" disabled={loading} className={styles.btn}>
              {loading ? "Creating..." : "Create Supplier"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateSupplier;