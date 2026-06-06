import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./PurchaseBillView.module.css";
import { API } from "../../constants/api";

function PurchaseBillView() {
  const { supplierId, purchaseId } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBill();
  }, []);

  const fetchBill = async () => {
    try {
      const token = localStorage.getItem("token");
const res = await fetch(API.purchaseById(purchaseId), 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setBill(data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;
  if (!bill) return <div style={{ padding: 40 }}>Bill not found</div>;

  return (
    <div className={styles.page}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          ← Purchase Bill
        </button>
        <div className={styles.topActions}>
          <button className={styles.outlineBtn}>🖨 Print</button>
          <button className={styles.outlineBtn}>⬇ Download PDF</button>
        </div>
      </div>

      {/* Bill Container */}
      <div className={styles.billWrap}>
        <div className={styles.invoice}>

          {/* Company Header */}
          <div className={styles.companyHeader}>
            <h2 className={styles.companyName}>
              {bill.companyName || "Your Company"}
            </h2>
            <p className={styles.companyAddr}>
              {bill.companyAddress || ""}
            </p>
          </div>

          <div className={styles.divider} />

          {/* Invoice Meta */}
          <div className={styles.metaRow}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Invoice No.</span>
              <span className={styles.metaValue}>{bill.invoiceNo}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Invoice Date</span>
              <span className={styles.metaValue}>{bill.invoiceDate}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Due Date</span>
              <span className={styles.metaValue}>
                {bill.dueDate || "—"}
              </span>
            </div>
          </div>

          <div className={styles.divider} />

          {/* Supplier Info */}
          <div className={styles.billTo}>
            <p className={styles.billToLabel}>BILL FROM</p>
            <p className={styles.supplierName}>{bill.supplierName}</p>
            <p className={styles.supplierMobile}>{bill.supplierMobile}</p>
          </div>

          <div className={styles.divider} />

          {/* Items Table */}
          <table className={styles.itemTable}>
            <thead>
              <tr>
                <th>Items</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Tax</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {(bill.items || []).map((item, i) => (
                <tr key={i}>
                  <td>{item.productName}</td>
                  <td>{item.qty} {item.unit}</td>
                  <td>₹{item.rate}</td>
                  <td>
                    ₹{item.taxAmount}
                    <br />
                    <span className={styles.taxPct}>
                      ({item.taxPercent}%)
                    </span>
                  </td>
                  <td>₹{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.divider} />

          {/* Totals */}
          <div className={styles.totalsWrap}>
            <div className={styles.totalsRight}>
              <div className={styles.totalRow}>
                <span>Taxable Amount</span>
                <span>₹{bill.taxableAmount?.toFixed(2)}</span>
              </div>
              {bill.cgst > 0 && (
                <div className={styles.totalRow}>
                  <span>CGST @{bill.cgstPercent}%</span>
                  <span>₹{bill.cgst?.toFixed(2)}</span>
                </div>
              )}
              {bill.sgst > 0 && (
                <div className={styles.totalRow}>
                  <span>SGST @{bill.sgstPercent}%</span>
                  <span>₹{bill.sgst?.toFixed(2)}</span>
                </div>
              )}
              <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                <span>Total Amount</span>
                <span>₹{bill.totalAmount?.toFixed(2)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Paid Amount</span>
                <span>₹{bill.paidAmount?.toFixed(2)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Balance</span>
                <span>₹{bill.balanceAmount?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Amount in Words */}
          <div className={styles.amtWords}>
            <span>Total Amount (in words): </span>
            <strong>{bill.amountInWords || "—"}</strong>
          </div>

        </div>
      </div>
    </div>
  );
}

export default PurchaseBillView;