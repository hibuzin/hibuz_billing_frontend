import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PurchaseList.module.css";

function PurchaseList() {
  const [purchases, setPurchases] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://192.168.31.181:5000/api/purchase/purchase/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setPurchases(data.data || []);
    } catch (err) {
      console.log("Purchase fetch error:", err);
    }
  };

  return (
    <div className={styles.container}>
      
      {/* Header */}
      <div className={styles.header}>
        <h2>Purchases</h2>

        <button
          className={styles.addBtn}
          onClick={() => navigate("/create-purchase")}
        >
          +
        </button>
      </div>

      {/* List */}
      <div className={styles.grid}>
        {purchases.map((p) => (
          <div key={p._id} className={styles.card}>
            
            <div className={styles.top}>
              <h3>{p.supplierId?.name}</h3>
              <span className={styles.amount}>₹ {p.totalAmount}</span>
            </div>

            <div className={styles.middle}>
              <p>Items: {p.items.length}</p>
              <p>
                Date: {new Date(p.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className={styles.bottom}>
              <span className={styles.id}>
                #{p._id.slice(-6)}
              </span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

export default PurchaseList;