import { useEffect, useState } from "react";
import styles from "./LowStock.module.css";
import Toast from "../../components/Toast";
import { API } from "../../constants/api";

function LowStocks() {

  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchLowStocks();
  }, []);

  const fetchLowStocks = async () => {
    try {

      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(`${API.stock}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {

        // LOW STOCK ONLY
        const lowStocks = (data.data || []).filter(
          (item) => item.status === "Low Stock"
        );

        // REMOVE DUPLICATES
        const uniqueStocks = lowStocks.filter(
          (item, index, self) =>
            index ===
            self.findIndex(
              (s) =>
                s.productId === item.productId &&
                s.flavor === item.flavor &&
                s.mrp === item.mrp &&
                s.litters === item.litters
            )
        );

        setStocks(uniqueStocks);

      } else {
        setToast({
          type: "error",
          message: "Failed to load low stocks",
        });
      }

    } catch (err) {
      console.log(err);

      setToast({
        type: "error",
        message: "Failed to load low stocks",
      });

    } finally {
      setLoading(false);
    }
  };

  const filteredStocks = stocks.filter((item) =>
    item.productName.toLowerCase().includes(search.toLowerCase())
  );

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

        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />

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