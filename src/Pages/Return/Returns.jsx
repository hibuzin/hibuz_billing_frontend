import { useEffect, useState } from "react";
import styles from "./Returns.module.css";
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function Returns() {
  const [returns, setReturns] = useState([]);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://192.168.31.181:5000/api/return/return",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to fetch returns"
        );
      }

      setReturns(data.data || []);

    } catch (err) {
      console.error("RETURN FETCH ERROR:", err);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <>
      <div className={styles.container}>

       <div className={styles.header}>
  <div>
    <h1>Returns</h1>
    <p>
      Manage supplier return requests
    </p>
  </div>

  <div className={styles.headerRight}>
    
    <div className={styles.count}>
      {returns.length} Records
    </div>

    <button
      className={styles.addBtn}
      onClick={() => navigate("/create-returns")}
    >
      <FiPlus />
    </button>

  </div>
</div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>

            <thead>
              <tr>
                <th>Supplier</th>
                <th>Status</th>
                <th>Total Items</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {returns.map((item) => (
                <tr
                  key={item._id}
                  onClick={() => setSelected(item)}
                >
                  <td>
                    {item.supplierId?.name || "N/A"}
                  </td>

                  <td>
                    <span
                      className={`${styles.status} ${
                        styles[item.status]
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td>
                    {item.items?.length || 0}
                  </td>

                  <td>
                    {formatDate(item.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

      {selected && (
        <div
          className={styles.overlay}
          onClick={(e) =>
            e.target === e.currentTarget &&
            setSelected(null)
          }
        >

          <div className={styles.dialog}>

            <div className={styles.dialogHeader}>

              <div>
                <h2>
                  Return Details
                </h2>

                <p>
                  {selected.supplierId?.name ||
                    "Unknown Supplier"}
                </p>
              </div>

              <button
                className={styles.closeBtn}
                onClick={() => setSelected(null)}
              >
                ×
              </button>

            </div>

            <div className={styles.infoGrid}>

              <div className={styles.infoCard}>
                <label>Status</label>

                <span
                  className={`${styles.status} ${
                    styles[selected.status]
                  }`}
                >
                  {selected.status}
                </span>
              </div>

              <div className={styles.infoCard}>
                <label>Created Date</label>

                <p>
                  {formatDate(
                    selected.createdAt
                  )}
                </p>
              </div>

              <div className={styles.infoCard}>
                <label>Purchase ID</label>

                <p>
                  {selected.purchaseId?._id ||
                    "N/A"}
                </p>
              </div>

              <div className={styles.infoCard}>
                <label>Supplier Phone</label>

                <p>
                  {selected.supplierId?.phone ||
                    "N/A"}
                </p>
              </div>

            </div>

            <div className={styles.itemsSection}>
              <h3>Returned Items</h3>

              <div className={styles.itemsWrap}>
                {selected.items.map((item) => (
                  <div
                    key={item._id}
                    className={styles.itemCard}
                  >

                    <div>
                      <label>Product</label>

                      <p>
                        {item.productId?.name ||
                          "Unknown Product"}
                      </p>
                    </div>

                    <div>
                      <label>Quantity</label>

                      <p>{item.qty}</p>
                    </div>

                    <div>
                      <label>Reason</label>

                      <p>
                        {item.reason || "N/A"}
                      </p>
                    </div>

                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default Returns;