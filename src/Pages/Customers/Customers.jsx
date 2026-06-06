import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Customers.module.css";
import { FiSearch, FiX } from "react-icons/fi";
import {
  FaRegFileAlt,
  FaEdit,
  FaTrash,
  FaEllipsisV,
} from "react-icons/fa";
import Toast from "../../components/Toast";
import { API } from "../../constants/api";
import {
  Users,
  Award,
  UserCheck,
  ExternalLink
} from "lucide-react";


function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  const [selected, setSelected] = useState(null);
  const [bills, setBills] = useState([]);
  const [billsLoading, setBillsLoading] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
const menuRef = useRef(null);

  const [editCustomer, setEditCustomer] = useState({
    _id: "", name: "", phone: "", email: "", address: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (search.trim()) {
      searchCustomers(search);
    } else {
      fetchCustomers();
    }
  }, [search]);

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target)
    ) {
      setOpenMenu(null);
    }
  };

  document.addEventListener(
    "mousedown",
    handleClickOutside
  );

  return () => {
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
  };
}, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(API.customers, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch customers");
      setCustomers(data.data || []);
    } catch (err) {
      showToast(err.message || "Server error", "error");
    }
  };

  const searchCustomers = async (query) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API.customerSearch}?q=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      setCustomers(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBills = async (customerId) => {
    try {
      setBillsLoading(true);
      setBills([]);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://192.168.31.181:5000/api/bill/search/customer?search=${customerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (data.success) setBills(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setBillsLoading(false);
    }
  };

  const openCustomer = (customer) => {
    setSelected(customer);
    setSelectedBill(null);
    fetchBills(customer.id);
  };

  const closePanel = () => {
    setSelected(null);
    setBills([]);
    setSelectedBill(null);
  };

  const openEditModal = (e, customer) => {
    e.stopPropagation();
    setEditCustomer({
      _id: customer._id,
      name: customer.name || "",
      phone: customer.phone || "",
      email: customer.email || "",
      address: customer.address || "",
    });
    setShowEditModal(true);
    document.body.style.overflow = "hidden";
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    document.body.style.overflow = "auto";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      setEditLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API.customers}/${editCustomer._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editCustomer.name,
          phone: editCustomer.phone,
          email: editCustomer.email,
          address: editCustomer.address,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");
      setCustomers((prev) =>
        prev.map((c) => (c._id === editCustomer._id ? data.data : c))
      );
      if (selected?._id === editCustomer._id) setSelected(data.data);
      showToast(data.message || "Customer updated successfully");
      closeEditModal();
    } catch (err) {
      showToast(err.message || "Server error", "error");
    } finally {
      setEditLoading(false);
    }
  };

  const openDeleteConfirm = (e, id) => {
    e.stopPropagation();
    setSelectedDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    try {
      setLoadingId(selectedDeleteId);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API.customers}/${selectedDeleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete");
      setCustomers((prev) => prev.filter((c) => c._id !== selectedDeleteId));
      if (selected?._id === selectedDeleteId) closePanel();
      showToast(data.message || "Customer deleted successfully");
      setShowDeleteConfirm(false);
    } catch (err) {
      showToast(err.message || "Server error", "error");
    } finally {
      setLoadingId(null);
    }
  };

  const totalPoints = customers.reduce((sum, c) => sum + (c.loyaltyPoints || 0), 0);

  return (
    <div className={styles.container}>

      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* HEADER */}
      <div className={styles.header}>
        <h2>Customers</h2>
        <div className={styles.headerRight}>
          <div className={styles.reportBox}>
            <FaRegFileAlt />
            <span>Reports</span>
          </div>
        </div>
      </div>

      {/* CARDS */}
     <div className={styles.cardsRow}>

  {/* ALL CUSTOMERS */}
  <div className={styles.infoCard}>
    <div className={`${styles.cardRow} ${styles.customerCard}`}>
      <div className={styles.cardTitle}>
        <Users size={14} />
        <p>All Customers</p>
      </div>

      <ExternalLink
        size={14}
        className={styles.externalIcon}
      />
    </div>

    <h2>{customers.length}</h2>
  </div>

  {/* LOYALTY POINTS */}
  <div className={styles.infoCard}>
    <div className={`${styles.cardRow} ${styles.pointsCard}`}>
      <div className={styles.cardTitle}>
        <Award size={14} />
        <p>Total Loyalty Points</p>
      </div>

      <ExternalLink
        size={14}
        className={styles.externalIcon}
      />
    </div>

    <h2>
      {totalPoints.toLocaleString("en-IN")}
    </h2>
  </div>

  {/* ACTIVE TODAY */}
  <div className={styles.infoCard}>
    <div className={`${styles.cardRow} ${styles.activeCard}`}>
      <div className={styles.cardTitle}>
        <UserCheck size={14} />
        <p>To Collect</p>
      </div>

      <ExternalLink
        size={14}
        className={styles.externalIcon}
      />
    </div>

    <h2>0</h2>
  </div>

