import styles from "./Sidebar.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaHome, FaUsers, FaBox, FaChartBar, FaTags } from "react-icons/fa";
import { MdPayments, MdInventory } from "react-icons/md";
import { RiMoneyDollarCircleLine } from "react-icons/ri";

function Sidebar() {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);

  const menu = [
  { name: "HOME", path: "/home", icon: <FaHome /> },
  { name: "CUSTOMERS", path: "/customers", icon: <FaUsers /> },
  { name: "PRODUCTS", path: "/products", icon: <FaBox /> },

  {
    name: "SALES",
    icon: <RiMoneyDollarCircleLine />,
    children: [
      { name: "Today Sale", path: "/sales/today" },
      { name: "Week Sale", path: "/sales/week" },
      { name: "Monthly Sale", path: "/sales/month" },
    ],
  },

  {
    name: "PAYMENT",
    icon: <MdPayments />,
    children: [
      { name: "Cash", path: "/payment/cash" },
      { name: "Online", path: "/payment/online" },
      { name: "Pending", path: "/payment/pending" },
    ],
  },

  {
    name: "STOCKS",
    icon: <MdInventory />,
    children: [
      { name: "Available", path: "/stocks/available" },
      { name: "Low Stock", path: "/stocks/low" },
      { name: "Out of Stock", path: "/stocks/out" },
    ],
  },

  { name: "GST", path: "/gst", icon: <FaChartBar /> },
  { name: "ANALYTICS", path: "/analytics", icon: <FaChartBar /> },
  { name: "OFFERS", path: "/offers", icon: <FaTags /> },
];

  return (
    <div className={styles.sidebar}>
      <ul className={styles.menu}>

        {menu.map((item, index) => (
          <div key={index}>

            {/* MAIN ITEM */}
            <li
              className={styles.item}
              onClick={() =>
                item.children
                  ? setOpenMenu(openMenu === index ? null : index)
                  : navigate(item.path)
              }
            >
             <div className={styles.menuItem}>
  <span className={styles.icon}>{item.icon}</span>
  <span>{item.name}</span>
</div>
            </li>

    <div className={styles.divider}></div>

            {/* SUB MENU */}
            {item.children && openMenu === index && (
              <div className={styles.subMenu}>
                {item.children.map((sub, i) => (
                  <li
                    key={i}
                    className={styles.subItem}
                    onClick={() => navigate(sub.path)}
                  >
                    {sub.name}
                  </li>
                ))}
              </div>
            )}

          </div>
        ))}

      </ul>
    </div>
  );
}

export default Sidebar;