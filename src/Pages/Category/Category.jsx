import { useEffect, useState } from "react";
import styles from "./Category.module.css";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaTrash,
  FaEdit,
} from "react-icons/fa";

import Toast from "../../components/Toast";

function Category() {
  const [categories, setCategories] =
    useState([]);

  const [toast, setToast] =
    useState(null);

  const [loadingId, setLoadingId] =
    useState(null);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [editCategory, setEditCategory] =
    useState(null);

  const [editName, setEditName] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  // FETCH

  const fetchCategories = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const res = await fetch(
        "http://192.168.31.181:5000/api/category",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        setCategories(data.data || []);
      } else {
        setToast({
          type: "error",
          message:
            "Failed to load categories",
        });
      }
    } catch (err) {
      setToast({
        type: "error",
        message: "Server error",
      });
    }
  };

  // DELETE

  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm(
        "Delete this category?"
      );

    if (!confirmDelete) return;

    try {
      setLoadingId(id);

      const token =
        localStorage.getItem("token");

      const res = await fetch(
        `http://192.168.31.181:5000/api/category/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        setCategories((prev) =>
          prev.filter(
            (cat) => cat._id !== id
          )
        );

        setToast({
          type: "success",
          message:
            data.message ||
            "Category deleted successfully",
        });
      } else {
        setToast({
          type: "error",
          message:
            data.message ||
            "Delete failed",
        });
      }
    } catch (err) {
      setToast({
        type: "error",
        message: "Server error",
      });
    } finally {
      setLoadingId(null);
    }
  };

  // OPEN EDIT

  const openEditModal = (cat) => {
    setEditCategory(cat);

    setEditName(cat.name);

    setShowEditModal(true);

    document.body.style.overflow =
      "hidden";
  };

  // CLOSE EDIT

  const closeEditModal = () => {
    setShowEditModal(false);

    document.body.style.overflow =
      "auto";
  };

  // UPDATE

  const handleUpdate = async () => {
    if (!editName.trim()) {
      return setToast({
        type: "error",
        message: "Enter category name",
      });
    }

    try {
      setSaving(true);

      const token =
        localStorage.getItem("token");

      const res = await fetch(
        `http://192.168.31.181:5000/api/category/${editCategory._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: editName,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setCategories((prev) =>
          prev.map((cat) =>
            cat._id ===
            editCategory._id
              ? data.data
              : cat
          )
        );

        setToast({
          type: "success",
          message:
            data.message ||
            "Category updated successfully",
        });

        closeEditModal();
      } else {
        setToast({
          type: "error",
          message:
            data.message ||
            "Update failed",
        });
      }
    } catch (err) {
      setToast({
        type: "error",
        message: "Server error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      {toast && <Toast {...toast} />}

      {/* HEADER */}

      <div className={styles.header}>
        <div>
          <h2>Categories</h2>

          <p>
            Total Categories :
            {categories.length}
          </p>
        </div>

        <button
          className={styles.addBtn}
          onClick={() =>
            navigate("/create-category")
          }
        >
          <FaPlus />
          Add Category
        </button>
      </div>

      {/* LIST */}

      <div className={styles.grid}>
        {categories.map((cat) => (
          <div
            key={cat._id}
            className={styles.card}
          >
            <div className={styles.top}>
              <div>
                <h3>{cat.name}</h3>

                <span
                  className={
                    styles.status
                  }
                >
                  {cat.isActive
                    ? "Active"
                    : "Inactive"}
                </span>
              </div>

              <div
                className={
                  styles.actions
                }
              >
                <button
                  className={
                    styles.editBtn
                  }
                  onClick={() =>
                    openEditModal(cat)
                  }
                >
                  <FaEdit />
                </button>

                <button
                  className={
                    styles.deleteBtn
                  }
                  onClick={() =>
                    handleDelete(
                      cat._id
                    )
                  }
                  disabled={
                    loadingId ===
                    cat._id
                  }
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT MODAL */}

      {showEditModal && (
        <div
          className={
            styles.modalOverlay
          }
        >
          <div className={styles.modal}>
            <div
              className={
                styles.modalHeader
              }
            >
              <h3>Edit Category</h3>

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
                className={styles.field}
              >
                <label>
                  Category Name
                </label>

                <input
                  type="text"
                  value={editName}
                  onChange={(e) =>
                    setEditName(
                      e.target.value
                    )
                  }
                  placeholder="Enter category name"
                />
              </div>

              <button
                className={
                  styles.saveBtn
                }
                onClick={handleUpdate}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Category;