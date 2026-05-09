import { useEffect, useState } from "react";
import styles from "./Customers.module.css";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://192.168.31.181:5000/api/customer/customers", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch customers");
        }

        return data;
      })
      .then((data) => {
        setCustomers(data.data || []);
      })
      .catch((err) => console.error("FETCH ERROR:", err));
  }, []);

  const maxPts = Math.max(
    ...customers.map((c) => c.loyaltyPoints || 0),
    1
  );

  return (
    <>
      <div className={styles.wrap}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Customers</h1>
          </div>
          <span className={styles.countBadge}>
            {customers.length} members
          </span>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Points</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((c) => (
              <tr key={c.id} onClick={() => setSelected(c)}>
                <td className={styles.idCell}>{c.id}</td>
                <td className={styles.nameCell}>{c.name}</td>
                <td>{c.phone}</td>
                <td>{c.email}</td>

                <td className={styles.ptsCell}>
                  <span className={styles.ptsValue}>
                    {(c.loyaltyPoints || 0).toLocaleString()}
                  </span>

                  <span
                    className={styles.ptsBar}
                    style={{
                      width: `${
                        maxPts
                          ? Math.round(
                              (c.loyaltyPoints / maxPts) * 40
                            )
                          : 0
                      }px`,
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div
          className={styles.overlay}
          onClick={(e) =>
            e.target === e.currentTarget && setSelected(null)
          }
        >
          <div className={styles.dialog}>
            <div className={styles.dialogHeader}>
              <div>
                <div className={styles.dialogName}>
                  {selected.name}
                </div>
                <div className={styles.dialogId}>
                  {selected.id}
                </div>
              </div>

              <button className={styles.closeBtn}
              onClick={() => setSelected(null)}>
  ✕
</button>
            </div>

            <hr className={styles.divider} />

            <div className={styles.dialogGrid}>
              {Object.entries(selected).map(([key, value]) => {
                if (key === "__v") return null;

                return (
                  <div key={key} className={styles.field}>
                    <label>{key}</label>
                    <p>
                      {value === null ||
                      value === undefined ||
                      value === ""
                        ? "—"
                        : typeof value === "object"
                        ? JSON.stringify(value)
                        : value.toString()}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Customers;