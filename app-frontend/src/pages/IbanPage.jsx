import { useEffect, useState } from "react";
import api from "../api/api";
import { CSVLink } from "react-csv";
import { useAuth } from "../auth/AuthContext";
import "./IbanPage.css";

export default function IbanPage() {
  const [ibans, setIbans] = useState([]);
  const [formFilters, setFormFilters] = useState({ raion: "", localitate: "", codEco: "", year: "" });
  const [filters, setFilters] = useState({ raion: "", localitate: "", codEco: "", year: "" });
  const [form, setForm] = useState({ ibanCode: "", year: "", codEco: "", raion: "", localitate: "" });
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState({ type: "", message: "" });
  const { user } = useAuth();
  const [allIbans, setAllIbans] = useState([]);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

  const canEdit = user?.role === "Admin" || user?.role === "Operator";

  useEffect(() => {
    loadIbans();
  }, [page, filters, sortField, sortOrder]);

  const loadIbans = async () => {
    try {
      const params = new URLSearchParams({
        page,
        pageSize,
        sortField,
        sortOrder,
        ...filters
      });
      const response = await api.get(`/iban/paginated?${params.toString()}`);
      setIbans(response.data.items);
      setTotalCount(response.data.totalCount);
    } catch {
      setStatus({ type: "error", message: "Eroare la încărcarea IBAN-urilor." });
    }
  };

  const fetchAllIbans = async () => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/iban?${params.toString()}`);
      return response.data;
    } catch {
      alert("Eroare la exportul CSV.");
      return [];
    }
  };

  const handleExport = async () => {
    const fullData = await fetchAllIbans();
    setAllIbans(fullData);
    document.getElementById("csv-export-btn")?.click();
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setFilters(formFilters);
  };

  const handleResetFilters = () => {
    const empty = { raion: "", localitate: "", codEco: "", year: "" };
    setFormFilters(empty);
    setFilters(empty);
    setPage(1);
  };

  const handleFilterChange = (e) => {
    setFormFilters({ ...formFilters, [e.target.name]: e.target.value });
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ ibanCode: "", year: "", codEco: "", raion: "", localitate: "" });
    setEditingId(null);
    setStatus({ type: "", message: "" });
  };

  const handleSubmitIban = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    if (!form.ibanCode || !form.codEco || !form.raion || !form.localitate) {
      return setStatus({ type: "error", message: "Toate câmpurile sunt obligatorii." });
    }

    const parsedYear = parseInt(form.year);
    if (!parsedYear || parsedYear < 1900 || parsedYear > new Date().getFullYear()) {
      return setStatus({ type: "error", message: "Anul trebuie să fie valid." });
    }

    try {
      if (editingId) {
        await api.put(`/iban/${editingId}`, form);
        setStatus({ type: "success", message: "IBAN actualizat cu succes." });
      } else {
        await api.post("/iban", form);
        setStatus({ type: "success", message: "IBAN adăugat cu succes." });
      }
      resetForm();
      await loadIbans();
    } catch (err) {
      const msg = err.response?.data?.message || "Eroare la salvare IBAN.";
      setStatus({ type: "error", message: msg });
    }
  };

  const handleEdit = (iban) => {
    setForm(iban);
    setEditingId(iban.id);
    setStatus({ type: "", message: "" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Ștergi acest IBAN?")) {
      try {
        await api.delete(`/iban/${id}`);
        await loadIbans();
      } catch {
        setStatus({ type: "error", message: "Eroare la ștergere." });
      }
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? " 🔼" : " 🔽";
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="iban-page">
      <h2>📄 Coduri IBAN</h2>

      <section className="card">
        <h3>🔍 Filtrare</h3>
        <form onSubmit={handleFilterSubmit} className="form">
          <input className="input" name="raion" placeholder="Raion" value={formFilters.raion} onChange={handleFilterChange} />
          <input className="input" name="localitate" placeholder="Localitate" value={formFilters.localitate} onChange={handleFilterChange} />
          <input className="input" name="codEco" placeholder="Cod Eco" value={formFilters.codEco} onChange={handleFilterChange} />
          <input className="input" name="year" placeholder="An" type="number" value={formFilters.year} onChange={handleFilterChange} />
          <div className="filter-buttons">
            <button type="submit" className="btn-primary">Filtrează</button>
            <button type="button" className="btn-secondary" onClick={handleResetFilters}>Resetează</button>
          </div>
        </form>
      </section>

      {canEdit && (
        <section className="card">
          <h3>{editingId ? "✏️ Editare IBAN" : "➕ Adăugare IBAN"}</h3>
          <form onSubmit={handleSubmitIban} className="form two-columns">
            <input className="input input-long" name="ibanCode" placeholder="Cod IBAN" value={form.ibanCode} onChange={handleFormChange} required />
            <input className="input" name="year" placeholder="An" type="number" value={form.year} onChange={handleFormChange} required />
            <input className="input" name="codEco" placeholder="Cod Eco" value={form.codEco} onChange={handleFormChange} required />
            <input className="input" name="raion" placeholder="Raion" value={form.raion} onChange={handleFormChange} required />
            <input className="input" name="localitate" placeholder="Localitate" value={form.localitate} onChange={handleFormChange} required />
            <div className="form-buttons">
              <button type="submit" className="btn-primary">{editingId ? "Salvează" : "Adaugă"}</button>
              {editingId && <button type="button" onClick={resetForm} className="btn-secondary">Anulează</button>}
            </div>
          </form>
          {status.message && (
            <div className={`status-msg ${status.type}`}>{status.message}</div>
          )}
        </section>
      )}

      <section className="card">
        <h3>📋 Tabel IBAN-uri</h3>
        <table className="table">
          <thead>
            <tr>
              <th onClick={() => handleSort("id")} className="sortable">ID{renderSortIcon("id")}</th>
              <th onClick={() => handleSort("ibanCode")} className="sortable">Cod{renderSortIcon("ibanCode")}</th>
              <th onClick={() => handleSort("year")} className="sortable">An{renderSortIcon("year")}</th>
              <th onClick={() => handleSort("codEco")} className="sortable">Cod Eco{renderSortIcon("codEco")}</th>
              <th onClick={() => handleSort("raion")} className="sortable">Raion{renderSortIcon("raion")}</th>
              <th onClick={() => handleSort("localitate")} className="sortable">Localitate{renderSortIcon("localitate")}</th>
              {canEdit && <th>Acțiuni</th>}
            </tr>
          </thead>
          <tbody>
            {ibans.length > 0 ? ibans.map(iban => (
              <tr key={iban.id}>
                <td>{iban.id}</td>
                <td>{iban.ibanCode}</td>
                <td>{iban.year}</td>
                <td>{iban.codEco}</td>
                <td>{iban.raion}</td>
                <td>{iban.localitate}</td>
                {canEdit && (
                  <td>
                    <button onClick={() => handleEdit(iban)}>✏️</button>
                    <button onClick={() => handleDelete(iban.id)} style={{ marginLeft: "0.5rem" }}>🗑️</button>
                  </td>
                )}
              </tr>
            )) : (
              <tr><td colSpan={canEdit ? 7 : 6}>Nu există rezultate.</td></tr>
            )}
          </tbody>
        </table>

        <div className="pagination">
        <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="pagination-btn"
          >
            ◀️ Prev
          </button>

          <span className="pagination-info">Pagina {page} din {totalPages}</span>

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || totalCount === 0}
            className="pagination-btn"
          >
            Next ▶️
          </button>
        </div>
      </section>

      {canEdit && (
          <>
            <button onClick={handleExport} className="btn-export">⬇️ Exportă CSV</button>
            <CSVLink
              data={allIbans}
              filename="ibanuri.csv"
              className="hidden"
              target="_blank"
              id="csv-export-btn"
            />
          </>
        )}
      </div>
  );
}
