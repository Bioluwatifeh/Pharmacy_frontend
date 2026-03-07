import { useState, useEffect } from "react";
import API from "../api/api";

/* ─── Field Component ──────────────────────────────────────── */
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

/* ─── Shared input styles ──────────────────────────────────── */
const inputBase = {
  width: "100%", boxSizing: "border-box",
  padding: "12px 14px",
  border: "1.5px solid #e5e7eb", borderRadius: "10px",
  fontSize: "14px", color: "#111827",
  fontFamily: "'DM Sans', sans-serif",
  background: "#fff", outline: "none",
  transition: "border-color 0.15s, box-shadow 0.15s"
};

function StyledInput({ type = "text", placeholder, value, onChange, min }) {
  return (
    <input
      type={type} placeholder={placeholder} value={value}
      onChange={onChange} min={min} required
      style={inputBase}
      onFocus={e => { e.target.style.borderColor = "#0D6E4F"; e.target.style.boxShadow = "0 0 0 3px rgba(13,110,79,0.1)"; }}
      onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}
    />
  );
}

/* ─── AddMedicine Page ─────────────────────────────────────── */
function AddMedicine() {
  const [name, setName]               = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory]       = useState("");
  const [price, setPrice]             = useState("");
  const [stock, setStock]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [success, setSuccess]         = useState(false);
  const [error, setError]             = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const link = document.createElement("link");
    link.rel  = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(false); setLoading(true);
    try {
      await API.post("/medicines", { name, description, category, price, stock_quantity: stock },
        { headers: { Authorization: `Bearer ${token}` } });
      setSuccess(true);
      setName(""); setDescription(""); setCategory(""); setPrice(""); setStock("");
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.log(err);
      setError("Failed to add medicine. Please check your inputs and try again.");
    } finally {
      setLoading(false);
    }
  };

  const categories = ["Antibiotic", "Analgesic", "Antiviral", "Antifungal", "Vitamin", "Supplement", "Other"];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(145deg, #f0fdf6 0%, #f8fafc 60%, #eff6ff 100%)",
      fontFamily: "'DM Sans', sans-serif"
    }}>

      {/* Body */}
      <main style={{ padding: "40px", maxWidth: "1280px", margin: "0 auto" }}>

        {/* Page heading */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "30px", fontWeight: 700, color: "#0D6E4F", margin: 0
          }}>Add Medicine</h1>
          <p style={{ margin: "6px 0 0", fontSize: "14px", color: "#6b7280" }}>
            Fill in the details below to add a new medicine to inventory
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "28px", alignItems: "start" }}>

          {/* ── Form card ── */}
          <div style={{
            background: "#fff", borderRadius: "18px",
            border: "1.5px solid #e5e7eb", padding: "32px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
          }}>

            {/* Toast messages */}
            {success && (
              <div style={{
                background: "#f0fdf6", border: "1.5px solid #bbf7d0", borderRadius: "10px",
                padding: "12px 16px", marginBottom: "24px",
                fontSize: "13.5px", color: "#14532d", fontWeight: 500,
                display: "flex", alignItems: "center", gap: "8px"
              }}>
                <span>✅</span> Medicine added successfully!
              </div>
            )}
            {error && (
              <div style={{
                background: "#fef2f2", border: "1.5px solid #fecaca", borderRadius: "10px",
                padding: "12px 16px", marginBottom: "24px",
                fontSize: "13.5px", color: "#dc2626", fontWeight: 500,
                display: "flex", alignItems: "center", gap: "8px"
              }}>
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

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
                      ...inputBase,
                      cursor: "pointer",
                      appearance: "none",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 14px center",
                      paddingRight: "36px"
                    }}
                    onFocus={e => { e.target.style.borderColor = "#0D6E4F"; e.target.style.boxShadow = "0 0 0 3px rgba(13,110,79,0.1)"; }}
                    onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}
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
                  style={{
                    ...inputBase, resize: "vertical", minHeight: "100px", lineHeight: 1.6
                  }}
                  onFocus={e => { e.target.style.borderColor = "#0D6E4F"; e.target.style.boxShadow = "0 0 0 3px rgba(13,110,79,0.1)"; }}
                  onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}
                />
              </Field>

              {/* Row 2: Price + Stock */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <Field label="Price (₦)" icon="💰">
                  <div style={{ position: "relative" }}>
                    <span style={{
                      position: "absolute", left: "13px", top: "50%",
                      transform: "translateY(-50%)", fontSize: "13px",
                      fontWeight: 600, color: "#6b7280", pointerEvents: "none"
                    }}>₦</span>
                    <input
                      type="number" placeholder="0.00" value={price} min="0" step="0.01" required
                      onChange={e => setPrice(e.target.value)}
                      style={{ ...inputBase, paddingLeft: "28px" }}
                      onFocus={e => { e.target.style.borderColor = "#0D6E4F"; e.target.style.boxShadow = "0 0 0 3px rgba(13,110,79,0.1)"; }}
                      onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}
                    />
                  </div>
                </Field>

                <Field label="Stock Quantity" icon="📦">
                  <StyledInput type="number" placeholder="0" min="0" value={stock} onChange={e => setStock(e.target.value)} />
                </Field>
              </div>

              {/* Submit */}
              <div style={{ marginTop: "8px" }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: "13px 32px",
                    background: loading ? "#9ca3af" : "linear-gradient(135deg, #0D6E4F 0%, #16a34a 100%)",
                    border: "none", borderRadius: "10px",
                    color: "white", fontSize: "15px", fontWeight: 600,
                    fontFamily: "'DM Sans', sans-serif",
                    cursor: loading ? "not-allowed" : "pointer",
                    boxShadow: loading ? "none" : "0 4px 14px rgba(13,110,79,0.3)",
                    transition: "opacity 0.15s, transform 0.1s",
                    letterSpacing: "0.3px"
                  }}
                  onMouseEnter={e => { if (!loading) e.target.style.opacity = "0.92"; }}
                  onMouseLeave={e => { e.target.style.opacity = "1"; }}
                  onMouseDown={e => { if (!loading) e.target.style.transform = "scale(0.99)"; }}
                  onMouseUp={e => { e.target.style.transform = "scale(1)"; }}
                >
                  {loading ? "Adding…" : "➕ Add Medicine"}
                </button>
              </div>

            </form>
          </div>

          {/* ── Right tips panel ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Guidelines card */}
            <div style={{
              background: "#fff", borderRadius: "18px",
              border: "1.5px solid #e5e7eb", padding: "24px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
            }}>
              <h3 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "16px", fontWeight: 700, color: "#111827",
                margin: "0 0 16px", display: "flex", alignItems: "center", gap: "8px"
              }}>📋 Entry Guidelines</h3>
              {[
                ["💊", "Name", "Include strength & form (e.g. 500mg Capsule)"],
                ["🏷️", "Category", "Choose the closest therapeutic class"],
                ["💰", "Price", "Enter the unit selling price"],
                ["📦", "Stock", "Enter current quantity on hand"],
              ].map(([icon, title, tip]) => (
                <div key={title} style={{
                  display: "flex", gap: "10px", marginBottom: "14px", alignItems: "flex-start"
                }}>
                  <span style={{
                    width: "30px", height: "30px", borderRadius: "8px",
                    background: "#f0fdf6", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    fontSize: "14px", flexShrink: 0
                  }}>{icon}</span>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>{title}</div>
                    <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>{tip}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Low stock warning card */}
            <div style={{
              background: "linear-gradient(135deg, #f0fdf6, #dcfce7)",
              borderRadius: "18px", border: "1.5px solid #bbf7d0",
              padding: "20px 22px"
            }}>
              <div style={{ fontSize: "22px", marginBottom: "8px" }}>⚠️</div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#14532d", marginBottom: "4px" }}>
                Low Stock Alert
              </div>
              <div style={{ fontSize: "12.5px", color: "#166534", lineHeight: 1.6 }}>
                Medicines with stock below <strong>10 units</strong> will automatically appear in the Low Stock section of your dashboard.
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default AddMedicine;