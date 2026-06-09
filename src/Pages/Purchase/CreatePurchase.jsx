import { useState, useEffect } from "react";
import Select from "react-select";
import { FiTrash2, FiPlus, FiSave, FiArrowLeft } from "react-icons/fi";
import { MdQrCodeScanner } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import styles from "./CreatePurchase.module.css";
import AddItemsModal from "./AddItemsModal";
import Toast from "../../components/Toast";
import { API } from "../../constants/api";

function CreatePurchase() {
  const emptyItem = {
    productId: "",
    mrp: "",
    qty: "",
    costPrice: "",
    sellingPrice: "",
    barcode: "",
    discount: "",
  };

  const [form, setForm] = useState({
    supplierId: "",
    invoiceNo: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    supplierBillAmount: "",
    paidAmount: "",
    notes: "",
  });

  const [billItems, setBillItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [showItemModal, setShowItemModal] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const balanceAmount =
    Number(form.supplierBillAmount || 0) - Number(form.paidAmount || 0);

  const subtotal = billItems.reduce(
    (acc, item) => acc + (Number(item.qty) || 0) * (Number(item.costPrice) || 0),
    0
  );

  const totalDiscount = billItems.reduce(
    (acc, item) => acc + (Number(item.discount) || 0),
    0
  );

  const totalTax = billItems.reduce(
    (acc, item) =>
      acc +
      ((Number(item.qty) || 0) *
        (Number(item.costPrice) || 0) *
        (Number(item.tax) || 0)) /
      100,
    0
  );

  const totalAmount = subtotal - totalDiscount + totalTax;

  useEffect(() => {
  setForm((prev) => ({
    ...prev,
    supplierBillAmount: totalAmount,
  }));
}, [totalAmount]);

  useEffect(() => {
    fetchSuppliers();
    fetchProducts();
  }, []);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 2500);
  };

  const fetchSuppliers = async () => {
    try {
      const res = await fetch(API.suppliers, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuppliers(data.data || []);
    } catch {
      showToast("Failed to load suppliers", "error");
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(API.products, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setProducts(data.data || []);
    } catch {
      showToast("Failed to load products", "error");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const getProductOptions = () =>
    products.map((p) => ({ value: p._id, label: p.name, product: p }));

  const updateItem = (index, field, value) => {
    setBillItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleProductSelect = (index, selected) => {
    const product = selected?.product;
    setBillItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        productId: product?._id || "",
        mrp: product?.mrp || "",
        costPrice: product?.costPrice || "",
        sellingPrice: product?.sellingPrice || "",
        barcode: product?.barcode || "",
      };
      return updated;
    });
  };

  const handleAddItems = (newItems) => {
    setBillItems((prev) => {
      const existing = prev.filter((i) => i.productId);
      const existingIds = new Set(existing.map((i) => i.productId));
      const toAdd = newItems.filter((i) => !existingIds.has(i.productId));
      return [...existing, ...toAdd];
    });
  };

  const removeRow = (index) => {
    if (billItems.length === 1) return;
    setBillItems((prev) => prev.filter((_, i) => i !== index));
  };

  const selectedSupplier = suppliers.find(
    (s) => s._id === form.supplierId
  );

  const supplierOptions = suppliers.map((s) => ({
    value: s._id,
    label: s.supplierName,
  }));

  const handleSubmit = async () => {
    if (!form.supplierId) return showToast("Select supplier", "error");
    const validItems = billItems.filter((i) => i.productId);
    if (validItems.length === 0) return showToast("Add at least one item", "error");

    try {
      setLoading(true);
      const payload = {
        supplierId: form.supplierId,
        invoiceNo: form.invoiceNo,
        invoiceDate: form.invoiceDate,
        totalAmount,
        supplierBillAmount: Number(form.supplierBillAmount),
        paidAmount: Number(form.paidAmount),
        balanceAmount,
        items: validItems.map((item) => ({
          productId: item.productId,
          qty: Number(item.qty),
          costPrice: Number(item.costPrice),
          mrp: Number(item.mrp),
          sellingPrice: Number(item.sellingPrice),
          barcode: item.barcode,
        })),
      };

      const res = await fetch(API.createPurchase, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Purchase failed");

      showToast("Purchase created successfully", "success");
      setForm({
        supplierId: "",
        invoiceNo: "",
        invoiceDate: new Date().toISOString().split("T")[0],
        dueDate: "",
        supplierBillAmount: "",
        paidAmount: "",
        notes: "",
      });
      setBillItems([{ ...emptyItem }]);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "32px",
      height: "32px",
      fontSize: "13px",
      border: state.isFocused ? "1.5px solid #1a73e8" : "1px solid #d0d7de",
      borderRadius: "4px",
      boxShadow: "none",
      background: "#fff",
      cursor: "pointer",
    }),
    valueContainer: (base) => ({ ...base, padding: "0 8px", height: "30px" }),
    indicatorsContainer: (base) => ({ ...base, height: "30px" }),
    option: (base, state) => ({
      ...base,
      fontSize: "13px",
      padding: "6px 10px",
      background: state.isSelected ? "#1a73e8" : state.isFocused ? "#f0f4ff" : "#fff",
      color: state.isSelected ? "#fff" : "#24292f",
      cursor: "pointer",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "13px",
      borderRadius: "6px",
      border: "1px solid #d0d7de",
      boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
    }),
    placeholder: (base) => ({ ...base, color: "#aaa", fontSize: "12px" }),
    singleValue: (base) => ({ ...base, fontSize: "13px", color: "#24292f" }),
  };

  return (
    <>
      <Toast message={toast.message} type={toast.type} />

      <div className={styles.page}>
        {/* TOP BAR */}
        <div className={styles.topBar}>
          <div className={styles.topLeft}>
            <button
              className={styles.backBtn}
              onClick={() => navigate("/purchase")}
            >
              <FiArrowLeft size={16} />
              <span>Create Purchase Invoice</span>
            </button>
          </div>
          <div className={styles.topRight}>
            <button className={styles.btnOutline} onClick={() => { }}>
              Save &amp; New
            </button>
            <button
              className={styles.btnPrimary}
              onClick={handleSubmit}
              disabled={loading}
            >
              <FiSave size={14} />
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {/* INVOICE BODY */}
        <div className={styles.invoiceBody}>
          {/* HEADER SECTION */}
          <div className={styles.headerSection}>
            <div className={styles.billFrom}>
              <p className={styles.sectionLabel}>Bill From</p>
              <div className={styles.partyBox}>
                <Select
                  options={supplierOptions}
                  placeholder="+ Add Party"
                  menuPortalTarget={document.body}
                  styles={{
                    ...selectStyles,

                    control: (base) => ({
                      ...base,
                      width: "100%",
                      height: "100%",
                      minHeight: "100%",
                      border: "none",
                      boxShadow: "none",
                      background: "transparent",
                      cursor: "pointer",
                    }),

                    valueContainer: (base) => ({
                      ...base,
                      height: "100%",
                      justifyContent: "center",
                    }),

                    indicatorsContainer: () => ({
                      display: "none",
                    }),

                    indicatorSeparator: () => ({
                      display: "none",
                    }),
                  }}
                  onChange={(sel) =>
                    setForm((prev) => ({
                      ...prev,
                      supplierId: sel?.value || "",
                    }))
                  }
                />
              </div>
            </div>

            <div className={styles.invoiceMeta}>
              <div className={styles.metaRow}>
                <div className={styles.metaField}>
                  <label>purchase Inv No.</label>
                  <input
                    type="text"
                    name="invoiceNo"
                    value={form.invoiceNo}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.metaField}>
                  <label>Purchase Inv Date.</label>
                  <input
                    type="date"
                    name="invoiceDate"
                    value={form.invoiceDate}
                    onChange={handleChange}
                  />
                </div>

              </div>
              <div className={styles.metaRow}>
                <div className={styles.metaField}>
                  <label>Supplier Bill Amount</label>
                  <input
                    type="number"
                    name="supplierBillAmount"
                    value={form.supplierBillAmount}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </div>

              </div>
            </div>
          </div>

          {/* ITEMS TABLE */}
          <div className={styles.tableSection}>
            <table className={styles.itemsTable}>
              <thead>
                <tr>
                  <th className={styles.colNo}>NO</th>
                  <th className={styles.colItem}>ITEMS</th>
                  <th className={styles.colMrp}>MRP</th>
                  <th className={styles.colQty}>QTY</th>
                  <th className={styles.colPrice}>PRICE/ITEM (₹)</th>
                  <th className={styles.colDiscount}>DISCOUNT</th>
                  <th className={styles.colTax}>TAX</th>
                  <th className={styles.colAmount}>AMOUNT (₹)</th>
                  <th className={styles.colAction}></th>
                </tr>
              </thead>
              <tbody>
                {billItems.map((item, index) => {
                  const lineTotal =
                    (Number(item.qty) || 0) * (Number(item.costPrice) || 0) -
                    (Number(item.discount) || 0);

                  return (
                    <tr key={index} className={styles.itemRow}>
                      <td className={styles.colNo}>{index + 1}</td>
                      <td className={styles.colItem}>
                        <Select
                          options={getProductOptions()}
                          placeholder="Search item..."
                          value={
                            getProductOptions().find((p) => p.value === item.productId) || null
                          }
                          onChange={(sel) => handleProductSelect(index, sel)}
                          styles={selectStyles}
                          isSearchable
                        />
                        <input
                          className={styles.descInput}
                          placeholder="Enter Description (optional)"
                          value={item.barcode}
                          onChange={(e) => updateItem(index, "barcode", e.target.value)}
                        />
                      </td>
                      <td className={styles.colMrp}>
                        <input
                          type="number"
                          className={styles.cellInput}
                          value={item.mrp}
                          onChange={(e) => updateItem(index, "mrp", e.target.value)}
                          placeholder="0"
                        />
                      </td>
                      <td className={styles.colQty}>
                        <div className={styles.qtyCell}>
                          <input
                            type="number"
                            className={styles.cellInput}
                            value={item.qty}
                            onChange={(e) => updateItem(index, "qty", e.target.value)}
                          />
                          <span className={styles.unit}>PCS</span>
                        </div>
                      </td>
                      <td className={styles.colPrice}>
                        <input
                          type="number"
                          className={styles.cellInput}
                          value={item.costPrice}
                          onChange={(e) => updateItem(index, "costPrice", e.target.value)}
                          placeholder="0"
                        />
                      </td>
                      <td className={styles.colDiscount}>
                        <div className={styles.discountCell}>
                          <div className={styles.discRow}>
                            <span className={styles.pct}>%</span>
                            <input
                              type="number"
                              className={styles.cellInput}
                              placeholder="0"
                              value={item.discountPct || ""}
                              onChange={(e) => updateItem(index, "discountPct", e.target.value)}
                            />
                          </div>
                          <div className={styles.discRow}>
                            <span className={styles.rupee}>₹</span>
                            <input
                              type="number"
                              className={styles.cellInput}
                              placeholder="0"
                              value={item.discount || ""}
                              onChange={(e) => updateItem(index, "discount", e.target.value)}
                            />
                          </div>
                        </div>
                      </td>
                      <td className={styles.colTax}>
                        <select
                          className={styles.taxSelect}
                          value={item.tax || ""}
                          onChange={(e) => updateItem(index, "tax", e.target.value)}
                        >
                          <option value="">None</option>
                          <option value="5">5%</option>
                          <option value="12">12%</option>
                          <option value="18">18%</option>
                          <option value="28">28%</option>
                        </select>
                        <div className={styles.taxAmt}>
                          ₹{" "}
                          {(
                            ((Number(item.qty) || 0) *
                              (Number(item.costPrice) || 0) *
                              (Number(item.tax) || 0)) /
                            100
                          ).toFixed(0)}
                        </div>
                      </td>
                      <td className={styles.colAmount}>
                        ₹ {lineTotal.toLocaleString("en-IN")}
                      </td>
                      <td className={styles.colAction}>
                        <button
                          className={styles.deleteRowBtn}
                          onClick={() => removeRow(index)}
                          type="button"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* ADD ITEM + SCAN BAR */}
            <div className={styles.addItemBar}>
              <button
                className={styles.addItemBtn}
                onClick={() => setShowItemModal(true)}
                type="button"
              >
                <FiPlus size={14} />
                Add Item
              </button>
              <button className={styles.scanBtn} type="button">
                <MdQrCodeScanner size={40} />
                Scan Barcode
              </button>
            </div>

            {/* SUBTOTAL ROW */}
            <div className={styles.subtotalRow}>
              <span>SUBTOTAL</span>
              <span>₹ {subtotal.toLocaleString("en-IN")}</span>
              <span>- ₹ {totalDiscount.toLocaleString("en-IN")}</span>
              <span>₹ {totalTax.toFixed(0)}</span>
            </div>
          </div>

          {/* FOOTER */}
          <div className={styles.invoiceFooter}>
            <div className={styles.footerLeft}>
              <button className={styles.addLink}>+ Add Notes</button>
              <button className={styles.addLink}>+ Add Terms and Conditions</button>
            </div>
            <div className={styles.totalsPanel}>
              <button className={styles.addLink}>+ Add Additional Charges</button>
              <div className={styles.totalLine}>
                <span>Taxable Amount</span>
                <span>₹ {subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className={styles.totalLine}>
                <span>+ Add Discount</span>
                <span>- ₹ {totalDiscount.toLocaleString("en-IN")}</span>
              </div>
              <div className={styles.divider} />
              <div className={styles.totalLineBold}>
                <span>Total Amount</span>
                <span>₹ {totalAmount.toLocaleString("en-IN")}</span>
              </div>
              <div className={styles.divider} />
              <div className={styles.totalLine}>
                <span>Amount Paid</span>
                <div className={styles.paidInput}>
                  <span>₹</span>
                  <input
                    type="number"
                    name="paidAmount"
                    value={form.paidAmount}
                    onChange={handleChange}
                    placeholder="0"
                  />
                  <select className={styles.payMode}>
                    <option>Cash</option>
                    <option>UPI</option>
                    <option>Bank</option>
                  </select>
                </div>
              </div>
              <div className={styles.balanceLine}>
                <span>Balance Amount</span>
                <span className={balanceAmount > 0 ? styles.balRed : styles.balGreen}>
                  ₹ {balanceAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showItemModal && (
        <AddItemsModal
          products={products}
          onClose={() => setShowItemModal(false)}
          onAddItems={handleAddItems}
        />
      )}
    </>
  );
}

export default CreatePurchase;