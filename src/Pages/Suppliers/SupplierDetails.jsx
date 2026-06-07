import { useEffect, useState } from "react";
import { FaArrowUp, FaArrowLeft, } from "react-icons/fa";

import {
  FiFileText,
  FiEdit,
  FiTrash2,
  FiCreditCard,
  FiChevronDown,
} from "react-icons/fi";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./SupplierDetails.module.css";
import { API } from "../../constants/api";

function SupplierDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [supplier, setSupplier] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [activeTab, setActiveTab] = useState("transactions");
  const [allSuppliers, setAllSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [productSummary, setProductSummary] = useState([]);


  const totalPurchaseQty = productSummary.reduce(
    (sum, item) => sum + item.purchaseQty,
    0
  );

  const totalSalesQty = productSummary.reduce(
    (sum, item) => sum + item.salesQty,
    0
  );


  useEffect(() => {
    fetchSupplierDetails(id);
  }, [id]);

  useEffect(() => {
    fetchAllSuppliers();
  }, []);

  const fetchAllSuppliers = async () => {
    try {
      const token = localStorage.getItem("token");

      const [suppliersRes, balancesRes] = await Promise.all([
        fetch(API.suppliers, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(API.supplierbalance, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const suppliersData = await suppliersRes.json();
      const balancesData = await balancesRes.json();

      const balanceMap = {};
      (balancesData.data || []).forEach((b) => {
        balanceMap[b.supplierId] = b.balance;
      });

      const merged = (suppliersData.data || []).map((s) => ({
        ...s,
        balance: balanceMap[s._id] ?? 0,
      }));

      setAllSuppliers(merged);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchSupplierDetails = async (supplierId) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const [purchaseRes, productRes] = await Promise.all([
        fetch(API.supplierPurchases(supplierId), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(API.supplierProductSummary(supplierId),
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),
      ]);

      const purchaseData = await purchaseRes.json();
      const productData = await productRes.json();

      setSupplier(purchaseData.supplier);
      setPurchases(purchaseData.data || []);
      setProductSummary(productData.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSupplier = (sup) => {
    navigate(`/supplier/${sup._id}`);
    setActiveTab("transactions");
  };

  const filteredSuppliers = allSuppliers.filter((s) =>
    (s.supplierName || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const totalPaid = purchases.reduce((sum, bill) => sum + bill.paidAmount, 0);
  const totalBalance = purchases.reduce((sum, bill) => sum + bill.balanceAmount, 0);

  const getStatus = (bill) => {
    if (bill.balanceAmount === 0) return "Paid";
    if (bill.paidAmount > 0) return "Partial";
    return "Pending";
  };

  return (
    <div className={styles.wrap}>
      {/* Left Panel */}
      <div className={styles.leftPanel}>
        <div className={styles.searchBox}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search Party"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className={styles.partyList}>
          {filteredSuppliers.map((sup) => (
            <div
              key={sup._id}
              className={`${styles.supplierCard} ${id === sup._id ? styles.activeSupplierCard : ""}`}
              onClick={() => handleSelectSupplier(sup)}
            >
              <div className={styles.cardLeft}>
                <h4>{sup.supplierName}</h4>
                <span className={styles.cardRole}>Supplier</span>
              </div>
              <div className={styles.cardRight}>
                <span className={styles.cardBalance}>₹ {sup.balance.toLocaleString("en-IN")}</span>
                <FaArrowUp className={styles.icon} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className={styles.right}>
        {loading ? (
          <div className={styles.loadingState}>Loading...</div>
        ) : (
          <>
            {/* Header */}
            <div className={styles.mainHeader}>
              <button className={styles.backBtn} onClick={() => navigate(-1)}>
                <FaArrowLeft />
              </button>
              <div>
                <div className={styles.headerName}>{supplier?.name}</div>
              </div>
              <div className={styles.headerActions}>
                <button className={styles.invoiceBtn}>
                  <FiFileText className={styles.btnIcon} />
                  <span>Create Sales Invoice</span>
                  <FiChevronDown className={styles.dropdownIcon} />
                </button>

                <button className={styles.editBtn}>
                  <FiEdit className={styles.btnIcon} />
                  <span>Edit</span>
                </button>

                <button className={styles.iconBtn}>
                  <FiTrash2 />
                </button>

                <button className={styles.keyBtn}>
                  <FiCreditCard />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
              {["transactions", "profile", "ledger", "productReport"].map((tab) => (
                <button
                  key={tab}
                  className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ""
                    }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className={styles.content}>
              {/* Transactions Tab */}
              {activeTab === "transactions" && (
                <div className={styles.tableWrap}>
                  <table className={styles.tbl}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Invoice</th>
                        <th>Amount</th>
                        <th>Paid</th>
                        <th>Balance</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchases.map((bill) => (
                        <tr key={bill.purchaseId}
                          onClick={() => navigate(`/supplier/${id}/purchase/${bill.purchaseId}`)}
                          style={{ cursor: "pointer" }}>
                          <td>{bill.invoiceDate}</td>
                          <td>{bill.invoiceNo}</td>
                          <td>₹ {Number(bill.supplierBillAmount || 0).toLocaleString("en-IN", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                          })}</td>

                          <td>₹ {Number(bill.paidAmount || 0).toLocaleString("en-IN", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                          })}</td>
                          <td>
                            ₹ {Number(bill.balanceAmount || 0).toLocaleString("en-IN", {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                          <td>
                            <span
                              className={`${styles.badge} ${styles[getStatus(bill).toLowerCase()]
                                }`}
                            >
                              {getStatus(bill)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className={styles.profileGrid}>

                  {/* General Details */}
                  <div className={styles.profileCard}>
                    <h3 className={styles.cardHeading}>
                      General Details
                    </h3>

                    <div className={styles.profileRow}>
                      <span className={styles.lbl}>Name</span>
                      <span className={styles.val}>
                        {supplier?.supplierName || "-"}
                      </span>
                    </div>

                    <div className={styles.profileRow}>
                      <span className={styles.lbl}>Mobile</span>
                      <span className={styles.val}>
                        {supplier?.mobile || "-"}
                      </span>
                    </div>

                    <div className={styles.profileRow}>
                      <span className={styles.lbl}>Email</span>
                      <span className={styles.val}>
                        {supplier?.email || "-"}
                      </span>
                    </div>
                  </div>

                  {/* Business Details */}
                  <div className={styles.profileCard}>
                    <h3 className={styles.cardHeading}>
                      Business Details
                    </h3>

                    <div className={styles.profileRow}>
                      <span className={styles.lbl}>GST No</span>
                      <span className={styles.val}>
                        {supplier?.gstNumber || "-"}
                      </span>
                    </div>

                    <div className={styles.profileRow}>
                      <span className={styles.lbl}>Address</span>
                      <span className={styles.val}>
                        {supplier?.address || "-"}
                      </span>
                    </div>

                    <div className={styles.profileRow}>
                      <span className={styles.lbl}>City</span>
                      <span className={styles.val}>
                        {supplier?.city || "-"}
                      </span>
                    </div>

                    <div className={styles.profileRow}>
                      <span className={styles.lbl}>State</span>
                      <span className={styles.val}>
                        {supplier?.state || "-"}
                      </span>
                    </div>

                    <div className={styles.profileRow}>
                      <span className={styles.lbl}>Pincode</span>
                      <span className={styles.val}>
                        {supplier?.pincode || "-"}
                      </span>
                    </div>
                  </div>

                </div>
              )}

              {activeTab === "productReport" && (
                <>
                  <div className={styles.summaryRow}>
                    <div className={styles.statCard}>
                      <div className={styles.statLabel}>Products</div>
                      <div className={styles.statValue}>
                        {productSummary.length}
                      </div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statLabel}>Purchase Qty</div>
                      <div className={styles.statValue}>
                        {totalPurchaseQty}
                      </div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statLabel}>Sales Qty</div>
                      <div className={styles.statValue}>
                        {totalSalesQty}
                      </div>
                    </div>
                  </div>

                  <div className={styles.tableWrap}>
                    <table className={styles.tbl}>
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Brand</th>
                          <th>Purchase Qty</th>
                          <th>Purchase Amount</th>
                          <th>Sales Qty</th>
                          <th>Sales Amount</th>
                        </tr>
                      </thead>

                      <tbody>
                        {productSummary.map((item) => (
                          <tr key={item.productId}>
                            <td>{item.productName}</td>
                            <td>{item.brand || "-"}</td>
                            <td>{item.purchaseQty}</td>
                            <td>₹{item.purchaseAmount.toFixed(2)}</td>
                            <td>{item.salesQty}</td>
                            <td>₹{item.salesAmount.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* Ledger Tab */}
              {activeTab === "ledger" && (
                <div className={styles.tableWrap}>
                  <table className={styles.tbl}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Invoice</th>
                        <th>Amount</th>
                        <th>Paid</th>
                        <th>Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchases.map((bill) => (
                        <tr
                          key={bill.purchaseId}
                          onClick={() => navigate(`/supplier/${id}/purchase/${bill.purchaseId}`)}
                          style={{ cursor: "pointer" }}
                        >
                          <td>{bill.invoiceDate}</td>
                          <td>{bill.invoiceNo}</td>
                          <td>₹{bill.supplierBillAmount}</td>
                          <td>₹{bill.paidAmount}</td>
                          <td>₹{bill.balanceAmount}</td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SupplierDetails;