import {
  useState,
  useEffect,
  useRef,
} from "react";

import styles from "./CreateCategory.module.css";
import Toast from "../../components/Toast";
import { API } from "../../constants/api";

function CreateCategory() {
  const [form, setForm] = useState({
    name: "",
    hsnCode: "",
    description: "",
    gstRate: "",
  });

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  const inputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setMessage("Category name is required");
      setType("error");
      return;
    }

    if (!form.hsnCode.trim()) {
      setMessage("HSN Code is required");
      setType("error");
      return;
    }

    if (!form.gstRate) {
      setMessage("GST Rate is required");
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
            name: form.name.trim(),
            hsnCode: form.hsnCode.trim(),
            description:
              form.description.trim(),
            gstRate: Number(form.gstRate),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
            "Failed to create category"
        );
      }

      setMessage(
        "Category created successfully"
      );

      setType("success");

      setForm({
        name: "",
        hsnCode: "",
        description: "",
        gstRate: "",
      });
    } catch (err) {
      setMessage(
        err.message || "Something went wrong"
      );

      setType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className={styles.page}>
      <Toast
        message={message}
        type={type}
      />

      <div className={styles.card}>
        <h2 className={styles.title}>
          Create Category
        </h2>

        <form
          onSubmit={handleSubmit}
          className={styles.form}
        >
          <div className={styles.field}>
            <label>Category Name</label>

            <input
              ref={inputRef}
              type="text"
              name="name"
              placeholder="Enter category name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label>HSN Code</label>

            <input
              type="text"
              name="hsnCode"
              placeholder="Enter HSN code"
              value={form.hsnCode}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label>Description</label>

            <textarea
              name="description"
              placeholder="Enter description"
              value={form.description}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className={styles.field}>
            <label>GST Rate (%)</label>

            <input
              type="number"
              name="gstRate"
              placeholder="Enter GST rate"
              value={form.gstRate}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className={styles.button}
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create Category"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateCategory;