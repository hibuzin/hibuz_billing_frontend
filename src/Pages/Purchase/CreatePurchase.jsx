import { useState, useEffect } from "react";
import Select from "react-select";
import { FaEdit } from "react-icons/fa";
import styles from "./CreatePurchase.module.css";
import Toast from "../../components/Toast";
import { API } from "../../constants/api";

function CreatePurchase() {
 const emptyItem = {
  productId: "",
  flavor: "",
  litters: "",
  mrp: "",
  qty: "",
  costPrice: "",
  sellingPrice: "",
  barcode: "",
};

  const [form, setForm] = useState({
  supplierId: "",
  invoiceNo: "",
  invoiceDate: "",
});

  const [currentItem, setCurrentItem] =
    useState(emptyItem);

  const [billItems, setBillItems] =
    useState([]);

  const [suppliers, setSuppliers] =
    useState([]);

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [toast, setToast] = useState({
    message: "",
    type: "",
  });

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [editIndex, setEditIndex] =
    useState(null);

  const [editItem, setEditItem] =
    useState(emptyItem);

  const token =
    localStorage.getItem("token");

  useEffect(() => {
    fetchSuppliers();
    fetchProducts();
  }, []);

  // TOAST
  const showToast = (message, type) => {
    setToast({ message, type });

    setTimeout(() => {
      setToast({
        message: "",
        type: "",
      });
    }, 2500);
  };

  // FETCH SUPPLIERS
  const fetchSuppliers = async () => {
    try {
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
            "Supplier fetch failed"
        );
      }

      setSuppliers(data.data || []);
    } catch (err) {
      console.error(err);

      showToast(
        "Failed to load suppliers",
        "error"
      );
    }
  };

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await fetch(
        API.products,
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
            "Product fetch failed"
        );
      }

      setProducts(data.data || []);
    } catch (err) {
      console.error(err);

      showToast(
        "Failed to load products",
        "error"
      );
    }
  };

  // FORM CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ITEM CHANGE
  const handleItemChange = (
    field,
    value
  ) => {
    setCurrentItem((prev) => ({
      ...prev,
      [field]: value,
    }));
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
  const getFlavorOptions = (productId) => {
  const product = products.find(
    (p) => p._id === productId
  );

  if (!product || !product.flavor)
    return [];

  return product.flavor.map((f) => ({
    value: f,
    label: f,
  }));
};

const getLiterOptions = (productId) => {
  const product = products.find(
    (p) => p._id === productId
  );

  if (!product || !product.litters)
    return [];

  return product.litters.map(
    (l, i) => ({
      value: l,
      label: l,
      mrp: product.mrps?.[i] || 0,
    })
  );
};


  // MRP OPTIONS
  const getMrpOptions = (
    productId
  ) => {
    const product = products.find(
      (p) => p._id === productId
    );

    if (!product) return [];

    return product.mrps.map((m) => ({
      value: m,
      label: `₹ ${m}`,
    }));
  };

  // ADD ITEM
  const addItem = () => {
    if (!currentItem.productId) {
      return showToast(
        "Select product",
        "error"
      );
    }

    setBillItems((prev) => [
      ...prev,
      {
        ...currentItem,
      },
    ]);


    showToast(
      "Item added successfully",
      "success"
    );
  };

  // REMOVE ITEM
  const removeBillItem = (index) => {
    const updated = billItems.filter(
      (_, i) => i !== index
    );

    setBillItems(updated);
  };

  // OPEN EDIT MODAL
  const openEditModal = (
    item,
    index
  ) => {
    document.body.style.overflow =
      "hidden";

    setEditItem(item);

    setEditIndex(index);

    setShowEditModal(true);
  };

  // CLOSE EDIT MODAL
  const closeEditModal = () => {
    document.body.style.overflow =
      "auto";

    setShowEditModal(false);
  };

  // SAVE EDIT ITEM
  const saveEditItem = () => {
    if (!editItem.productId) {
      return showToast(
        "Select product",
        "error"
      );
    }

    const updatedItems = [
      ...billItems,
    ];

    updatedItems[editIndex] =
      editItem;

    setBillItems(updatedItems);

    closeEditModal();

    showToast(
      "Item updated successfully",
      "success"
    );
  };

  // TOTAL
  const totalAmount = billItems.reduce(
    (acc, item) =>
      acc +
      (Number(item.qty) || 0) *
        (Number(item.costPrice) || 0),
    0
  );

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.supplierId) {
      return showToast(
        "Select supplier",
        "error"
      );
    }

    if (billItems.length === 0) {
      return showToast(
        "Add at least one item",
        "error"
      );
    }

    try {
      setLoading(true);

      const payload = {
  supplierId: form.supplierId,
  invoiceNo: form.invoiceNo,
  invoiceDate: form.invoiceDate,

  items: billItems.map((item) => ({
    productId: item.productId,
    flavor: item.flavor,
    mrp: Number(item.mrp),
    qty: Number(item.qty),
    costPrice: Number(item.costPrice),
    sellingPrice: Number(item.sellingPrice),
    barcode: item.barcode,
  })),
};

      const res = await fetch(
        API.createPurchase,
        {
          method: "POST",

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
          data.message ||
            "Purchase failed"
        );
      }

      showToast(
        "Purchase created successfully",
        "success"
      );

      setForm({
  supplierId: "",
  invoiceNo: "",
  invoiceDate: "",
});

      setBillItems([]);

      setCurrentItem(emptyItem);
    } catch (err) {
      console.error(err);

      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast
        message={toast.message}
        type={toast.type}
      />

      <div className={styles.container}>
        <div className={styles.layout}>
          {/* LEFT */}
          <div className={styles.left}>
            <div className={styles.card}>
              <div className={styles.header}>
                <h2>Create Purchase</h2>

                <p>
                  Manage supplier
                  purchases efficiently
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className={styles.form}
              >
                {/* SUPPLIER */}
                <div className={styles.field}>
                  <label>Supplier</label>

                  <select
                    name="supplierId"
                    value={form.supplierId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select Supplier
                    </option>

                   {suppliers.map((s) => (
  <option key={s._id} value={s._id}>{s.supplierName}</option>
))}
                  </select>
                </div>

                <div className={styles.grid}>
  <div className={styles.field}>
    <label>Invoice No</label>

    <input
      type="text"
      name="invoiceNo"
      value={form.invoiceNo}
      onChange={handleChange}
      placeholder="Enter Invoice No"
    />
  </div>

  <div className={styles.field}>
    <label>Invoice Date</label>

    <input
      type="date"
      name="invoiceDate"
      value={form.invoiceDate}
      onChange={handleChange}
    />
  </div>
</div>

                {/* PRODUCT CARD */}
                <div className={styles.itemCard}>
                  <div
                    className={
                      styles.itemHeader
                    }
                  >
                    <h4>Add Product</h4>
                  </div>

                  <div className={styles.grid}>
                    {/* PRODUCT */}
                    <div
                      className={styles.field}
                    >
                      <label>
                        Product
                      </label>

                      <Select
                        options={getProductOptions()}
                        placeholder="Search Product"
                        value={
                          getProductOptions().find(
                            (p) =>
                              p.value ===
                              currentItem.productId
                          ) || null
                        }
                        onChange={(
                          selected
                        ) => {
                          const product =
                            selected?.product;

                          setCurrentItem({
                            ...currentItem,

                            productId:
                              product?._id ||
                              "",

                            flavor:
                              product
                                ?.flavor?.[0] ||
                              "",

                            litters:
  product?.litters?.[0] || "",

                            mrp:
                              product
                                ?.mrps?.[0] ||
                              "",
                          });
                        }}
                        isSearchable
                      />
                    </div>

                    {/* FLAVOR */}
                    <div
                      className={styles.field}
                    >
                      <label>
                        Flavor
                      </label>

                      <Select
                        options={getFlavorOptions(
                          currentItem.productId
                        )}
                        placeholder="Select Flavor"
                        value={
                          getFlavorOptions(
                            currentItem.productId
                          ).find(
                            (f) =>
                              f.value ===
                              currentItem.flavor
                          ) || null
                        }
                        onChange={(
                          selected
                        ) =>
                          handleItemChange(
                            "flavor",
                            selected?.value ||
                              ""
                          )
                        }
                      />
                    </div>

                    {/* LITERS */}
                    <div
                      className={styles.field}
                    >
                      <label>
                        Liters
                      </label>

                      <Select
                        options={getLiterOptions(
                          currentItem.productId
                        )}
                        placeholder="Select Liters"
                        value={
                          getLiterOptions(
                            currentItem.productId
                          ).find(
                            (l) =>
                              l.value ===
                              currentItem.litters
                          ) || null
                        }
                        onChange={(
                          selected
                        ) =>
                          setCurrentItem({
                            ...currentItem,

                            litters:
  selected?.value || "",

                            mrp:
                              selected?.mrp ||
                              "",
                          })
                        }
                      />
                    </div>

                    {/* MRP */}
                    <div className={styles.field}>
                      <label>MRP</label>

                      <Select
                        options={getMrpOptions(
                          currentItem.productId
                        )}
                        placeholder="Select MRP"
                        value={
                          getMrpOptions(
                            currentItem.productId
                          ).find(
                            (m) =>
                              m.value ===
                              currentItem.mrp
                          ) || null
                        }
                        onChange={(
                          selected
                        ) =>
                          handleItemChange(
                            "mrp",
                            selected?.value ||
                              ""
                          )
                        }
                      />
                    </div>

                    {/* QTY */}
                    <div
                      className={styles.field}
                    >
                      <label>
                        Quantity
                      </label>

                      <input
                        type="number"
                        value={
                          currentItem.qty
                        }
                        onChange={(e) =>
                          handleItemChange(
                            "qty",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    {/* COST */}
                    <div
                      className={styles.field}
                    >
                      <label>
                        Cost Price
                      </label>

                      <input
                        type="number"
                        value={
                          currentItem.costPrice
                        }
                        onChange={(e) =>
                          handleItemChange(
                            "costPrice",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    {/* SELLING */}
                    <div
                      className={styles.field}
                    >
                      <label>
                        Selling Price
                      </label>

                      <input
                        type="number"
                        value={
                          currentItem.sellingPrice
                        }
                        onChange={(e) =>
                          handleItemChange(
                            "sellingPrice",
                            e.target.value
                          )
                        }
                      />
                    </div>

                   
                    <div
                      className={styles.field}
                     >
                      

                      <select
                      
                      >
                        <option value="box">
                          Box
                        </option>

                        <option value="piece">
                          Piece
                        </option>

                        <option value="kg">
                          Kg
                        </option>
                      </select>
                    </div>

                  

                    {/* BARCODE */}
                    <div
                      className={styles.field}
                    >
                      <label>
                        Barcode
                      </label>

                      <input
                        type="text"
                        value={
                          currentItem.barcode
                        }
                        onChange={(e) =>
                          handleItemChange(
                            "barcode",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addItem}
                  className={styles.addBtn}
                >
                  Add Item
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT */}
          <div className={styles.right}>
            <div className={styles.billCard}>
              <div
                className={styles.billHeader}
              >
                <h3>Purchase Bill</h3>
              </div>

              <div
                className={styles.billItems}
              >
                {billItems.map(
                  (item, index) => {
                    const product =
                      products.find(
                        (p) =>
                          p._id ===
                          item.productId
                      );

                    return (
                      <div
                        key={index}
                        className={
                          styles.billItem
                        }
                      >
                        <div>
                          <h4>
                            {product?.name ||
                              "Product"}
                          </h4>

                          <div
                            className={
                              styles.billInfo
                            }
                          >
                            <p>
                              Flavor
                              <span>
                                {item.flavor ||
                                  "-"}
                              </span>
                            </p>

                            <p>
                              Liters
                              <span>
                                {item.litters || "-"}
                              </span>
                            </p>

                            <p>
                              MRP
                              <span>
                                ₹{" "}
                                {item.mrp ||
                                  0}
                              </span>
                            </p>

                            <p>
                              Qty
                              <span>
                                {item.qty ||
                                  0}
                              </span>
                            </p>

                            <p>
                              Cost
                              <span>
                                ₹{" "}
                                {item.costPrice ||
                                  0}
                              </span>
                            </p>

                            <p>
                              Selling
                              <span>
                                ₹{" "}
                                {item.sellingPrice ||
                                  0}
                              </span>
                            </p>
                          </div>
                        </div>

                        <div
                          className={
                            styles.billRight
                          }
                        >
                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(
                                item,
                                index
                              )
                            }
                            className={
                              styles.editBtn
                            }
                          >
                            <FaEdit />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              removeBillItem(
                                index
                              )
                            }
                            className={
                              styles.billRemoveBtn
                            }
                          >
                            ×
                          </button>

                          <strong>
                            ₹{" "}
                            {(Number(
                              item.qty
                            ) || 0) *
                              (Number(
                                item.costPrice
                              ) || 0)}
                          </strong>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>

              <div
                className={styles.billFooter}
              >
                <h2>
                  Total : ₹{" "}
                  {totalAmount}
                </h2>
              </div>

              <button
                type="submit"
                disabled={loading}
                onClick={handleSubmit}
                className={
                  styles.submitBtn
                }
              >
                {loading
                  ? "Creating..."
                  : "Create Purchase"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {showEditModal && (
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
                type="button"
                onClick={
                  closeEditModal
                }
                className={
                  styles.closeBtn
                }
              >
                ×
              </button>
            </div>
{/* SUPPLIER */}
<div className={styles.field}>
  <label>Supplier</label>

  <select
    value={form.supplierId}
    onChange={(e) =>
      setForm({
        ...form,
        supplierId: e.target.value,
      })
    }
  >
    <option value="">
      Select Supplier
    </option>

    {suppliers.map((s) => (
  <option key={s._id} value={s._id}>{s.supplierName}</option>
))}
  </select>
</div>

            <div className={styles.grid}>
              {/* PRODUCT */}
              <div
                className={styles.field}
              >
                <label>Product</label>

                <Select
                  options={getProductOptions()}
                  placeholder="Search Product"
                  value={
                    getProductOptions().find(
                      (p) =>
                        p.value ===
                        editItem.productId
                    ) || null
                  }
                  onChange={(
                    selected
                  ) => {
                    const product =
                      selected?.product;

                    setEditItem({
                      ...editItem,

                      productId:
                        product?._id ||
                        "",

                      flavor:
                        product
                          ?.flavor?.[0] ||
                        "",

                      litters:
  product?.litters?.[0] || "",

                      mrp:
                        product
                          ?.mrps?.[0] ||
                        "",
                    });
                  }}
                />
              </div>

              {/* FLAVOR */}
              <div
                className={styles.field}
              >
                <label>Flavor</label>

                <Select
                  options={getFlavorOptions(
                    editItem.productId
                  )}
                  placeholder="Select Flavor"
                  value={
                    getFlavorOptions(
                      editItem.productId
                    ).find(
                      (f) =>
                        f.value ===
                        editItem.flavor
                    ) || null
                  }
                  onChange={(
                    selected
                  ) =>
                    setEditItem({
                      ...editItem,
                      flavor:
                        selected?.value ||
                        "",
                    })
                  }
                />
              </div>

              {/* LITERS */}
              <div
                className={styles.field}
              >
                <label>Liters</label>

                <Select
                  options={getLiterOptions(
                    editItem.productId
                  )}
                  placeholder="Select Liters"
                  value={
                    getLiterOptions(
                      editItem.productId
                    ).find(
                      (l) =>
                        l.value ===
                        editItem.litters
                    ) || null
                  }
                  onChange={(
                    selected
                  ) =>
                    setEditItem({
                      ...editItem,

                      litters:
                        selected?.value ||
                        "",

                      mrp:
                        selected?.mrp ||
                        "",
                    })
                  }
                />
              </div>

              {/* MRP */}
              <div
                className={styles.field}
              >
                <label>MRP</label>

                <Select
                  options={getMrpOptions(
                    editItem.productId
                  )}
                  placeholder="Select MRP"
                  value={
                    getMrpOptions(
                      editItem.productId
                    ).find(
                      (m) =>
                        m.value ===
                        editItem.mrp
                    ) || null
                  }
                  onChange={(
                    selected
                  ) =>
                    setEditItem({
                      ...editItem,
                      mrp:
                        selected?.value ||
                        "",
                    })
                  }
                />
              </div>

              {/* QTY */}
              <div
                className={styles.field}
              >
                <label>Qty</label>

                <input
                  type="number"
                  value={editItem.qty}
                  onChange={(e) =>
                    setEditItem({
                      ...editItem,
                      qty:
                        e.target.value,
                    })
                  }
                />
              </div>

              {/* COST */}
              <div
                className={styles.field}
              >
                <label>
                  Cost Price
                </label>

                <input
                  type="number"
                  value={
                    editItem.costPrice
                  }
                  onChange={(e) =>
                    setEditItem({
                      ...editItem,
                      costPrice:
                        e.target.value,
                    })
                  }
                />
              </div>

              {/* SELLING */}
              <div
                className={styles.field}
              >
                <label>
                  Selling Price
                </label>

                <input
                  type="number"
                  value={
                    editItem.sellingPrice
                  }
                  onChange={(e) =>
                    setEditItem({
                      ...editItem,
                      sellingPrice:
                        e.target.value,
                    })
                  }
                />
              </div>

              {/* UNIT TYPE */}
              <div
                className={styles.field}
              >
                <label>
                  Unit Type
                </label>

                <select
                  value={
                    editItem.unitType
                  }
                  onChange={(e) =>
                    setEditItem({
                      ...editItem,
                      unitType:
                        e.target.value,
                    })
                  }
                >
                  <option value="box">
                    Box
                  </option>

                  <option value="piece">
                    Piece
                  </option>

                  <option value="kg">
                    Kg
                  </option>
                </select>
              </div>

              {/* UNIT VALUE */}
              <div
                className={styles.field}
              >
                <label>
                  Unit Value
                </label>

                <input
                  type="number"
                  value={
                    editItem.unitValue
                  }
                  onChange={(e) =>
                    setEditItem({
                      ...editItem,
                      unitValue:
                        e.target.value,
                    })
                  }
                />
              </div>

              {/* BARCODE */}
              <div
                className={styles.field}
              >
                <label>
                  Barcode
                </label>

                <input
                  type="text"
                  value={
                    editItem.barcode
                  }
                  onChange={(e) =>
                    setEditItem({
                      ...editItem,
                      barcode:
                        e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div
              className={styles.modalBtns}
            >
              <button
                type="button"
                onClick={saveEditItem}
                className={
                  styles.submitBtn
                }
              >
                Save Changes
              </button>

              <button
                type="button"
                onClick={
                  closeEditModal
                }
                className={
                  styles.cancelBtn
                }
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CreatePurchase;