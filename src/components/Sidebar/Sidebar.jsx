import styles from "./Sidebar.module.css";
import { useNavigate } from "react-router-dom";
import { FaHome, FaUsers, FaBox, FaChartBar, FaTags } from "react-icons/fa";
import { MdPayments, MdInventory } from "react-icons/md";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { FaChevronDown } from "react-icons/fa";
import { FaBars } from "react-icons/fa";
import { useState, useEffect } from "react";


  const getRoleFromToken = () => {
  try {
    const token = localStorage.getItem("token");
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.role;
  } catch {
    return null;
  }
};


function Sidebar({ collapsed, setCollapsed, lang }) {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);
  const role = getRoleFromToken();


  const menu = [
  { 
    name: lang === "ta" ? "முகப்பு" : "HOME", 
    path: "/home", 
    icon: <FaHome /> 
  },

  { 
    name: lang === "ta" ? "வாடிக்கையாளர்கள்" : "CUSTOMERS", 
    path: "/customers", 
    icon: <FaUsers /> 
  },

  { 
    name: lang === "ta" ? "பொருட்கள்" : "PRODUCTS", 
    path: "/products", 
    icon: <FaBox /> 
  },

  {
    name: lang === "ta" ? "விற்பனை" : "SALES",
    icon: <RiMoneyDollarCircleLine />,
    children: [
      { name: lang === "ta" ? "இன்றைய விற்பனை" : "Today Sale", path: "/sales/today" },
      { name: lang === "ta" ? "வார விற்பனை" : "Week Sale", path: "/sales/week" },
      { name: lang === "ta" ? "மாத விற்பனை" : "Monthly Sale", path: "/sales/month" },
    ],
  },

  {
    name: lang === "ta" ? "கட்டணம்" : "PAYMENT",
    icon: <MdPayments />,
    children: [
      { name: lang === "ta" ? "பணம்" : "Cash", path: "/payment/cash" },
      { name: lang === "ta" ? "ஆன்லைன்" : "Online", path: "/payment/online" },
      { name: lang === "ta" ? "நிலுவை" : "Pending", path: "/payment/pending" },
    ],
  },

  {
    name: lang === "ta" ? "சரக்கு" : "STOCKS",
    icon: <MdInventory />,
    children: [
      { name: lang === "ta" ? "கிடைக்கும்" : "Available", path: "/stocks/available" },
      { name: lang === "ta" ? "குறைந்தது" : "Low Stock", path: "/stocks/low" },
      { name: lang === "ta" ? "இல்லை" : "Out of Stock", path: "/stocks/out" },
    ],
  },

  { 
    name: lang === "ta" ? "ஜிஎஸ்டி" : "GST", 
    path: "/gst", 
    icon: <FaChartBar />,
    onlyRole: "super_admin"
  },

  { 
    name: lang === "ta" ? "பகுப்பாய்வு" : "ANALYTICS", 
    path: "/analytics", 
    icon: <FaChartBar /> 
  },

  { 
    name: lang === "ta" ? "சலுகைகள்" : "OFFERS", 
    path: "/offers", 
    icon: <FaTags /> 
  },
];

  return (
    <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>

<div className={styles.topBar}>
  <FaBars
    className={styles.toggleBtn}
    onClick={() => setCollapsed(!collapsed)}
  />
</div>

      <ul className={styles.menu}>

        {menu
  .filter(item => !item.onlyRole || item.onlyRole === role)
  .map((item, index) => (
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

        {/* TEXT */}
        {!collapsed && <span>{item.name}</span>}
      </div>

      {/* ARROW */}
      {!collapsed && item.children && (
        <span
          className={`${styles.arrow} ${
            openMenu === index ? styles.rotate : ""
          }`}
        >
          <FaChevronDown />
        </span>
      )}
    </li>

    {/* SUB MENU */}
    {!collapsed && item.children && openMenu === index && (
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