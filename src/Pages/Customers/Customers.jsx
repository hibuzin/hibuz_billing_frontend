import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Customers.module.css";
import { FiPlus, FiSearch } from "react-icons/fi";
import Toast from "../../components/Toast";
import { API } from "../../constants/api";

function Customers() {

  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] =
  useState(false);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();
  const addBtnRef = useRef(null);

const rowRefs = useRef([]);

  const [toast, setToast] = useState({
  message: "",
  type: "success",
});

const [isEditing, setIsEditing] = useState(false);

  const [editData, setEditData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  useEffect(() => {
  if (search.trim()) {
    searchCustomers(search);
  } else {
    fetchCustomers();
  }
}, [search]);

  const showToast = (message, type = "success") => {
  setToast({ message, type });

  setTimeout(() => {
    setToast({ message: "", type: "success" });
  }, 2500);
};

  const fetchCustomers = () => {
    const token = localStorage.getItem("token");

    fetch(API.customers, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch customers");
        }

        return data;
      })
      .then((data) => {
        setCustomers(data.data || []);
      })
      .catch((err) => console.error("FETCH ERROR:", err));
  };

  const searchCustomers = async (query) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${API.customerSearch}?q=${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.message || "Failed to search customers"
      );
    }

    setCustomers(data.data || []);

  } catch (err) {
    console.error("SEARCH ERROR:", err);
  }
};

  const openCustomer = (customer) => {
    setSelected(customer);

    setEditData({
      name: customer.name || "",
      phone: customer.phone || "",
      email: customer.email || "",
      address: customer.address || "",
    });

    setIsEditing(false);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API.customers}/${selected._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Update failed");
      }

      showToast("Customer updated successfully");

      setCustomers((prev) =>
        prev.map((c) =>
          c._id === selected._id ? data.data : c
        )
      );

      setSelected(data.data);

      setIsEditing(false);

    } catch (err) {
      console.error("UPDATE ERROR:", err);
      showToast(err.message, "error");
    }
  };

  
  const maxPts = Math.max(
    ...customers.map((c) => c.loyaltyPoints || 0),
    1
  );

  const handleDelete = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${API.customers}/${selected._id}`,
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
        data.message || "Failed to delete customer"
      );
    }

    showToast(
      "Customer deleted successfully",
      "success"
    );

    setCustomers((prev) =>
      prev.filter((c) => c._id !== selected._id)
    );

    setSelected(null);

    setShowDeleteConfirm(false);

  } catch (err) {
    console.error("DELETE ERROR:", err);

    showToast(err.message, "error");
  }
};

  return (
    <>
      <div className={styles.wrap}>
        <div className={styles.topSection}>

  <h1 className={styles.title}>
    Customers
  </h1>

  <div className={styles.searchRow}>

    <div className={styles.searchBox}>

      <FiSearch className={styles.searchIcon} />

      <input
        type="text"
        placeholder="Search by name, phone or ID..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className={styles.searchInput}
      />

    </div>

    <button
      ref={addBtnRef}
      className={styles.addBtn}
      onClick={() =>
        navigate("/create-customer")
      }
    >
      <FiPlus />
    </button>

  </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Points</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((c) => (
              <tr
                key={c.id}
                onClick={() => openCustomer(c)}
              >
                <td className={styles.idCell}>{c.id}</td>

                <td className={styles.nameCell}>
                  {c.name}
                </td>

                <td>{c.phone}</td>

                <td>{c.email}</td>

                <td className={styles.ptsCell}>
                  <span className={styles.ptsValue}>
                    {(c.loyaltyPoints || 0).toLocaleString()}
                  </span>

                  <span
                    className={styles.ptsBar}
                    style={{
                      width: `${
                        maxPts
                          ? Math.round(
                              (c.loyaltyPoints / maxPts) * 40
                            )
                          : 0
                      }px`,
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div
          className={styles.overlay}
          onClick={(e) =>
            e.target === e.currentTarget &&
            setSelected(null)
          }
        >
          <div className={styles.dialog}>
            <div className={styles.dialogHeader}>
              <div>
                <div className={styles.dialogName}>
                  {selected.name}
                </div>

                <div className={styles.dialogId}>
                  Customer #{selected.id}
                </div>
              </div>

              <div className={styles.actionBtns}>
                <button
                  className={styles.editBtn}
                  onClick={() =>
                    setIsEditing(!isEditing)
                  }
                >
                  {isEditing ? "Cancel" : "Edit"}
                </button>

<button
  className={styles.deleteBtn}
  onClick={() => setShowDeleteConfirm(true)}
>
  Delete
</button>
                <button
                  className={styles.closeBtn}
                  onClick={() => setSelected(null)}
                >
                  ✕
                </button>
              </div>
            </div>

            <hr className={styles.divider} />

            <div className={styles.dialogGrid}>
              {Object.entries(
  isEditing
    ? { ...selected, ...editData }
    : selected
).map(
                ([key, value]) => {
                  if (key === "__v") return null;

                  return (
                    <div
                      key={key}
                      className={styles.field}
                    >
                      <label>{key}</label>

                      {isEditing &&
                      [
                        "name",
                        "phone",
                        "email",
                        "address",
                      ].includes(key) ? (
                        key === "address" ? (
                          <textarea
                            value={editData[key]}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                [key]:
                                  e.target.value,
                              })
                            }
                          />
                        ) : (
                          <input
                            type="text"
                            value={editData[key]}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                [key]:
                                  e.target.value,
                              })
                            }
                          />
                        )
                      ) : (
                        <p>
                          {value === null ||
                          value === undefined ||
                          value === ""
                            ? "—"
                            : typeof value ===
                              "object"
                            ? JSON.stringify(
                                value
                              )
                            : value.toString()}
                        </p>
                      )}
                    </div>
                  );
                }
              )}
            </div>

            {isEditing && (
              <button
                className={styles.updateBtn}
                onClick={handleUpdate}
              >
                Save Changes
              </button>
            )}
          </div>
          {showDeleteConfirm && (
  <div className={styles.confirmOverlay}>
    <div className={styles.confirmBox}>
      <h3>Delete Customer?</h3>

      <p>
         Are you sure you want to delete this customer?
      </p>

      <div className={styles.confirmActions}>
        <button
          className={styles.cancelBtn}
          onClick={() =>
            setShowDeleteConfirm(false)
          }
        >
          Cancel
        </button>

        <button
          className={styles.confirmDeleteBtn}
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}
        </div>
      )}
      <Toast
  message={toast.message}
  type={toast.type}
/>
    </>
  );
}

export default Customers;