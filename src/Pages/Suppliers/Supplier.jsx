import { useEffect, useState, useRef } from "react";
import styles from "./Supplier.module.css";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaRegFileAlt,
  FaSearch,
  FaEllipsisV,
  FaEdit,
  FaTrash,
  FaUsers
} from "react-icons/fa";
import { IndianRupee, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { FiArrowUp } from "react-icons/fi";
import Toast from "../../components/Toast";
import { API } from "../../constants/api";
import { FaRupeeSign } from "react-icons/fa";

function Supplier() {

  const [selectedSupplier, setSelectedSupplier] =
    useState(null)
  const [suppliers, setSuppliers] =
    useState([]);

  const [supplierTotals, setSupplierTotals] = useState({
    totalBills: 0,
    totalSupplierPurchase: 0,
    totalSupplierBalance: 0,
    totalPaidAmount: 0,
  });


  const [supplierBalances, setSupplierBalances] = useState([]);
  const [activeView, setActiveView] = useState("all");
  const [toast, setToast] =
    useState(null);

  const [loadingId, setLoadingId] =
    useState(null);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [
    showDeleteConfirm,
    setShowDeleteConfirm,
  ] = useState(false);

  const [editLoading, setEditLoading] =
    useState(false);

  const [selectedDeleteId, setSelectedDeleteId] =
    useState(null);

  const [editSupplier, setEditSupplier] =
    useState({
      _id: "",
      supplierName: "",
      mobile: "",
      gstNumber: "",
      email: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    });

  const [openMenu, setOpenMenu] = useState(null);

  const menuRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchSuppliers();
    fetchSupplierTotals();
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


  const showToast = (
    message,
    type = "success"
  ) => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 2500);
  };


  const fetchSuppliers = async () => {
    try {
      const token = localStorage.getItem("token");

      const [suppliersRes, balancesRes] = await Promise.all([
        fetch(API.suppliers, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API.suppliers}/supplier-balances`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const suppliersData = await suppliersRes.json();
      const balancesData = await balancesRes.json();

      const balanceMap = {};
      (balancesData.data || []).forEach((b) => {
        balanceMap[b.supplierId] = b.balance;
      });

      const merged = (suppliersData.data || []).map((s) => ({
        ...s,
        balance: balanceMap[s._id] ?? 0,
      }));

      setSuppliers(merged);

    } catch (err) {
      showToast(err.message || "Server error", "error");
    }
  };

  const fetchSupplierBalances = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API.suppliers}/supplier-balances`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      const balanceMap = {};
suppliers.forEach((s) => {
  balanceMap[s._id] = s.gstNumber;
});

const merged = (data.data || []).map((b) => ({
  ...b,
  gstNumber: balanceMap[b.supplierId] || "-",
}));

setSupplierBalances(merged);

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to fetch balances"
        );
      }

      setSupplierBalances(data.data || []);
      

    } catch (err) {
      showToast(
        err.message || "Server error",
        "error"
      );
    }
  };

  const fetchSupplierTotals = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API.suppliers}/supplier-totals`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to fetch totals"
        );
      }

      setSupplierTotals(data.data);

    } catch (err) {
      console.error(err);
    }
  };

  const openDeleteConfirm = (id) => {
    setSelectedDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    try {
      setLoadingId(selectedDeleteId);

      const token =
        localStorage.getItem("token");

      const res = await fetch(
        `${API.suppliers}/${selectedDeleteId}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
          "Failed to delete supplier"
        );
      }

      setSuppliers((prev) =>
        prev.filter(
          (sup) =>
            sup._id !== selectedDeleteId
        )
      );

      showToast(
        data.message ||
        "Supplier deleted successfully",
        "success"
      );

      setShowDeleteConfirm(false);

    } catch (err) {
      showToast(
        err.message || "Server error",
        "error"
      );
    } finally {
      setLoadingId(null);
    }
  };

  const openEditModal = (supplier) => {
    setEditSupplier({
      _id: supplier._id,
      supplierName:
        supplier.supplierName || "",
      mobile: supplier.mobile || "",
      gstNumber:
        supplier.gstNumber || "",
      email: supplier.email || "",
      address: supplier.address || "",
      city: supplier.city || "",
      state: supplier.state || "",
      pincode:
        supplier.pincode || "",
    });

    setShowEditModal(true);

    document.body.style.overflow =
      "hidden";
  };

  const closeEditModal = () => {
    setShowEditModal(false);

    document.body.style.overflow =
      "auto";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditSupplier((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      setEditLoading(true);

      const token =
        localStorage.getItem("token");

      const res = await fetch(
        `${API.suppliers}/${editSupplier._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            supplierName:
              editSupplier.supplierName,
            mobile:
              editSupplier.mobile,
            gstNumber:
              editSupplier.gstNumber,
            email: editSupplier.email,
            address:
              editSupplier.address,
            city: editSupplier.city,
            state:
              editSupplier.state,
            pincode:
              editSupplier.pincode,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
          "Update failed"
        );
      }

      setSuppliers((prev) =>
        prev.map((sup) =>
          sup._id ===
            editSupplier._id
            ? data.data
            : sup
        )
      );

      showToast(
        data.message ||
        "Supplier updated successfully",
        "success"
      );

      closeEditModal();

    } catch (err) {
      showToast(
        err.message || "Server error",
        "error"
      );
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className={styles.container}>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
        />
      )}

      <div className={styles.header}>

        <h2>Suppliers</h2>

        <div className={styles.headerRight}>

          <div className={styles.reportBox}>
            <FaRegFileAlt />
            <span>Reports</span>
          </div>


        </div>

      </div>

      <div className={styles.cardsRow}>

        <div
          className={
            activeView === "all"
              ? styles.primaryCard
              : styles.infoCard
          }
          onClick={() => setActiveView("all")}
        >
          <div className={styles.cardTitle}>
            <FaUsers className={styles.cardIcon} />
            <p>All Suppliers</p>
          </div>
          <h2>{suppliers.length}</h2>
        </div>

        <div className={styles.infoCard}>
          <div className={styles.cardTitle}>
            <div className={styles.cardTitle}>
              <FaRupeeSign className={styles.collectIcon} />
              <p>To Collect</p>
            </div>
          </div>

          <h2>
            <FaRupeeSign className={styles.rupeeIcon} />
            0
          </h2>

        </div>

        <div
          className={
            activeView === "balance"
              ? styles.primaryCard
              : styles.infoCard
          }
          onClick={() => {
            setActiveView("balance");

            if (supplierBalances.length === 0) {
              fetchSupplierBalances();
            }
          }}
        >
          <div className={styles.cardTitle}>
            <div className={styles.cardTitle}>
              <FaRupeeSign className={styles.payIcon} />
              <p>To Pay</p>
            </div>
          </div>

          <h2>
            <FaRupeeSign className={styles.rupeeIcon} />
            {supplierTotals.totalSupplierBalance?.toLocaleString(
              "en-IN",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}
          </h2>
        </div>
      </div>

      <div className={styles.searchRow}>

        <div className={styles.searchBox}>

          <FaSearch className={styles.searchIcon} />

          <input
            type="text"
            placeholder="Search suppliers..."
            className={styles.searchInput}
          />

        </div>

        <div
          className={styles.createSupplierBox}
          onClick={() =>
            navigate("/create-supplier")
          }
        >
          <span>Create Supplier</span>
        </div>

      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Supplier Name</th>
              <th>GST No</th>
              <th>Mobile</th>
              <th>Balance</th>
              <th></th>
            </tr>
          </thead>

          <tbody>

            {activeView === "all" &&
              suppliers.map((sup) => (
                <tr
                  key={sup._id}
                  onClick={() =>
                    navigate(`/supplier/${sup._id}`)
                  }
                >


                  <td>{sup.supplierName}</td>
                  <td>{sup.gstNumber}</td>
                  <td>{sup.mobile}</td>
                  <td className={styles.balanceCell}>
                    <FiArrowUp className={styles.balanceIcon} />
                    ₹ {sup.balance.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div
                      className={styles.menuWrapper}
                      ref={
                        openMenu === sup._id
                          ? menuRef
                          : null
                      }
                    >
                      <button
                        className={styles.menuBtn}
                        onClick={() =>
                          setOpenMenu(
                            openMenu === sup._id
                              ? null
                              : sup._id
                          )
                        }
                      >
                        <FaEllipsisV />
                      </button>

                      {openMenu === sup._id && (
                        <div className={styles.dropdownMenu}>
                          <button
                            className={styles.editMenuItem}
                            onClick={() => {
                              openEditModal(sup);
                              setOpenMenu(null);
                            }}
                          >
                            <FaEdit />
                            Edit
                          </button>

                          <button
                            className={styles.deleteMenuItem}
                            onClick={() => {
                              openDeleteConfirm(
                                sup._id
                              );
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

            {activeView === "balance" &&
  supplierBalances.map((sup) => (
    <tr
      key={sup._id}
      onClick={() => navigate(`/supplier/${sup._id}`)}
    >
      <td>{sup.supplierName}</td>
      <td>{sup.gstNumber}</td>
      <td>{sup.mobile}</td>
      <td className={styles.balanceCell}>
        <FaArrowUp className={styles.balanceIcon} />
        ₹ {sup.balance.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
        })}
      </td>
      <td onClick={(e) => e.stopPropagation()}>
        <div
          className={styles.menuWrapper}
          ref={openMenu === sup._id ? menuRef : null}
        >
          <button
            className={styles.menuBtn}
            onClick={() =>
              setOpenMenu(openMenu === sup._id ? null : sup._id)
            }
          >
            <FaEllipsisV />
          </button>

          {openMenu === sup._id && (
            <div className={styles.dropdownMenu}>
              <button
                className={styles.editMenuItem}
                onClick={() => {
                  openEditModal(sup);
                  setOpenMenu(null);
                }}
              >
                <FaEdit />
                Edit
              </button>

              <button
                className={styles.deleteMenuItem}
                onClick={() => {
                  openDeleteConfirm(sup._id);
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



      {showEditModal && (
        <div
          className={
            styles.modalOverlay
          }
          onClick={closeEditModal}
        >
          <div
            className={styles.modal}
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div
              className={
                styles.modalHeader
              }
            >
              <h3>Edit Supplier</h3>

              <button
                className={
                  styles.closeBtn
                }
                onClick={
                  closeEditModal
                }
              >
                ×
              </button>
            </div>

            <div
              className={
                styles.modalBody
              }
            >

              <div
                className={
                  styles.field
                }
              >
                <label>
                  Supplier Name
                </label>

                <input
                  type="text"
                  name="supplierName"
                  value={
                    editSupplier.supplierName
                  }
                  onChange={
                    handleChange
                  }
                />
              </div>

              <div
                className={
                  styles.field
                }
              >
                <label>Mobile</label>

                <input
                  type="text"
                  name="mobile"
                  value={
                    editSupplier.mobile
                  }
                  onChange={
                    handleChange
                  }
                />
              </div>

              <div
                className={
                  styles.field
                }
              >
                <label>
                  GST Number
                </label>

                <input
                  type="text"
                  name="gstNumber"
                  value={
                    editSupplier.gstNumber
                  }
                  onChange={
                    handleChange
                  }
                />
              </div>

              <div
                className={
                  styles.field
                }
              >
                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  value={
                    editSupplier.email
                  }
                  onChange={
                    handleChange
                  }
                />
              </div>

              <div
                className={`${styles.field} ${styles.full}`}
              >
                <label>
                  Address
                </label>

                <textarea
                  name="address"
                  value={
                    editSupplier.address
                  }
                  onChange={
                    handleChange
                  }
                />
              </div>

              <div
                className={
                  styles.field
                }
              >
                <label>City</label>

                <input
                  type="text"
                  name="city"
                  value={
                    editSupplier.city
                  }
                  onChange={
                    handleChange
                  }
                />
              </div>

              <div
                className={
                  styles.field
                }
              >
                <label>State</label>

                <input
                  type="text"
                  name="state"
                  value={
                    editSupplier.state
                  }
                  onChange={
                    handleChange
                  }
                />
              </div>

              <div
                className={
                  styles.field
                }
              >
                <label>
                  Pincode
                </label>

                <input
                  type="text"
                  name="pincode"
                  value={
                    editSupplier.pincode
                  }
                  onChange={
                    handleChange
                  }
                />
              </div>

              <button
                className={
                  styles.saveBtn
                }
                onClick={
                  handleUpdate
                }
                disabled={
                  editLoading
                }
              >
                {editLoading
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div
          className={
            styles.modalOverlay
          }
        >
          <div
            className={
              styles.confirmBox
            }
          >
            <h3>
              Delete Supplier?
            </h3>

            <p>
              Are you sure you want
              to delete this supplier?
            </p>

            <div
              className={
                styles.confirmActions
              }
            >
              <button
                className={
                  styles.cancelBtn
                }
                onClick={() =>
                  setShowDeleteConfirm(
                    false
                  )
                }
              >
                Cancel
              </button>

              <button
                className={
                  styles.confirmDeleteBtn
                }
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Supplier;