import { useEffect, useState } from "react";
import styles from "./ManageBusiness.module.css";

function ManageBusiness() {
  const [business, setBusiness] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      setBusiness(JSON.parse(userData));
    }
  }, []);

 return (
  <div className={styles.container}>
    <div className={styles.wrapper}>
      <div className={styles.title}>Manage Business</div>

      {business ? (
        <div className={styles.form}>
  <div className={styles.row}>
    <div className={styles.col}>
      <label>Business Name</label>
      <div className={styles.box}>
        {business.CompanyName}
      </div>
    </div>

    <div className={styles.col}>
      <label>Phone</label>
      <div className={styles.box}>
        {business.CompanyPhone}
      </div>
    </div>

    <div className={styles.col}>
      <label>Email</label>
      <div className={styles.box}>
        {business.CompanyEmail}
      </div>
    </div>
  </div>
</div>
      ) : (
        <div className={styles.empty}>
          No business data found
        </div>
      )}
    </div>
  </div>
);
}

export default ManageBusiness;