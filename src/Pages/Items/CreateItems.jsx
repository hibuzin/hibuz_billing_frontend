import { useState, useEffect, useRef } from "react";
import styles from "./CreateItems.module.css";
import Toast from "../../components/Toast";
import { API } from "../../constants/api";

function CreateProduct() {
  const [form, setForm] = useState({
    name: "",
    brand: "",
    categoryId: "",
    flavor: "",
    liters: "",
    mrps: "",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });

  const nameRef = useRef(null);
  const brandRef = useRef(null);
  const categoryRef = useRef(null);
  const flavorRef = useRef(null);
  const litersRef = useRef(null);
  const mrpsRef = useRef(null);
  const submitRef = useRef(null);

  useEffect(() => {
    if (nameRef.current) nameRef.current.focus();
  }, []);

  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextRef?.current) nextRef.current.focus();
      else handleSubmit(e);
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 2500);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(API.categories, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setCategories(data.data || []))
      .catch((err) => console.error("CATEGORY FETCH ERROR:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const payload = {
        name: form.name,
        brand: form.brand,
        categoryId: form.categoryId,
        flavor: form.flavor.split(",").map((i) => i.trim()).filter(Boolean),
        litters: form.liters.split(",").map((i) => i.trim()).filter(Boolean),
        mrps: form.mrps.split(",").map((i) => Number(i.trim())).filter((i) => !isNaN(i)),
      };
      const res = await fetch(API.createProduct, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create item");
      showToast("Item created successfully", "success");
      setForm({ name: "", brand: "", categoryId: "", flavor: "", liters: "", mrps: "" });
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

        <div className={styles.pageHeader}>
          <h2>Create Item</h2>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>

          <div className={styles.field}>
            <label>Item Name</label>
            <input
              ref={nameRef}
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              onKeyDown={(e) => handleKeyDown(e, brandRef)}
              placeholder="Enter item name"
              required
            />
          </div>

          <div className={styles.field}>
            <label>Brand</label>
            <input
              ref={brandRef}
              type="text"
              name="brand"
              value={form.brand}
              onChange={handleChange}
              onKeyDown={(e) => handleKeyDown(e, categoryRef)}
              placeholder="Enter brand name"
              required
            />
          </div>

          <div className={styles.field}>
            <label>Category</label>
            <select
              ref={categoryRef}
              name="categoryId"
              value={form.categoryId}
              onChange={(e) => setForm((prev) => ({ ...prev, categoryId: e.target.value }))}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); flavorRef.current?.focus(); } }}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label>Flavors</label>
            <input
              ref={flavorRef}
              type="text"
              name="flavor"
              value={form.flavor}
              onChange={handleChange}
              onKeyDown={(e) => handleKeyDown(e, litersRef)}
              placeholder="ex: mango, orange, cola"
            />
          </div>

          <div className={styles.field}>
            <label>Liters</label>
            <input
              ref={litersRef}
              type="text"
              name="liters"
              value={form.liters}
              onChange={handleChange}
              onKeyDown={(e) => handleKeyDown(e, mrpsRef)}
              placeholder="ex: 250ml, 500ml, 1L"
            />
          </div>

          <div className={styles.field}>
            <label>MRP Value</label>
            <input
              ref={mrpsRef}
              type="text"
              name="mrps"
              value={form.mrps}
              onChange={handleChange}
              onKeyDown={(e) => handleKeyDown(e, submitRef)}
              placeholder="ex: 20, 40, 60"
            />
          </div>

          <button
            ref={submitRef}
            type="submit"
            disabled={loading}
            className={styles.submitBtn}
          >
            {loading ? "Creating..." : "Create Item"}
          </button>

        </form>
      </div>
    </>
  );
}

export default CreateProduct;