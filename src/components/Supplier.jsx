import { useEffect, useState } from "react";
import styles from "./Supplier.module.css";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import Toast from "../components/Toast";

function Supplier() {
  const [suppliers, setSuppliers] = useState([]);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://192.168.31.181:5000/api/supplier", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setSuppliers(data.data || []);
      } else {
        setToast({ type: "error", message: "Failed to load suppliers" });
      }
    } catch {
      setToast({ type: "error", message: "Server error" });
    }
  };

  return (
    <div className={styles.container}>
      {toast && <Toast {...toast} />}

      <div className={styles.header}>
        <div>
          <h2>Suppliers</h2>
          <p>Manage supplier details</p>
        </div>

        <button
          className={styles.addBtn}
          onClick={() => navigate("/create-supplier")}
        >
          <FaPlus />
        </button>
      </div>

      <div className={styles.grid}>
        {suppliers.map((sup) => (
          <div key={sup._id} className={styles.card}>
            <h3>{sup.name}</h3>
            <p>{sup.phone}</p>
            <span>{sup.address}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Supplier;