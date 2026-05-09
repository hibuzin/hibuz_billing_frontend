import { useState, useEffect } from "react";
import styles from "./CreatePurchase.module.css";
import Toast from "./Toast";

function CreatePurchase() {
  const [form, setForm] = useState({
    supplierId: "",
  });

  const [items, setItems] = useState([
    { productId: "", qty: "", costPrice: "" },
  ]);

  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSuppliers();
    fetchProducts();
  }, []);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 2500);
  };

  // FETCH SUPPLIERS
  const fetchSuppliers = async () => {
    try {
      const res = await fetch("http://192.168.31.181:5000/api/supplier", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Supplier fetch failed");

      setSuppliers(data.data || []);
    } catch (err) {
      console.error(err);
      showToast("Failed to load suppliers", "error");
    }
  };

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://192.168.31.181:5000/api/productadd", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Product fetch failed");

      setProducts(data.data || []);
    } catch (err) {
      console.error(err);
      showToast("Failed to load products", "error");
    }
  };

  // FORM CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ITEM CHANGE
  const handleItemChange = (index, e) => {
    const updated = [...items];
    updated[index][e.target.name] = e.target.value;
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { productId: "", qty: "", costPrice: "" }]);
  };

  const removeItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  const totalAmount = items.reduce(
    (acc, item) => acc + (Number(item.qty) || 0) * (Number(item.costPrice) || 0),
    0
  );

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.supplierId) {
      return showToast("Select supplier", "error");
    }

    if (items.some((i) => !i.productId || !i.qty || !i.costPrice)) {
      return showToast("Fill all item fields", "error");
    }

    try {
      setLoading(true);

      const res = await fetch(
        "http://192.168.31.181:5000/api/purchase/purchase",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            supplierId: form.supplierId,
            items: items.map((i) => ({
              productId: i.productId,
              qty: Number(i.qty),
              costPrice: Number(i.costPrice),
            })),
            totalAmount,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Purchase failed");
      }

      showToast("Purchase created successfully", "success");

      setForm({ supplierId: "" });
      setItems([{ productId: "", qty: "", costPrice: "" }]);

    } catch (err) {
      console.error(err);
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
            <h2>Create Purchase</h2>
            <p>Manage supplier purchases efficiently</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>

            {/* SUPPLIER */}
            <div className={styles.field}>
              <label>Supplier</label>
              <select
                name="supplierId"
                value={form.supplierId}
                onChange={handleChange}
              >
                <option value="">Select Supplier</option>
                {suppliers.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* ITEMS */}
            <div className={styles.items}>
              {items.map((item, index) => (
                <div key={index} className={styles.row}>

                  <select
                    name="productId"
                    value={item.productId}
                    onChange={(e) => handleItemChange(index, e)}
                  >
                    <option value="">Select Product</option>
                    {products.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    name="qty"
                    placeholder="Qty"
                    value={item.qty}
                    onChange={(e) => handleItemChange(index, e)}
                  />

                  <input
                    type="number"
                    name="costPrice"
                    placeholder="Cost"
                    value={item.costPrice}
                    onChange={(e) => handleItemChange(index, e)}
                  />

                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className={styles.remove}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <button type="button" onClick={addItem} className={styles.add}>
              Add Item
            </button>

            <div className={styles.total}>
              Total: ₹ {totalAmount}
            </div>

            <button type="submit" disabled={loading} className={styles.submit}>
              {loading ? "Creating..." : "Create Purchase"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreatePurchase;