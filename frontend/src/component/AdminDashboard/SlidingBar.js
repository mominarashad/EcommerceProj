// components/Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaCalendarAlt, FaFileAlt, FaCog, FaSignOutAlt, FaBox ,FaPhone} from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src="./images/i.jpg" alt="Delight Logo" />
        <h2>Smart MART</h2>
      </div>
      <ul className="sidebar-menu">
        <li><Link to="/admin-dashboard">
            <FaHome /> Dashboard
          </Link></li>
        <li><Link to="/products">
            <FaBox /> Products
          </Link></li>

        <li>
  <Link to="/admincontact">
    <FaPhone /> Contact
  </Link>
</li>

        <li><Link to="/settings">
            <FaCog /> Settings
          </Link>
        </li>
        <li><FaSignOutAlt /> Logout</li>
      </ul>
    </div>
  );
};

export default Sidebar;
