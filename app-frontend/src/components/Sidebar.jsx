import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
  FaList,
  FaUserShield,
  FaSignOutAlt
} from "react-icons/fa";
import "./Sidebar.css";

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <h2>IBAN Admin</h2>
        {user && (
          <p className="sidebar-role">
            Logat ca: <strong>{user.role}</strong>
          </p>
        )}
      </div>

      <div className="sidebar-links">
        {user && (
          <>
            <SidebarLink to="/ibans" icon={<FaList />} label="IBAN-uri" />
            {user.role === "Admin" && (
              <SidebarLink to="/admin" icon={<FaUserShield />} label="Utilizatori" />
            )}
          </>
        )}
      </div>

      {user && (
        <button className="sidebar-link logout-btn" onClick={logout}>
          <FaSignOutAlt /> <span>Logout</span>
        </button>
      )}
    </div>
  );
}

function SidebarLink({ to, icon, label }) {
  return (
    <Link to={to} className="sidebar-link">
      {icon} <span>{label}</span>
    </Link>
  );
}
