import Sidebar from "./Sidebar";

export default function AdminLayout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main style={{
        marginLeft: "220px",
        padding: "2rem",
        flex: 1,
        minHeight: "100vh",
        backgroundColor: "#f5f5f5"
      }}>
        {children}
      </main>
    </div>
  );
}
