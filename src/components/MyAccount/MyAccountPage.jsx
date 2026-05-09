import styles from "./MyAccountPage.module.css";

function MyAccountPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const roleText =
    role === "super_admin"
      ? "Super Admin"
      : role === "admin"
      ? "Admin"
      : role === "cashier"
      ? "Cashier"
      : "";

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        
        <div className={styles.avatar}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <h2 className={styles.name}>
          {user?.name || "User"}
        </h2>

        <p className={styles.email}>
          {user?.email}
        </p>

        <span
          className={`${styles.roleChip} ${
            role === "admin"
              ? styles.admin
              : role === "cashier"
              ? styles.cashier
              : styles.superAdmin
          }`}
        >
          {roleText}
        </span>

      </div>
    </div>
  );
}

export default MyAccountPage;