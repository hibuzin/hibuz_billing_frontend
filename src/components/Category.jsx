import { useEffect, useState } from "react";
import styles from "./Category.module.css";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import Toast from "../components/Toast";

function Category() {
  const [categories, setCategories] = useState([]);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://192.168.31.181:5000/api/category", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setCategories(data.data || []);
      } else {
        setToast({ type: "error", message: "Failed to load categories" });
      }
    } catch (err) {
      setToast({ type: "error", message: "Server error" });
    }
  };

  return (
    <div className={styles.container}>
      {toast && <Toast {...toast} />}

      <div className={styles.header}>
        <div>
          <h2>Categories</h2>
          <p>Manage product categories</p>
        </div>

        <button
          className={styles.addBtn}
          onClick={() => navigate("/create-category")}
        >
          <FaPlus />
        </button>
      </div>

      <div className={styles.grid}>
        {categories.map((cat) => (
          <div key={cat._id} className={styles.card}>
            <h3>{cat.name}</h3>
            <span className={styles.status}>
              {cat.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Category;