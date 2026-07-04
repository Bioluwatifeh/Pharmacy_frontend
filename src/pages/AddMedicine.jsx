import { useState } from "react";
import API from "../api/api";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap');
  
  .am-main { padding: 36px 40px; max-width: 1400px; margin: 0 auto; font-family: 'DM Sans', sans-serif; }
  .am-header { margin-bottom: 30px; }
  .am-title { font-family: 'Playfair Display', serif; font-size: 32px; color: #0D6E4F; margin: 0; }
  .am-subtitle { color: #6b7280; font-size: 14px; margin-top: 5px; }
  
  .am-layout { display: grid; grid-template-columns: 1fr 380px; gap: 28px; align-items: start; }
  
  .am-card { 
    background: #fff; border: 1.5px solid #e5e7eb; border-radius: 20px; 
    padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.02);
  }

  .am-section-title { 
    font-size: 13px; font-weight: 700; color: #0D6E4F; 
    margin: 24px 0 16px; text-transform: uppercase; letter-spacing: 1px;
    display: flex; align-items: center; gap: 8px;
  }
  .am-section-title::after { content: ""; flex: 1; height: 1px; background: #f0fdf6; }

  .am-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
  .am-row3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 20px; }

  .am-input-group { display: flex; flex-direction: column; gap: 8px; }
  .am-label { font-size: 12.5px; font-weight: 600; color: #374151; display: flex; align-items: center; gap: 6px; }
  
  .am-input { 
    width: 100%; box-sizing: border-box; padding: 12px 16px; border: 1.5px solid #e5e7eb; 
    borderRadius: 12px; font-size: 14px; color: #111827; background: #fff; outline: none; 
    transition: all 0.2s; 
  }
  .am-input:focus { border-color: #0D6E4F; box-shadow: 0 0 0 4px rgba(13,110,79,0.1); }

  .am-sidebar { position: sticky; top: 100px; display: flex; flex-direction: column; gap: 20px; }
  .am-tip-card { 
    background: #fff; border: 1.5px solid #e5e7eb; border-radius: 16px; padding: 20px;
  }

  .am-submit-btn {
    width: 100%; padding: 14px; margin-top: 10px; border: none; border-radius: 12px;
    background: linear-gradient(135deg, #0D6E4F, #16a34a); color: white;
    font-weight: 600; font-size: 15px; cursor: pointer; transition: transform 0.2s, opacity 0.2s;
    box-shadow: 0 4px 12px rgba(13,110,79,0.2);
  }
  .am-submit-btn:hover { transform: translateY(-1px); opacity: 0.95; }
  .am-submit-btn:disabled { background: #9ca3af; cursor: not-allowed; transform: none; }

  @media (max-width: 1024px) {
    .am-layout { grid-template-columns: 1fr; }
    .am-sidebar { position: static; }
  }
`;

function AddMedicine() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [unitName, setUnitName] = useState("");
  const [packName, setPackName] = useState("");
  const [cartonName, setCartonName] = useState("");
  const [unitsPerPack, setUnitsPerPack] = useState("");
  const [packsPerCarton, setPacksPerCarton] = useState("");
  const [stockUnits, setStockUnits] = useState("");
  const [strength, setStrength] = useState("");
const [form, setForm] = useState("");

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const token = localStorage.getItem("token");

  const categories = ["Antibiotic", "Analgesic", "Antiviral", "Antifungal", "Vitamin", "Supplement", "Other"];
  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 4000); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/medicines", {
  name,
  description,
  category,
  price,

  unit_name: unitName,
  pack_name: packName,
  carton_name: cartonName,
  units_per_pack: unitsPerPack,
  packs_per_carton: packsPerCarton,
  stock_units: stockUnits,

  // ✅ ADD THESE TWO
  strength,
  form

}, {
  headers: { Authorization: `Bearer ${token}` }
});

      showToast("Medicine added successfully!");
      setName(""); setDescription(""); setCategory(""); setPrice("");
      setUnitName(""); setPackName(""); setCartonName("");
      setUnitsPerPack(""); setPacksPerCarton(""); setStockUnits("");
    } catch (e) {
      showToast("Failed to add medicine. Please check inputs.", "error");
    } finally { setLoading(false); }
  };

  return (
    <div className="am-main">
      <style>{CSS}</style>

      <div className="am-header">
        <h1 className="am-title">Add New Medicine</h1>
        <p className="am-subtitle">Register new stock and define packaging ratios for the inventory</p>
      </div>

      <div className="am-layout">
        <div className="am-card">
          {toast && (
            <div style={{ 
              background: toast.type === "success" ? "#f0fdf6" : "#fef2f2", 
              border: `1.5px solid ${toast.type === "success" ? "#bbf7d0" : "#fecaca"}`,
              padding: "14px", borderRadius: "12px", marginBottom: "24px", color: toast.type === "success" ? "#14532d" : "#dc2626",
              fontSize: "14px", fontWeight: 500
            }}>
              {toast.type === "success" ? "✅ " : "⚠️ "} {toast.msg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="am-section-title">General Information</div>
            <div className="am-row">
              <div className="am-input-group">
                <label className="am-label"><span>💊</span> Medicine Name</label>
                <input className="am-input" placeholder="e.g. Paracetamol 500mg" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="am-input-group">
                <label className="am-label"><span>🏷️</span> Category</label>
                <select className="am-input" value={category} onChange={e => setCategory(e.target.value)} required>
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="am-input-group" style={{ marginBottom: "20px" }}>
              <label className="am-label"><span>📝</span> Description</label>
              <textarea className="am-input" style={{ minHeight: "80px", resize: "vertical" }} placeholder="Briefly describe the medicine usage..." value={description} onChange={e => setDescription(e.target.value)} />
            </div>

            <div className="am-row">
  <div className="am-input-group">
    <label className="am-label"><span>⚗️</span> Strength</label>
    <input
      className="am-input"
      placeholder="e.g. 500mg"
      value={strength}
      onChange={e => setStrength(e.target.value)}
    />
  </div>

  <div className="am-input-group">
    <label className="am-label"><span>🧪</span> Form</label>
    <select
      className="am-input"
      value={form}
      onChange={e => setForm(e.target.value)}
    >
      <option value="">Select Form</option>
      <option value="tablet">Tablet</option>
      <option value="capsule">Capsule</option>
      <option value="syrup">Syrup</option>
      <option value="injection">Injection</option>
      <option value="cream">Cream</option>
    </select>
  </div>
</div>

            <div className="am-section-title">Packaging Hierarchy</div>
            <div className="am-row3">
              <div className="am-input-group">
                <label className="am-label"><span>🔹</span> Unit (Smallest)</label>
                <input className="am-input" placeholder="e.g. Tablet" value={unitName} onChange={e => setUnitName(e.target.value)} required />
              </div>
              <div className="am-input-group">
                <label className="am-label"><span>📦</span> Pack Type</label>
                <input className="am-input" placeholder="e.g. Strip" value={packName} onChange={e => setPackName(e.target.value)} />
              </div>
              <div className="am-input-group">
                <label className="am-label"><span>🚚</span> Bulk Type</label>
                <input className="am-input" placeholder="e.g. Carton" value={cartonName} onChange={e => setCartonName(e.target.value)} />
              </div>
            </div>

            <div className="am-row3">
              <div className="am-input-group">
                <label className="am-label"><span>🔢</span> Units per Pack</label>
                <input type="number" className="am-input" placeholder="0" value={unitsPerPack} onChange={e => setUnitsPerPack(e.target.value)} />
              </div>
              <div className="am-input-group">
                <label className="am-label"><span>🔄</span> Packs per Carton</label>
                <input type="number" className="am-input" placeholder="0" value={packsPerCarton} onChange={e => setPacksPerCarton(e.target.value)} />
              </div>
              <div className="am-input-group">
                <label className="am-label"><span>📊</span> Total Units In Stock</label>
                <input type="number" className="am-input" style={{ background: "#f9fafb" }} placeholder="Total individual units" value={stockUnits} onChange={e => setStockUnits(e.target.value)} required />
              </div>
            </div>

            <div className="am-section-title">Financials</div>
            <div style={{ maxWidth: "250px" }}>
              <div className="am-input-group">
                <label className="am-label"><span>💰</span> Price per Unit (₦)</label>
                <input type="number" step="0.01" className="am-input" placeholder="0.00" value={price} onChange={e => setPrice(e.target.value)} required />
              </div>
            </div>

            <button type="submit" disabled={loading} className="am-submit-btn">
              {loading ? "Registering Medicine..." : "➕ Add to Inventory"}
            </button>
          </form>
        </div>

        <div className="am-sidebar">
          <div className="am-tip-card">
            <h3 style={{ margin: "0 0 15px", fontSize: "16px", color: "#111827" }}>📋 Entry Rules</h3>
            <ul style={{ padding: 0, margin: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
              <li style={{ fontSize: "13px", color: "#4b5563", display: "flex", gap: "8px" }}>
                <span style={{ color: "#0D6E4F" }}>✔</span> <strong>Units:</strong> Always stock by individual count (e.g., total tablets).
              </li>
              <li style={{ fontSize: "13px", color: "#4b5563", display: "flex", gap: "8px" }}>
                <span style={{ color: "#0D6E4F" }}>✔</span> <strong>Ratios:</strong> Ensure units/pack and packs/carton are accurate for wholesale math.
              </li>
              <li style={{ fontSize: "13px", color: "#4b5563", display: "flex", gap: "8px" }}>
                <span style={{ color: "#0D6E4F" }}>✔</span> <strong>Pricing:</strong> Set price for a single unit.
              </li>
            </ul>
          </div>

          <div style={{ background: "linear-gradient(135deg, #f0fdf6, #dcfce7)", border: "1.5px solid #bbf7d0", padding: "20px", borderRadius: "16px" }}>
            <h4 style={{ margin: "0 0 5px", color: "#14532d", fontSize: "14px" }}>💡 Smart Inventory</h4>
            <p style={{ margin: 0, fontSize: "12.5px", color: "#166534", lineHeight: 1.5 }}>
              Once added, the system will automatically calculate pack availability based on your ratios during order creation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddMedicine;