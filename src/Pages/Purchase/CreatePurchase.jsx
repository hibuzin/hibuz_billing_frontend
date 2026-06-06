import { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { FaEdit } from "react-icons/fa";
import styles from "./CreatePurchase.module.css";
import Toast from "../../components/Toast";
import { API } from "../../constants/api";

function CreatePurchase() {
  const emptyItem = {
    productId: "",
    flavor: "",
    litters: "",
    mrp: "",
    qty: "",
    costPrice: "",
    sellingPrice: "",
    barcode: "",
  };

  const [form, setForm] = useState({
    supplierId: "",
    invoiceNo: "",
    invoiceDate: "",
    supplierBillAmount: "",
    paidAmount: "",
  });

  const balanceAmount =
    Number(form.supplierBillAmount || 0) - Number(form.paidAmount || 0);

  const [currentItem, setCurrentItem] = useState(emptyItem);
  const [billItems, setBillItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editItem, setEditItem] = useState(emptyItem);

  // ── REFS ──
  const supplierRef = useRef(null);
  const invoiceRef = useRef(null);
  const dateRef = useRef(null);
  const productSelectRef = useRef(null);
  const flavorSelectRef = useRef(null);
  const litersSelectRef = useRef(null);
  const mrpSelectRef = useRef(null);
  const qtyRef = useRef(null);
  const costRef = useRef(null);
  const sellingRef = useRef(null);
  const barcodeRef = useRef(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSuppliers();
    fetchProducts();
    setTimeout(() => supplierRef.current?.focus(), 200);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "Enter") handleSubmit(e);
      if (e.key === "Escape") closeEditModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [billItems, form]);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 2500);
  };

  const fetchSuppliers = async () => {
    try {
      const res = await fetch(API.suppliers, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Supplier fetch failed");
      setSuppliers(data.data || []);
    } catch {
      showToast("Failed to load suppliers", "error");
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(API.products, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Product fetch failed");
      setProducts(data.data || []);
    } catch {
      showToast("Failed to load products", "error");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (field, value) => {
    setCurrentItem((prev) => ({ ...prev, [field]: value }));
  };

  const getProductOptions = () =>
    products.map((p) => ({ value: p._id, label: p.name, product: p }));

  const getFlavorOptions = (productId) => {
    const product = products.find((p) => p._id === productId);
    if (!product || !product.flavor) return [];
    return product.flavor.map((f) => ({ value: f, label: f }));
  };

  const getLiterOptions = (productId) => {
    const product = products.find((p) => p._id === productId);
    if (!product || !product.litters) return [];
    return product.litters.map((l, i) => ({
      value: l,
      label: l,
      mrp: product.mrps?.[i] || 0,
    }));
  };

  const getMrpOptions = (productId) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return [];
    return product.mrps.map((m) => ({ value: m, label: `₹ ${m}` }));
  };

  const focusNext = (ref) => {
    setTimeout(() => ref.current?.focus(), 80);
  };

  const addItem = () => {
    if (!currentItem.productId) return showToast("Select product", "error");
    setBillItems((prev) => [...prev, { ...currentItem }]);
    setCurrentItem(emptyItem);
    showToast("Item added successfully", "success");
    setTimeout(() => productSelectRef.current?.focus(), 150);
  };

  const removeBillItem = (index) => {
    setBillItems(billItems.filter((_, i) => i !== index));
  };

  const openEditModal = (item, index) => {
    document.body.style.overflow = "hidden";
    setEditItem(item);
    setEditIndex(index);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    document.body.style.overflow = "auto";
    setShowEditModal(false);
  };

  const saveEditItem = () => {
    if (!editItem.productId) return showToast("Select product", "error");
    const updatedItems = [...billItems];
    updatedItems[editIndex] = editItem;
    setBillItems(updatedItems);
    closeEditModal();
    showToast("Item updated successfully", "success");
  };

  const totalAmount = billItems.reduce(
    (acc, item) =>
      acc + (Number(item.qty) || 0) * (Number(item.costPrice) || 0),
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.supplierId) return showToast("Select supplier", "error");
    if (billItems.length === 0) return showToast("Add at least one item", "error");

    try {
      setLoading(true);
      const payload = {
        supplierId: form.supplierId,
        invoiceNo: form.invoiceNo,
        invoiceDate: form.invoiceDate,
        totalAmount,
        supplierBillAmount: Number(form.supplierBillAmount),
        paidAmount: Number(form.paidAmount),
        balanceAmount,
        items: billItems.map((item) => ({
          productId: item.productId,
          flavor: item.flavor,
          litters: item.litters,
          qty: Number(item.qty),
          costPrice: Number(item.costPrice),
          mrp: Number(item.mrp),
          sellingPrice: Number(item.sellingPrice),
          barcode: item.barcode,
        })),
      };

      const res = await fetch(API.createPurchase, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Purchase failed");

      showToast("Purchase created successfully", "success");
      setForm({
        supplierId: "",
        invoiceNo: "",
        invoiceDate: "",
        supplierBillAmount: "",
        paidAmount: "",
      });
      setBillItems([]);
      setCurrentItem(emptyItem);
      setTimeout(() => supplierRef.current?.focus(), 200);
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

        {/* PAGE HEADER */}
        <div className={styles.pageHeader}>
          <h2>Create Purchase</h2>
        </div>

        <div className={styles.layout}>

          {/* ── LEFT ── */}
          <div className={styles.left}>
            <form onSubmit={handleSubmit} className={styles.form}>

              {/* SUPPLIER */}
              <div className={styles.field}>
                <label>Supplier</label>
                <select
                  ref={supplierRef}
                  name="supplierId"
                  value={form.supplierId}
                  onChange={handleChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      invoiceRef.current?.focus();
                    }
                  }}
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.supplierName}
                    </option>
                  ))}
                </select>
              </div>

              {/* INVOICE NO */}
              <div className={styles.field}>
                <label>Invoice No</label>
                <input
                  ref={invoiceRef}
                  type="text"
                  name="invoiceNo"
                  value={form.invoiceNo}
                  onChange={handleChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      dateRef.current?.focus();
                    }
                  }}
                />
              </div>

              {/* INVOICE DATE */}
              <div className={styles.field}>
                <label>Invoice Date</label>
                <input
                  ref={dateRef}
                  type="date"
                  name="invoiceDate"
                  value={form.invoiceDate}
                  onChange={handleChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      productSelectRef.current?.focus();
                    }
                  }}
                />
              </div>
              {/* ── ITEM CARD ── */}
              <div className={styles.itemCard}>
                <div className={styles.itemHeader}>
                  <h4>Add Product</h4>
                </div>

                <div className={styles.grid}>

                  {/* PRODUCT */}
                  <div className={styles.field}>
                    <label>Product</label>
                    <Select
                      ref={productSelectRef}
                      options={getProductOptions()}
                      placeholder="Search Product"
                      value={
                        getProductOptions().find(
                          (p) => p.value === currentItem.productId
                        ) || null
                      }
                      onChange={(selected) => {
                        const product = selected?.product;
                        setCurrentItem({
                          ...currentItem,
                          productId: product?._id || "",
                          flavor: product?.flavor?.[0] || "",
                          litters: product?.litters?.[0] || "",
                          mrp: product?.mrps?.[0] || "",
                        });
                        focusNext(flavorSelectRef);
                      }}
                      isSearchable
                    />
                  </div>

                  {/* FLAVOR */}
                  <div className={styles.field}>
                    <label>Flavor</label>
                    <Select
                      ref={flavorSelectRef}
                      options={getFlavorOptions(currentItem.productId)}
                      placeholder="Select Flavor"
                      value={
                        getFlavorOptions(currentItem.productId).find(
                          (f) => f.value === currentItem.flavor
                        ) || null
                      }
                      onChange={(selected) => {
                        handleItemChange("flavor", selected?.value || "");
                        focusNext(litersSelectRef);
                      }}
                      isSearchable
                    />
                  </div>

                  {/* LITERS */}
                  <div className={styles.field}>
                    <label>Liters</label>
                    <Select
                      ref={litersSelectRef}
                      options={getLiterOptions(currentItem.productId)}
                      placeholder="Select Liters"
                      value={
                        getLiterOptions(currentItem.productId).find(
                          (l) => l.value === currentItem.litters
                        ) || null
                      }
                      onChange={(selected) => {
                        setCurrentItem({
                          ...currentItem,
                          litters: selected?.value || "",
                          mrp: selected?.mrp || "",
                        });
                        focusNext(mrpSelectRef);
                      }}
                      isSearchable
                    />
                  </div>

                  {/* MRP */}
                  <div className={styles.field}>
                    <label>MRP</label>
                    <Select
                      ref={mrpSelectRef}
                      options={getMrpOptions(currentItem.productId)}
                      placeholder="Select MRP"
                      value={
                        getMrpOptions(currentItem.productId).find(
                          (m) => m.value === currentItem.mrp
                        ) || null
                      }
                      onChange={(selected) => {
                        handleItemChange("mrp", selected?.value || "");
                        focusNext(qtyRef);
                      }}
                      isSearchable
                    />
                  </div>

                  {/* QTY */}
                  <div className={styles.field}>
                    <label>Quantity</label>
                    <input
                      ref={qtyRef}
                      type="number"
                      value={currentItem.qty}
                      onChange={(e) => handleItemChange("qty", e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          costRef.current?.focus();
                        }
                      }}
                    />
                  </div>

                  {/* COST PRICE */}
                  <div className={styles.field}>
                    <label>Cost Price</label>
                    <input
                      ref={costRef}
                      type="number"
                      value={currentItem.costPrice}
                      onChange={(e) => handleItemChange("costPrice", e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          sellingRef.current?.focus();
                        }
                      }}
                    />
                  </div>

                  {/* SELLING PRICE */}
                  <div className={styles.field}>
                    <label>Selling Price</label>
                    <input
                      ref={sellingRef}
                      type="number"
                      value={currentItem.sellingPrice}
                      onChange={(e) =>
                        handleItemChange("sellingPrice", e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          barcodeRef.current?.focus();
                        }
                      }}
                    />
                  </div>

                  {/* BARCODE */}
                  <div className={styles.field}>
                    <label>Barcode</label>
                    <input
                      ref={barcodeRef}
                      type="text"
                      value={currentItem.barcode}
                      onChange={(e) => handleItemChange("barcode", e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addItem();
                        }
                      }}
                    />
                  </div>

                </div>
              </div>

              <div className={styles.amountSection}>

                <div className={styles.field}>
                  <label>Supplier Bill Amount</label>
                  <input
                    type="number"
                    name="supplierBillAmount"
                    value={form.supplierBillAmount}
                    onChange={handleChange}
                    placeholder="Enter supplier amount"
                  />
                </div>

                <div className={styles.field}>
                  <label>Paid Amount</label>
                  <input
                    type="number"
                    name="paidAmount"
                    value={form.paidAmount}
                    onChange={handleChange}
                    placeholder="Enter paid amount"
                  />
                </div>

              </div>

              {/* ADD ITEM BUTTON */}
              <button
                type="button"
                onClick={addItem}
                className={styles.addBtn}
              >
                + Add Item
              </button>

            </form>
          </div>

          {/* ── RIGHT - BILL PANEL ── */}
          <div className={styles.right}>
            <div className={styles.billCard}>

              <div className={styles.billHeader}>
                <h3>Purchase Bill</h3>
              </div>

              <div className={styles.billTableWrapper}>
  <table className={styles.billTable}>
    <thead>
      <tr>
        <th>#</th>
        <th>Product</th>
        <th>Flavor</th>
        <th>Liters</th>
        <th>MRP</th>
        <th>Qty</th>
        <th>Cost</th>
        <th>Total</th>
        <th>Action</th>
      </tr>
    </thead>

    <tbody>
      {billItems.map((item, index) => {
        const product = products.find(
          (p) => p._id === item.productId
        );

        return (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{product?.name || "-"}</td>
            <td>{item.flavor || "-"}</td>
            <td>{item.litters || "-"}</td>
            <td>₹{item.mrp || 0}</td>
            <td>{item.qty || 0}</td>
            <td>₹{item.costPrice || 0}</td>
            <td>
              ₹
              {(Number(item.qty) || 0) *
                (Number(item.costPrice) || 0)}
            </td>

            <td>
              <button
                type="button"
                onClick={() => openEditModal(item, index)}
                className={styles.editBtn}
              >
                <FaEdit />
              </button>

              <button
                type="button"
                onClick={() => removeBillItem(index)}
                className={styles.billRemoveBtn}
              >
                ×
              </button>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>

              <div className={styles.billFooter}>
                <h2>
                  <span>Total</span>
                  <span>₹ {totalAmount}</span>
                </h2>

                <p>
                  <span>Supplier Bill</span>
                  <span>₹ {form.supplierBillAmount || 0}</span>
                </p>

                <p>
                  <span>Paid</span>
                  <span>₹ {form.paidAmount || 0}</span>
                </p>

                <h3>
                  <span>Balance</span>
                  <span>₹ {balanceAmount}</span>
                </h3>
              </div>

              <button
                type="submit"
                disabled={loading}
                onClick={handleSubmit}
                className={styles.submitBtn}
              >
                {loading ? "Creating..." : "Create Purchase"}
              </button>

            </div>
          </div>

        </div>
      </div>

      {/* ── EDIT MODAL ── */}
      {showEditModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Edit Product</h3>
              <button
                type="button"
                onClick={closeEditModal}
                className={styles.closeBtn}
              >
                ×
              </button>
            </div>

            <div className={styles.grid}>

              {/* PRODUCT */}
              <div className={styles.field}>
                <label>Product</label>
                <Select
                  options={getProductOptions()}
                  placeholder="Search Product"
                  value={
                    getProductOptions().find(
                      (p) => p.value === editItem.productId
                    ) || null
                  }
                  onChange={(selected) => {
                    const product = selected?.product;
                    setEditItem({
                      ...editItem,
                      productId: product?._id || "",
                      flavor: product?.flavor?.[0] || "",
                      litters: product?.litters?.[0] || "",
                      mrp: product?.mrps?.[0] || "",
                    });
                  }}
                />
              </div>

              {/* FLAVOR */}
              <div className={styles.field}>
                <label>Flavor</label>
                <Select
                  options={getFlavorOptions(editItem.productId)}
                  placeholder="Select Flavor"
                  value={
                    getFlavorOptions(editItem.productId).find(
                      (f) => f.value === editItem.flavor
                    ) || null
                  }
                  onChange={(selected) =>
                    setEditItem({ ...editItem, flavor: selected?.value || "" })
                  }
                />
              </div>

              {/* LITERS */}
              <div className={styles.field}>
                <label>Liters</label>
                <Select
                  options={getLiterOptions(editItem.productId)}
                  placeholder="Select Liters"
                  value={
                    getLiterOptions(editItem.productId).find(
                      (l) => l.value === editItem.litters
                    ) || null
                  }
                  onChange={(selected) =>
                    setEditItem({
                      ...editItem,
                      litters: selected?.value || "",
                      mrp: selected?.mrp || "",
                    })
                  }
                />
              </div>

              {/* MRP */}
              <div className={styles.field}>
                <label>MRP</label>
                <Select
                  options={getMrpOptions(editItem.productId)}
                  placeholder="Select MRP"
                  value={
                    getMrpOptions(editItem.productId).find(
                      (m) => m.value === editItem.mrp
                    ) || null
                  }
                  onChange={(selected) =>
                    setEditItem({ ...editItem, mrp: selected?.value || "" })
                  }
                />
              </div>

              {/* QTY */}
              <div className={styles.field}>
                <label>Qty</label>
                <input
                  type="number"
                  value={editItem.qty}
                  onChange={(e) =>
                    setEditItem({ ...editItem, qty: e.target.value })
                  }
                />
              </div>

              {/* COST PRICE */}
              <div className={styles.field}>
                <label>Cost Price</label>
                <input
                  type="number"
                  value={editItem.costPrice}
                  onChange={(e) =>
                    setEditItem({ ...editItem, costPrice: e.target.value })
                  }
                />
              </div>

              {/* SELLING PRICE */}
              <div className={styles.field}>
                <label>Selling Price</label>
                <input
                  type="number"
                  value={editItem.sellingPrice}
                  onChange={(e) =>
                    setEditItem({ ...editItem, sellingPrice: e.target.value })
                  }
                />
              </div>

              {/* BARCODE */}
              <div className={styles.field}>
                <label>Barcode</label>
                <input
                  type="text"
                  value={editItem.barcode}
                  onChange={(e) =>
                    setEditItem({ ...editItem, barcode: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      saveEditItem();
                    }
                  }}
                />
              </div>

            </div>

            <div className={styles.modalBtns}>
              <button
                type="button"
                onClick={saveEditItem}
                className={styles.submitBtn}
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={closeEditModal}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default CreatePurchase;