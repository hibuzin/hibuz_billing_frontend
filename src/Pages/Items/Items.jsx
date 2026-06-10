import { useEffect, useState, useRef } from "react";
import styles from "./Items.module.css";
import { useNavigate } from "react-router-dom";
import { TrendingUp, PackageMinus, ExternalLink, PackageX } from 'lucide-react';

import {
  FaBoxes,
  FaExclamationTriangle,
  FaTimesCircle,
} from "react-icons/fa";

import Toast from "../../components/Toast";
import { API } from "../../constants/api";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaEllipsisV,
  FaSearch,
  FaBarcode,
} from "react-icons/fa";

function Item() {
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

  const [deleteProductId, setDeleteProductId] = useState(null);
  const totalItems = product.length;

  const totalCategories = categories.length;

  const lowStockItems = 0;
  const [openMenu, setOpenMenu] = useState(null);
  const [stockValue, setStockValue] = useState(0);

  const menuRef = useRef(null);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();



  useEffect(() => {
    fetchProduct();
    fetchCategories();
    fetchStockValue();
  }, []);

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

  const placeholders = [
    "Search by Name",
    "Search by HSN Code",
  ];

  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => prev + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (placeholderIndex === placeholders.length - 1) {
      setTimeout(() => {
        setPlaceholderIndex(0);
      }, 400); // transition duration
    }
  }, [placeholderIndex]);

  // stock value 

  const fetchStockValue = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(API.stockValue, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      console.log(data); // check response

      if (data.success) {
        setStockValue(
          data.summary?.totalCostValue || 0
        );
      }
    } catch (err) {
      console.error("Stock Value Error:", err);
    }
  };

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
            "Failed to load items",
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

  const searchProducts = async (value) => {
    try {
      const token = localStorage.getItem("token");

      if (!value.trim()) {
        fetchProduct();
        return;
      }

      const res = await fetch(
        `${API.products}/search?search=${encodeURIComponent(value)}`,
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
      }
    } catch (err) {
      console.log(err);
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

  const handleDelete = async () => {
    if (!deleteProductId) return;

    try {
      setDeleteLoading(deleteProductId);

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API.products}/${deleteProductId}`,
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
            (item) => item._id !== deleteProductId
          )
        );

        setToast({
          type: "success",
          message:
            data.message ||
            "Item deleted successfully",
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
      setDeleteProductId(null);
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
            "item updated successfully",
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
          <h2>items</h2>
        </div>


      </div>

      <div className={styles.cardsRow}>

        {/* STOCK VALUE */}
        <div className={styles.infoCard}>
          <div className={`${styles.cardRow} ${styles.stockCard}`}>
            <div className={styles.cardTitle}>
              <TrendingUp size={14} />
              <p>Stock Value</p>
            </div>

            <ExternalLink size={14} className={styles.externalIcon} />
          </div>

          <h2>
            ₹ {Number(stockValue).toLocaleString("en-IN")}
          </h2>
        </div>

        {/* LOW STOCK */}
        <div className={styles.infoCard}>
          <div className={`${styles.cardRow} ${styles.lowStockCard}`}>
            <div className={styles.cardTitle}>
              <PackageMinus size={14} />
              <p>Low Stock</p>
            </div>

            <ExternalLink size={14} className={styles.externalIcon} />
          </div>

          <h2>{lowStockItems}</h2>
        </div>

        {/* OUT OF STOCK */}
        <div className={styles.infoCard}>
          <div className={`${styles.cardRow} ${styles.outStockCard}`}>
            <div className={styles.cardTitle}>
              <PackageX size={14} />
              <p>Out Of Stock</p>
            </div>

            <ExternalLink size={14} className={styles.externalIcon} />
          </div>

          <h2>0</h2>
        </div>

      </div>

      <div className={styles.searchRow}>
        <div className={styles.searchBox}>
          <FaSearch className={styles.searchIcon} />

          <div className={styles.placeholderWrapper}>
            {!search && (
              <div
                className={styles.placeholderSlider}
                style={{
                  transform: `translateY(-${placeholderIndex * 36}px)`,
                }}
              >
                {placeholders.map((text, i) => (
                  <span key={i}>{text}</span>
                ))}
              </div>
            )}

            <input
              type="text"
              value={search}
              onChange={(e) => {
                const value = e.target.value;
                setSearch(value);
                searchProducts(value);
              }}
              className={styles.searchInput}
            />
          </div>
        </div>

        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search Categories"
            className={styles.searchInput}
          />
        </div>

        <div className={styles.searchBox}>
          <FaBarcode className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search Barcode"
            className={styles.searchInput}
          />
        </div>

        <button
          className={styles.addBtn}
          onClick={() => navigate("/create-product")}
        >
          <span>Create items</span>
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
            No items found
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
  <tr>
    <th>No</th>
    <th>Name</th>
    <th>HSN Code</th>
    <th>BarCode</th>
    <th>Qty</th>
    <th>Selling Price</th>
    <th>Purchase Price</th>
    <th>MRP</th>
    <th></th>
  </tr>
</thead>

            <tbody>
  {product.map((p, index) => (
    <tr
      key={p._id || p.productId}
      onClick={() =>
        navigate(`/item/${p._id || p.productId}`)
      }
    >
      <td>{index + 1}</td>

      <td className={styles.nameCell}>
        {p.name || p.productName}
      </td>

      <td>{p.hsnCode || "—"}</td>

      <td>{p.barcode || "—"}</td>

      <td>{p.availableQty || 0}</td>

      <td>₹ {p.sellingPrice || 0}</td>

      <td>₹ {p.costPrice || 0}</td>

      <td>₹ {p.mrp || 0}</td>

      <td>
        <div
          ref={openMenu === p._id ? menuRef : null}
          className={styles.menuWrapper}
        >
          <button
            className={styles.menuBtn}
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenu(
                openMenu === p._id ? null : p._id
              );
            }}
          >
            <FaEllipsisV />
          </button>

          {openMenu === p._id && (
            <div className={styles.dropdownMenu}>
              <button
                className={styles.editMenuItem}
                onClick={(e) => {
                  e.stopPropagation();
                  openEdit(p);
                  setOpenMenu(null);
                }}
              >
                <FaEdit />
                Edit
              </button>

              <button
                className={styles.deleteMenuItem}
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteProductId(p._id);
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
              <h3>Edit item</h3>

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
                  item Name
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

      {deleteProductId && (
        <div className={styles.modalOverlay}>
          <div className={styles.deleteModal}>
            <h3>Delete Product?</h3>

            <p>
              Are you sure you want to delete this
              item?
            </p>

            <div className={styles.deleteActions}>
              <button
                className={styles.cancelBtn}
                onClick={() =>
                  setDeleteProductId(null)
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
              <h3>item Details</h3>

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

export default Item;