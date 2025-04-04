import { useState } from "react";
import api from "../api/api";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);
      const token = res.data.token;

      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      login(token, role);
      navigate("/");
    } catch {
      setError("❌ Autentificare eșuată. Verifică datele.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.title}>🔐 Autentificare</h2>

        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <div style={styles.passwordWrapper}>
          <input
            name="password"
            placeholder="Parolă"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <span onClick={togglePasswordVisibility} style={styles.eyeIcon}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {error && <p style={styles.error}>{error}</p>}
        {loading && <p style={styles.loading}>Se autentifică...</p>}

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Se trimite..." : "Login"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    height: "100vh",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f6f9",
    fontFamily: "Segoe UI, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    background: "white",
    padding: "2rem",
    borderRadius: "10px",
    boxShadow: "0 0 15px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "1rem"
  },
  title: {
    marginBottom: "1rem",
    textAlign: "center",
    fontWeight: "600"
  },
  input: {
    padding: "0.75rem",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: "6px",
    width: "100%",                    
    boxSizing: "border-box",           
    backgroundColor: "#e9f2ff"
  },
  button: {
    backgroundColor: "#1976d2",
    color: "white",
    border: "none",
    padding: "0.75rem",
    fontSize: "1rem",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background 0.3s ease"
  },
  error: {
    color: "red",
    fontSize: "0.9rem",
    marginTop: "-0.5rem"
  },
  loading: {
    color: "#666",
    fontSize: "0.9rem",
    marginTop: "-0.5rem"
  },
  passwordWrapper: {
    position: "relative",
    marginBottom: "1rem"
  },
  eyeIcon: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "#666",
    fontSize: "1rem"
  }
};
