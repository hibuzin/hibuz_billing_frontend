import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { FaTrash, FaPlus, FaEdit } from "react-icons/fa";
import Toast from "../../components/Toast";
import styles from "./PurchaseList.module.css";
import { API } from "../../constants/api";

function PurchaseList() {
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [products, setProducts] = useState([]);
  const [toast, setToast] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPurchase, setEditPurchase] = useState(null);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPurchases();
    fetchProducts();
  }, []);

  const fetchPurchases = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API.purchases}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setPurchases(data.data || []);
    } catch (err) {
      console.log(err);
      setToast({ type: "error", message: "Failed to load purchases" });
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API.products}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setProducts(data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this purchase?")) return;
    try {
      setLoadingId(id);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API.purchases}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setPurchases((prev) => prev.filter((p) => p._id !== id));
        setToast({ type: "success", message: "Purchase deleted successfully" });
      }
    } catch (err) {
      console.log(err);
      setToast({ type: "error", message: "Delete failed" });
    } finally {
      setLoadingId(null);
    }
  };

  const openEditModal = (purchase) => {
    setEditPurchase({
      ...purchase,
      items: purchase.items.map((item) => ({ ...item })),
    });
    setShowEditModal(true);
    document.body.style.overflow = "hidden";
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    document.body.style.overflow = "auto";
  };

  const getProductOptions = () =>
    products.map((p) => ({ value: p._id, label: p.name, product: p }));

  const getFlavorOptions = (productId) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return [];
    return product.flavor.map((f) => ({ value: f, label: f }));
  };

  const getLiterOptions = (productId) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return [];
    return product.liters.map((l, i) => ({
      value: l,
      label: l,
      mrp: product.mrps[i],
    }));
  };

  const updateItem = (index, field, value) => {
    const updatedItems = [...editPurchase.items];
    updatedItems[index][field] = value;
    setEditPurchase({ ...editPurchase, items: updatedItems });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const payload = {
        supplierId: editPurchase.supplierId?._id,
        items: editPurchase.items.map((item) => ({
          productId: item.productId?._id || item.productId,
          flavor: item.flavor,
          liters: item.liters,
          mrp: Number(item.mrp),
          qty: Number(item.qty),
          costPrice: Number(item.costPrice),
          sellingPrice: Number(item.sellingPrice),
        })),
      };
      const res = await fetch(
        `${API.purchases}/${editPurchase._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");
      setToast({ type: "success", message: "Purchase updated successfully" });
      fetchPurchases();
      closeEditModal();
    } catch (err) {
      console.log(err);
      setToast({ type: "error", message: err.message || "Update failed" });
    } finally {
      setSaving(false);
    }
  };

  // Supplier name helper — handles both populated object and plain string
  const getSupplierName = (supplierId) => {
    if (!supplierId) return "—";
    if (typeof supplierId === "object") {
      return supplierId.supplierName || supplierId.name || "—";
    }
    return supplierId;
  };

  return (
    <div className={styles.container}>
      {toast && <Toast {...toast} />}

      {/* HEADER */}
      <div className={styles.header}>
  <div>
    <h2 className={styles.title}>
      Purchase List
    </h2>

    <p className={styles.count}>
      Total Purchases:
      {purchases.length}
    </p>
  </div>

  <button
    className={styles.addBtn}
    onClick={() =>
      navigate("/create-purchase")
    }
  >
    <FaPlus />
  </button>
</div>

      {/* TABLE */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>No</th>
              <th>Supplier</th>
              <th>Total</th>
              <th>Items</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((p, index) => (
              <tr
                key={p._id}
                className={styles.tableRow}
                onClick={() => setSelectedPurchase(p)}
              >
                <td>{index + 1}</td>
                <td>{getSupplierName(p.supplierId)}</td>
                <td>Rs. {p.totalAmount}</td>
                <td>{p.items?.length}</td>
                <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                <td>
                  <div
                    className={styles.actionBtns}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className={styles.editBtn}
                      onClick={() => openEditModal(p)}
                    >
                      <FaEdit size={12} />
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(p._id)}
                      disabled={loadingId === p._id}
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DETAIL MODAL */}
      {selectedPurchase && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedPurchase(null)}
        >
          <div
            className={styles.detailModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>Purchase Details</h3>
              <button
                className={styles.closeBtn}
                onClick={() => setSelectedPurchase(null)}
              >
                x
              </button>
            </div>

            <div className={styles.detailsGrid}>
              <div>
                <label>Supplier</label>
                <p>{getSupplierName(selectedPurchase.supplierId)}</p>
              </div>
              <div>
                <label>Total Amount</label>
                <p>Rs. {selectedPurchase.totalAmount}</p>
              </div>
              <div>
                <label>Total Items</label>
                <p>{selectedPurchase.items?.length}</p>
              </div>
              <div>
                <label>Date</label>
                <p>
                  {new Date(selectedPurchase.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className={styles.itemsSection}>
              <h4>Products</h4>
              {selectedPurchase.items?.map((item, index) => (
                <div key={index} className={styles.itemCard}>
                  <div>
                    <strong>{item.productId?.name}</strong>
                    <p>
                      {item.flavor} &bull; {item.liters}
                    </p>
                  </div>
                  <div className={styles.itemRight}>
                    <span>Qty: {item.qty}</span>
                    <span>Rs. {item.costPrice}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && editPurchase && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Edit Purchase</h3>
              <button className={styles.closeBtn} onClick={closeEditModal}>
                x
              </button>
            </div>

            <div className={styles.modalBody}>
              {editPurchase.items?.map((item, index) => (
                <div key={index} className={styles.editCard}>
                  <div className={styles.modalGrid}>
                    {/* PRODUCT */}
                    <div className={styles.field}>
                      <label>Product</label>
                      <Select
                        options={getProductOptions()}
                        value={getProductOptions().find(
                          (p) => p.value === item.productId?._id
                        )}
                        onChange={(selected) => {
                          const product = selected?.product;
                          updateItem(index, "productId", product);
                          updateItem(index, "flavor", product?.flavor?.[0] || "");
                          updateItem(index, "liters", product?.liters?.[0] || "");
                          updateItem(index, "mrp", product?.mrps?.[0] || "");
                        }}
                      />
                    </div>

                    {/* FLAVOR */}
                    <div className={styles.field}>
                      <label>Flavor</label>
                      <Select
                        options={getFlavorOptions(item.productId?._id)}
                        value={getFlavorOptions(item.productId?._id).find(
                          (f) => f.value === item.flavor
                        )}
                        onChange={(selected) =>
                          updateItem(index, "flavor", selected?.value)
                        }
                      />
                    </div>

                    {/* LITERS */}
                    <div className={styles.field}>
                      <label>Liters</label>
                      <Select
                        options={getLiterOptions(item.productId?._id)}
                        value={getLiterOptions(item.productId?._id).find(
                          (l) => l.value === item.liters
                        )}
                        onChange={(selected) => {
                          updateItem(index, "liters", selected?.value);
                          updateItem(index, "mrp", selected?.mrp);
                        }}
                      />
                    </div>

                    {/* MRP */}
                    <div className={styles.field}>
                      <label>MRP</label>
                      <input
                        type="number"
                        value={item.mrp}
                        onChange={(e) =>
                          updateItem(index, "mrp", e.target.value)
                        }
                      />
                    </div>

                    {/* QTY */}
                    <div className={styles.field}>
                      <label>Quantity</label>
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) =>
                          updateItem(index, "qty", e.target.value)
                        }
                      />
                    </div>

                    {/* COST */}
                    <div className={styles.field}>
                      <label>Cost Price</label>
                      <input
                        type="number"
                        value={item.costPrice}
                        onChange={(e) =>
                          updateItem(index, "costPrice", e.target.value)
                        }
                      />
                    </div>

                    {/* SELLING */}
                    <div className={styles.field}>
                      <label>Selling Price</label>
                      <input
                        type="number"
                        value={item.sellingPrice}
                        onChange={(e) =>
                          updateItem(index, "sellingPrice", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                className={styles.submitBtn}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PurchaseList;