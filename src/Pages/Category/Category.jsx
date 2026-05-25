import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Category.module.css";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Toast from "../../components/Toast";
import { API } from "../../constants/api";

function Category() {
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(null);

  const [deleteItem, setDeleteItem] =
    useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: "" });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: "", type: "success" });
    }, 2500);
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(API.categories, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setCategories(data.data || []);
      } else {
        showToast("Failed to load categories", "error");
      }
    } catch (err) {
      showToast("Server error", "error");
    }
  };

  const openCategory = (cat) => {
    setSelected(cat);
    setEditData({ name: cat.name });
    setIsEditing(false);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API.categories}/${selected._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      showToast("Category updated successfully");

      setCategories((prev) =>
        prev.map((c) =>
          c._id === selected._id ? data.data : c
        )
      );

      setSelected(data.data);
      setIsEditing(false);
    } catch (err) {
      showToast(err.message, "error");
    }

  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API.categories}/${deleteItem._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      showToast("Category deleted successfully");

      setCategories((prev) =>
        prev.filter((c) => c._id !== deleteItem._id)
      );

      setDeleteItem(null);
      setShowDeleteConfirm(false);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <>
      <div className={styles.wrap}>
        <div className={styles.topSection}>
          <h1 className={styles.title}>Categories</h1>

          <button
            className={styles.addBtn}
            onClick={() => navigate("/create-category")}
          >
            <FaPlus />
          </button>
        </div>

        <div className={styles.card}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Category Name</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((c, i) => (
                <tr key={c._id} onClick={() => openCategory(c)}>
                  <td>{i + 1}</td>
                  <td>{c.name}</td>

                  <td>
                    <div className={styles.actions}>

                      <button
                        className={styles.editBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected(c);
                          setEditData({
                            name: c.name || "",
                            hsnCode: c.hsnCode || "",
                            gstRate: c.gstRate || "",
                            description: c.description || "",
                          });
                          setIsEditing(true);
                        }}
                      >
                        <FaEdit />
                      </button>

                      <button
                        className={styles.deleteBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteItem(c);
                          setShowDeleteConfirm(true);
                        }}
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
      </div>

      {selected && (
        <div className={styles.overlay}>
          <div className={styles.dialog}>

            <div className={styles.dialogHeader}>
              <div className={styles.dialogName}>
                Category Details
              </div>

              <button
                className={styles.closeBtn}
                onClick={() => setSelected(null)}
              >
                ✕
              </button>
            </div>

            <hr className={styles.divider} />

            <div className={styles.dialogGrid}>

              <div className={styles.field}>
                <label>Name</label>

                {isEditing ? (
                  <input
                    type="text"
                    value={editData.name || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        name: e.target.value,
                      })
                    }
                  />
                ) : (
                  <p>{selected.name}</p>
                )}
              </div>

              <div className={styles.field}>
                <label>HSN Code</label>

                {isEditing ? (
                  <input
                    type="text"
                    value={editData.hsnCode || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        hsnCode: e.target.value,
                      })
                    }
                  />
                ) : (
                  <p>{selected.hsnCode}</p>
                )}
              </div>

              <div className={styles.field}>
                <label>GST Rate</label>

                {isEditing ? (
                  <input
                    type="number"
                    value={editData.gstRate || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        gstRate: e.target.value,
                      })
                    }
                  />
                ) : (
                  <p>{selected.gstRate}%</p>
                )}
              </div>

              <div className={styles.field}>
                <label>Description</label>

                {isEditing ? (
                  <textarea
                    value={editData.description || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        description: e.target.value,
                      })
                    }
                  />
                ) : (
                  <p>{selected.description}</p>
                )}
              </div>

              {isEditing && (
                <div className={styles.updateWrap}>
                  <button
                    className={styles.updateBtn}
                    onClick={handleUpdate}
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className={styles.overlay}>
          <div className={styles.deleteDialog}>

            <h3>Delete Category?</h3>

            <p>
              Are you sure you want to delete
              this category?
            </p>

            <div className={styles.deleteActions}>

              <button
                className={styles.cancelBtn}
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteItem(null);
                }}
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

      <Toast message={toast.message} type={toast.type} />
    </>
  );
}

export default Category;