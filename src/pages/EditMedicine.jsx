import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap');
  .em-main { padding: 36px 40px; max-width: 1280px; margin: 0 auto; }
  .em-title { font-size: 30px; }
  .em-layout { display: grid; grid-template-columns: 1fr 300px; gap: 22px; align-items: start; }
  .em-info { display: flex; flex-direction: column; gap: 14px; position: sticky; top: 80px; }
  .em-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0 16px; }
  .em-actions { display: flex; gap: 10px; flex-wrap: wrap; }
  @media (max-width: 768px) {
    .em-main { padding: 14px; }
    .em-title { font-size: 22px; }
    .em-layout { grid-template-columns: 1fr; }
    .em-info { display: none; }
    .em-row2 { grid-template-columns: 1fr; }
    .em-actions button { flex: 1; }
  }
  @media (min-width: 769px) and (max-width: 1024px) {
    .em-main { padding: 24px; }
    .em-layout { grid-template-columns: 1fr; }
    .em-info { display: none; }
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

function EditMedicine() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:"", description:"", category:"", price:"", stock:"" });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [toast, setToast] = useState(null);
  const token = localStorage.getItem("token");
  const categories = ["Antibiotic","Analgesic","Antiviral","Antifungal","Vitamin","Supplement","Other"];

  useEffect(() => {
    const load = async () => {
      try {
        const r = await API.get(`/medicines/${id}`,{headers:{Authorization:`Bearer ${token}`}});
        const m = r.data;
        setForm({ name:m.name, description:m.description||"", category:m.category, price:m.price, stock:m.stock_quantity });
      } catch(e) { console.log(e); } finally { setFetching(false); }
    };
    load();
  }, []);

  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const showToast = (msg,type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null),4000); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await API.put(`/medicines/${id}`,{name:form.name,description:form.description,category:form.category,price:form.price,stock_quantity:form.stock},{headers:{Authorization:`Bearer ${token}`}});
      showToast("Updated successfully!");
    } catch(e) { console.log(e); showToast("Update failed. Please try again.","error"); } finally { setLoading(false); }
  };

  const selectStyle = { ...iBase, cursor:"pointer", appearance:"none", WebkitAppearance:"none", backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat:"no-repeat", backgroundPosition:"right 14px center", paddingRight:"36px" };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(145deg,#f0fdf6 0%,#f8fafc 60%,#eff6ff 100%)", fontFamily:"'DM Sans',sans-serif" }}>
      <style>{CSS}</style>
      <main className="em-main">
        <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"16px" }}>
          <button onClick={()=>navigate(-1)} style={{ background:"none", border:"none", cursor:"pointer", color:"#6b7280", fontSize:"13.5px", fontWeight:500, fontFamily:"'DM Sans',sans-serif", padding:0 }}>← Back</button>
          <span style={{ color:"#d1d5db" }}>›</span>
          <span style={{ fontSize:"13.5px", color:"#0D6E4F", fontWeight:600 }}>Edit Medicine</span>
        </div>
        <div style={{ marginBottom:"22px" }}>
          <h1 className="em-title" style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, color:"#0D6E4F", margin:0 }}>Edit Medicine</h1>
          <p style={{ margin:"5px 0 0", fontSize:"13px", color:"#6b7280" }}>{fetching?"Loading…":`Editing: ${form.name}`}</p>
        </div>

        {fetching
          ? <div style={{ background:"#fff", borderRadius:"16px", border:"1.5px solid #e5e7eb", padding:"60px", textAlign:"center", color:"#9ca3af" }}><div style={{ fontSize:"28px", marginBottom:"10px" }}>⏳</div>Loading…</div>
          : (
            <div className="em-layout">
              <div style={{ background:"#fff", borderRadius:"16px", border:"1.5px solid #e5e7eb", padding:"24px 28px", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
                <div style={{ display:"inline-flex", alignItems:"center", gap:"6px", background:"#f0fdf6", border:"1.5px solid #bbf7d0", borderRadius:"8px", padding:"5px 12px", marginBottom:"18px" }}>
                  <span style={{ fontSize:"12px", fontWeight:600, color:"#14532d", fontFamily:"'DM Sans',sans-serif" }}>🆔 Medicine ID: {id}</span>
                </div>
                {toast && <div style={{ background:toast.type==="success"?"#f0fdf6":"#fef2f2", border:`1.5px solid ${toast.type==="success"?"#bbf7d0":"#fecaca"}`, borderRadius:"10px", padding:"11px 14px", marginBottom:"18px", fontSize:"13px", color:toast.type==="success"?"#14532d":"#dc2626", fontWeight:500 }}>{toast.type==="success"?"✅":"⚠️"} {toast.msg}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="em-row2">
                    <Field label="Medicine Name" icon="💊"><input value={form.name} onChange={e=>set("name",e.target.value)} required style={iBase} onFocus={onFocus} onBlur={onBlur} /></Field>
                    <Field label="Category" icon="🏷️"><select value={form.category} onChange={e=>set("category",e.target.value)} required style={selectStyle} onFocus={onFocus} onBlur={onBlur}><option value="">Select…</option>{categories.map(c=><option key={c} value={c}>{c}</option>)}</select></Field>
                  </div>
                  <Field label="Description" icon="📝"><textarea value={form.description} onChange={e=>set("description",e.target.value)} rows={3} style={{...iBase,resize:"vertical",minHeight:"80px",lineHeight:1.6}} onFocus={onFocus} onBlur={onBlur} /></Field>
                  <div className="em-row2">
                    <Field label="Price (₦)" icon="💰">
                      <div style={{ position:"relative" }}>
                        <span style={{ position:"absolute", left:"13px", top:"50%", transform:"translateY(-50%)", fontSize:"13px", fontWeight:600, color:"#6b7280", pointerEvents:"none" }}>₦</span>
                        <input type="number" value={form.price} min="0" step="0.01" required onChange={e=>set("price",e.target.value)} style={{...iBase,paddingLeft:"28px"}} onFocus={onFocus} onBlur={onBlur} />
                      </div>
                    </Field>
                    <Field label="Stock Quantity" icon="📦"><input type="number" value={form.stock} min="0" required onChange={e=>set("stock",e.target.value)} style={iBase} onFocus={onFocus} onBlur={onBlur} /></Field>
                  </div>
                  <div className="em-actions">
                    <button type="submit" disabled={loading} style={{ padding:"12px 24px", background:loading?"#9ca3af":"linear-gradient(135deg,#0D6E4F,#16a34a)", border:"none", borderRadius:"10px", color:"white", fontSize:"14px", fontWeight:600, fontFamily:"'DM Sans',sans-serif", cursor:loading?"not-allowed":"pointer", boxShadow:loading?"none":"0 4px 14px rgba(13,110,79,0.3)" }}>{loading?"Saving…":"💾 Save Changes"}</button>
                    <button type="button" onClick={()=>navigate(-1)} style={{ padding:"12px 20px", background:"#fff", border:"1.5px solid #e5e7eb", borderRadius:"10px", color:"#374151", fontSize:"14px", fontWeight:600, fontFamily:"'DM Sans',sans-serif", cursor:"pointer" }}>Cancel</button>
                  </div>
                </form>
              </div>
              <div className="em-info">
                <div style={{ background:"#fff", borderRadius:"16px", border:"1.5px solid #e5e7eb", padding:"20px", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
                  <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"15px", fontWeight:700, color:"#111827", margin:"0 0 14px" }}>🔍 Current Values</h3>
                  {[["Name",form.name||"—"],["Category",form.category||"—"],["Price",form.price?`₦${Number(form.price).toLocaleString()}`:"—"],["Stock",form.stock!==""?`${form.stock} units`:"—"]].map(([l,v])=>(
                    <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid #f3f4f6" }}>
                      <span style={{ fontSize:"12px", color:"#6b7280", fontWeight:500 }}>{l}</span>
                      <span style={{ fontSize:"12.5px", color:"#111827", fontWeight:600, maxWidth:"150px", textAlign:"right", wordBreak:"break-word" }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ marginTop:"12px" }}>
                    <div style={{ fontSize:"11px", color:"#6b7280", marginBottom:"5px", fontWeight:500 }}>Stock Level</div>
                    <div style={{ background:"#f3f4f6", borderRadius:"99px", height:"7px", overflow:"hidden" }}>
                      <div style={{ height:"100%", borderRadius:"99px", width:`${Math.min(100,(Number(form.stock)/100)*100)}%`, background:Number(form.stock)===0?"#ef4444":Number(form.stock)<=10?"#f59e0b":"linear-gradient(90deg,#0D6E4F,#4ADE80)", transition:"width 0.4s" }} />
                    </div>
                    <div style={{ fontSize:"11px", color:Number(form.stock)===0?"#dc2626":Number(form.stock)<=10?"#92400e":"#14532d", fontWeight:600, marginTop:"4px" }}>{Number(form.stock)===0?"Out of Stock":Number(form.stock)<=10?"Low Stock":"In Stock"}</div>
                  </div>
                </div>
                <div style={{ background:"linear-gradient(135deg,#fff7ed,#ffedd5)", borderRadius:"16px", border:"1.5px solid #fed7aa", padding:"18px" }}>
                  <div style={{ fontSize:"20px", marginBottom:"6px" }}>⚠️</div>
                  <div style={{ fontSize:"12.5px", fontWeight:600, color:"#9a3412", marginBottom:"3px" }}>Be careful when editing</div>
                  <div style={{ fontSize:"12px", color:"#c2410c", lineHeight:1.6 }}>Price or stock changes immediately affect orders and the dashboard.</div>
                </div>
              </div>
            </div>
          )}
      </main>
    </div>
  );
}
export default EditMedicine;