</div>

      {/* SEARCH + CREATE */}
      <div className={styles.searchRow}>
        <div className={styles.searchBox}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search customers..."
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div
          className={styles.createCustomerBox}
          onClick={() => navigate("/create-customer")}
        >
          <span>Create Customer</span>
        </div>
      </div>

      {/* MAIN BODY — split when selected */}
      <div className={`${styles.mainBody} ${selected ? styles.split : ""}`}>

        {/* TABLE */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone</th>
                {!selected && <th>Email</th>}
                <th>Points</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr
                  key={c._id}
                  className={`${styles.tableRow} ${selected?._id === c._id ? styles.activeRow : ""}`}
                  onClick={() => openCustomer(c)}
                >
                  <td className={styles.idCell}>{c.id}</td>
                  <td className={styles.nameCell}>{c.name}</td>
                  <td>{c.phone}</td>
                  {!selected && <td>{c.email || "—"}</td>}
                  <td>{(c.loyaltyPoints || 0).toLocaleString("en-IN")}</td>
                  <td>
  <div
    ref={openMenu === c._id ? menuRef : null}
    className={styles.menuWrapper}
  >
    <button
      className={styles.menuBtn}
      onClick={(e) => {
        e.stopPropagation();
        setOpenMenu(
          openMenu === c._id ? null : c._id
        );
      }}
    >
      <FaEllipsisV />
    </button>

    {openMenu === c._id && (
      <div className={styles.dropdownMenu}>
        <button
          className={styles.editMenuItem}
          onClick={(e) => {
            openEditModal(e, c);
            setOpenMenu(null);
          }}
        >
          <FaEdit />
          Edit
        </button>

        <button
          className={styles.deleteMenuItem}
          onClick={(e) => {
            openDeleteConfirm(e, c._id);
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

        {/* RIGHT PANEL */}
        {selected && (
          <div className={styles.rightPanel}>

            {/* PANEL HEADER */}
            <div className={styles.panelHeader}>
              <div>
                <h3 className={styles.panelName}>{selected.name}</h3>
                <p className={styles.panelSub}>#{selected.id} · {selected.phone}</p>
              </div>
              <button className={styles.panelClose} onClick={closePanel}>
                <FiX />
              </button>
            </div>

            {/* CUSTOMER INFO */}
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Email</span>
                <span className={styles.infoValue}>{selected.email || "—"}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Points</span>
                <span className={styles.infoValue}>{(selected.loyaltyPoints || 0).toLocaleString("en-IN")}</span>
              </div>
              <div className={`${styles.infoItem} ${styles.infoFull}`}>
                <span className={styles.infoLabel}>Address</span>
                <span className={styles.infoValue}>{selected.address || "—"}</span>
              </div>
            </div>

            {/* BILLS */}
            <div className={styles.billsHeader}>
              <span className={styles.billsTitle}>Bill History</span>
              <span className={styles.billCount}>{bills.length}</span>
            </div>

            {billsLoading ? (
              <p className={styles.emptyText}>Loading bills...</p>
            ) : bills.length === 0 ? (
              <p className={styles.emptyText}>No bills found</p>
            ) : (
              <div className={styles.billsList}>
                {bills.map((bill) => (
                  <div
                    key={bill._id}
                    className={styles.billCard}
                    onClick={() => setSelectedBill(bill)}
                  >
                    <div className={styles.billTop}>
                      <span className={styles.billDate}>
                        {new Date(bill.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit", month: "short", year: "numeric",
                        })}
                      </span>
                      <span className={styles.billAmount}>
                        ₹{bill.summary.grandTotal}
                      </span>
                    </div>
                    <div className={styles.billMeta}>
                      {bill.items.length} items · {bill.paymentMethod}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* BILL RECEIPT MODAL */}
            {selectedBill && (
              <>
                <div className={styles.billOverlay} onClick={() => setSelectedBill(null)} />
                <div className={styles.receiptBox}>
                  <button className={styles.receiptClose} onClick={() => setSelectedBill(null)}>
                    <FiX />
                  </button>
                  <div className={styles.receiptHeader}>
                    <h2>PARVATHI SUPER MARKET</h2>
                    <p>No.12, Chennai Main Road</p>
                    <p>Ph: +91 9876543210</p>
                    <p>GSTIN: 33ABCDE1234F1Z5</p>
                  </div>
                  <div className={styles.dashedLine} />
                  <div className={styles.receiptInfo}>
                    <p>Bill No: #{selectedBill.billNumber || selectedBill._id.slice(-5)}</p>
                    <p>Date: {new Date(selectedBill.createdAt).toLocaleString("en-IN")}</p>
                    <p>Payment: {selectedBill.paymentMethod}</p>
                  </div>
                  <div className={styles.dashedLine} />
                  <div className={styles.receiptTableHeader}>
                    <span>Item</span>
                    <span>Qty</span>
                    <span>Amt</span>
                  </div>
                  <div className={styles.dashedLine} />
                  {selectedBill.items.map((item, i) => (
                    <div key={i} className={styles.receiptItem}>
                      <div>
                        <strong>{item.name}</strong>
                        {item.flavor && <p className={styles.flavor}>{item.flavor}</p>}
                      </div>
                      <div>{item.qty}</div>
                      <div>₹{item.finalPrice}</div>
                    </div>
                  ))}
                  <div className={styles.dashedLine} />
                  <div className={styles.receiptGrand}>
                    <span>TOTAL</span>
                    <span>₹{selectedBill.summary.grandTotal}</span>
                  </div>
                  <div className={styles.dashedLine} />
                  <div className={styles.receiptFooter}>
                    <p>Thank You, Visit Again!</p>
                    <p>Powered by Askar Billing</p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className={styles.modalOverlay} onClick={closeEditModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Edit Customer</h3>
              <button className={styles.closeBtn} onClick={closeEditModal}>×</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.field}>
                <label>Name</label>
                <input type="text" name="name" value={editCustomer.name} onChange={handleChange} />
              </div>
              <div className={styles.field}>
                <label>Phone</label>
                <input type="text" name="phone" value={editCustomer.phone} onChange={handleChange} />
              </div>
              <div className={styles.field}>
                <label>Email</label>
                <input type="email" name="email" value={editCustomer.email} onChange={handleChange} />
              </div>
              <div className={`${styles.field} ${styles.full}`}>
                <label>Address</label>
                <textarea name="address" value={editCustomer.address} onChange={handleChange} />
              </div>
              <button className={styles.saveBtn} onClick={handleUpdate} disabled={editLoading}>
                {editLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {showDeleteConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.confirmBox}>
            <h3>Delete Customer?</h3>
            <p>Are you sure you want to delete this customer?</p>
            <div className={styles.confirmActions}>
              <button className={styles.cancelBtn} onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className={styles.confirmDeleteBtn} onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Customers;