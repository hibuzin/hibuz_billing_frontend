import { useNavigate } from "react-router-dom";
import styles from "./ManageUsers.module.css";

function ManageUsers() {
  const navigate = useNavigate();

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h1 className={styles.title}>Manage Users</h1>
        <p className={styles.subtitle}>Control access and roles across your workspace</p>
      </div>

      <div className={styles.grid}>

        {/* ADMIN */}
        <div className={styles.panel}>
          <div className={styles.iconRow}>
            <div className={`${styles.icon} ${styles.adminIcon}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <span className={`${styles.badge} ${styles.adminBadge}`}>Admin</span>
          </div>

          <div>
            <p className={styles.panelTitle}>Admin</p>
            <p className={styles.desc}>Full access to settings, reports, and user management across the platform.</p>
          </div>

          <div className={styles.divider} />

          <div className={styles.footer}>
            <p className={styles.stat}><span>3</span> active users</p>
            <button className={styles.btn} onClick={() => navigate("/admin")}>
              View all
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* CASHIER */}
        <div className={styles.panel}>
          <div className={styles.iconRow}>
            <div className={`${styles.icon} ${styles.cashierIcon}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
              </svg>
            </div>
            <span className={`${styles.badge} ${styles.cashierBadge}`}>Cashier</span>
          </div>

          <div>
            <p className={styles.panelTitle}>Cashier</p>
            <p className={styles.desc}>Billing and sales access only. Restricted from reports, settings, and inventory edits.</p>
          </div>

          <div className={styles.divider} />

          <div className={styles.footer}>
            <p className={styles.stat}><span>7</span> active users</p>
            <button className={styles.btn} onClick={() => navigate("/cashier")}>
              View all
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ManageUsers;