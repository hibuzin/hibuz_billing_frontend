import { useEffect, useState } from "react";
import styles from "./OutOfStock.module.css";
import Toast from "../../components/Toast";
import { API } from "../../constants/api";

function OutOfStock() {
  const [stocks, setStocks] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOutStocks();
  }, []);

  const fetchOutStocks = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API.outofstock}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {

        // OUT OF STOCK FILTER
        const filtered = data.data.filter(
          (item) =>
            item.currentStock <= 0 ||
            item.status === "Out Of Stock"
        );

        // REMOVE DUPLICATES
        const uniqueStocks = filtered.filter(
          (item, index, self) =>
            index ===
            self.findIndex(
              (s) =>
                s.productId === item.productId &&
                s.flavor === item.flavor &&
                s.mrp === item.mrp
            )
        );

        setStocks(uniqueStocks);
      }

    } catch (err) {
      console.log(err);

      setToast({
        type: "error",
        message: "Failed to load out of stock products",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>

      {toast && <Toast {...toast} />}

      <div className={styles.header}>
        <div>
          <h2>Out Of Stock</h2>
          <p>Total Products: {stocks.length}</p>
        </div>
      </div>

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
                <td colSpan="7">Loading...</td>
              </tr>
            ) : stocks.length === 0 ? (
              <tr>
                <td colSpan="7">No out of stock products</td>
              </tr>
            ) : (
              stocks.map((item, index) => (
                <tr key={index}>

                  <td>{index + 1}</td>

                  <td>{item.barcode}</td>

                  <td>{item.productName}</td>

                  <td>₹ {item.mrp}</td>

                  <td>{item.currentStock}</td>

                  <td>
                    <span className={styles.outStock}>
                      Out Of Stock
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

export default OutOfStock;