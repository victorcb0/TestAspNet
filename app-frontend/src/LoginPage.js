import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("https://localhost:7097/api/auth/login", {
        username,
        password
      });

      const token = response.data.token;

      // Salvăm tokenul în localStorage
      localStorage.setItem("token", token);

      // Decodăm JWT pentru a extrage rolul (opțional)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      localStorage.setItem("role", role);

      navigate("/"); // redirecționăm după login
    } catch (err) {
      setError("Login eșuat. Verifică datele.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "3rem auto", padding: "2rem", border: "1px solid #ccc" }}>
      <h2>Autentificare</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          style={{ display: "block", width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
        />
        <input
          type="password"
          placeholder="Parolă"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ display: "block", width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" style={{ padding: "0.5rem", width: "100%" }}>
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
