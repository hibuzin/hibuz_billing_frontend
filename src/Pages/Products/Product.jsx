import { useEffect, useState } from "react";
import styles from "./Product.module.css";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaTrash,
  FaEdit,
} from "react-icons/fa";

import Toast from "../../components/Toast";
import { API } from "../../constants/api";

function Product() {
  const [product, setProduct] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [toast, setToast] =
    useState(null);

  const [deleteLoading, setDeleteLoading] =
    useState(null);

  const [showModal, setShowModal] =
    useState(false);

  const [editProduct, setEditProduct] =
    useState(null);

    const [viewProduct, setViewProduct] =
  useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, []);

  // FETCH PRODUCTS

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");

      const res = await fetch(
        API.products,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        setProduct(data.data || []);
      } else {
        setToast({
          type: "error",
          message:
            data.message ||
            "Failed to load products",
        });
      }
    } catch (err) {
      console.error(err);

      setToast({
        type: "error",
        message: "Server error",
      });
    } finally {
      setLoading(false);
    }
  };

  // FETCH CATEGORIES

  const fetchCategories = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const res = await fetch(
        API.categories,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        setCategories(data.data || []);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // DELETE

  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this product?"
      );

    if (!confirmDelete) return;

    try {
      setDeleteLoading(id);

      const token =
        localStorage.getItem("token");

      const res = await fetch(
        `${API.products}/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        setProduct((prev) =>
          prev.filter(
            (item) => item._id !== id
          )
        );

        setToast({
          type: "success",
          message:
            data.message ||
            "Product deleted successfully",
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
      console.error(err);

      setToast({
        type: "error",
        message: "Server error",
      });
    } finally {
      setDeleteLoading(null);
    }
  };

  // OPEN EDIT

  const openEdit = (item) => {
    setEditProduct({
      ...item,

      flavor:
        item.flavor?.join(", ") || "",

      liters:
  item.litters?.join(", ") || "",

      mrps:
        item.mrps?.join(", ") || "",
    });

    setShowModal(true);

    document.body.style.overflow =
      "hidden";
  };

  // CLOSE EDIT

  const closeModal = () => {
    setShowModal(false);

    document.body.style.overflow =
      "auto";
  };

  // CHANGE

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // UPDATE

  const handleUpdate = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const payload = {
        name: editProduct.name,
        brand: editProduct.brand,

        categoryId:
          editProduct.categoryId,

        flavor: editProduct.flavor
          .split(",")
          .map((f) => f.trim()),

        litters: editProduct.liters
          .split(",")
          .map((l) => l.trim()),

        mrps: editProduct.mrps
          .split(",")
          .map((m) => Number(m.trim())),
      };

      const res = await fetch(
        `${API.products}/${editProduct._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (data.success) {
        setProduct((prev) =>
          prev.map((item) =>
            item._id ===
            editProduct._id
              ? data.data
              : item
          )
        );

        setToast({
          type: "success",
          message:
            data.message ||
            "Product updated successfully",
        });

        closeModal();
      } else {
        setToast({
          type: "error",
          message:
            data.message ||
            "Update failed",
        });
      }
    } catch (err) {
      console.log(err);

      setToast({
        type: "error",
        message: "Server error",
      });
    }
  };

  return (
    <div className={styles.container}>
      {toast && <Toast {...toast} />}

      {/* HEADER */}

      <div className={styles.header}>
        <div>
          <h2>Products</h2>

          <p>
            Manage your product
            inventory
          </p>
        </div>

        <button
          className={styles.addBtn}
          onClick={() =>
            navigate("/create-product")
          }
        >
          <FaPlus />
        </button>
      </div>

      {/* PRODUCTS */}

<div className={styles.tableWrapper}>
  {loading ? (
    <div className={styles.loading}>
      Loading...
    </div>
  ) : product.length === 0 ? (
    <div className={styles.empty}>
      No products found
    </div>
  ) : (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>No</th>
          <th>Name</th>
          <th>Brand</th>
          <th>Category</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {product.map((p, index) => (
          <tr
  key={p._id}
  onClick={() => setViewProduct(p)}
  className={styles.row}
>
            <td>{index + 1}</td>

            <td className={styles.nameCell}>
              {p.name}
            </td>

            <td>
              {p.brand || "—"}
            </td>

            <td>
              {p.categoryId?.name ||
                "—"}
            </td>

            <td>
              <div
                className={
                  styles.actions
                }
              >
                <button
                  className={
                    styles.editBtn
                  }
                  onClick={(e) => {
  e.stopPropagation();
  openEdit(p);
}}
                >
                  <FaEdit />
                </button>

                <button
                  className={
                    styles.deleteBtn
                  }
                  onClick={(e) => {
  e.stopPropagation();
  handleDelete(p._id);
}}
                  disabled={
                    deleteLoading ===
                    p._id
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
  )}
</div>
      {/* MODAL */}

      {showModal && editProduct && (
        <div
          className={styles.modalOverlay}
        >
          <div className={styles.modal}>
            <div
              className={
                styles.modalHeader
              }
            >
              <h3>Edit Product</h3>

              <button
                className={
                  styles.closeBtn
                }
                onClick={closeModal}
              >
                ×
              </button>
            </div>

            <div className={styles.form}>
              <div className={styles.field}>
                <label>
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={editProduct.name}
                  onChange={
                    handleChange
                  }
                />
              </div>

              <div className={styles.field}>
                <label>Brand</label>

                <input
                  type="text"
                  name="brand"
                  value={
                    editProduct.brand
                  }
                  onChange={
                    handleChange
                  }
                />
              </div>

              <div className={styles.field}>
                <label>
                  Category
                </label>

                <select
                  name="categoryId"
                  value={
                    editProduct.categoryId
                      ?._id ||
                    editProduct.categoryId
                  }
                  onChange={
                    handleChange
                  }
                >
                  {categories.map(
                    (cat) => (
                      <option
                        key={cat._id}
                        value={cat._id}
                      >
                        {cat.name}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className={styles.field}>
                <label>
                  Flavor
                </label>

                <input
                  type="text"
                  name="flavor"
                  value={
                    editProduct.flavor
                  }
                  onChange={
                    handleChange
                  }
                />
              </div>

              <div className={styles.field}>
                <label>
                  Liters
                </label>

                <input
                  type="text"
                  name="liters"
                  value={
                    editProduct.liters
                  }
                  onChange={
                    handleChange
                  }
                />
              </div>

              <div className={styles.field}>
                <label>MRPs</label>

                <input
                  type="text"
                  name="mrps"
                  value={
                    editProduct.mrps
                  }
                  onChange={
                    handleChange
                  }
                />
              </div>

              <div
                className={
                  styles.modalBtns
                }
              >
                <button
                  className={
                    styles.cancelBtn
                  }
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  className={
                    styles.saveBtn
                  }
                  onClick={handleUpdate}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewProduct && (
  <div
    className={styles.modalOverlay}
    onClick={() => setViewProduct(null)}
  >
    <div
      className={styles.viewModal}
      onClick={(e) => e.stopPropagation()}
    >

      <div className={styles.modalHeader}>
        <h3>Product Details</h3>

        <button
          className={styles.closeBtn}
          onClick={() => setViewProduct(null)}
        >
          ×
        </button>
      </div>

      <div className={styles.viewGrid}>

        {Object.entries(viewProduct).map(
          ([key, value]) => {

            if (key === "__v") return null;

            return (
              <div
                key={key}
                className={styles.viewField}
              >
                <label>{key}</label>

                <p>
                  {Array.isArray(value)
                    ? value.join(", ")
                    : typeof value === "object"
                    ? JSON.stringify(
                        value,
                        null,
                        2
                      )
                    : value?.toString() || "—"}
                </p>
              </div>
            );
          }
        )}

      </div>

    </div>
  </div>
)}

    </div>
  );
}

export default Product;