import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBarcode, FaEdit, FaTrash, FaKeyboard } from "react-icons/fa";
import { MdAdjust } from "react-icons/md";
import styles from "./ItemDetailsPage.module.css";
import { API } from "../../constants/api";

function ItemDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [products, setProducts] = useState([]);
    const [activeTab, setActiveTab] = useState("itemDetails");
    const [switching, setSwitching] = useState(false);
    const [search, setSearch] = useState("");

    // Fetch all products once
    useEffect(() => {
        const fetchProducts = async () => {
            const token = localStorage.getItem("token");
            const res = await fetch(API.products, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const json = await res.json();
            if (json.success) setProducts(json.data || []);
        };
        fetchProducts();
    }, []);

    const fetchItemDetails = useCallback(async () => {
        try {
            setSwitching(true);
            const token = localStorage.getItem("token");
            const res = await fetch(`${API.stockList}/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const json = await res.json();
            if (json.success) setData(json);
            else setData(null);
        } catch (err) {
            console.error(err);
            setData(null);
        } finally {
            setSwitching(false);
        }
    }, [id]);

    const searchProducts = async (value) => {
        try {
            const token = localStorage.getItem("token");

            if (!value.trim()) {
                const res = await fetch(API.products, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                if (data.success) {
                    setProducts(data.data || []);
                }

                return;
            }

            const res = await fetch(
                `${API.products}/search?search=${encodeURIComponent(value)}`,
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


    useEffect(() => {
        fetchItemDetails();
    }, [fetchItemDetails]);

    // First load — nothing yet
    if (!data && switching) return <div className={styles.loading}>Loading...</div>;
    if (!data) return <div className={styles.loading}>Item not found</div>;

    const { product, summary, data: stockData } = data;

    return (
        <div className={styles.container}>
            <div className={styles.pageLayout}>

                {/* LEFT PANEL */}
                <div className={styles.leftPanel}>
                    <div className={styles.searchBox}>
                        <input
                            type="text"
                            placeholder="Search Items"
                            value={search}
                            onChange={(e) => {
                                const value = e.target.value;
                                setSearch(value);
                                searchProducts(value);
                            }}
                            className={styles.searchInput}
                        />
                    </div>

                    <button className={styles.createBtn} onClick={() => navigate("/create-product")}>
                        + Create Item
                    </button>

                    <div className={styles.itemsList}>
                        {products.map((item) => (
                            <div
                                key={item._id}
                                className={`${styles.itemCard} ${item._id === id ? styles.activeItem : ""}`}
                                onClick={() => item._id !== id && navigate(`/item/${item._id}`)}
                            >
                                <div className={styles.itemTop}>
                                    <h4>{item.name || item.productName}</h4>
                                </div>
                                <div className={styles.itemBottom}>
                                    <span>{item.stock || 0} PCS</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className={`${styles.rightPanel} ${switching ? styles.switching : ""}`}>

                    {/* HEADER */}
                    <div className={styles.header}>
                        <div className={styles.headerLeft}>
                            <button
                                className={styles.backBtn}
                                onClick={() => navigate("/product")}
                            >
                                <FaArrowLeft />
                            </button>
                            <h2>{product.productName}</h2>
                            <span className={`${styles.badge} ${product.status === "Available" ? styles.inStock : styles.outStock}`}>
                                {product.status === "Available" ? "In Stock" : "Out of Stock"}
                            </span>
                        </div>

                        <div className={styles.headerActions}>
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
                        {["itemDetails", "stockDetails", "partyWise"].map((tab) => (
                            <button
                                key={tab}
                                className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ""}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab === "itemDetails" ? "Item Details"
                                    : tab === "stockDetails" ? "Stock Details"
                                        : "Party Wise Report"}
                            </button>
                        ))}
                    </div>

                    {/* TAB: ITEM DETAILS */}
                    {activeTab === "itemDetails" && (
                        <div className={styles.tabContent}>
                            <div className={styles.leftCol}>
                                <div className={styles.card}>
                                    <div className={styles.cardHeader}>
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
                                            <p className={styles.value}>₹ {summary.totalCostValue.toLocaleString("en-IN")}</p>
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

                            <div className={styles.rightCol}>
                                <div className={styles.card}>
                                    <div className={styles.cardHeader}>
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
                                            <p className={styles.priceValue}>₹ {stockData[0]?.mrp ?? "-"}</p>
                                        </div>
                                    </div>
                                    <div className={styles.detailGrid} style={{ marginTop: 16 }}>
                                        <div>
                                            <p className={styles.label}>GST Tax Rate</p>
                                            <p className={styles.value}>None</p>
                                        </div>
                                        <div />
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

                                <div className={styles.card}>
                                    <div className={styles.cardHeader}>
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

                    {/* TAB: STOCK DETAILS */}
                    {activeTab === "stockDetails" && (
                        <div className={styles.stockDetailsTab}>


                            <div className={styles.tableWrapper}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Purchased Qty</th>
                                            <th>Received Qty</th>
                                            <th>Pending Qty</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stockData.map((item) => (
                                            <tr key={item.purchaseId}>
                                                <td>{new Date(item.invoiceDate).toLocaleDateString("en-IN")}</td>
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

                    {/* TAB: PARTY WISE */}
                    {activeTab === "partyWise" && (
                        <div className={styles.emptyTab}>
                            <p>Party Wise Report — Coming Soon</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ItemDetails;