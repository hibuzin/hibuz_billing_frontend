import { useEffect, useState } from "react";
import styles from "./Supplier.module.css";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import Toast from "./Toast";
import { API } from "../constants/api";

function Supplier() {

  const [selectedSupplier, setSelectedSupplier] =
  useState(null);
  const [suppliers, setSuppliers] =
    useState([]);

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

  const navigate = useNavigate();

  useEffect(() => {
    fetchSuppliers();
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
      const token =
        localStorage.getItem("token");

      const res = await fetch(
        API.suppliers,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch suppliers"
        );
      }

      setSuppliers(data.data || []);

    } catch (err) {
      showToast(
        err.message || "Server error",
        "error"
      );
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
        fetch(`${API.suppliers}/${editSupplier._id}`),
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
        <div>
          <h2>Suppliers</h2>

          <p>
            Manage supplier details
          </p>
        </div>

        <button
          className={styles.addBtn}
          onClick={() =>
            navigate("/create-supplier")
          }
        >
          <FaPlus />
        </button>
      </div>

      <div className={styles.tableWrapper}>
  <table className={styles.table}>
    <thead>
  <tr>
    <th>No</th>
    <th>Supplier Name</th>
    <th>GST No</th>
    <th>Mobile</th>
    <th>Actions</th>
  </tr>
</thead>

<tbody>
  {suppliers.map((sup, index) => (
    <tr
      key={sup._id}
      onClick={() =>
        setSelectedSupplier(sup)
      }
      className={styles.tableRow}
    >
      <td>{index + 1}</td>

      <td className={styles.nameCell}>
        {sup.supplierName}
      </td>

      <td>{sup.gstNumber}</td>

      <td>{sup.mobile}</td>

      <td>
        <div
          className={styles.actionBtns}
          onClick={(e) =>
            e.stopPropagation()
          }
        >
          <button
            className={styles.editBtn}
            onClick={() =>
              openEditModal(sup)
            }
          >
            <FaEdit />
          </button>

          <button
            className={styles.deleteBtn}
            onClick={() =>
              openDeleteConfirm(
                sup._id
              )
            }
            disabled={
              loadingId === sup._id
            }
          >
            <FaTrash />
          </button>
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