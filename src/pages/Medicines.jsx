import { useEffect, useState } from "react";
import API from "../api/api";
import MedicineCard from "../components/MedicineCard";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap');
  .med-main { padding: 36px 40px; max-width: 1400px; margin: 0 auto; }
  .med-title { font-size: 30px; }
  .med-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
  .med-pills { display: flex; gap: 10px; margin-bottom: 18px; flex-wrap: wrap; }
  .med-search { display: flex; gap: 8px; align-items: center; flex-wrap: nowrap; }
  .med-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px,1fr)); gap: 16px; }
  @media (max-width: 640px) {
    .med-main { padding: 14px; }
    .med-title { font-size: 22px; }
    .med-search { flex-wrap: wrap; }
    .med-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
  }
  @media (min-width: 641px) and (max-width: 1024px) {
    .med-main { padding: 24px; }
    .med-grid { grid-template-columns: repeat(3, 1fr); }
  }
`;

function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Parse the user details safely from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const currentToken = localStorage.getItem("token");
    
    // 🛑 GUARD: If no token exists (e.g., just logged out), stop immediately!
    if (!currentToken) {
      setLoading(false);
      return;
    }
    
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    const token = localStorage.getItem("token");
    
    // 🛑 GUARD: Do not ping backend if token is gone
    if (!token) return;

    setLoading(true);
    try { 
      const res = await API.get("/medicines", { 
        headers: { Authorization: `Bearer ${token}` } 
      }); 
      setMedicines(res.data); 
    }
    catch (err) { 
      console.log(err); 
    } finally { 
      setLoading(false); 
    }
  };

  const searchMedicine = async () => {
    const token = localStorage.getItem("token");
    
    // 🛑 GUARD: Do not ping backend if token is gone
    if (!token) return;

    setLoading(true);
    try { 
      const res = await API.get(`/medicines/search?q=${search}`, { 
        headers: { Authorization: `Bearer ${token}` } 
      }); 
      setMedicines(res.data); 
    }
    catch (err) { 
      console.log(err); 
    } finally { 
      setLoading(false); 
    }
  };

  const deleteMedicine = async (id) => {
    const token = localStorage.getItem("token");
    
    // 🛑 GUARD: Prevent delete attempt if unauthorized
    if (!token) {
      alert("You must be logged in to delete items.");
      return;
    }

    try {
      await API.delete(`/medicines/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("Medicine deleted");
      fetchMedicines(); // Refresh the inventory list gracefully
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  const inStock    = medicines.filter(m => m.stock_units > 100).length;
const lowStock   = medicines.filter(m => m.stock_units > 0 && m.stock_units <= 100).length;
const outOfStock = medicines.filter(m => m.stock_units === 0).length;

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(145deg,#f0fdf6 0%,#f8fafc 60%,#eff6ff 100%)", fontFamily:"'DM Sans',sans-serif" }}>
      <style>{CSS}</style>
      <main className="med-main">
        <div className="med-header">
          <div>
            <h1 className="med-title" style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, color:"#0D6E4F", margin:0 }}>Medicines</h1>
            <p style={{ margin:"5px 0 0", fontSize:"13px", color:"#6b7280" }}>Manage your full medicine inventory</p>
          </div>
          {(user?.role==="admin"||user?.role==="inventory_manager") && (
            <a href="/add-medicine" style={{ display:"inline-flex", alignItems:"center", gap:"6px", padding:"10px 18px", background:"linear-gradient(135deg,#0D6E4F,#16a34a)", borderRadius:"10px", color:"white", fontSize:"13.5px", fontWeight:600, fontFamily:"'DM Sans',sans-serif", textDecoration:"none", boxShadow:"0 4px 14px rgba(13,110,79,0.25)", whiteSpace:"nowrap" }}>➕ Add Medicine</a>
          )}
        </div>

        <div className="med-pills">
          {[{l:"Total",v:medicines.length,bg:"#f0fdf6",bo:"#bbf7d0",c:"#14532d"},{l:"In Stock",v:inStock,bg:"#dcfce7",bo:"#86efac",c:"#166534"},{l:"Low Stock",v:lowStock,bg:"#fef9c3",bo:"#fde68a",c:"#854d0e"},{l:"Out of Stock",v:outOfStock,bg:"#fee2e2",bo:"#fca5a5",c:"#991b1b"}].map(s => (
            <div key={s.l} style={{ background:s.bg, border:`1.5px solid ${s.bo}`, borderRadius:"99px", padding:"5px 14px", display:"flex", alignItems:"center", gap:"7px" }}>
              <span style={{ fontSize:"12px", fontWeight:500, color:s.c }}>{s.l}</span>
              <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"14px", fontWeight:700, color:s.c }}>{s.v}</span>
            </div>
          ))}
        </div>

        <div style={{ background:"#fff", borderRadius:"12px", border:"1.5px solid #e5e7eb", padding:"12px 14px", marginBottom:"22px", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
          <div className="med-search">
            <div style={{ position:"relative", flex:1, minWidth:"160px" }}>
              <span style={{ position:"absolute", left:"11px", top:"50%", transform:"translateY(-50%)", fontSize:"14px", pointerEvents:"none" }}>🔍</span>
              <input placeholder="Search medicines…" value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key==="Enter"&&searchMedicine()}
                style={{ width:"100%", boxSizing:"border-box", padding:"10px 14px 10px 36px", border:"1.5px solid #e5e7eb", borderRadius:"8px", fontSize:"13.5px", fontFamily:"'DM Sans',sans-serif", outline:"none", background:"#f9fafb" }}
                onFocus={e=>{ e.target.style.borderColor="#0D6E4F"; e.target.style.background="#fff"; }} onBlur={e=>{ e.target.style.borderColor="#e5e7eb"; e.target.style.background="#f9fafb"; }} />
            </div>
            <button onClick={searchMedicine} style={{ padding:"10px 18px", background:"linear-gradient(135deg,#0D6E4F,#16a34a)", border:"none", borderRadius:"8px", color:"white", fontSize:"13px", fontWeight:600, fontFamily:"'DM Sans',sans-serif", cursor:"pointer", whiteSpace:"nowrap" }}>Search</button>
            <button onClick={() => { setSearch(""); fetchMedicines(); }} style={{ padding:"10px 14px", background:"#f3f4f6", border:"1.5px solid #e5e7eb", borderRadius:"8px", color:"#6b7280", fontSize:"13px", fontWeight:600, fontFamily:"'DM Sans',sans-serif", cursor:"pointer" }}>Reset</button>
          </div>
        </div>

        {loading
          ? <div style={{ textAlign:"center", padding:"60px 0", color:"#9ca3af" }}><div style={{ fontSize:"28px", marginBottom:"10px" }}>⏳</div>Loading medicines…</div>
          : medicines.length === 0
            ? <div style={{ textAlign:"center", padding:"60px 0", color:"#9ca3af" }}><div style={{ fontSize:"36px", marginBottom:"10px" }}>💊</div><div style={{ fontWeight:500 }}>No medicines found</div></div>
            : <div className="med-grid">{medicines.map(m => <MedicineCard key={m.id} med={m} user={user} deleteMedicine={deleteMedicine} />)}</div>
        }
      </main>
    </div>
  );
}
export default Medicines;