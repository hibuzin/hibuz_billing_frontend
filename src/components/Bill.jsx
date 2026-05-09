import { useState, useRef } from "react";
import styles from "./Bill.module.css";

function Bill() {
  const [code, setCode] = useState("");
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bill, setBill] = useState(null);

  const token = localStorage.getItem("token");

  const receiptRef = useRef(null);

  const addCode = () => {
    if (!code.trim()) return;
    setCodes((prev) => [...prev, code.trim()]);
    setCode("");
  };

  const removeCode = (index) => {
    setCodes((prev) => prev.filter((_, i) => i !== index));
  };

  const generateBill = async () => {
    if (codes.length === 0) return;
    try {
      setLoading(true);
      setBill(null);
      const res = await fetch("http://192.168.31.181:5000/api/bill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ codes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Bill failed");
      setBill(data.data);
      setTimeout(() => {
  receiptRef.current?.scrollIntoView({
    behavior: "smooth",
    block: "end",
  });
}, 100);
      setCodes([]);
      setCode("");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };


  const now = new Date();
  const dateStr = now.toLocaleDateString("en-GB");
  const timeStr = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className={styles.container}>
      <div className={styles.card}>

        <div className={styles.header}>
          <h2 className={styles.title}>Bill generator</h2>
          {codes.length > 0 && (
            <span className={styles.badge}>{codes.length}</span>
          )}
        </div>

        <div className={styles.inputRow}>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCode()}
            placeholder="Enter barcode"
            className={styles.input}
          />
          <button onClick={addCode} className={styles.addBtn}>Add</button>
        </div>

        {codes.length > 0 ? (
          <div className={styles.list}>
            {codes.map((c, i) => (
              <div key={i} className={styles.codeItem}>
                <span>{c}</span>
                <button onClick={() => removeCode(i)}>Remove</button>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.emptyState}>No barcodes added yet</p>
        )}

        <button
          className={styles.generateBtn}
          onClick={generateBill}
          disabled={loading || codes.length === 0}
        >
          {loading ? "Generating..." : "Generate bill"}
        </button>

        {bill && (
  <div
    className={styles.modalOverlay}
    onClick={() => setBill(null)}
  >
    <div
      ref={receiptRef}
      className={styles.receipt}
      onClick={(e) => e.stopPropagation()}
    >

            {/* TOP */}
            <div className={styles.receiptTop}>
              <p className={styles.receiptPhone}>Phone: {bill.phone || "8124776156"}</p>
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

            {/* ITEMS TABLE */}
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
                <span className={styles.colPrice}>{Number(item.price ?? item.finalPrice).toFixed(2)}</span>
                <span className={styles.colAmt}>{Number(item.finalPrice).toFixed(2)}</span>
              </div>
            ))}

            <div className={styles.dashedLine} />

            {/* SUBTOTAL / TAX / TOTAL */}
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

            {/* GST BREAKDOWN */}
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

            {/* FOOTER */}
            <div className={styles.receiptFooter}>
              <p><strong>Terms &amp; Conditions</strong></p>
              <p>Thank you for doing business with us.</p>
            </div>
<div className={styles.actionButtons}>
  <button
    className={styles.cancelBtn}
    onClick={() => setBill(null)}
  >
    Cancel
  </button>

  <button
    className={styles.printBtn}
    onClick={() => window.print()}
  >
    Print
  </button>
</div>
          </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Bill;