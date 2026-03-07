import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";

/* ─── Field wrapper ────────────────────────────────────────── */
function Field({ label, icon, children }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <label style={{
        display: "flex", alignItems: "center", gap: "6px",
        fontSize: "13px", fontWeight: 600, color: "#374151",
        marginBottom: "7px", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.2px"
      }}>
        <span>{icon}</span> {label}
      </label>
      {children}
    </div>
  );
}

const inputBase = {
  width: "100%", boxSizing: "border-box",
  padding: "12px 14px",
  border: "1.5px solid #e5e7eb", borderRadius: "10px",
  fontSize: "14px", color: "#111827",
  fontFamily: "'DM Sans', sans-serif",
  background: "#fff", outline: "none",
  transition: "border-color 0.15s, box-shadow 0.15s"
};

function StyledInput({ type = "text", placeholder, value, onChange, min, step }) {
  return (
    <input
      type={type} placeholder={placeholder} value={value}
      onChange={onChange} min={min} step={step} required
      style={inputBase}
      onFocus={e => { e.target.style.borderColor = "#0D6E4F"; e.target.style.boxShadow = "0 0 0 3px rgba(13,110,79,0.1)"; }}
      onBlur={e =>  { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}
    />
  );
}

/* ─── EditMedicine Page ────────────────────────────────────── */
function EditMedicine() {
  const { id }       = useParams();
  const navigate     = useNavigate();

  const [name, setName]               = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory]       = useState("");
  const [price, setPrice]             = useState("");
  const [stock, setStock]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [fetching, setFetching]       = useState(true);
  const [success, setSuccess]         = useState(false);
  const [error, setError]             = useState("");

  const token = localStorage.getItem("token");
  const categories = ["Antibiotic", "Analgesic", "Antiviral", "Antifungal", "Vitamin", "Supplement", "Other"];

  useEffect(() => {
    const link = document.createElement("link");
    link.rel  = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap";
    document.head.appendChild(link);
    fetchMedicine();
  }, []);

  const fetchMedicine = async () => {
    setFetching(true);
    try {
      const res = await API.get(`/medicines/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      const med = res.data;
      setName(med.name);
      setDescription(med.description || "");
      setCategory(med.category);
      setPrice(med.price);
      setStock(med.stock_quantity);
    } catch (err) {
      console.log(err);
      setError("Failed to load medicine details.");
    } finally {
      setFetching(false);
    }
  };

  const updateMedicine = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(false); setLoading(true);
    try {
      await API.put(`/medicines/${id}`,
        { name, description, category, price, stock_quantity: stock },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.log(err);
      setError("Update failed. Please check your inputs and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(145deg, #f0fdf6 0%, #f8fafc 60%, #eff6ff 100%)", fontFamily: "'DM Sans', sans-serif" }}>

      <main style={{ padding: "40px", maxWidth: "1280px", margin: "0 auto" }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
          <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", color: "#6b7280", fontSize: "13.5px", fontWeight: 500, fontFamily: "'DM Sans', sans-serif", padding: 0 }}>
            ← Back
          </button>
          <span style={{ color: "#d1d5db" }}>›</span>
          <span style={{ fontSize: "13.5px", color: "#0D6E4F", fontWeight: 600 }}>Edit Medicine</span>
        </div>

        {/* Page heading */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "30px", fontWeight: 700, color: "#0D6E4F", margin: 0 }}>Edit Medicine</h1>
          <p style={{ margin: "6px 0 0", fontSize: "14px", color: "#6b7280" }}>
            {fetching ? "Loading medicine details…" : `Editing: ${name}`}
          </p>
        </div>

        {/* Loading skeleton */}
        {fetching ? (
          <div style={{ background: "#fff", borderRadius: "18px", border: "1.5px solid #e5e7eb", padding: "40px 32px", textAlign: "center", color: "#9ca3af", fontSize: "14px" }}>
            <div style={{ fontSize: "28px", marginBottom: "12px" }}>⏳</div>
            Loading medicine details…
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "28px", alignItems: "start" }}>

            {/* Form card */}
            <div style={{ background: "#fff", borderRadius: "18px", border: "1.5px solid #e5e7eb", padding: "32px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>

              {/* ID badge */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "#f0fdf6", border: "1.5px solid #bbf7d0", borderRadius: "8px", padding: "6px 14px", marginBottom: "24px" }}>
                <span style={{ fontSize: "12px" }}>🆔</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", fontWeight: 600, color: "#14532d" }}>Medicine ID: {id}</span>
              </div>

              {/* Toasts */}
              {success && (
                <div style={{ background: "#f0fdf6", border: "1.5px solid #bbf7d0", borderRadius: "10px", padding: "12px 16px", marginBottom: "24px", fontSize: "13.5px", color: "#14532d", fontWeight: 500, display: "flex", alignItems: "center", gap: "8px" }}>
                  ✅ Medicine updated successfully!
                </div>
              )}
              {error && (
                <div style={{ background: "#fef2f2", border: "1.5px solid #fecaca", borderRadius: "10px", padding: "12px 16px", marginBottom: "24px", fontSize: "13.5px", color: "#dc2626", fontWeight: 500, display: "flex", alignItems: "center", gap: "8px" }}>
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={updateMedicine}>

                {/* Row 1: Name + Category */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <Field label="Medicine Name" icon="💊">
                    <StyledInput placeholder="e.g. Amoxicillin 500mg" value={name} onChange={e => setName(e.target.value)} />
                  </Field>

                  <Field label="Category" icon="🏷️">
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      required
                      style={{
                        ...inputBase, cursor: "pointer", appearance: "none",
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: "36px"
                      }}
                      onFocus={e => { e.target.style.borderColor = "#0D6E4F"; e.target.style.boxShadow = "0 0 0 3px rgba(13,110,79,0.1)"; }}
                      onBlur={e =>  { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}
                    >
                      <option value="">Select category…</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </Field>
                </div>

                {/* Description */}
                <Field label="Description" icon="📝">
                  <textarea
                    placeholder="Brief description of the medicine, usage, and notes…"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={4}
                    style={{ ...inputBase, resize: "vertical", minHeight: "100px", lineHeight: 1.6 }}
                    onFocus={e => { e.target.style.borderColor = "#0D6E4F"; e.target.style.boxShadow = "0 0 0 3px rgba(13,110,79,0.1)"; }}
                    onBlur={e =>  { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}
                  />
                </Field>

                {/* Row 2: Price + Stock */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <Field label="Price (₦)" icon="💰">
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", fontSize: "13px", fontWeight: 600, color: "#6b7280", pointerEvents: "none" }}>₦</span>
                      <input
                        type="number" placeholder="0.00" value={price} min="0" step="0.01" required
                        onChange={e => setPrice(e.target.value)}
                        style={{ ...inputBase, paddingLeft: "28px" }}
                        onFocus={e => { e.target.style.borderColor = "#0D6E4F"; e.target.style.boxShadow = "0 0 0 3px rgba(13,110,79,0.1)"; }}
                        onBlur={e =>  { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}
                      />
                    </div>
                  </Field>

                  <Field label="Stock Quantity" icon="📦">
                    <StyledInput type="number" placeholder="0" min="0" value={stock} onChange={e => setStock(e.target.value)} />
                  </Field>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: "13px 28px",
                      background: loading ? "#9ca3af" : "linear-gradient(135deg,#0D6E4F,#16a34a)",
                      border: "none", borderRadius: "10px",
                      color: "white", fontSize: "15px", fontWeight: 600,
                      fontFamily: "'DM Sans', sans-serif",
                      cursor: loading ? "not-allowed" : "pointer",
                      boxShadow: loading ? "none" : "0 4px 14px rgba(13,110,79,0.3)",
                      transition: "opacity 0.15s, transform 0.1s"
                    }}
                    onMouseEnter={e => { if (!loading) e.target.style.opacity = "0.92"; }}
                    onMouseLeave={e => { e.target.style.opacity = "1"; }}
                    onMouseDown={e => { if (!loading) e.target.style.transform = "scale(0.99)"; }}
                    onMouseUp={e => { e.target.style.transform = "scale(1)"; }}
                  >
                    {loading ? "Saving…" : "💾 Save Changes"}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    style={{
                      padding: "13px 22px",
                      background: "#fff", border: "1.5px solid #e5e7eb",
                      borderRadius: "10px", color: "#374151",
                      fontSize: "15px", fontWeight: 600,
                      fontFamily: "'DM Sans', sans-serif", cursor: "pointer"
                    }}
                  >
                    Cancel
                  </button>
                </div>

              </form>
            </div>

            {/* Right info panel */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

              {/* Current values snapshot */}
              <div style={{ background: "#fff", borderRadius: "18px", border: "1.5px solid #e5e7eb", padding: "22px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "16px", fontWeight: 700, color: "#111827", margin: "0 0 16px", display: "flex", alignItems: "center", gap: "8px" }}>
                  🔍 Current Values
                </h3>
                {[
                  ["Name",     name     || "—"],
                  ["Category", category || "—"],
                  ["Price",    price    ? `₦${Number(price).toLocaleString()}` : "—"],
                  ["Stock",    stock    !== "" ? `${stock} units` : "—"],
                ].map(([label, val]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid #f3f4f6" }}>
                    <span style={{ fontSize: "12.5px", color: "#6b7280", fontWeight: 500 }}>{label}</span>
                    <span style={{ fontSize: "13px", color: "#111827", fontWeight: 600, maxWidth: "160px", textAlign: "right", wordBreak: "break-word" }}>{val}</span>
                  </div>
                ))}

                {/* Stock indicator */}
                <div style={{ marginTop: "14px" }}>
                  <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "6px", fontWeight: 500 }}>Stock Level</div>
                  <div style={{ background: "#f3f4f6", borderRadius: "99px", height: "8px", overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: "99px",
                      width: `${Math.min(100, (Number(stock) / 100) * 100)}%`,
                      background: Number(stock) === 0 ? "#ef4444" : Number(stock) <= 10 ? "#f59e0b" : "linear-gradient(90deg,#0D6E4F,#4ADE80)",
                      transition: "width 0.4s"
                    }} />
                  </div>
                  <div style={{ fontSize: "11.5px", color: Number(stock) === 0 ? "#dc2626" : Number(stock) <= 10 ? "#92400e" : "#14532d", fontWeight: 600, marginTop: "5px" }}>
                    {Number(stock) === 0 ? "Out of Stock" : Number(stock) <= 10 ? "Low Stock" : "In Stock"}
                  </div>
                </div>
              </div>

              {/* Warning note */}
              <div style={{ background: "linear-gradient(135deg,#fff7ed,#ffedd5)", borderRadius: "18px", border: "1.5px solid #fed7aa", padding: "20px 22px" }}>
                <div style={{ fontSize: "22px", marginBottom: "8px" }}>⚠️</div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#9a3412", marginBottom: "4px" }}>Be careful when editing</div>
                <div style={{ fontSize: "12.5px", color: "#c2410c", lineHeight: 1.6 }}>
                  Changing the price or stock will immediately affect orders and the dashboard inventory view.
                </div>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default EditMedicine;