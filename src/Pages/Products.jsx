import styles from "./Products.module.css";
import { useNavigate } from "react-router-dom";

function Products() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Add Category",
      desc: "Create and manage your products",
      path: "/category",
    },
    {
      title: "Add Product",
      desc: "Create and manage your products",
      path: "/product",
    },
    {
      title: "Add Supplier",
      desc: "Manage supplier details",
      path: "/supplier",
    },
    {
      title: "Add Purchase",
      desc: "Record product purchases",
      path: "/purchase",
    },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Products</h1>

      <div className={styles.grid}>
        {cards.map((card, index) => (
          <div
            key={index}
            className={styles.card}
            onClick={() => navigate(card.path)}
          >
            <div className={styles.cardContent}>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;