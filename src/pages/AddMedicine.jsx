import { useState } from "react";
import API from "../api/api";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap');
  .am-main { padding: 36px 40px; max-width: 1280px; margin: 0 auto; }
  .am-title { font-size: 30px; }
  .am-layout { display: grid; grid-template-columns: 1fr 300px; gap: 24px; align-items: start; }
  .am-tips { display: flex; flex-direction: column; gap: 14px; }
  .am-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0 16px; }
  .am-btn { width: auto; }
  @media (max-width: 768px) {
    .am-main { padding: 14px; }
    .am-title { font-size: 22px; }
    .am-layout { grid-template-columns: 1fr; }
    .am-tips { display: none; }
    .am-row2 { grid-template-columns: 1fr; }
    .am-btn { width: 100%; }
  }
  @media (min-width: 769px) and (max-width: 1024px) {
    .am-main { padding: 24px; }
    .am-layout { grid-template-columns: 1fr; }
    .am-tips { display: none; }
  }
`;

const iBase = { width:"100%", boxSizing:"border-box", padding:"11px 14px", border:"1.5px solid #e5e7eb", borderRadius:"10px", fontSize:"14px", color:"#111827", fontFamily:"'DM Sans',sans-serif", background:"#fff", outline:"none", transition:"border-color 0.15s, box-shadow 0.15s" };
const onFocus = e => { e.target.style.borderColor="#0D6E4F"; e.target.style.boxShadow="0 0 0 3px rgba(13,110,79,0.1)"; };
const onBlur  = e => { e.target.style.borderColor="#e5e7eb"; e.target.style.boxShadow="none"; };

function Field({ label, icon, children }) {
  return (
    <div style={{ marginBottom:"16px" }}>
      <label style={{ display:"flex", alignItems:"center", gap:"5px", fontSize:"12.5px", fontWeight:600, color:"#374151", marginBottom:"6px", fontFamily:"'DM Sans',sans-serif" }}><span>{icon}</span>{label}</label>
      {children}
    </div>
  );
}

function AddMedicine() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const token = localStorage.getItem("token");
  const categories = ["Antibiotic","Analgesic","Antiviral","Antifungal","Vitamin","Supplement","Other"];

  const showToast = (msg, type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null), 4000); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await API.post("/medicines",{name,description,category,price,stock_quantity:stock},{headers:{Authorization:`Bearer ${token}`}});
      showToast("Medicine added successfully!");
      setName(""); setDescription(""); setCategory(""); setPrice(""); setStock("");
    } catch(e) { console.log(e); showToast("Failed to add medicine. Please check your inputs.","error"); } finally { setLoading(false); }
  };

  const selectStyle = { ...iBase, cursor:"pointer", appearance:"none", WebkitAppearance:"none", backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat:"no-repeat", backgroundPosition:"right 14px center", paddingRight:"36px" };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(145deg,#f0fdf6 0%,#f8fafc 60%,#eff6ff 100%)", fontFamily:"'DM Sans',sans-serif" }}>
      <style>{CSS}</style>
      <main className="am-main">
        <div style={{ marginBottom:"24px" }}>
          <h1 className="am-title" style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, color:"#0D6E4F", margin:0 }}>Add Medicine</h1>
          <p style={{ margin:"5px 0 0", fontSize:"13px", color:"#6b7280" }}>Fill in the details to add a new medicine to inventory</p>
        </div>
        <div className="am-layout">
          <div style={{ background:"#fff", borderRadius:"16px", border:"1.5px solid #e5e7eb", padding:"24px 28px", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
            {toast && <div style={{ background:toast.type==="success"?"#f0fdf6":"#fef2f2", border:`1.5px solid ${toast.type==="success"?"#bbf7d0":"#fecaca"}`, borderRadius:"10px", padding:"11px 14px", marginBottom:"20px", fontSize:"13px", color:toast.type==="success"?"#14532d":"#dc2626", fontWeight:500 }}>{toast.type==="success"?"✅":"⚠️"} {toast.msg}</div>}
            <form onSubmit={handleSubmit}>
              <div className="am-row2">
                <Field label="Medicine Name" icon="💊"><input placeholder="e.g. Amoxicillin 500mg" value={name} onChange={e=>setName(e.target.value)} required style={iBase} onFocus={onFocus} onBlur={onBlur} /></Field>
                <Field label="Category" icon="🏷️"><select value={category} onChange={e=>setCategory(e.target.value)} required style={selectStyle} onFocus={onFocus} onBlur={onBlur}><option value="">Select category…</option>{categories.map(c=><option key={c} value={c}>{c}</option>)}</select></Field>
              </div>
              <Field label="Description" icon="📝"><textarea placeholder="Brief description…" value={description} onChange={e=>setDescription(e.target.value)} rows={3} style={{...iBase,resize:"vertical",minHeight:"80px",lineHeight:1.6}} onFocus={onFocus} onBlur={onBlur} /></Field>
              <div className="am-row2">
                <Field label="Price (₦)" icon="💰">
                  <div style={{ position:"relative" }}>
                    <span style={{ position:"absolute", left:"13px", top:"50%", transform:"translateY(-50%)", fontSize:"13px", fontWeight:600, color:"#6b7280", pointerEvents:"none" }}>₦</span>
                    <input type="number" placeholder="0.00" value={price} min="0" step="0.01" required onChange={e=>setPrice(e.target.value)} style={{...iBase,paddingLeft:"28px"}} onFocus={onFocus} onBlur={onBlur} />
                  </div>
                </Field>
                <Field label="Stock Quantity" icon="📦"><input type="number" placeholder="0" min="0" value={stock} required onChange={e=>setStock(e.target.value)} style={iBase} onFocus={onFocus} onBlur={onBlur} /></Field>
              </div>
              <button type="submit" disabled={loading} className="am-btn" style={{ padding:"12px 28px", background:loading?"#9ca3af":"linear-gradient(135deg,#0D6E4F,#16a34a)", border:"none", borderRadius:"10px", color:"white", fontSize:"14px", fontWeight:600, fontFamily:"'DM Sans',sans-serif", cursor:loading?"not-allowed":"pointer", boxShadow:loading?"none":"0 4px 14px rgba(13,110,79,0.3)" }}>
                {loading?"Adding…":"➕ Add Medicine"}
              </button>
            </form>
          </div>
          <div className="am-tips">
            <div style={{ background:"#fff", borderRadius:"16px", border:"1.5px solid #e5e7eb", padding:"20px", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"15px", fontWeight:700, color:"#111827", margin:"0 0 14px" }}>📋 Entry Guidelines</h3>
              {[["💊","Name","Include strength & dosage form"],["🏷️","Category","Choose the closest drug class"],["💰","Price","Set the unit selling price"],["📦","Stock","Current quantity on hand"]].map(([icon,title,tip])=>(
                <div key={title} style={{ display:"flex", gap:"10px", marginBottom:"12px" }}>
                  <div style={{ width:"28px", height:"28px", borderRadius:"7px", background:"#f0fdf6", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px", flexShrink:0 }}>{icon}</div>
                  <div><div style={{ fontSize:"12.5px", fontWeight:600, color:"#374151" }}>{title}</div><div style={{ fontSize:"11.5px", color:"#6b7280", marginTop:"1px" }}>{tip}</div></div>
                </div>
              ))}
            </div>
            <div style={{ background:"linear-gradient(135deg,#f0fdf6,#dcfce7)", borderRadius:"16px", border:"1.5px solid #bbf7d0", padding:"18px" }}>
              <div style={{ fontSize:"20px", marginBottom:"6px" }}>⚠️</div>
              <div style={{ fontSize:"12.5px", fontWeight:600, color:"#14532d", marginBottom:"3px" }}>Low Stock Alert</div>
              <div style={{ fontSize:"12px", color:"#166534", lineHeight:1.6 }}>Medicines below <strong>10 units</strong> appear in the Low Stock dashboard section.</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
export default AddMedicine;