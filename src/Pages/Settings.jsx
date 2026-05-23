import { useState } from "react";
import styles from "./Settings.module.css";

function Settings() {
  const [activeMenu, setActiveMenu] = useState("account");

  const renderContent = () => {
    switch (activeMenu) {
      case "account":
        return (
          <div>
            <h2>Account</h2>
            <p>Manage your account details and preferences here.</p>
          </div>
        );

      case "business":
        return (
          <div>
            <h2>Manage Business</h2>
            <p>Manage your business information and settings here.</p>
          </div>
        );

      case "invoice":
        return (
          <div>
            <h2>Invoice Settings</h2>
            <p>Configure invoice related settings here.</p>
          </div>
        );

      case "print":
        return (
          <div>
            <h2>Print Settings</h2>
            <p>Manage print layouts and printer settings here.</p>
          </div>
        );

      case "users":
        return (
          <div>
            <h2>Manage Users</h2>
            <p>Add, edit, and manage system users here.</p>
          </div>
        );

      case "support":
        return (
          <div>
            <h2>Help & Support</h2>
            <p>Get help and contact support here.</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <button
          className={`${styles.settingBtn} ${
            activeMenu === "account" ? styles.activeBtn : ""
          }`}
          onClick={() => setActiveMenu("account")}
        >
          Account
        </button>

        <button
          className={`${styles.settingBtn} ${
            activeMenu === "business" ? styles.activeBtn : ""
          }`}
          onClick={() => setActiveMenu("business")}
        >
          Manage Business
        </button>

        <button
          className={`${styles.settingBtn} ${
            activeMenu === "invoice" ? styles.activeBtn : ""
          }`}
          onClick={() => setActiveMenu("invoice")}
        >
          Invoice Settings
        </button>

        <button
          className={`${styles.settingBtn} ${
            activeMenu === "print" ? styles.activeBtn : ""
          }`}
          onClick={() => setActiveMenu("print")}
        >
          Print Settings
        </button>

        <button
          className={`${styles.settingBtn} ${
            activeMenu === "users" ? styles.activeBtn : ""
          }`}
          onClick={() => setActiveMenu("users")}
        >
          Manage Users
        </button>

        <button
          className={`${styles.settingBtn} ${
            activeMenu === "support" ? styles.activeBtn : ""
          }`}
          onClick={() => setActiveMenu("support")}
        >
          Help & Support
        </button>
      </div>

      <div className={styles.content}>
        {renderContent()}
      </div>
    </div>
  );
}

export default Settings;