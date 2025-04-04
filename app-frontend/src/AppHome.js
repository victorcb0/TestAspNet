import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AppHome() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return <h1>🏠 Pagina Home – Ești logat</h1>;
}
