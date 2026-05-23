import styles from "./Onboarding.module.css";
import Toast from "./Toast";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "./AppBar/AppBar";
import { FaShieldAlt } from "react-icons/fa";
import { MdVerified } from "react-icons/md";

function Onboarding() {
  const [lang, setLang] = useState("en");

  const [form, setForm] = useState({
    CompanyName: "",
    CompanyPhone: "",
    CompanyEmail: "",
    password: "",
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
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { CompanyName, CompanyPhone, CompanyEmail, password } = form;

    if (!CompanyName || !CompanyPhone || !CompanyEmail || !password) {
      setMessage("Please fill all fields");
      setType("error");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "http://192.168.31.181:5000/api/auth/register-super-admin",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage(data.message || "Setup completed");
        setType("success");

        localStorage.setItem("user", JSON.stringify(data.data));
        localStorage.setItem("isLoggedIn", "true");

        setTimeout(() => navigate("/home"), 1200);
      } else {
        setMessage(data.message || "Failed");
        setType("error");
      }
    } catch (err) {
      setMessage("Server error");
      setType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppBar lang={lang} setLang={setLang} />

      <div className={styles.container}>
        <Toast message={message} type={type} />

        <div className={styles.wrapper}>

          {/* LEFT */}
          <div className={styles.left}>
            <div className={styles.brand}>
              <span className={styles.orange}>hibuz</span>
              <span className={styles.dark}>Billing</span>
            </div>

            <h1>Welcome 👋 to</h1>
            <h2>Our Billing</h2>

            <p>Simple billing & accounting software for your business.</p>

            <div className={styles.badgeRow}>
              <div className={styles.badge}>
                <FaShieldAlt className={styles.badgeIcon} />
                <span>100% Secure</span>
              </div>
              <div className={styles.badge}>
                <MdVerified className={styles.badgeIcon} />
                <span>ISO Certified</span>
              </div>
            </div>
          </div>

          {/* DIVIDER */}
          <div className={styles.dividerWrap}>
            <div className={styles.dividerLine} />
          </div>

          {/* RIGHT */}
          <div className={styles.right}>
            <div className={styles.formCard}>
              <h3>Let's set up your business</h3>
              <p className={styles.topText}>Fill your basic details</p>

              <div className={styles.field}>
                <label>Business Name</label>
                <input
                  type="text"
                  name="CompanyName"
                  value={form.CompanyName}
                  onChange={handleChange}
                  placeholder="Enter business name"
                />
              </div>

              <div className={styles.field}>
                <label>Mobile Number</label>
                <input
                  type="text"
                  name="CompanyPhone"
                  value={form.CompanyPhone}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                />
              </div>

              <div className={styles.field}>
                <label>Email Address</label>
                <input
                  type="email"
                  name="CompanyEmail"
                  value={form.CompanyEmail}
                  onChange={handleChange}
                  placeholder="Enter email"
                />
              </div>

              <div className={styles.field}>
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                />
              </div>

              <button onClick={handleSubmit} disabled={loading}>
                {loading ? "Setting up..." : "Finish Setup"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default Onboarding;