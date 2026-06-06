import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    FaArrowLeft,
    FaBarcode,
    FaEdit,
    FaTrash,
    FaKeyboard,
} from "react-icons/fa";
import { MdAdjust } from "react-icons/md";
import styles from "./ItemDetailsPage.module.css";
import { API } from "../../constants/api";

function ItemDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [activeTab, setActiveTab] = useState("itemDetails");
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

useEffect(() => {
    setLoading(true);
    fetchItemDetails();
}, [id]);

    const fetchProducts = async () => {
        const token = localStorage.getItem("token");

        const res = await fetch(API.products, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();

        if (data.success) {
            setProducts(data.data || []);
        }
    };

    const fetchItemDetails = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API.stock}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();

    if (json.success) {
      setData(json);
    } else {
      setData(null);
    }
  } catch (err) {
    console.error(err);
    setData(null);
  } finally {
    setLoading(false);
  }
};

    if (loading) return <div className={styles.loading}>Loading...</div>;
    if (!data) return <div className={styles.loading}>Item not found</div>;

    const { product, summary, data: stockData } = data;

    return (
        <div className={styles.container}>
        <div className={styles.pageLayout}>

            {/* LEFT ITEMS LIST */}

            <div className={styles.leftPanel}>
  {/* Search */}
  <div className={styles.searchBox}>
    <input
      type="text"
      placeholder="Search Items"
    />
  </div>

  {/* Create Button */}
  <button
    className={styles.createBtn}
    onClick={() => navigate("/create-product")}
  >
    + Create Item
  </button>

  {/* Items */}
  <div className={styles.itemsList}>
    {products.map((item) => (
      <div
        key={item._id}
        className={`${styles.itemCard} ${
          item._id === id ? styles.activeItem : ""
        }`}
        onClick={() => navigate(`/item/${item._id}`)}
      >
        <div className={styles.itemTop}>
          <h4>{item.name}</h4>
        </div>

        <div className={styles.itemBottom}>
          <span>
            {item.currentStock || 0} PCS
          </span>
        </div>
      </div>
    ))}
  </div>
</div>

            <div className={styles.rightPanel}>
                {/* HEADER */}
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <button className={styles.backBtn} onClick={() => navigate(-1)}>
                            <FaArrowLeft />
                        </button>
                        <h2>{product.productName}</h2>
                        <span className={`${styles.badge} ${product.status === "Available" ? styles.inStock : styles.outStock}`}>
                            {product.status === "Available" ? "In Stock" : "Out of Stock"}
                        </span>
                    </div>

                    <div className={styles.headerActions}>
                        <button className={styles.actionBtn}>
                            <FaBarcode />
                            <span>Print Barcode</span>
                        </button>
                        <button className={styles.actionBtn}>
                            <MdAdjust />
                            <span>Adjust Stock</span>
                        </button>
                        <button className={styles.actionBtnIcon}>
                            <FaEdit />
                            <span>Edit</span>
                        </button>
                        <button className={styles.actionBtnDanger}>
                            <FaTrash />
                        </button>
                        <button className={styles.actionBtnIcon}>
                            <FaKeyboard />
                        </button>
                    </div>
                </div>

                {/* TABS */}
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === "itemDetails" ? styles.activeTab : ""}`}
                        onClick={() => setActiveTab("itemDetails")}
                    >
                        Item Details
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === "stockDetails" ? styles.activeTab : ""}`}
                        onClick={() => setActiveTab("stockDetails")}
                    >
                        Stock Details
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === "partyWise" ? styles.activeTab : ""}`}
                        onClick={() => setActiveTab("partyWise")}
                    >
                        Party Wise Report
                    </button>
                </div>

                {/* TAB CONTENT */}
                {activeTab === "itemDetails" && (
                    <div className={styles.tabContent}>

                        {/* LEFT COLUMN */}
                        <div className={styles.leftCol}>

                            {/* General Details */}
                            <div className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <span className={styles.cardIcon}></span>
                                    <h3>General Details</h3>
                                </div>

                                <div className={styles.detailGrid}>
                                    <div className={styles.detailFull}>
                                        <p className={styles.label}>Item Name</p>
                                        <p className={styles.value}>{product.productName}</p>
                                    </div>

                                    <div>
                                        <p className={styles.label}>Brand</p>
                                        <p className={styles.value}>{product.brand || "-"}</p>
                                    </div>

                                    <div>
                                        <p className={styles.label}>Category</p>
                                        <p className={styles.value}>-</p>
                                    </div>

                                    <div>
                                        <p className={styles.label}>Current Stock</p>
                                        <p className={styles.value}>{product.currentStock} PCS</p>
                                    </div>

                                    <div>
                                        <p className={styles.label}>Stock Value</p>
                                        <p className={styles.value}>
                                            ₹ {summary.totalCostValue.toLocaleString("en-IN")}
                                        </p>
                                    </div>

                                    <div>
                                        <p className={styles.label}>Low Stock Quantity</p>
                                        <p className={styles.value}>-</p>
                                    </div>

                                    <div>
                                        <p className={styles.label}>Low Stock Warning</p>
                                        <p className={`${styles.value} ${styles.disabled}`}>Disabled</p>
                                    </div>

                                    <div className={styles.detailFull}>
                                        <p className={styles.label}>Item Description</p>
                                        <p className={styles.value}>-</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className={styles.rightCol}>

                            {/* Pricing Details */}
                            <div className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <span className={styles.cardIcon}></span>
                                    <h3>Pricing Details</h3>
                                </div>

                                <div className={styles.pricingRow}>
                                    <div>
                                        <p className={styles.label}>Sales Price</p>
                                        <p className={styles.priceValue}>
                                            ₹ {stockData[0]?.sellingPrice ?? "-"}
                                            <span className={styles.withTax}> With Tax</span>
                                        </p>
                                    </div>
                                    <div>
                                        <p className={styles.label}>Purchase Price</p>
                                        <p className={styles.priceValue}>
                                            ₹ {stockData[0]?.costPrice ?? "-"}
                                            <span className={styles.withTax}> With Tax</span>
                                        </p>
                                    </div>
                                    <div>
                                        <p className={styles.label}>MRP</p>
                                        <p className={styles.priceValue}>
                                            ₹ {stockData[0]?.mrp ?? "-"}
                                        </p>
                                    </div>
                                </div>

                                <div className={styles.detailGrid} style={{ marginTop: 16 }}>
                                    <div>
                                        <p className={styles.label}>GST Tax Rate</p>
                                        <p className={styles.value}>None</p>
                                    </div>
                                    <div></div>
                                    <div>
                                        <p className={styles.label}>HSN Code</p>
                                        <p className={styles.value}>-</p>
                                    </div>
                                    <div>
                                        <p className={styles.label}>Secondary Unit</p>
                                        <p className={styles.value}>-</p>
                                    </div>
                                </div>
                            </div>

                            {/* Stock Details */}
                            <div className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <span className={styles.cardIcon}></span>
                                    <h3>Stock Details</h3>
                                </div>

                                <div>
                                    <p className={styles.label}>Batching</p>
                                    <p className={styles.value}>
                                        Disabled{" "}
                                        <span className={styles.enableLink}>Enable →</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "stockDetails" && (
                    <div className={styles.stockDetailsTab}>
                        <div className={styles.summaryCards}>
                            <div className={styles.summaryCard}>
                                <p className={styles.label}>Total Purchased</p>
                                <h3>{summary.totalPurchasedQty} PCS</h3>
                            </div>
                            <div className={styles.summaryCard}>
                                <p className={styles.label}>Total Received</p>
                                <h3>{summary.totalReceivedQty} PCS</h3>
                            </div>
                            <div className={styles.summaryCard}>
                                <p className={styles.label}>Total Pending</p>
                                <h3>{summary.totalPendingQty} PCS</h3>
                            </div>
                            <div className={styles.summaryCard}>
                                <p className={styles.label}>Cost Value</p>
                                <h3>₹ {summary.totalCostValue.toLocaleString("en-IN")}</h3>
                            </div>
                            <div className={styles.summaryCard}>
                                <p className={styles.label}>Selling Value</p>
                                <h3>₹ {summary.totalSellingValue.toLocaleString("en-IN")}</h3>
                            </div>
                            <div className={styles.summaryCard}>
                                <p className={styles.label}>Expected Profit</p>
                                <h3 className={styles.profit}>₹ {summary.expectedProfit.toLocaleString("en-IN")}</h3>
                            </div>
                        </div>

                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Invoice No</th>
                                        <th>Date</th>
                                        <th>Flavor</th>
                                        <th>Cost Price</th>
                                        <th>Selling Price</th>
                                        <th>MRP</th>
                                        <th>Purchased Qty</th>
                                        <th>Received Qty</th>
                                        <th>Pending Qty</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stockData.map((item) => (
                                        <tr key={item.purchaseId}>
                                            <td>{item.invoiceNo}</td>
                                            <td>{new Date(item.invoiceDate).toLocaleDateString("en-IN")}</td>
                                            <td>{item.flavor || "-"}</td>
                                            <td>₹ {item.costPrice}</td>
                                            <td>₹ {item.sellingPrice}</td>
                                            <td>₹ {item.mrp}</td>
                                            <td>{item.purchasedQty}</td>
                                            <td>{item.receivedQty}</td>
                                            <td>{item.pendingQty}</td>
                                            <td>
                                                <span className={`${styles.badge} ${item.status === "Available" ? styles.inStock : styles.outStock}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === "partyWise" && (
                    <div className={styles.emptyTab}>
                        <p>Party Wise Report - Coming Soon</p>
                    </div>
                )}
            </div>
</div>
        </div>
    );
}

export default ItemDetails;