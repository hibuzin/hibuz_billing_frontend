import { useEffect, useState } from "react";
import styles from "./ManageBusiness.module.css";
import { FiImage } from "react-icons/fi";

function ManageBusiness() {
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
  <FiImage />

  <div>
    Upload Logo
    <br />

    <span>
      PNG/JPG, max 5 MB.
    </span>
  </div>
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
</div>


    </div>
  );
}

export default ManageBusiness;