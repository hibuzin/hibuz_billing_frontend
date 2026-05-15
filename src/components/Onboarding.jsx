import styles from "./Onboarding.module.css";
import Toast from "./Toast";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Onboarding() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    location: "",
    address: "",
    gst: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(""), 2500);
      return () => clearTimeout(t);
    }
  }, [message]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { name, email, company, phone, location } = form;

    if (!name || !email || !company || !phone || !location) {
      setMessage("Please fill required fields");
      setType("error");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://192.168.31.181:5000/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage("Onboarding completed");
        setType("success");

        setTimeout(() => {
          navigate("/home");
        }, 1200);
      } else {
        setMessage(data.message || "Failed");
        setType("error");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error");
      setType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Toast message={message} type={type} />

      <div className={styles.card}>
        <h1>Welcome </h1>
        <p className={styles.subtitle}>Let’s set up your account</p>

        <div className={styles.grid}>
          <input name="name" placeholder="Full Name" onChange={handleChange} />
          <input name="email" placeholder="Email" onChange={handleChange} />
          <input name="company" placeholder="Company Name" onChange={handleChange} />
          <input name="phone" placeholder="Phone Number" onChange={handleChange} />
          <input name="location" placeholder="Location" onChange={handleChange} />
          <input name="gst" placeholder="GST Number (optional)" onChange={handleChange} />
        </div>

        <textarea
          name="address"
          placeholder="Full Address"
          onChange={handleChange}
          className={styles.textarea}
        />

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Finish Setup"}
        </button>
      </div>
    </div>
  );
}

export default Onboarding;