import { useState, useEffect } from "react";
import styles from "./CreateProduct.module.css";
import Toast from "./Toast";

function CreateProduct() {
  const [form, setForm] = useState({
    name: "",
    costPrice: "",
    sellingPrice: "",
    stock: "",
    categoryId: "",
    unitType: "piece",
    unitValue: 0,
  });

  const [categories, setCategories] = useState([]);
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

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://192.168.31.181:5000/api/category", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // adjust based on your API structure
        setCategories(data.data || []);
      })
      .catch((err) => console.error("CATEGORY FETCH ERROR:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      const res = await fetch(
        "http://192.168.31.181:5000/api/productadd/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...form,
            costPrice: Number(form.costPrice),
            sellingPrice: Number(form.sellingPrice),
            stock: Number(form.stock),
            unitValue: Number(form.unitValue),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create product");
      }

      showToast("Product created successfully", "success");

      setForm({
        name: "",
        costPrice: "",
        sellingPrice: "",
        stock: "",
        categoryId: "",
        unitType: "piece",
        unitValue: 1,
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
            <h2>Create Product</h2>
            <p>Add new product to your inventory</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.grid}>
              
              <div className={styles.field}>
                <label>Product Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.field}>
                <label>Cost Price</label>
                <input
                  type="number"
                  name="costPrice"
                  value={form.costPrice}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.field}>
                <label>Selling Price</label>
                <input
                  type="number"
                  name="sellingPrice"
                  value={form.sellingPrice}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.field}>
                <label>Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* UPDATED FIELD */}
              <div className={styles.field}>
                <label>Category</label>
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label>Unit Type</label>
                <select
                  name="unitType"
                  value={form.unitType}
                  onChange={handleChange}
                >
                  <option value="piece">Piece</option>
                  <option value="kg">Kg</option>
                  <option value="litre">Litre</option>
                </select>
              </div>

              <div className={styles.field}>
                <label>Unit Value</label>
                <input
                  type="number"
                  name="unitValue"
                  value={form.unitValue}
                  onChange={handleChange}
                />
              </div>

            </div>

            <button type="submit" disabled={loading} className={styles.btn}>
              {loading ? "Creating..." : "Create Product"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateProduct;