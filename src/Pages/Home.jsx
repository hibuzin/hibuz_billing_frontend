import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import { FiPlus } from "react-icons/fi";

function Home() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <h1 className={styles.title}>Billing Management</h1>
        <button className={styles.addBtn} onClick={() => navigate("/bill")}>
          <FiPlus size={18} />
        </button>
      </div>
    </div>
  );
}

export default Home;