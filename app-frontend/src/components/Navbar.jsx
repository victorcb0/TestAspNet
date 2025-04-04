import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div style={{
      background: "#1976d2",
      color: "white",
      padding: "1rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <h2 style={{ margin: 0 }}>IBAN Admin</h2>
      {user && (
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <a href="/" style={{ color: "white", textDecoration: "none" }}>Acasă</a>
          <a href="/ibans" style={{ color: "white", textDecoration: "none" }}>IBAN-uri</a>
          {user.role === "Admin" && <a href="/admin" style={{ color: "white", textDecoration: "none" }}>Utilizatori</a>}
          <span>{user.role}</span>
          <button onClick={logout} style={{ background: "#ef5350" }}>Logout</button>
        </div>
      )}
    </div>
  );
}
