import { useEffect, useState } from "react";
import styles from "./Cashier.module.css";
import { useNavigate } from "react-router-dom";
import UIState from "../components/UIState";
import Toast from "../components/Toast";

function Cashier() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [editUser, setEditUser] = useState(null);
  const [otpError, setOtpError] = useState("");

  const [form, setForm] = useState({
    name: "",
    role: "",
  });

  // delete section
  const [deleteUser, setDeleteUser] = useState(null);
  const [confirmStep, setConfirmStep] = useState(1);
  const [generatedCode, setGeneratedCode] = useState("");
  const [enteredCode, setEnteredCode] = useState("");

  // toast
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(""), 2500);
      return () => clearTimeout(t);
    }
  }, [message]);

  // UPDATED GET CASHIERS
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://192.168.31.181:5000/api/cashier/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch cashiers");
        }

        return data;
      })
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setUsers(data.data); // no filter needed
        } else {
          setUsers([]);
        }
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <UIState type="loading" message="Loading users..." />;

  if (error)
    return (
      <UIState
        type="error"
        message={error}
        onRetry={() => window.location.reload()}
      />
    );

  // update user
  const handleUpdate = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `http://192.168.31.181:5000/api/users/${editUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: form.name,
            role: form.role,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setUsers((prev) =>
        prev.map((u) =>
          u._id === editUser._id
            ? { ...u, name: form.name, role: form.role }
            : u
        )
      );

      setMessage("User updated successfully");
      setMessageType("success");
      setEditUser(null);
    } catch (err) {
      setMessage(err.message || "Update failed");
      setMessageType("error");
    }
  };

  // delete user
 const handleDelete = async () => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(
      `http://192.168.31.181:5000/api/cashier/${deleteUser._id}`,
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

    setUsers((prev) =>
  prev.filter((u) => u._id !== data.data.userId)
);

    setMessage("Cashier deleted successfully"); // optional update
    setMessageType("success");

    setDeleteUser(null);
    setConfirmStep(1);
    setEnteredCode("");
  } catch (err) {
    setMessage(err.message || "Delete failed");
    setMessageType("error");
  }
};

  return (
    <div className={styles.container}>
      <Toast message={message} type={messageType} />

      <div className={styles.header}>
        <h2 className={styles.title}>CASHIERS</h2>

        <div
          className={styles.createBox}
          onClick={() => navigate("/create-user")}
        >
          <span className={styles.plus}>+</span>
          <span className={styles.createText}>
            CREATE CASHIER
          </span>
        </div>
      </div>

      <div className={styles.grid}>
        {users.length === 0 ? (
          <p className={styles.state}>No users found</p>
        ) : (
          users.map((user) => (
            <div key={user._id} className={styles.card}>
              <div className={styles.cardHeader}>
                <button
                  className={styles.deleteBtn}
                  onClick={() => {
                    setDeleteUser(user);
                    setConfirmStep(1);
                  }}
                >
                  Delete
                </button>

                <div className={styles.avatar}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>

                <button
                  className={styles.editBtn}
                  onClick={() => {
                    setEditUser(user);
                    setForm({
                      name: user.name,
                      role: user.role,
                    });
                  }}
                >
                  Edit
                </button>
              </div>

              <div className={styles.info}>
                <p className={styles.name}>{user.name}</p>
                <p className={styles.email}>{user.email}</p>
              </div>

              <div className={styles.footer}>
                <span className={styles.role}>
                  {user.role}
                </span>

                <span
                  className={
                    user.isActive
                      ? styles.active
                      : styles.inactive
                  }
                >
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* EDIT MODAL */}
      {editUser && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Edit User</h3>

            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              placeholder="Name"
            />

            <select
              value={form.role}
              onChange={(e) =>
                setForm({
                  ...form,
                  role: e.target.value,
                })
              }
            >
              <option value="cashier">Cashier</option>
              <option value="admin">Admin</option>
            </select>

            <div className={styles.modalActions}>
              <button onClick={() => setEditUser(null)}>
                Cancel
              </button>
              <button onClick={handleUpdate}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteUser && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            {confirmStep === 1 && (
              <>
                <h3>
                  Are you sure you want to delete?
                </h3>

                <div className={styles.modalActions}>
                  <button
                    onClick={() => setDeleteUser(null)}
                  >
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

                <p className={styles.code}>
                  {generatedCode}
                </p>

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
                  <button
                    onClick={() => setDeleteUser(null)}
                  >
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
    </div>
  );
}

export default Cashier;