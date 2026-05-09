import { useEffect, useState } from "react";
import styles from "./Product.module.css";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

function Product() {
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://192.168.31.181:5000/api/productadd",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch product");
      }

      setProduct(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      
      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <h2>Product</h2>
          <p>Manage your product inventory</p>
        </div>

        <button
          className={styles.addBtn}
          onClick={() => navigate("/create-product")}
        >
          <FaPlus />
        </button>
      </div>

      {/* TABLE */}
      <div className={styles.card}>
        {loading ? (
          <p className={styles.loading}>Loading...</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Cost</th>
                <th>Selling</th>
                <th>Stock</th>
                <th>Unit</th>
              </tr>
            </thead>

            <tbody>
              {product.map((p) => (
                <tr key={p._id}>
                  <td className={styles.name}>{p.name}</td>

                  <td>{p.categoryId?.name || "N/A"}</td>

                  <td>₹ {p.costPrice}</td>

                  <td>₹ {p.sellingPrice}</td>

                  <td>
                    <span
                      className={`${styles.stock} ${
                        p.stock <= p.reorderLevel
                          ? styles.lowStock
                          : ""
                      }`}
                    >
                      {p.stock}
                    </span>
                  </td>

                  <td>
                    {p.unitType} ({p.unitValue})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Product;