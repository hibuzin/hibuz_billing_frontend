import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import styles from "./ManageUsers.module.css";

function ManageUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      // ADMINS
      const adminRes = await fetch(
        "http://192.168.31.181:5000/api/super-admin/admins",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const adminData = await adminRes.json();

      // CASHIERS
      const cashierRes = await fetch(
        "http://192.168.31.181:5000/api/super-admin/cashiers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const cashierData = await cashierRes.json();

      const admins = (adminData.data || []).map((u) => ({
        ...u,
        role: "Admin",
      }));

      const cashiers = (cashierData.data || []).map((u) => ({
        ...u,
        role: "Cashier",
      }));

      setUsers([...admins, ...cashiers]);

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.wrap}>

      <div className={styles.topSection}>
        <div>
          <h1 className={styles.title}>Manage Users</h1>
          <p className={styles.subtitle}>
            View and manage all users
          </p>
        </div>

        <button
          className={styles.addBtn}
          onClick={() => navigate("/createuser")}
        >
          <FaPlus />
        </button>
      </div>

      <div className={styles.card}>
        <table className={styles.table}>

          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u, i) => (
              <tr key={i}>
                <td>{u.name || u.CompanyName || "-"}</td>

                <td>
                  {u.email || u.CompanyEmail || "-"}
                </td>

                <td>
                  {u.phone || u.CompanyPhone || "-"}
                </td>

                <td>
                  <span
                    className={`${styles.role} ${
                      u.role === "Admin"
                        ? styles.admin
                        : styles.cashier
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}

export default ManageUsers;