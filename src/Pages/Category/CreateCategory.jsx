import { useState } from "react";
import styles from "./CreateCategory.module.css";
import Toast from "../../components/Toast";
import { API } from "../../constants/api";

function CreateCategory() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setMessage("Category name is required");
      setType("error");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      const res = await fetch(
       API.categories,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: name.trim(),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create category");
      }

      setMessage("Category created successfully");
      setType("success");
      setName("");
    } catch (err) {
      setMessage(err.message || "Something went wrong");
      setType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <Toast message={message} type={type} />

      <div className={styles.card}>
        <h2 className={styles.title}>Create Category</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Category Name</label>
            <input
              type="text"
              placeholder="Enter category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className={styles.button}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Category"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateCategory;