import styles from "./Sidebar.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaUsers, FaBox, FaChartBar, FaTags, FaCog } from "react-icons/fa";
import { MdPayments, MdInventory } from "react-icons/md";
import { RiMoneyDollarCircleLine, } from "react-icons/ri";
import {
  FaTruckLoading, FaUserCircle,
  FaFileInvoice,
  FaChevronRight,
  FaPrint,
  FaHeadset,
  FaShieldAlt,
} from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { FaBars } from "react-icons/fa";
import { useState, useEffect } from "react";
import { APP_VERSION } from "../../version";
import { FaSignOutAlt } from "react-icons/fa";



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
  const [settingsMode, setSettingsMode] = useState(false);
  const role = getRoleFromToken();
  const location = useLocation();
  const user =
    JSON.parse(
      localStorage.getItem("user")
    ) || {};

  const businessName =
    user?.CompanyName || "";

  const phone =
    user?.CompanyPhone || "";

  const logo =
    localStorage.getItem(
      "businessLogo"
    ) || "";

  const settingsMenu = [
    {
      name: lang === "ta" ? "கணக்கு" : "Account",
      path: "/account",
      icon: <FaUserCircle />,
    },
    {
      name: lang === "ta" ? "வணிகத்தை நிர்வகிக்கவும்" : "Manage Business",
      path: "/myaccountpage",
      icon: <FaUserCircle />,
    },
    {
      name: lang === "ta" ? "பயனர்கள் நிர்வாகம்" : "Manage Users",
      path: "/settings/users",
      icon: <FaUsers />,
    },
    {
      name: lang === "ta" ? "இன்வாய்ஸ் அமைப்புகள்" : "Invoice Settings",
      path: "/settings/invoice",
      icon: <FaFileInvoice />,
    },
    {
      name: lang === "ta" ? "அச்சு அமைப்புகள்" : "Print Settings",
      path: "/settings/print",
      icon: <FaPrint />,
    },
    {
      name: lang === "ta" ? "உதவி & ஆதரவு" : "Help & Support",
      path: "/settings/support",
      icon: <FaHeadset />,
    },

    {
      divider: true
    },

    {
      name: lang === "ta" ? "வெளியேறு" : "Logout",
      path: "/logout",
      icon: <FaSignOutAlt />,
      logout: true,
    },
  ];

  const menu = [


    {
      name: lang === "ta" ? "முகப்பு பலகம்" : "DASHBOARD",
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
      icon: <FaBox />,
      children: [
        {
          name: lang === "ta" ? "வகைகள்" : "Category",
          path: "/category"
        },

        {
          name: lang === "ta" ? "பொருட்கள்" : "Product",
          path: "/product"
        },
      ],
    },

    {
      name: lang === "ta" ? "சப்ளையர்கள்" : "SUPPLIER",
      icon: <FaTruckLoading />,
      children: [
        {
          name: lang === "ta" ? "சப்ளையர்" : "Supplier",
          path: "/supplier"
        },

        {
          name: lang === "ta" ? "கொள்முதல்" : "Purchase",
          path: "/purchase"
        },
      ],
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

  const handleLogout = async () => {
    try {

      const token = localStorage.getItem("token");

      await axios.post(
        "http://192.168.31.181:5000/api/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    } catch (error) {
      console.error("Logout failed:", error);
    } finally {

      localStorage.clear();

      navigate("/");

    }
  };

  return (
    <div
      className={`
    ${styles.sidebar}
    ${collapsed ? styles.collapsed : ""}
    ${settingsMode ? styles.settingsSidebar : ""}
  `}
    >

      {/* TOP FIXED */}

      <div className={styles.topFixed}>

        <div className={styles.topBar}>

          {!collapsed && (
            <div className={styles.businessSection}>

              <div className={styles.businessInfo}>

                <div className={styles.avatar}>
                  {logo ? (
                    <img src={logo} alt="logo" />
                  ) : (
                    businessName.charAt(0)
                  )}
                </div>

                <div className={styles.businessText}>
                  <h4>{businessName}</h4>
                  <p>{phone}</p>
                </div>

              </div>

              <div className={styles.billRow}>

                <button
                  className={styles.billBtn}
                  onClick={() => navigate("/onboarding")}
                >
                  + Create Sale Invoice
                </button>
                {/*
      <button
        className={styles.menuBtn}
        onClick={() => setCollapsed(!collapsed)}
      >
        <FaBars />
      </button>
*/}
              </div>

            </div>
          )}



          {/*
{collapsed && (
  <FaBars
    className={styles.toggleBtn}
    onClick={() => setCollapsed(!collapsed)}
  />
)}
*/}


        </div>

      </div>

      <div className={styles.menuWrapper}>

        <ul className={styles.menu}>
          {!settingsMode ? (
            menu
              .filter(
                item =>
                  item.key !== "settings" &&
                  (
                    !item.onlyRole ||
                    item.onlyRole === role
                  )
              )
              .map((item, index) => (
                <div key={index}>
                  <li
                    className={`${styles.item} ${location.pathname === item.path
                      ? styles.active
                      : ""
                      }`}
                    onClick={() => {
                      if (item.key === "settings") {
                        setSettingsMode(true);
                        navigate("/myaccountpage");
                      } else if (item.children) {
                        setOpenMenu(openMenu === index ? null : index);
                      } else {
                        navigate(item.path);
                      }
                    }}
                  >
                    <div className={styles.menuItem}>
                      <span className={styles.icon}>{item.icon}</span>

                      {!collapsed && <span>{item.name}</span>}
                    </div>

                    {!collapsed && item.children && (
                      <span
                        className={`${styles.arrow} ${openMenu === index ? styles.rotate : ""
                          }`}
                      >
                        <FaChevronRight />
                      </span>
                    )}
                  </li>

                  {!collapsed && item.children && openMenu === index && (
                    <div className={styles.subMenu}>
                      {item.children.map((sub, i) => (
                        <li
                          key={i}
                          className={`${styles.subItem} ${location.pathname === sub.path
                            ? styles.active
                            : ""
                            }`}
                          onClick={() => navigate(sub.path)}
                        >
                          {sub.name}
                        </li>
                      ))}
                    </div>
                  )}
                </div>
              ))
          ) : (
            <>
              <li
                className={styles.backItem}
                onClick={() => setSettingsMode(false)}
              >
                <span>← Back to Dashboard</span>
              </li>
              {settingsMenu.map((item, index) => {

                if (item.divider) {
                  return <div key={index} className={styles.settingsDivider}></div>;
                }

                return (
                  <li
                    key={index}
                    className={`${styles.item} ${location.pathname === item.path
                        ? styles.active
                        : ""
                      }`}
                    onClick={() => {

                      if (item.logout) {
                        handleLogout();
                        return;
                      }

                      navigate(item.path);
                    }}
                  >
                    <div className={styles.menuItem}>
                      <span className={styles.icon}>
                        {item.icon}
                      </span>

                      {!collapsed && <span>{item.name}</span>}
                    </div>
                  </li>
                );
              })}
            </>
          )}
        </ul>
      </div>

      <div className={styles.bottomSettings}>

  {!settingsMode && (
    <div
      className={styles.settingsButton}
      onClick={() => {
        setSettingsMode(true);
        navigate("/myaccountpage");
      }}
    >
      <div className={styles.menuItem}>
        <span className={styles.icon}>
          <FaCog />
        </span>

        {!collapsed && (
          <span className={styles.settingsText}>
            Settings
          </span>
        )}
      </div>
    </div>
  )}

  {!collapsed && (
    <p className={styles.versionText}>
      Version {APP_VERSION}
    </p>
  )}

</div>
    </div>

  );
}

export default Sidebar;