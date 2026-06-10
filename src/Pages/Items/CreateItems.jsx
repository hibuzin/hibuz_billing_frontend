import { useState, useEffect, useRef } from "react";
import styles from "./CreateItems.module.css";
import Toast from "../../components/Toast";
import { API } from "../../constants/api";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

function CreateProduct() {
  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    hsnCode: "",
    gstRate: "",
    mrp: "",
    costPrice: "",
    sellingPrice: "",
     description: "",
    barcode: "",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const nameRef = useRef(null);
  const categoryRef = useRef(null);
  const hsnRef = useRef(null);
  const gstRef = useRef(null);
  const mrpRef = useRef(null);
  const costRef = useRef(null);
  const sellingRef = useRef(null);
  const descriptionRef = useRef(null);
  const barcodeRef = useRef(null);
  const submitRef = useRef(null);
  const navigate = useNavigate();

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

  const handleCreateCategory = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(API.categories, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newCategory,
        }),
      });

      const data = await res.json();
      console.log("CATEGORY SUBMIT");
      console.log("STATUS:", res.status);
      console.log("RESPONSE:", data);

      if (!res.ok) {
        throw new Error(data.message || "Failed to create category");
      }

      setCategories((prev) => [...prev, data.data]);

      setForm((prev) => ({
        ...prev,
        categoryId: data.data._id,
      }));

      setNewCategory("");
      setShowCategoryModal(false);

      showToast("Category created successfully", "success");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const payload = {
  name: form.name,
  categoryId: form.categoryId,
  hsnCode: form.hsnCode,
  gstRate: Number(form.gstRate),
  mrp: Number(form.mrp),
  costPrice: Number(form.costPrice),
  sellingPrice: Number(form.sellingPrice),
  barcode: form.barcode,
  description: form.description,
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
      setForm({
  name: "",
  categoryId: "",
  hsnCode: "",
  gstRate: "",
  mrp: "",
  costPrice: "",
  sellingPrice: "",
  barcode: "",
  description: "",
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

        <div className={styles.header}>
  <button
    type="button"
    className={styles.backBtn}
    onClick={() => navigate("/product")}
  >
    <FiArrowLeft size={18} />
  </button>

  <h2>Create Customer</h2>
</div>

        <form onSubmit={handleSubmit} className={styles.form}>

  <div className={styles.sectionTitle}>
    Product Details
  </div>

  <div className={styles.productGrid}>

    <div className={styles.field}>
      <label>Item Name</label>
      <input
        ref={nameRef}
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        onKeyDown={(e) => handleKeyDown(e, categoryRef)}
        placeholder="Enter item name"
        required
      />
    </div>

    <div className={styles.field}>
      <label>Category</label>

      <div className={styles.categoryWrapper}>
        <select
          ref={categoryRef}
          name="categoryId"
          value={form.categoryId}
          onChange={(e) => {
            if (e.target.value === "__add_category__") {
              setShowCategoryModal(true);
              return;
            }

            setForm((prev) => ({
              ...prev,
              categoryId: e.target.value,
            }));
          }}
          required
        >
          <option value="">Select Category</option>

          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}

          <option value="__add_category__">
            + Add Category
          </option>
        </select>
      </div>
    </div>

    <div className={styles.field}>
      <label>HSN Code</label>
      <input
        ref={hsnRef}
        type="text"
        name="hsnCode"
        value={form.hsnCode}
        onChange={handleChange}
        onKeyDown={(e) => handleKeyDown(e, gstRef)}
        placeholder="Enter HSN Code"
      />
    </div>

    <div className={styles.field}>
      <label>GST Rate (%)</label>
      <input
        ref={gstRef}
        type="number"
        name="gstRate"
        value={form.gstRate}
        onChange={handleChange}
        onKeyDown={(e) => handleKeyDown(e, mrpRef)}
        placeholder="18"
      />
    </div>

  </div>

  <div className={styles.sectionTitle}>
    Pricing Details
  </div>

  <div className={styles.grid}>

    <div className={styles.field}>
      <label>MRP</label>
      <input
        ref={mrpRef}
        type="number"
        name="mrp"
        value={form.mrp}
        onChange={handleChange}
        onKeyDown={(e) => handleKeyDown(e, costRef)}
        placeholder="MRP"
      />
    </div>

    <div className={styles.field}>
      <label>Cost Price</label>
      <input
        ref={costRef}
        type="number"
        name="costPrice"
        value={form.costPrice}
        onChange={handleChange}
        onKeyDown={(e) => handleKeyDown(e, sellingRef)}
        placeholder="Cost Price"
      />
    </div>

    <div className={styles.field}>
      <label>Selling Price</label>
      <input
        ref={sellingRef}
        type="number"
        name="sellingPrice"
        value={form.sellingPrice}
        onChange={handleChange}
        onKeyDown={(e) => handleKeyDown(e, barcodeRef)}
        placeholder="Selling Price"
      />
    </div>

<div className={`${styles.field} ${styles.full}`}>
  <label>Description</label>

  <textarea
    ref={descriptionRef}
    name="description"
    value={form.description}
    onChange={handleChange}
    onKeyDown={(e) => handleKeyDown(e, submitRef)}
    placeholder="Enter product description"
    rows={4}
  />
</div>

  </div>

  <div className={styles.sectionTitle}>
    Inventory Details
  </div>

  <div className={styles.grid}>

    <div className={styles.field}>
      <label>Barcode</label>
      <input
        ref={barcodeRef}
        type="text"
        name="barcode"
        value={form.barcode}
        onChange={handleChange}
        onKeyDown={(e) => handleKeyDown(e, submitRef)}
        placeholder="Barcode"
      />
    </div>

  </div>

  <div className={styles.submitRow}>
    <button
      ref={submitRef}
      type="submit"
      disabled={loading}
      className={styles.submitBtn}
    >
      {loading ? "Creating..." : "Create Item"}
    </button>
  </div>

</form>
      </div>

      {showCategoryModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Create Category</h3>

            <input
              type="text"
              value={newCategory}
              onChange={(e) =>
                setNewCategory(e.target.value)
              }
              placeholder="Enter category name"
            />

            <div className={styles.modalActions}>
              <button
                type="button"
                onClick={() =>
                  setShowCategoryModal(false)
                }
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCreateCategory();
                }}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

export default CreateProduct;