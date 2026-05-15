import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import styles from "./Admin.module.css";

function Admin() {
  const [admins, setAdmins] = useState([]);
  const navigate = useNavigate();
  const [editAdmin, setEditAdmin] = useState(null);
  const [deleteAdmin, setDeleteAdmin] = useState(null);
const [confirmStep, setConfirmStep] = useState(1);
const [generatedCode, setGeneratedCode] = useState("");
const [enteredCode, setEnteredCode] = useState("");
const [otpError, setOtpError] = useState("");

const [form, setForm] = useState({
  name: "",
  email: "",
  role: "admin",
});

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://192.168.31.181:5000/api/admins/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAdmins(data.data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  //delete admins 
  const handleDelete = async () => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(
      `http://192.168.31.181:5000/api/admins/${deleteAdmin._id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    // remove from UI
    setAdmins((prev) =>
      prev.filter((a) => a._id !== deleteAdmin._id)
    );

    // reset
    setDeleteAdmin(null);
    setConfirmStep(1);
    setEnteredCode("");
    setOtpError("");

  } catch (err) {
    console.error(err);
  }
};

  // put admins
  const handleUpdate = async () => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(
      `http://192.168.31.181:5000/api/admins/${editAdmin._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    // UI update
    setAdmins((prev) =>
      prev.map((a) =>
        a._id === editAdmin._id ? { ...a, ...form } : a
      )
    );

    setEditAdmin(null);
  } catch (err) {
    console.error(err);
  }
};

  return (

    
    <div className={styles.container}>

      {deleteAdmin && (
  <div className={styles.modalOverlay}>
    <div className={styles.modal}>

      {confirmStep === 1 && (
        <>
          <h3>Are you sure you want to delete?</h3>

          <div className={styles.modalActions}>
            <button onClick={() => setDeleteAdmin(null)}>
              Cancel
            </button>

            <button
              onClick={() => {
                const code = Math.floor(
                  100000 + Math.random() * 900000
                ).toString();
                setGeneratedCode(code);
                setConfirmStep(2);
              }}
            >
              Yes
            </button>
          </div>
        </>
      )}

      {confirmStep === 2 && (
        <>
          <h3>Enter 6 digit code</h3>

          <p className={styles.code}>{generatedCode}</p>

          <input
            type="text"
            value={enteredCode}
            onChange={(e) =>
              setEnteredCode(e.target.value)
            }
            placeholder="Enter code"
          />

          {otpError && (
            <p className={styles.otpError}>
              {otpError}
            </p>
          )}

          <div className={styles.modalActions}>
            <button onClick={() => setDeleteAdmin(null)}>
              Cancel
            </button>

            <button
              onClick={() => {
                if (enteredCode === generatedCode) {
                  setOtpError("");
                  handleDelete();
                } else {
                  setOtpError("Incorrect code");
                }
              }}
            >
              Delete
            </button>
          </div>
        </>
      )}

    </div>
  </div>
)}

      {editAdmin && (
  <div className={styles.modalOverlay}>
    <div className={styles.modal}>
      <h3>Edit Admin</h3>

      <input
        type="text"
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
        placeholder="Name"
      />

      <input
        type="email"
        value={form.email}
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
        placeholder="Email"
      />

      <select
        value={form.role}
        onChange={(e) =>
          setForm({ ...form, role: e.target.value })
        }
      >
        <option value="admin">Admin</option>
      </select>

      <div className={styles.modalActions}>
        <button onClick={() => setEditAdmin(null)}>
          Cancel
        </button>
        <button onClick={handleUpdate}>
          Save
        </button>
      </div>
    </div>
  </div>
)}
      
      <div className={styles.header}>
        <h2 className={styles.title}>ADMINS</h2>

        <div
          className={styles.createBox}
          onClick={() => navigate("/create-admin")}
        >
          <span className={styles.plus}>+</span>
          <span className={styles.createText}>CREATE ADMIN</span>
        </div>
      </div>

      <div className={styles.grid}>
  {admins.map((admin) => (
    <div key={admin._id} className={styles.card}>
      
      {/* TOP */}
      <div className={styles.cardHeader}>
        
        <button
  className={styles.deleteBtn}
  onClick={() => {
    setDeleteAdmin(admin);
    setConfirmStep(1);
  }}
>
  Delete
</button>

        <div className={styles.avatar}>
          {admin.name?.charAt(0).toUpperCase()}
        </div>

        <button
  className={styles.editBtn}
  onClick={() => {
    setEditAdmin(admin);
    setForm({
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });
  }}
>
  Edit
</button>

      </div>

      {/* INFO */}
      <div className={styles.info}>
        <p className={styles.name}>{admin.name}</p>
        <p className={styles.email}>{admin.email}</p>
      </div>

      {/* FOOTER */}
      <div className={styles.footer}>
        <span className={styles.role}>{admin.role}</span>

        <span className={styles.active}>
          Active
        </span>
      </div>

    </div>
  ))}
</div>

    </div>
    
  );
}

export default Admin;