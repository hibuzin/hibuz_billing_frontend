import { useEffect, useState } from "react";
import styles from "./AvailableStocks.module.css";
import Toast from "../../components/Toast";
import { API } from "../../constants/api";

function Stocks() {
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
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
        console.log("Stocks Data:", data.data);
        setStocks(data.data || []);
        setFilteredStocks(data.data || []);
      }

      if (data.success) {
        setStocks(data.data || []);
        setFilteredStocks(data.data || []);
      } else {
        setToast({
          type: "error",
          message: "Failed to load stocks",
        });
      }
    } catch (err) {
      console.log(err);

      setToast({
        type: "error",
        message: "Failed to load stocks",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (value) => {
    setSearch(value);

    try {
      const token = localStorage.getItem("token");

      if (!value.trim()) {
        setFilteredStocks(stocks);
        return;
      }

      const res = await fetch(
        `${API.stock}/product-search-stock?search=${value}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        setFilteredStocks(data.data || []);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.container}>

      {toast && <Toast {...toast} />}

      {/* HEADER */}
      <div className={styles.header}>

        <div>
          <h2 className={styles.title}>Stocks</h2>

          <p className={styles.subtitle}>
            Total Products : {filteredStocks.length}
          </p>
        </div>

        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className={styles.searchInput}
        />

      </div>

      {/* TABLE */}
      <div className={styles.tableWrapper}>

        <table className={styles.table}>

          <thead>
            <tr>
              <th>No</th>
              <th>Item Code</th>
              <th>Product</th>
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
                  No stock found
                </td>
              </tr>
            ) : (
              filteredStocks.map((item, index) => (
                <tr key={index} className={styles.tableRow}>

                  <td>{index + 1}</td>
                  <td>{item.itemCode}</td>


                  <td>
                    <div className={styles.productName}>
                      {item.productName}
                    </div>
                  </td>

                  <td>₹ {item.mrp}</td>

                  <td>
                    <span className={styles.stockCount}>
                      {item.currentStock}
                    </span>
                  </td>

                  <td>
                    <span
                      className={
                        item.status === "Low Stock"
                          ? styles.lowStock
                          : styles.available
                      }
                    >
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

export default Stocks;