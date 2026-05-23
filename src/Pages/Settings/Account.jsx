import { useState } from "react";
import styles from "./Account.module.css";

function Account() {
  const [saved, setSaved] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setForm({ ...saved });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setForm({ ...saved });
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    setSaved({ ...form });
    setIsEditing(false);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase();
  };

  return (
    <div className={styles.accountPage}>

      {/* Header */}
      <div className={styles.topHeader}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Account Settings</h1>
          <p className={styles.subtitle}>Manage your account details</p>
        </div>

        <div className={styles.headerButtons}>
          {isEditing ? (
            <>
              <button className={styles.cancelBtn} onClick={handleCancel}>
                Cancel
              </button>
              <button className={styles.saveBtn} onClick={handleSave}>
                Save Changes
              </button>
            </>
          ) : (
            <button className={styles.editBtn} onClick={handleEdit}>
              <span className={styles.editIcon}>✎</span> Edit
            </button>
          )}
        </div>
      </div>

      {/* Avatar Row */}
      <div className={styles.avatarRow}>
        <div className={styles.avatar}>
          {getInitials(saved.name)}
        </div>
        <div className={styles.avatarInfo}>
          <p className={styles.avatarName}>{saved.name || "—"}</p>
          <p className={styles.avatarEmail}>{saved.email || "—"}</p>
        </div>
      </div>

      {/* Section */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>General Information</h2>
      </div>

      <hr className={styles.divider} />

      {/* Form */}
      <div className={styles.formGrid}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>NAME *</label>
          <input
            type="text"
            name="name"
            placeholder="Enter name"
            value={isEditing ? form.name : saved.name}
            onChange={handleChange}
            disabled={!isEditing}
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>MOBILE NUMBER</label>
          <input
            type="text"
            name="phone"
            placeholder="Enter mobile number"
            value={isEditing ? form.phone : saved.phone}
            onChange={handleChange}
            disabled={!isEditing}
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>EMAIL</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={isEditing ? form.email : saved.email}
            onChange={handleChange}
            disabled={!isEditing}
            className={styles.input}
          />
        </div>
      </div>

      {/* Toast */}
      {toastVisible && (
        <div className={styles.toast}>✓ Changes saved successfully</div>
      )}

    </div>
  );
}

export default Account;