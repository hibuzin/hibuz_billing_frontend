import { useEffect, useState } from "react";
import styles from "./LowStock.module.css";
import Toast from "../../components/Toast";
import { API } from "../../constants/api";

function LowStocks() {

  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState("");

  useEffect(() => {
    fetchLowStocks();
  }, []);

  const fetchLowStocks = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem("token");

    const res = await fetch(`${API.stock}/low-stock?limit=50`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (data.success) {
      const lowStocks = (data.data || []).filter(
        (item) => item.status === "Low Stock"
      );
      setStocks(lowStocks);
    }
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};

const filteredStocks = stocks.filter((item) => {
  const matchesSearch =
    item.productName?.toLowerCase().includes(search.toLowerCase()) ||
    item.brand?.toLowerCase().includes(search.toLowerCase()) ||
    item.barcode?.toLowerCase().includes(search.toLowerCase());

  const matchesLimit =
    !limit || item.currentStock <= Number(limit);

  return matchesSearch && matchesLimit;
});

console.log("stocks:", stocks);
console.log("limit value:", limit);
console.log("filtered:", filteredStocks);

  return (
    <div className={styles.container}>

      {toast && <Toast {...toast} />}

      {/* HEADER */}
      <div className={styles.header}>

        <div>
          <h2 className={styles.title}>Low Stocks</h2>

          <p className={styles.subtitle}>
            Total Low Stock Products : {filteredStocks.length}
          </p>
        </div>

        <div className={styles.filters}>
  <input
    type="text"
    placeholder="Search product..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className={styles.searchInput}
  />

  <input
    type="number"
    placeholder="Stock Limit"
    value={limit}
    onChange={(e) => setLimit(e.target.value)}
    className={styles.limitInput}
  />
</div>

      </div>

      {/* TABLE */}
      <div className={styles.tableWrapper}>

        <table className={styles.table}>

          <thead>
            <tr>
              <th>No</th>
              <th>Product</th>
              <th>Brand</th>
              <th>Flavor</th>
              <th>Liters</th>
              <th>MRP</th>
              <th>Stock</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td colSpan="8" className={styles.empty}>
                  Loading...
                </td>
              </tr>
            ) : filteredStocks.length === 0 ? (
              <tr>
                <td colSpan="8" className={styles.empty}>
                  No low stock products
                </td>
              </tr>
            ) : (
              filteredStocks.map((item, index) => (
                <tr key={index} className={styles.tableRow}>

                  <td>{index + 1}</td>

                  <td>
                    <div className={styles.productName}>
                      {item.productName}
                    </div>
                  </td>

                  <td>{item.brand || "-"}</td>

                  <td>{item.flavor || "-"}</td>

                  <td>{item.litters || "-"}</td>

                  <td>₹ {item.mrp}</td>

                  <td>
                    <span className={styles.stockCount}>
                      {item.currentStock}
                    </span>
                  </td>

                  <td>
                    <span className={styles.lowStock}>
                      {item.status}
                    </span>
                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default LowStocks;