import { useEffect, useState } from "react";
import API from "../api/api";
import MedicineCard from "../components/MedicineCard";

/* ─── Medicines Page ───────────────────────────────────────── */
function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch]       = useState("");
  const [loading, setLoading]     = useState(true);

  const token = localStorage.getItem("token");
  const user  = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const link = document.createElement("link");
    link.rel  = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap";
    document.head.appendChild(link);
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const res = await API.get("/medicines", { headers: { Authorization: `Bearer ${token}` } });
      setMedicines(res.data);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const searchMedicine = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/medicines/search?q=${search}`, { headers: { Authorization: `Bearer ${token}` } });
      setMedicines(res.data);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const deleteMedicine = async (id) => {
    if (!window.confirm("Delete this medicine?")) return;
    try {
      await API.delete(`/medicines/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchMedicines();
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  const inStock    = medicines.filter(m => m.stock_quantity > 10).length;
  const lowStock   = medicines.filter(m => m.stock_quantity > 0 && m.stock_quantity <= 10).length;
  const outOfStock = medicines.filter(m => m.stock_quantity === 0).length;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(145deg, #f0fdf6 0%, #f8fafc 60%, #eff6ff 100%)", fontFamily: "'DM Sans', sans-serif" }}>

      <main style={{ padding: "36px 40px", maxWidth: "1400px", margin: "0 auto" }}>

        {/* Heading row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "30px", fontWeight: 700, color: "#0D6E4F", margin: 0 }}>Medicines</h1>
            <p style={{ margin: "6px 0 0", fontSize: "14px", color: "#6b7280" }}>Manage your full medicine inventory</p>
          </div>

          {user?.role === "admin" && (
            <a href="/medicines/add" style={{
              display: "inline-flex", alignItems: "center", gap: "7px",
              padding: "11px 22px",
              background: "linear-gradient(135deg,#0D6E4F,#16a34a)",
              borderRadius: "10px", color: "white",
              fontSize: "14px", fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              textDecoration: "none",
              boxShadow: "0 4px 14px rgba(13,110,79,0.28)"
            }}>
              ➕ Add Medicine
            </a>
          )}
        </div>

        {/* Summary pills */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
          {[
            { label: "Total",       value: medicines.length, bg: "#f0fdf6", border: "#bbf7d0", color: "#14532d" },
            { label: "In Stock",    value: inStock,          bg: "#dcfce7", border: "#86efac", color: "#166534" },
            { label: "Low Stock",   value: lowStock,         bg: "#fef9c3", border: "#fde68a", color: "#854d0e" },
            { label: "Out of Stock",value: outOfStock,       bg: "#fee2e2", border: "#fca5a5", color: "#991b1b" },
          ].map(s => (
            <div key={s.label} style={{
              background: s.bg, border: `1.5px solid ${s.border}`,
              borderRadius: "99px", padding: "6px 16px",
              display: "flex", alignItems: "center", gap: "7px"
            }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 500, color: s.color }}>{s.label}</span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "15px", fontWeight: 700, color: s.color }}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* Search bar */}
        <div style={{
          background: "#fff", borderRadius: "14px", border: "1.5px solid #e5e7eb",
          padding: "14px 20px", marginBottom: "28px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          display: "flex", gap: "12px", alignItems: "center"
        }}>
          <div style={{ position: "relative", flex: 1 }}>
            <span style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", pointerEvents: "none" }}>🔍</span>
            <input
              placeholder="Search medicines by name…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === "Enter" && searchMedicine()}
              style={{
                width: "100%", boxSizing: "border-box",
                padding: "11px 14px 11px 42px",
                border: "1.5px solid #e5e7eb", borderRadius: "10px",
                fontSize: "14px", color: "#111827",
                fontFamily: "'DM Sans', sans-serif",
                outline: "none", background: "#f9fafb",
                transition: "border-color 0.15s, box-shadow 0.15s"
              }}
              onFocus={e => { e.target.style.borderColor = "#0D6E4F"; e.target.style.boxShadow = "0 0 0 3px rgba(13,110,79,0.1)"; e.target.style.background = "#fff"; }}
              onBlur={e =>  { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; e.target.style.background = "#f9fafb"; }}
            />
          </div>
          <button onClick={searchMedicine} style={{
            padding: "11px 22px", background: "linear-gradient(135deg,#0D6E4F,#16a34a)",
            border: "none", borderRadius: "10px", color: "white",
            fontSize: "14px", fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
            cursor: "pointer", boxShadow: "0 3px 10px rgba(13,110,79,0.25)"
          }}>Search</button>
          <button onClick={() => { setSearch(""); fetchMedicines(); }} style={{
            padding: "11px 16px", background: "#f3f4f6",
            border: "1.5px solid #e5e7eb", borderRadius: "10px",
            color: "#6b7280", fontSize: "13px", fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif", cursor: "pointer"
          }}>Reset</button>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#9ca3af", fontSize: "15px" }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>⏳</div>
            Loading medicines…
          </div>
        ) : medicines.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#9ca3af" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>💊</div>
            <div style={{ fontSize: "15px", fontWeight: 500 }}>No medicines found</div>
            <div style={{ fontSize: "13px", marginTop: "6px" }}>Try a different search or add a new medicine</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "18px" }}>
            {medicines.map(med => (
              <MedicineCard key={med.id} med={med} user={user} deleteMedicine={deleteMedicine} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Medicines;