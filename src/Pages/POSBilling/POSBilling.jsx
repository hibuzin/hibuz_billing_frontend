import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./POSBilling.module.css";
import { API } from "../../constants/api";

function Toast({ message, type }) {
  if (!message) return null;
  return (
    <div className={`${styles.toast} ${styles[`toast_${type}`]}`}>
      {message}
    </div>
  );
}

function Receipt({ bill, onClose, onPrint }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-GB");
  const timeStr = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.receipt} onClick={(e) => e.stopPropagation()}>

        <div className={styles.receiptTop}>
          <p className={styles.receiptPhone}>
            Phone: {bill.phone || "8124776156"}
          </p>
        </div>

        <div className={styles.dashedLine} />
        <p className={styles.receiptCenter}><strong>Tax Invoice</strong></p>

        <div className={styles.receiptMeta}>
          <span className={styles.receiptMetaLeft}>Cash Sale</span>
          <div className={styles.receiptMetaRight}>
            <span>Date: {dateStr}</span>
            <span>Time: {timeStr}</span>
            <span>Invoice no: {bill.billId}</span>
          </div>
        </div>

        <div className={styles.dashedLine} />

        <div className={styles.receiptTableHead}>
          <span className={styles.colName}>Item Name</span>
          <span className={styles.colQty}>Qty</span>
          <span className={styles.colPrice}>Price</span>
          <span className={styles.colAmt}>Amount</span>
        </div>

        <div className={styles.dashedLine} />

        {bill.items.map((item, i) => (
          <div key={i} className={styles.receiptRow}>
            <span className={styles.colName}>{item.name}</span>
            <span className={styles.colQty}>{item.qty ?? 1}</span>
            <span className={styles.colPrice}>
              {Number(item.price ?? item.finalPrice).toFixed(2)}
            </span>
            <span className={styles.colAmt}>
              {Number(item.finalPrice).toFixed(2)}
            </span>
          </div>
        ))}

        <div className={styles.dashedLine} />

        <div className={styles.summaryRow}>
          <span>Subtotal</span>
          <span className={styles.summaryColon}>:</span>
          <span>{Number(bill.summary.subTotal).toFixed(2)}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Taxes</span>
          <span className={styles.summaryColon}>:</span>
          <span>{Number(bill.summary.totalGST).toFixed(2)}</span>
        </div>
        <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
          <span>Total</span>
          <span className={styles.summaryColon}>:</span>
          <span>{Number(bill.summary.grandTotal).toFixed(2)}</span>
        </div>

        <div className={styles.dashedLine} />

        {bill.summary.gstBreakdown && (
          <>
            <div className={styles.receiptTableHead}>
              <span className={styles.colName}>Tax Type</span>
              <span className={styles.colAmt}>Taxable Amt</span>
              <span className={styles.colAmt}>Tax Amt</span>
            </div>
            <div className={styles.dashedLine} />
            {bill.summary.gstBreakdown.map((g, i) => (
              <div key={i} className={styles.receiptRow}>
                <span className={styles.colName}>{g.label}</span>
                <span className={styles.colAmt}>{Number(g.taxableAmt).toFixed(2)}</span>
                <span className={styles.colAmt}>{Number(g.taxAmt).toFixed(2)}</span>
              </div>
            ))}
            <div className={styles.totalTaxRow}>
              <span>Total Tax: {Number(bill.summary.totalGST).toFixed(2)}</span>
            </div>
            <div className={styles.dashedLine} />
          </>
        )}

        <div className={styles.receiptFooter}>
          <p><strong>Terms &amp; Conditions</strong></p>
          <p>Thank you for doing business with us.</p>
        </div>

        <div className={styles.actionButtons}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.printBtn} onClick={onPrint}>
            Print
          </button>
        </div>
      </div>
    </div>
  );
}

