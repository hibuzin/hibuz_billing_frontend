import { useEffect, useState } from "react";
import styles from "./Home.module.css";
import { API } from "../../constants/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function Home() {
  const [reportType, setReportType] = useState("today");
  const [salesData, setSalesData] = useState([]);
  const [transactions, setTransactions] = useState([]);


  const token = localStorage.getItem("token");

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };

  useEffect(() => {
    fetchSalesReport(reportType);
  }, [reportType]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchSalesReport = async (type) => {
  try {
    const res = await fetch(
      `${API.bill}/sales-check?type=${type}`,
      { headers: authHeaders }
    );

    const json = await res.json();
    const d = json?.data;

    setSalesData([
      {
        name: type,
        bills: d?.totalBills || 0,
        sales: d?.totalSales || 0,
      },
    ]);
  } catch (err) {
    setSalesData([]);
  }
};

  const fetchTransactions = async () => {
  try {
    const res = await fetch(
      `${API.bill}?limit=5`,
      { headers: authHeaders }
    );

    const json = await res.json();

    setTransactions(Array.isArray(json?.data) ? json.data : []);
  } catch (err) {
    setTransactions([]);
  }
};

  return (
    <div className={styles.page}>

    {/* FIXED TOP */}
    <div className={styles.pageHeader}>
      <h1>Dashboard</h1>
      <div className={styles.divider}></div>
    </div>

    {/* ONLY THIS SCROLLS */}
    <div className={styles.pageContent}>
      <div className={styles.overviewGrid}>
        <div className={styles.cardGreen}>
          To Collect <h2>₹0</h2>
        </div>

        <div className={styles.cardRed}>
          To Pay <h2>₹0</h2>
        </div>

        <div className={styles.cardGreay}>
          Today cash <h2>₹0</h2>
        </div>

      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          Latest Transactions
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Txn No</th>
              <th>Party</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="5" className={styles.empty}>
                  No transactions found
                </td>
              </tr>
            ) : (
              transactions.map((t, i) => (
                <tr key={i}>
                  <td>{t.createdAt}</td>
                  <td>{t.paymentMethod}</td>
                  <td>{t._id}</td>
                  <td>
  {t.customerId
    ? `${t.customerId.name}`
    : "N/A"}
</td>
                  <td>₹{t?.summary?.grandTotal || 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h3>Sales Report</h3>

          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={salesData}
            barCategoryGap="20%"
            barGap={4}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />
            <YAxis />

            <Tooltip cursor={false} />

            <Bar
              dataKey="bills"
              fill="#9c7fde"
              barSize={32}
              radius={[6, 6, 0, 0]}
              activeBar={false}
            />

            <Bar
              dataKey="sales"
              fill="#e7c385"
              barSize={32}
              radius={[6, 6, 0, 0]}
              activeBar={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
    </div>
  );
}