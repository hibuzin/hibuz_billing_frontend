import { useState, useEffect } from "react";
import styles from "./CreateProduct.module.css";
import Toast from "../../components/Toast";
import { API } from "../../constants/api";

function CreateProduct() {

const [form, setForm] = useState({
  name: "",
  brand: "",
  categoryId: "",
  hsnId: "",
  gstRate: "",
  flavor: "",
  liters: "",
  mrps: "",
});

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    message: "",
    type: "",
  });

  const showToast = (message, type) => {
    setToast({ message, type });

    setTimeout(() => {
      setToast({ message: "", type: "" });
    }, 2500);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(API.categories, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.data || []);
      })
      .catch((err) =>
        console.error("CATEGORY FETCH ERROR:", err)
      );
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
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
  hsnId: form.hsnId,
  gstRate: Number(form.gstRate),

  flavor: form.flavor
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean),

  liters: form.liters
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean),

  mrps: form.mrps
    .split(",")
    .map((item) => Number(item.trim()))
    .filter((item) => !isNaN(item)),
};

      const res = await fetch(
        API.createProduct,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to create product"
        );
      }

      showToast(
        "Product created successfully",
        "success"
      );

     setForm({
  name: "",
  brand: "",
  categoryId: "",
  hsnId: "",
  gstRate: "",
  flavor: "",
  liters: "",
  mrps: "",
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
            <h2>Create Product</h2>
            <p>
              Add product details with variants
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className={styles.form}
          >

            <div className={styles.grid}>

              <div className={styles.field}>
                <label>Product Name</label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.field}>
                <label>Brand</label>

                <input
                  type="text"
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.field}>
                <label>Category</label>

                <select
  name="categoryId"
  value={form.categoryId}
  onChange={(e) => {
    const selectedCategory = categories.find(
      (cat) => cat._id === e.target.value
    );

    setForm((prev) => ({
      ...prev,
      categoryId: e.target.value,
      hsnId: selectedCategory?.hsnId || "",
      gstRate:
        selectedCategory?.gstRate || "",
    }));
  }}
  required
>
                  <option value="">
                    Select Category
                  </option>

                  {categories.map((cat) => (
                    <option
                      key={cat._id}
                      value={cat._id}
                    >
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

            </div>
<div className={styles.field}>
  <label>HSN ID</label>

 <input
  type="text"
  name="hsnId"
  value={form.hsnId}
  onChange={handleChange}
/>
</div>

<div className={styles.field}>
  <label>GST Rate</label>

  <input
  type="number"
  name="gstRate"
  value={form.gstRate}
  onChange={handleChange}
/>

</div>
            <div className={styles.section}>
  <div className={styles.sectionHeader}>
    <h3>Flavors</h3>
  </div>

  <input
    type="text"
    name="flavor"
    value={form.flavor}
    onChange={handleChange}
    className={styles.singleInput}
    placeholder="mango, orange, cola"
  />
</div>

           <div className={styles.section}>
  <div className={styles.sectionHeader}>
    <h3>Liters</h3>
  </div>

  <input
    type="text"
    name="liters"
    value={form.liters}
    onChange={handleChange}
    className={styles.singleInput}
    placeholder="250ml, 500ml, 1L"
  />
</div>

           <div className={styles.section}>
  <div className={styles.sectionHeader}>
    <h3>MRP Values</h3>
  </div>

  <input
    type="text"
    name="mrps"
    value={form.mrps}
    onChange={handleChange}
    className={styles.singleInput}
    placeholder="20, 40, 60"
  />
</div>

            <button
              type="submit"
              disabled={loading}
              className={styles.submitBtn}
            >
              {loading
                ? "Creating..."
                : "Create Product"}
            </button>

          </form>
        </div>
      </div>
    </>
  );
}

export default CreateProduct;