function POSBilling() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [scanCode, setScanCode] = useState("");
  const [codes, setCodes] = useState([]);
  const [scannedItems, setScannedItems] = useState([]);
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanLoading, setScanLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);



  const scanInputRef = useRef(null);

  const subtotal = scannedItems.reduce(
    (sum, it) => sum + Number(it.sellingPrice || 0) * (it.qty || 1),
    0
  );
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  useEffect(() => {
    scanInputRef.current?.focus();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "success" }), 2500);
  };

  const addCode = async () => {
    if (!scanCode.trim()) {
      showToast("Please enter a barcode", "error");
      return;
    }
    try {
      setScanLoading(true);
      const res = await fetch(`${API.scan}/${scanCode}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Scan failed");

      setCodes((prev) => [...prev, scanCode.trim()]);

      setScannedItems((prev) => {
        const existing = prev.find((it) => it.barcode === scanCode.trim());
        if (existing) {
          return prev.map((it) =>
            it.barcode === scanCode.trim()
              ? { ...it, qty: (it.qty || 1) + 1 }
              : it
          );
        }
        return [...prev, { ...data.data, barcode: scanCode.trim(), qty: 1 }];
      });

      setScanCode("");
      showToast("Item added", "success");
      scanInputRef.current?.focus();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setScanLoading(false);
    }
  };

  const updateQty = (barcode, val) => {
    const qty = parseInt(val) || 1;
    setScannedItems((prev) =>
      prev.map((it) => (it.barcode === barcode ? { ...it, qty } : it))
    );
    setCodes((prev) => {
      const filtered = prev.filter((c) => c !== barcode);
      return [...filtered, ...Array(qty).fill(barcode)];
    });
  };

  const removeItem = (barcode) => {
    setScannedItems((prev) => prev.filter((it) => it.barcode !== barcode));
    setCodes((prev) => prev.filter((c) => c !== barcode));
    showToast("Item removed", "success");
  };

  const generateBill = async () => {
    if (codes.length === 0) {
      showToast("Please add at least one item", "error");
      return;
    }
    try {
      setLoading(true);
      setBill(null);
      const res = await fetch(API.bill, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ codes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Bill generation failed");

      setBill(data.data);
      showToast("Bill generated successfully", "success");
      setCodes([]);
      setScannedItems([]);
      setScanCode("");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const holdBill = async () => {
    if (scannedItems.length === 0) {
      showToast("Please add items", "error");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        customerName: "Walk-in Customer",
        items: scannedItems.map((item) => ({
          productId: item.productId,
          qty: item.qty,
          sellingPrice: item.sellingPrice || item.mrp, 
          mrp: item.mrp,
          gst: item.gst || 0,
          barcode: item.barcode,
          flavor: item.flavor || "",
        })),
      };

      console.log("Hold Bill Payload:", JSON.stringify(payload, null, 2));
    

      const res = await fetch(API.holdBill, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      
      const data = await res.json();

      console.log("Server response:", data);
      if (!res.ok) {
        throw new Error(data.message || "Failed to hold bill");
      }

      showToast(
        `Bill Hold Successfully (#${data.data.holdNo})`,
        "success"
      );

      // Clear current screen
      setScannedItems([]);
      setCodes([]);
      setScanCode("");
      setSearchResults([]);
      setShowDropdown(false);

    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (value) => {
    setScanCode(value);

    if (!value.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    try {
      const res = await fetch(
        `${API.bill}/search-product?search=${value}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        setSearchResults(data.data);
        setShowDropdown(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const addSearchProduct = (product) => {
    const item = {
      productId: product.productId,
      productName: product.productName,
      brand: product.brand,
      barcode: product.barcode,
      mrp: product.mrp || 0,
      sellingPrice: product.sellingPrice || 0,
      flavor: product.flavor || "",
      qty: 1,
    };

    setScannedItems((prev) => {
      const existing = prev.find(
        (p) => p.barcode === product.barcode
      );

      if (existing) {
        return prev.map((p) =>
          p.barcode === product.barcode
            ? { ...p, qty: p.qty + 1 }
            : p
        );
      }

      return [...prev, item];
    });

    setCodes((prev) => [...prev, product.barcode]);

    setScanCode("");
    setSearchResults([]);
    setShowDropdown(false);

    showToast("Item added", "success");
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey && e.key === "Escape") {
        navigate(-1);
      }

      if (e.key === "F7") {
        e.preventDefault();
        generateBill();
      }

      if (e.key === "F6") {
        e.preventDefault();
        generateBill();
      }

      if (e.ctrlKey && e.key.toLowerCase() === "b") {
        e.preventDefault();
        holdBill();
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);
  }, [codes, scannedItems]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey && e.key === "Escape") navigate(-1);
      if (e.key === "F7") { e.preventDefault(); generateBill(); }
      if (e.key === "F6") { e.preventDefault(); generateBill(); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [codes]);

  return (
    <div className={styles.posWrap}>

      {/* ── Top Bar ── */}
      <div className={styles.topBar}>
        <button className={styles.exitBtn} onClick={() => navigate(-1)}>
          <span>←</span> Exit POS <kbd>[CTRL+ESC]</kbd>
        </button>
        <span className={styles.topTitle}>POS Billing</span>
        <div className={styles.topRight}>
          <button className={styles.settingsBtn}>
            Settings <kbd>[CTRL+S]</kbd>
          </button>
        </div>
      </div>

      {/* ── Tab Row ── */}
      <div className={styles.tabsRow}>
        <div className={styles.tabActive}>
          Billing Screen 1 <kbd>[CTRL+1]</kbd>
          <span className={styles.tabClose} onClick={() => navigate(-1)}>✕</span>
        </div>
        <div
          className={styles.tabAdd}
          onClick={holdBill}
        >
          + Hold Bill & Create Another <kbd>[CTRL+B]</kbd>
        </div>
      </div>

      {/* ── Main Body ── */}
      <div className={styles.mainBody}>

        {/* ── Left Panel ── */}
        <div className={styles.leftPanel}>

          {/* Action Buttons */}
          <div className={styles.actionsBar}>
            <button className={styles.actionBtn} onClick={() => scanInputRef.current?.focus()}>
              + New Item <kbd>[CTRL+I]</kbd>
            </button>
            <button
              className={`${styles.actionBtn} ${styles.dangerBtn}`}
              onClick={() => {
                setScannedItems([]);
                setCodes([]);
                showToast("All items cleared", "success");
              }}
            >
              Delete Item <kbd>[DEL]</kbd>
            </button>
          </div>

          {/* Scan Row */}
          <div className={styles.searchRow}>
            <input
              ref={scanInputRef}
              className={styles.searchInput}
              placeholder="Scan Barcode or Enter item code and press Enter"
              value={scanCode}
              onChange={(e) => searchProducts(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCode()}
              disabled={scanLoading}
            />
            <button
              className={styles.scanAddBtn}
              onClick={addCode}
              disabled={scanLoading}
            >
              {scanLoading ? "..." : "Add"}
            </button>

            {showDropdown && searchResults.length > 0 && (
              <div className={styles.searchDropdown}>
                {searchResults.map((item) => (
                  <div
                    key={item.productId}
                    className={styles.searchItem}
                    onClick={() => addSearchProduct(item)}
                  >
                    <div>
                      <strong>{item.productName}</strong>
                      <small> ({item.brand})</small>
                    </div>

                    <div>
                      ₹{item.mrp || 0}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Table */}
          <div className={styles.tableWrap}>
            <div className={styles.tableHead}>
              <span>NO</span>
              <span>ITEMS</span>
              <span>BARCODE</span>
              <span>MRP</span>
              <span>SP (₹)</span>
              <span>DISC (%)</span>
              <span>QUANTITY</span>
              <span>AMOUNT (₹)</span>
            </div>

            {scannedItems.length === 0 ? (
              <div className={styles.emptyState}>
                Scan a barcode to add items
              </div>
            ) : (
              scannedItems.map((item, idx) => (
                <div className={styles.tableRow} key={`${item.barcode}-${idx}`}>
                  <span>{idx + 1}</span>
                  <span className={styles.itemName}>
                    {item.productName}
                    {item.flavor ? (
                      <span className={styles.itemSub}> · {item.flavor}</span>
                    ) : null}
                  </span>
                  <span className={styles.muted}>{item.barcode}</span>
                  <span className={styles.muted}>₹{item.mrp || 0}</span>
                  <span>₹{item.sellingPrice}</span>
                  <span className={styles.muted}>0</span>
                  <span className={styles.qtyCell}>
                    <input
                      className={styles.qtyInput}
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={(e) => updateQty(item.barcode, e.target.value)}
                    />
                    <span className={styles.pcsLabel}>PCS</span>
                  </span>
                  <span className={styles.amtCell}>
                    ₹{(Number(item.sellingPrice) * item.qty).toFixed(2)}
                    <button
                      className={styles.deleteBtn}
                      onClick={() => removeItem(item.barcode)}
                    >
                      🗑
                    </button>
                  </span>
                </div>
              ))
            )}
          </div>

          <div className={styles.arrowHint}>
            ↕ Use UP and DOWN arrow keys to scroll through different items
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className={styles.rightPanel}>

          <div className={styles.rightTopBtns}>
            <button className={styles.rightBtn}>Add Discount <kbd>[F2]</kbd></button>
            <button className={styles.rightBtn}>Add Additional Charge <kbd>[F3]</kbd></button>
          </div>

          <div className={styles.billBox}>
            <p className={styles.billBoxTitle}>Bill details</p>
            <div className={styles.billRow}>
              <span>Sub Total</span>
              <span className={styles.billVal}>₹ {subtotal.toFixed(2)}</span>
            </div>
            <div className={styles.billRow}>
              <span>Tax</span>
              <span className={styles.billVal}>₹ {tax.toFixed(2)}</span>
            </div>
            <div className={styles.totalBox}>
              <span>Total Amount</span>
              <span>₹ {Math.round(total)}</span>
            </div>
          </div>

          <div className={styles.receivedBox}>
            <div className={styles.recvLabel}>
              <span>Received Amount</span>
              <span className={styles.recvF4}>[F4]</span>
            </div>
            <div className={styles.recvRow}>
              <span className={styles.recvAmount}>₹ {Math.round(total)}</span>
              <select className={styles.cashSelect}>
                <option>Cash</option>
                <option>UPI</option>
                <option>Card</option>
              </select>
            </div>
          </div>

          <div className={styles.bottomActions}>
            <button
              className={styles.savePrintBtn}
              onClick={generateBill}
              disabled={loading || scannedItems.length === 0}
            >
              Save &amp; Print <kbd>[F6]</kbd>
            </button>
            <button
              className={styles.saveBtn}
              onClick={generateBill}
              disabled={loading || scannedItems.length === 0}
            >
              {loading ? "Generating..." : "Save Bill"} <kbd>[F7]</kbd>
            </button>
          </div>

        </div>
      </div>

      {/* ── Receipt Modal ── */}
      {bill && (
        <Receipt
          bill={bill}
          onClose={() => setBill(null)}
          onPrint={() => {
            window.print();
            showToast("Bill sent to printer", "success");
          }}
        />
      )}



      <Toast message={toast.message} type={toast.type} />
    </div>
  );
}

export default POSBilling;