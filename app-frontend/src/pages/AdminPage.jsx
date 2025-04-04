import { useState } from "react";
import api from "../api/api";

export default function AdminPage() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "Operator",
    assignedRaion: "",
  });

  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setStatus({ type: "", message: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    if (!form.username || !form.password) {
      return setStatus({
        type: "error",
        message: "Toate câmpurile sunt obligatorii.",
      });
    }
    
    if (form.password.length < 6) {
      return setStatus({
        type: "error",
        message: "Parola trebuie să conțină cel puțin 6 caractere.",
      });
    }
    

    if (form.role === "OperatorRaion" && !form.assignedRaion) {
      return setStatus({
        type: "error",
        message: "Raionul trebuie completat pentru OperatorRaion.",
      });
    }

    try {
      const payload = {
        username: form.username,
        password: form.password,
        role: form.role,
        assignedRaion: form.role === "OperatorRaion" ? form.assignedRaion : null,
      };

      await api.post("/auth/register", payload);
      setStatus({ type: "success", message: "✅ Utilizator creat cu succes!" });
      setForm({ username: "", password: "", role: "Operator", assignedRaion: "" });
    } catch (err) {
      const msg = typeof err.response?.data === "string"
        ? err.response.data
        : err.response?.data?.message || "Eroare la creare.";

      setStatus({
        type: "error",
        message: msg.includes("Username") ? "⚠️ Utilizatorul există deja!" : `❌ ${msg}`,
      });
    }
  };

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.title}>👤 Creare utilizator nou</h2>

        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          name="password"
          placeholder="Parolă"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="Admin">Admin</option>
          <option value="Operator">Operator</option>
          <option value="OperatorRaion">OperatorRaion</option>
        </select>

        {form.role === "OperatorRaion" && (
          <input
            name="assignedRaion"
            placeholder="ex: Anenii Noi"
            value={form.assignedRaion}
            onChange={handleChange}
            style={styles.input}
            required
          />
        )}

        {status.message && (
          <div
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "6px",
              fontSize: "0.95rem",
              backgroundColor: status.type === "error" ? "#ffe6e6" : "#e6ffed",
              color: status.type === "error" ? "#c62828" : "#2e7d32",
              border: `1px solid ${status.type === "error" ? "#ef9a9a" : "#a5d6a7"}`,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "1rem"
            }}
          >
            {status.message}
          </div>
        )}

        <button type="submit" style={styles.button}>Creează utilizator</button>
      </form>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    padding: "1rem",
    backgroundColor: "#f5f7fa",
    minHeight: "auto"
  },  
  card: {
    width: "100%",
    maxWidth: "500px",
    background: "white",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    fontFamily: "Segoe UI, sans-serif",
  },
  title: {
    textAlign: "center",
    marginBottom: "1rem",
    fontSize: "1.25rem",
  },
  input: {
    padding: "0.75rem",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: "6px",
    width: "100%",
    boxSizing: "border-box",
  },
  button: {
    backgroundColor: "#1976d2",
    color: "white",
    border: "none",
    padding: "0.75rem",
    fontSize: "1rem",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
};
