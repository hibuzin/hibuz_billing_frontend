import { useState, useEffect, useRef } from "react";
import styles from "./CreateSupplier.module.css";
import Toast from "../../components/Toast";
import { API } from "../../constants/api";

function CreateSupplier() {
  const [form, setForm] = useState({
    supplierName: "",
    mobile: "",
    gstNumber: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    message: "",
    type: "",
  });

  const supplierNameRef = useRef(null);
  const mobileRef = useRef(null);
  const gstRef = useRef(null);
  const emailRef = useRef(null);
  const addressRef = useRef(null);
  const cityRef = useRef(null);
  const stateRef = useRef(null);
  const pincodeRef = useRef(null);
  const submitRef = useRef(null);

  //auto focus

  useEffect(() => {
    supplierNameRef.current?.focus();
  }, []);

  //handle keydownn 
  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (nextRef?.current) {
        nextRef.current.focus();
      } else {
        handleSubmit(e);
      }
    }
  };



  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showToast = (message, type) => {
    setToast({ message, type });

    setTimeout(() => {
      setToast({
        message: "",
        type: "",
      });
    }, 2500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      const res = await fetch(
        API.createsupplier,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to create supplier"
        );
      }

      showToast(
        data.message || "Supplier created successfully",
        "success"
      );

      setForm({
        supplierName: "",
        mobile: "",
        gstNumber: "",
        email: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
      });

    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast
        message={toast.message}
        type={toast.type}
      />

      <div className={styles.container}>

        <div className={styles.header}>
          <h2>Create Supplier</h2>
        </div>



        <form
          onSubmit={handleSubmit}
          className={styles.form}
        >

          <div className={styles.sectionTitle}>
            General Details
          </div>
          <div className={styles.grid}>

            <div className={styles.field}>
              <label>Supplier Name</label>

              <input
                ref={supplierNameRef}
                type="text"
                name="supplierName"
                value={form.supplierName}
                placeholder="Enter supplier name"
                onChange={handleChange}
                onKeyDown={(e) =>
                  handleKeyDown(e, mobileRef)
                }
                required
              />
            </div>

            <div className={styles.field}>
              <label>Mobile</label>

              <input
                ref={mobileRef}
                type="text"
                name="mobile"
                value={form.mobile}
                placeholder="Enter mobile number"
                onChange={handleChange}
                onKeyDown={(e) =>
                  handleKeyDown(e, gstRef)
                }
                required
              />
            </div>

            <div className={styles.field}>
              <label>GST Number</label>

              <input
                ref={gstRef}
                type="text"
                name="gstNumber"
                value={form.gstNumber}
                placeholder="Enter gst "
                onChange={handleChange}
                onKeyDown={(e) =>
                  handleKeyDown(e, emailRef)
                }
                required
              />
            </div>

            <div className={styles.field}>
              <label>Email</label>

              <input
                ref={emailRef}
                type="email"
                name="email"
                value={form.email}
                placeholder="Enter email "
                onChange={handleChange}
                onKeyDown={(e) =>
                  handleKeyDown(e, addressRef)
                }
              />
            </div>

            <div
              className={`${styles.field} ${styles.full}`}
            >
              <label>Address</label>

              <textarea
                ref={addressRef}
                name="address"
                value={form.address}
                placeholder="Enter address "
                onChange={handleChange}
                onKeyDown={(e) =>
                  handleKeyDown(e, cityRef)
                }
                required
              />
            </div>

            <div className={styles.field}>
              <label>City</label>

              <input
                ref={cityRef}
                type="text"
                name="city"
                value={form.city}
                placeholder="Enter city "
                onChange={handleChange}
                onKeyDown={(e) =>
                  handleKeyDown(e, stateRef)
                }
                required
              />
            </div>

            <div className={styles.field}>
              <label>State</label>

              <input
                ref={stateRef}
                type="text"
                name="state"
                value={form.state}
                placeholder="Enter state "
                onChange={handleChange}
                onKeyDown={(e) =>
                  handleKeyDown(e, pincodeRef)
                }
                required
              />
            </div>

            <div className={styles.field}>
              <label>Pincode</label>

              <input
                ref={pincodeRef}
                type="text"
                name="pincode"
                value={form.pincode}
                placeholder="Enter pincode"
                onChange={handleChange}
                onKeyDown={(e) =>
                  handleKeyDown(e, submitRef)
                }
                required
              />
            </div>

            <div className={styles.buttonField}>
              <button
                ref={submitRef}
                type="submit"
                disabled={loading}
                className={styles.btn}
              >
                {loading
                  ? "Creating..."
                  : "Create Supplier"}
              </button>
            </div>

          </div>

        </form>
      </div>
    </>
  );
}

export default CreateSupplier;