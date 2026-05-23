import styles from "./MyAccountPage.module.css";
import { useState, useEffect } from "react";

function MyAccountPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const [logo, setLogo] = useState("");

  useEffect(() => {

    const savedLogo =
      localStorage.getItem("businessLogo");

    if (savedLogo) {
      setLogo(savedLogo);
    }

  }, []);

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

      {/* TOP SECTION */}
      <div className={styles.topSection}>

        <div className={styles.logoSection}>

          <label className={styles.logoUpload}>

            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {

                const file = e.target.files[0];

                if (file) {

                  const reader =
                    new FileReader();

                  reader.onloadend = () => {

                    const base64 =
                      reader.result;

                    setLogo(base64);

                    localStorage.setItem(
                      "businessLogo",
                      base64
                    );
                  };

                  reader.readAsDataURL(file);
                }
              }}
            />

            {logo ? (
              <img
                src={logo}
                alt="Logo"
                className={styles.logo}
              />
            ) : (
              <div className={styles.uploadText}>
                Upload Logo
              </div>
            )}

          </label>

        </div>

        {/* ROLE RIGHT */}
        <div
          className={`${styles.roleChip} ${role === "admin"
              ? styles.admin
              : role === "cashier"
                ? styles.cashier
                : styles.superAdmin
            }`}
        >
          {roleText}
        </div>

      </div>

      {/* DETAILS */}
      <div className={styles.detailsGrid}>

        <div className={styles.field}>
          <label>Company Name</label>

          <div className={styles.box}>
            {user?.CompanyName || "-"}
          </div>
        </div>

        <div className={styles.field}>
          <label>Phone</label>

          <div className={styles.box}>
            {user?.CompanyPhone || "-"}
          </div>
        </div>

        <div className={styles.field}>
          <label>Email</label>

          <div className={styles.box}>
            {user?.CompanyEmail || "-"}
          </div>
        </div>

        <div className={styles.field}>
          <label>Password</label>

          <div className={styles.box}>
            {user?.password || "-"}
          </div>
        </div>

        <div className={styles.field}>
          <label>Address</label>

          <div className={styles.box}>
            {user?.address || "-"}
          </div>
        </div>

        <div className={styles.field}>
          <label>City</label>

          <div className={styles.box}>
            {user?.city || "-"}
          </div>
        </div>

        <div className={styles.field}>
          <label>State</label>

          <div className={styles.box}>
            {user?.state || "-"}
          </div>
        </div>

        <div className={styles.field}>
          <label>Pincode</label>

          <div className={styles.box}>
            {user?.pincode || "-"}
          </div>
        </div>

        <div className={styles.field}>
          <label>GST Number</label>

          <div className={styles.box}>
            {user?.gstnumber || "-"}
          </div>
        </div>

        <div className={styles.field}>
          <label>Role</label>

          <div className={styles.box}>
            {roleText}
          </div>
        </div>

      </div>
    </div>
  );
}

export default MyAccountPage;