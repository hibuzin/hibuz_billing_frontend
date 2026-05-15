import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import {
  FaTrash,
  FaPlus,
  FaEdit,
} from "react-icons/fa";
import Toast from "../../components/Toast";
import styles from "./PurchaseList.module.css";

function PurchaseList() {
  const [purchases, setPurchases] =
    useState([]);

  const [products, setProducts] =
    useState([]);

  const [toast, setToast] =
    useState(null);

  const [loadingId, setLoadingId] =
    useState(null);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [editPurchase, setEditPurchase] =
    useState(null);

  const [saving, setSaving] =
    useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPurchases();
    fetchProducts();
  }, []);

  // FETCH PURCHASES

  const fetchPurchases = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const res = await fetch(
        "http://192.168.31.181:5000/api/purchase/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        setPurchases(data.data || []);
      }
    } catch (err) {
      console.log(err);

      setToast({
        type: "error",
        message: "Failed to load purchases",
      });
    }
  };

  // FETCH PRODUCTS

  const fetchProducts = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const res = await fetch(
        "http://192.168.31.181:5000/api/productadd/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        setProducts(data.data || []);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // DELETE

  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm(
        "Delete this purchase?"
      );

    if (!confirmDelete) return;

    try {
      setLoadingId(id);

      const token =
        localStorage.getItem("token");

      const res = await fetch(
        `http://192.168.31.181:5000/api/purchase/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        setPurchases((prev) =>
          prev.filter((p) => p._id !== id)
        );

        setToast({
          type: "success",
          message:
            "Purchase deleted successfully",
        });
      }
    } catch (err) {
      console.log(err);

      setToast({
        type: "error",
        message: "Delete failed",
      });
    } finally {
      setLoadingId(null);
    }
  };

  // OPEN EDIT

  const openEditModal = (purchase) => {
    setEditPurchase({
      ...purchase,
      items: purchase.items.map((item) => ({
        ...item,
      })),
    });

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

  // PRODUCT OPTIONS

  const getProductOptions = () => {
    return products.map((p) => ({
      value: p._id,
      label: p.name,
      product: p,
    }));
  };

  // FLAVOR OPTIONS

  const getFlavorOptions = (
    productId
  ) => {
    const product = products.find(
      (p) => p._id === productId
    );

    if (!product) return [];

    return product.flavor.map((f) => ({
      value: f,
      label: f,
    }));
  };

  // LITER OPTIONS

  const getLiterOptions = (
    productId
  ) => {
    const product = products.find(
      (p) => p._id === productId
    );

    if (!product) return [];

    return product.liters.map(
      (l, index) => ({
        value: l,
        label: l,
        mrp: product.mrps[index],
      })
    );
  };

  // UPDATE ITEM

  const updateItem = (
    index,
    field,
    value
  ) => {
    const updatedItems = [
      ...editPurchase.items,
    ];

    updatedItems[index][field] = value;

    setEditPurchase({
      ...editPurchase,
      items: updatedItems,
    });
  };

  // SAVE EDIT

  const handleSave = async () => {
    try {
      setSaving(true);

      const token =
        localStorage.getItem("token");

      const payload = {
        supplierId:
          editPurchase.supplierId?._id,

        items: editPurchase.items.map(
          (item) => ({
            productId:
              item.productId?._id ||
              item.productId,

            flavor: item.flavor,

            liters: item.liters,

            mrp: Number(item.mrp),

            qty: Number(item.qty),

            costPrice: Number(
              item.costPrice
            ),

            sellingPrice: Number(
              item.sellingPrice
            ),
          })
        ),
      };

      const res = await fetch(
        `http://192.168.31.181:5000/api/purchase/${editPurchase._id}`,
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

      if (!res.ok) {
        throw new Error(
          data.message || "Update failed"
        );
      }

      setToast({
        type: "success",
        message:
          "Purchase updated successfully",
      });

      fetchPurchases();

      closeEditModal();
    } catch (err) {
      console.log(err);

      setToast({
        type: "error",
        message:
          err.message || "Update failed",
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
          <h2 className={styles.title}>
            Purchase List
          </h2>

          <p className={styles.count}>
            Total Purchases :
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
          Add Purchase
        </button>
      </div>

      {/* LIST */}

      <div className={styles.grid}>
        {purchases.map((p) => (
          <div
            key={p._id}
            className={styles.card}
          >
            {/* TOP */}

            <div
              className={styles.cardHeader}
            >
              <div>
                <h3
                  className={
                    styles.supplier
                  }
                >
                  {p.supplierId?.name}
                </h3>

                <p
                  className={styles.phone}
                >
                  {p.supplierId?.phone}
                </p>
              </div>

              <div
                className={
                  styles.actionBtns
                }
              >
                <button
                  className={
                    styles.editBtn
                  }
                  onClick={() =>
                    openEditModal(p)
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
                      p._id
                    )
                  }
                  disabled={
                    loadingId === p._id
                  }
                >
                  <FaTrash />
                </button>
              </div>
            </div>

            {/* INFO */}

            <div className={styles.info}>
              <div className={styles.row}>
                <span>Total</span>

                <strong>
                  ₹ {p.totalAmount}
                </strong>
              </div>

              <div className={styles.row}>
                <span>Items</span>

                <strong>
                  {p.items?.length}
                </strong>
              </div>

              <div className={styles.row}>
                <span>Date</span>

                <strong>
                  {new Date(
                    p.createdAt
                  ).toLocaleDateString()}
                </strong>
              </div>
            </div>

            {/* ITEMS */}

            <div
              className={styles.itemsBox}
            >
              {p.items?.map(
                (item, index) => (
                  <div
                    key={index}
                    className={styles.item}
                  >
                    <div>
                      <h4>
                        {
                          item.productId
                            ?.name
                        }
                      </h4>

                      <p>
                        {item.flavor} •{" "}
                        {item.liters}
                      </p>
                    </div>

                    <div
                      className={
                        styles.qty
                      }
                    >
                      Qty : {item.qty}
                    </div>
                  </div>
                )
              )}
            </div>

            {/* FOOTER */}

            <div className={styles.footer}>
              <span
                className={
                  styles.purchaseId
                }
              >
                #
                {p._id.slice(-6)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT MODAL */}

      {showEditModal &&
        editPurchase && (
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
                <h3>Edit Purchase</h3>

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
                {editPurchase.items?.map(
                  (item, index) => (
                    <div
                      key={index}
                      className={
                        styles.editCard
                      }
                    >
                      <div
                        className={
                          styles.modalGrid
                        }
                      >
                        {/* PRODUCT */}

                        <div
                          className={
                            styles.field
                          }
                        >
                          <label>
                            Product
                          </label>

                          <Select
                            options={getProductOptions()}
                            value={getProductOptions().find(
                              (
                                p
                              ) =>
                                p.value ===
                                item
                                  .productId
                                  ?._id
                            )}
                            onChange={(
                              selected
                            ) => {
                              const product =
                                selected?.product;

                              updateItem(
                                index,
                                "productId",
                                product
                              );

                              updateItem(
                                index,
                                "flavor",
                                product
                                  ?.flavor?.[0] ||
                                  ""
                              );

                              updateItem(
                                index,
                                "liters",
                                product
                                  ?.liters?.[0] ||
                                  ""
                              );

                              updateItem(
                                index,
                                "mrp",
                                product
                                  ?.mrps?.[0] ||
                                  ""
                              );
                            }}
                          />
                        </div>

                        {/* FLAVOR */}

                        <div
                          className={
                            styles.field
                          }
                        >
                          <label>
                            Flavor
                          </label>

                          <Select
                            options={getFlavorOptions(
                              item
                                .productId
                                ?._id
                            )}
                            value={getFlavorOptions(
                              item
                                .productId
                                ?._id
                            ).find(
                              (
                                f
                              ) =>
                                f.value ===
                                item.flavor
                            )}
                            onChange={(
                              selected
                            ) =>
                              updateItem(
                                index,
                                "flavor",
                                selected?.value
                              )
                            }
                          />
                        </div>

                        {/* LITERS */}

                        <div
                          className={
                            styles.field
                          }
                        >
                          <label>
                            Liters
                          </label>

                          <Select
                            options={getLiterOptions(
                              item
                                .productId
                                ?._id
                            )}
                            value={getLiterOptions(
                              item
                                .productId
                                ?._id
                            ).find(
                              (
                                l
                              ) =>
                                l.value ===
                                item.liters
                            )}
                            onChange={(
                              selected
                            ) => {
                              updateItem(
                                index,
                                "liters",
                                selected?.value
                              );

                              updateItem(
                                index,
                                "mrp",
                                selected?.mrp
                              );
                            }}
                          />
                        </div>

                        {/* MRP */}

                        <div
                          className={
                            styles.field
                          }
                        >
                          <label>
                            MRP
                          </label>

                          <input
                            type="number"
                            value={
                              item.mrp
                            }
                            onChange={(e) =>
                              updateItem(
                                index,
                                "mrp",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        {/* QTY */}

                        <div
                          className={
                            styles.field
                          }
                        >
                          <label>
                            Quantity
                          </label>

                          <input
                            type="number"
                            value={
                              item.qty
                            }
                            onChange={(e) =>
                              updateItem(
                                index,
                                "qty",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        {/* COST */}

                        <div
                          className={
                            styles.field
                          }
                        >
                          <label>
                            Cost Price
                          </label>

                          <input
                            type="number"
                            value={
                              item.costPrice
                            }
                            onChange={(e) =>
                              updateItem(
                                index,
                                "costPrice",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        {/* SELLING */}

                        <div
                          className={
                            styles.field
                          }
                        >
                          <label>
                            Selling Price
                          </label>

                          <input
                            type="number"
                            value={
                              item.sellingPrice
                            }
                            onChange={(e) =>
                              updateItem(
                                index,
                                "sellingPrice",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )
                )}

                <button
                  className={
                    styles.submitBtn
                  }
                  onClick={handleSave}
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

export default PurchaseList; 