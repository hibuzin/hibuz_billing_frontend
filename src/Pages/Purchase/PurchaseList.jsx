
import {
  useEffect,
  useState,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import {
  FaEllipsisV,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import Toast from "../../components/Toast";
import styles from "./PurchaseList.module.css";
import { API } from "../../constants/api";

function PurchaseList() {
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [toast, setToast] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPurchase, setEditPurchase] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [openMenu, setOpenMenu] =
  useState(null);

const menuRef = useRef(null);
  const navigate = useNavigate();

  const [paymentAmount, setPaymentAmount] = useState("");

  const handlePayment = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${API.purchase}/pay/${selectedPurchase._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: Number(paymentAmount),
          note: "Supplier payment",
        }),
      }
    );

    const data = await res.json();

    if (data.success) {

      setSelectedPurchase((prev) => ({
        ...prev,
        paidAmount: data.data.paidAmount,
        balanceAmount: data.data.balanceAmount,
        paymentHistory: data.data.paymentHistory,
      }));

      setToast({
        type: "success",
        message: "Payment updated successfully",
      });

      setPaymentAmount("");

      fetchPurchases();

    } else {
      setToast({
        type: "error",
        message: data.message || "Payment failed",
      });
    }

  } catch (err) {
    console.log(err);

    setToast({
      type: "error",
      message: "Payment failed",
    });
  }
};

  useEffect(() => {
    fetchPurchases();
    fetchProducts();
    fetchSuppliers();
  }, []);

  useEffect(() => {
  const handleClickOutside = (e) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(e.target)
    ) {
      setOpenMenu(null);
    }
  };

  document.addEventListener(
    "mousedown",
    handleClickOutside
  );

  return () =>
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
}, []);

  const fetchPurchases = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API.purchase}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setPurchases(data.data || []);
    } catch (err) {
      console.log(err);
      setToast({ type: "error", message: "Failed to load purchases" });
    }
  };

  const fetchSuppliers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(API.suppliers, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setSuppliers(data.data || []);
    } catch (err) {
      console.log(err);
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

  const handleDelete = async () => {
    try {
      setLoadingId(deleteId);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API.purchase}/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setPurchases((prev) => prev.filter((p) => p._id !== deleteId));
        setToast({ type: "success", message: "Purchase deleted successfully" });
      } else {
        setToast({ type: "error", message: data.message || "Delete failed" });
      }
    } catch (err) {
      console.log(err);
      setToast({ type: "error", message: "Delete failed" });
    } finally {
      setLoadingId(null);
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  const openEditModal = (purchase) => {
    setEditPurchase({
      ...purchase,
      supplierId: purchase.supplier?.id || purchase.supplierId || "",
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

  const getSupplierOptions = () =>
    suppliers.map((s) => ({
      value: s._id,
      label: s.supplierName,
      supplier: s,
    }));

  const getFlavorOptions = (productId) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return [];
    return (product.flavor || []).map((f) => ({ value: f, label: f }));
  };

  const getLiterOptions = (productId) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return [];
    const liters = product.liters || product.litters || [];
    const mrps = product.mrps || [];
    return liters.map((l, i) => ({
      value: l,
      label: l,
      mrp: mrps[i] || 0,
    }));
  };

  const getMrpOptions = (productId) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return [];
    return (product.mrps || []).map((m) => ({ value: m, label: `Rs. ${m}` }));
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
        supplierId: editPurchase.supplierId,
        invoiceNo: editPurchase.invoiceNo,
        invoiceDate: editPurchase.invoiceDate,
        items: editPurchase.items.map((item) => ({
          productId: item.productId?._id || item.productId,
          flavor: item.flavor,
          liters: item.litters || item.liters,
          mrp: Number(item.mrp),
          qty: Number(item.qty),
          costPrice: Number(item.costPrice),
          sellingPrice: Number(item.sellingPrice),
          barcode: item.barcode || "",
        })),
      };
      const res = await fetch(`${API.purchase}/${editPurchase._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
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

  return (
    <div className={styles.container}>
      {toast && <Toast {...toast} />}

      {/* HEADER */}
      <div className={styles.header}>

        {/* LEFT */}
        <div>
          <h2 className={styles.title}>Purchase List</h2>
          <p className={styles.count}>
            Total Purchases: {purchases.length}
          </p>
        </div>

        {/* RIGHT */}
        <div className={styles.headerActions}>

          <button
            className={styles.headerBtn}
            onClick={() => navigate("/create-supplier")}
          >
            Create Supplier
          </button>

          <button
            className={styles.headerBtn}
            onClick={() => navigate("/create-purchase")}
          >
            Create Purchase
          </button>

        </div>

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
              <th></th>
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
                <td>{p.supplier?.name || "-"}</td>
                <td>Rs. {p.supplierBillAmount}</td>
                <td>{p.items?.length}</td>
                <td>
                  {p.invoiceDate
                    ? new Date(p.invoiceDate).toLocaleDateString()
                    : "-"}
                </td>
                <td onClick={(e) => e.stopPropagation()}>
  <div
    className={styles.menuWrapper}
    ref={
      openMenu === p._id
        ? menuRef
        : null
    }
  >
    <button
      className={styles.menuBtn}
      onClick={() =>
        setOpenMenu(
          openMenu === p._id
            ? null
            : p._id
        )
      }
    >
      <FaEllipsisV />
    </button>

    {openMenu === p._id && (
      <div className={styles.dropdownMenu}>
        <button
          className={styles.editMenuItem}
          onClick={() => {
            openEditModal(p);
            setOpenMenu(null);
          }}
        >
          <FaEdit />
          Edit
        </button>

        <button
          className={styles.deleteMenuItem}
          onClick={() => {
            setDeleteId(p._id);
            setShowDeleteModal(true);
            setOpenMenu(null);
          }}
        >
          <FaTrash />
          Delete
        </button>
      </div>
    )}
  </div>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.deleteModal}>
            <h3>Delete Purchase?</h3>
            <p>Are you sure you want to delete this purchase?</p>
            <div className={styles.deleteActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => { setShowDeleteModal(false); setDeleteId(null); }}
              >
                Cancel
              </button>
              <button className={styles.confirmDeleteBtn} onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

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

            {/* HEADER */}
            <div className={styles.modalHeader}>
              <h3>Purchase Details</h3>

              <button
                className={styles.closeBtn}
                onClick={() => setSelectedPurchase(null)}
              >
                x
              </button>
            </div>

            {/* DETAILS */}
            <div className={styles.detailsGrid}>

              <div>
                <label>Supplier</label>
                <p>{selectedPurchase.supplier?.name || "-"}</p>
              </div>

              <div>
                <label>Invoice No</label>
                <p>{selectedPurchase.invoiceNo}</p>
              </div>

              <div>
                <label>Total Amount</label>
                <p>₹ {selectedPurchase.totalAmount}</p>
              </div>

              <div>
                <label>Paid Amount</label>
                <p>₹ {selectedPurchase.paidAmount}</p>
              </div>

              <div>
                <label>Balance</label>
                <p>₹ {selectedPurchase.balanceAmount}</p>
              </div>

              <div className={styles.field}>
                <label>Add Payment</label>

                <input
                  type="number"
                  placeholder="Enter amount"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />

                <button
                  className={styles.payBtn}
                  onClick={handlePayment}
                >
                  Update Payment
                </button>
              </div>

              <div>
                <label>Date</label>
                <p>
                  {selectedPurchase.invoiceDate
                    ? new Date(
                      selectedPurchase.invoiceDate
                    ).toLocaleDateString()
                    : "-"}
                </p>
              </div>

            </div>

            {/* PRODUCTS */}
            <div className={styles.itemsSection}>
              <h4>Products</h4>

              {selectedPurchase.items?.map((item, index) => (
                <div key={index} className={styles.itemCard}>

                  <div>
                    <strong>{item.productName}</strong>

                    <p>
                      {item.brand && `${item.brand} • `}
                      {item.flavor && `${item.flavor} • `}
                      {item.litters || item.liters || ""}
                    </p>
                  </div>

                  <div className={styles.itemRight}>
                    <span>Qty: {item.qty}</span>
                    <span>MRP: ₹{item.mrp}</span>
                    <span>CP: ₹{item.costPrice}</span>
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

            {/* HEADER */}
            <div className={styles.modalHeader}>
              <h3>Edit Purchase</h3>
              <button className={styles.closeBtn} onClick={closeEditModal}>x</button>
            </div>

            {/* BODY */}
            <div className={styles.modalBody}>

              {/*  Purchase-level fields OUTSIDE the items loop */}
              <div className={styles.editCard}>
                <div className={styles.modalGrid}>

                  {/* SUPPLIER */}
                  <div className={styles.field}>
                    <label>Supplier</label>
                    <Select
                      options={getSupplierOptions()}
                      value={
                        getSupplierOptions().find(
                          (s) => s.value === editPurchase.supplierId
                        ) || null
                      }
                      onChange={(selected) =>
                        setEditPurchase({ ...editPurchase, supplierId: selected?.value })
                      }
                      placeholder="Select Supplier"
                    />
                  </div>

                  {/* INVOICE */}
                  <div className={styles.field}>
                    <label>Invoice No</label>
                    <input
                      type="text"
                      value={editPurchase.invoiceNo || ""}
                      onChange={(e) =>
                        setEditPurchase({ ...editPurchase, invoiceNo: e.target.value })
                      }
                    />
                  </div>



                  {/* DATE */}
                  <div className={styles.field}>
                    <label>Purchase Date</label>
                    <input
                      type="date"
                      value={
                        editPurchase.invoiceDate
                          ? editPurchase.invoiceDate.split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setEditPurchase({ ...editPurchase, invoiceDate: e.target.value })
                      }
                    />
                  </div>

                </div>
              </div>

              {/* Items loop — only item-specific fields here */}
              {editPurchase.items?.map((item, index) => (
                <div key={index} className={styles.editCard}>
                  <h4 style={{ marginBottom: "8px" }}>Item {index + 1}</h4>
                  <div className={styles.modalGrid}>

                    {/* PRODUCT */}
                    <div className={styles.field}>
                      <label>Product</label>
                      <Select
                        options={getProductOptions()}
                        value={
                          getProductOptions().find(
                            (p) => p.value === (item.productId?._id || item.productId)
                          ) || null
                        }
                        onChange={(selected) => {
                          const product = selected?.product;
                          updateItem(index, "productId", product);
                          updateItem(index, "flavor", product?.flavor?.[0] || "");
                          updateItem(index, "litters", product?.liters?.[0] || product?.litters?.[0] || "");
                          updateItem(index, "mrp", product?.mrps?.[0] || "");
                        }}
                      />
                    </div>

                    {/* FLAVOR */}
                    <div className={styles.field}>
                      <label>Flavor</label>
                      <Select
                        options={getFlavorOptions(item.productId?._id || item.productId)}
                        value={
                          getFlavorOptions(item.productId?._id || item.productId).find(
                            (f) => f.value === item.flavor
                          ) || null
                        }
                        onChange={(selected) => updateItem(index, "flavor", selected?.value)}
                      />
                    </div>

                    {/* LITERS */}
                    <div className={styles.field}>
                      <label>Liters</label>
                      <Select
                        options={getLiterOptions(item.productId?._id || item.productId)}
                        value={
                          getLiterOptions(item.productId?._id || item.productId).find(
                            (l) => l.value === (item.litters || item.liters)
                          ) || null
                        }
                        onChange={(selected) => {
                          updateItem(index, "litters", selected?.value);
                          updateItem(index, "mrp", selected?.mrp);
                        }}
                      />
                    </div>

                    {/* MRP */}
                    <div className={styles.field}>
                      <label>MRP</label>
                      <Select
                        options={getMrpOptions(item.productId?._id || item.productId)}
                        value={
                          getMrpOptions(item.productId?._id || item.productId).find(
                            (m) => m.value === item.mrp || m.value === Number(item.mrp)
                          ) || null
                        }
                        onChange={(selected) => updateItem(index, "mrp", selected?.value)}
                        placeholder="Select MRP"
                      />
                    </div>

                    {/* BARCODE —  now per-item as per GET response */}
                    <div className={styles.field}>
                      <label>Barcode</label>
                      <input
                        type="text"
                        value={item.barcode || ""}
                        onChange={(e) => updateItem(index, "barcode", e.target.value)}
                      />
                    </div>

                    {/* QTY */}
                    <div className={styles.field}>
                      <label>Quantity</label>
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) => updateItem(index, "qty", e.target.value)}
                      />
                    </div>

                    {/* COST PRICE */}
                    <div className={styles.field}>
                      <label>Cost Price</label>
                      <input
                        type="number"
                        value={item.costPrice}
                        onChange={(e) => updateItem(index, "costPrice", e.target.value)}
                      />
                    </div>

                    {/* SELLING PRICE */}
                    <div className={styles.field}>
                      <label>Selling Price</label>
                      <input
                        type="number"
                        value={item.sellingPrice}
                        onChange={(e) => updateItem(index, "sellingPrice", e.target.value)}
                      />
                    </div>

                  </div>
                </div>
              ))}

              {/* SAVE */}
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