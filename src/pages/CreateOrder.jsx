import { useEffect, useState } from "react";
import API from "../api/api";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap');
  .co-main { padding: 36px 40px; max-width: 1400px; margin: 0 auto; }
  .co-title { font-size: 30px; }
  .co-layout { display: grid; grid-template-columns: 1fr 320px; gap: 22px; align-items: start; }
  .co-cart { position: sticky; top: 80px; }
  .co-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px,1fr)); gap: 14px; }
  .co-search { display: flex; gap: 8px; align-items: center; }
  @media (max-width: 768px) {
    .co-main { padding: 14px; }
    .co-title { font-size: 22px; }
    .co-layout { grid-template-columns: 1fr; }
    .co-cart { position: static; order: -1; }
    .co-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
    .co-search { flex-wrap: wrap; }
  }
  @media (min-width: 769px) and (max-width: 1100px) {
    .co-main { padding: 24px; }
    .co-layout { grid-template-columns: 1fr 280px; }
    .co-grid { grid-template-columns: repeat(3,1fr); }
  }
`;

function StockBadge({ qty }) {
  if (qty===0)   return <span style={{ padding:"3px 8px", borderRadius:"99px", fontSize:"11px", fontWeight:600, background:"#fee2e2", color:"#dc2626" }}>✖ Out</span>;
  if (qty<=10)   return <span style={{ padding:"3px 8px", borderRadius:"99px", fontSize:"11px", fontWeight:600, background:"#fef9c3", color:"#92400e" }}>⚠ Low</span>;
  return               <span style={{ padding:"3px 8px", borderRadius:"99px", fontSize:"11px", fontWeight:600, background:"#dcfce7", color:"#14532d" }}>✓ In Stock</span>;
}

function MedCard({ med, onAdd, inCart }) {
  const out = med.stock_quantity === 0;
  return (
    <div style={{ background:inCart?"#f0fdf6":"#fff", border:`1.5px solid ${inCart?"#86efac":"#e5e7eb"}`, borderRadius:"13px", padding:"14px", display:"flex", flexDirection:"column", gap:"10px", boxShadow:"0 1px 4px rgba(0,0,0,0.05)", opacity:out?0.6:1, position:"relative", transition:"border-color 0.15s" }}>
      {inCart && <div style={{ position:"absolute", top:"9px", right:"9px", width:"18px", height:"18px", borderRadius:"50%", background:"#16a34a", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"9px", color:"white", fontWeight:700 }}>✓</div>}
      <div>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"14px", fontWeight:700, color:"#111827", marginBottom:"3px" }}>{med.name}</div>
        <div style={{ fontSize:"11.5px", color:"#6b7280", lineHeight:1.4, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{med.description||"No description"}</div>
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"16px", fontWeight:700, color:"#0D6E4F" }}>₦{Number(med.price).toLocaleString()}</div>
        <StockBadge qty={med.stock_quantity} />
      </div>
      <button onClick={() => onAdd(med)} disabled={out||inCart} style={{ width:"100%", padding:"8px", background:inCart?"#dcfce7":out?"#f3f4f6":"linear-gradient(135deg,#0D6E4F,#16a34a)", border:"none", borderRadius:"8px", color:inCart?"#14532d":out?"#9ca3af":"white", fontSize:"12.5px", fontWeight:600, fontFamily:"'DM Sans',sans-serif", cursor:out||inCart?"not-allowed":"pointer" }}>
        {inCart?"✓ Added":out?"Unavailable":"+ Add to Cart"}
      </button>
    </div>
  );
}

function CreateOrder() {
  const [medicines, setMedicines] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const token = localStorage.getItem("token");
  const user  = JSON.parse(localStorage.getItem("user"));

  useEffect(() => { fetchMedicines(); }, []);

  const showToast = (msg, type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null), 4000); };
  const fetchMedicines = async () => { try { const r = await API.get("/medicines",{headers:{Authorization:`Bearer ${token}`}}); setMedicines(r.data); } catch(e){console.log(e);} };
  const searchMedicine = async () => { try { const r = await API.get(`/medicines/search?q=${search}`,{headers:{Authorization:`Bearer ${token}`}}); setMedicines(r.data); } catch(e){console.log(e);} };
  const addToCart = (m) => { if (cart.find(i=>i.id===m.id)) return; setCart([...cart,{...m,quantity:1}]); };
  const updateQty = (id,q) => setCart(cart.map(i=>i.id===id?{...i,quantity:Math.max(1,Number(q))}:i));
  const removeFromCart = (id) => setCart(cart.filter(i=>i.id!==id));
  const total = cart.reduce((s,i)=>s+Number(i.price)*i.quantity,0);
  const cartIds = new Set(cart.map(i=>i.id));

  const placeOrder = async () => {
    setLoading(true);
    try {
      await API.post("/orders",{customer_id:user.id,items:cart.map(i=>({medicine_id:i.id,quantity:i.quantity,price:i.price}))},{headers:{Authorization:`Bearer ${token}`}});
      setCart([]); showToast("Order placed successfully!");
    } catch(e) { console.log(e); showToast("Order failed. Please try again.","error"); } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(145deg,#f0fdf6 0%,#f8fafc 60%,#eff6ff 100%)", fontFamily:"'DM Sans',sans-serif" }}>
      <style>{CSS}</style>
      <main className="co-main">
        <div style={{ marginBottom:"22px" }}>
          <h1 className="co-title" style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, color:"#0D6E4F", margin:0 }}>Create Order</h1>
          <p style={{ margin:"5px 0 0", fontSize:"13px", color:"#6b7280" }}>Browse medicines, build your cart, and place the order</p>
        </div>
        <div className="co-layout">
          {/* Medicines side */}
          <div>
            <div style={{ background:"#fff", borderRadius:"12px", border:"1.5px solid #e5e7eb", padding:"12px 14px", marginBottom:"16px" }}>
              <div className="co-search">
                <div style={{ position:"relative", flex:1, minWidth:"120px" }}>
                  <span style={{ position:"absolute", left:"11px", top:"50%", transform:"translateY(-50%)", fontSize:"14px", pointerEvents:"none" }}>🔍</span>
                  <input placeholder="Search medicine…" value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&searchMedicine()}
                    style={{ width:"100%", boxSizing:"border-box", padding:"10px 14px 10px 36px", border:"1.5px solid #e5e7eb", borderRadius:"8px", fontSize:"13.5px", fontFamily:"'DM Sans',sans-serif", outline:"none", background:"#f9fafb" }}
                    onFocus={e=>{e.target.style.borderColor="#0D6E4F";e.target.style.background="#fff";}} onBlur={e=>{e.target.style.borderColor="#e5e7eb";e.target.style.background="#f9fafb";}} />
                </div>
                <button onClick={searchMedicine} style={{ padding:"10px 16px", background:"linear-gradient(135deg,#0D6E4F,#16a34a)", border:"none", borderRadius:"8px", color:"white", fontSize:"13px", fontWeight:600, fontFamily:"'DM Sans',sans-serif", cursor:"pointer", whiteSpace:"nowrap" }}>Search</button>
                <button onClick={()=>{setSearch("");fetchMedicines();}} style={{ padding:"10px 12px", background:"#f3f4f6", border:"1.5px solid #e5e7eb", borderRadius:"8px", color:"#6b7280", fontSize:"13px", fontWeight:600, fontFamily:"'DM Sans',sans-serif", cursor:"pointer" }}>Reset</button>
              </div>
            </div>
            <div className="co-grid">
              {medicines.length===0
                ? <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"50px 0", color:"#9ca3af" }}>No medicines found</div>
                : medicines.map(m=><MedCard key={m.id} med={m} onAdd={addToCart} inCart={cartIds.has(m.id)} />)}
            </div>
          </div>

          {/* Cart side */}
          <div className="co-cart" style={{ background:"#fff", borderRadius:"16px", border:"1.5px solid #e5e7eb", overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.05)" }}>
            <div style={{ padding:"14px 18px", borderBottom:"1.5px solid #f3f4f6", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"17px", fontWeight:700, color:"#111827", margin:0 }}>🛒 Cart</h3>
              {cart.length>0 && <span style={{ background:"#0D6E4F", color:"white", borderRadius:"99px", padding:"2px 8px", fontSize:"12px", fontWeight:700 }}>{cart.length}</span>}
            </div>
            {toast && <div style={{ margin:"10px 14px 0", background:toast.type==="success"?"#f0fdf6":"#fef2f2", border:`1.5px solid ${toast.type==="success"?"#bbf7d0":"#fecaca"}`, borderRadius:"8px", padding:"9px 12px", fontSize:"12.5px", color:toast.type==="success"?"#14532d":"#dc2626", fontWeight:500 }}>{toast.type==="success"?"✅":"⚠️"} {toast.msg}</div>}
            <div style={{ maxHeight:"380px", overflowY:"auto", padding:"10px 14px" }}>
              {cart.length===0
                ? <div style={{ textAlign:"center", padding:"36px 16px", color:"#9ca3af" }}><div style={{ fontSize:"32px", marginBottom:"8px" }}>🛒</div><div style={{ fontSize:"13px" }}>Cart is empty</div></div>
                : cart.map(item => (
                  <div key={item.id} style={{ display:"flex", alignItems:"center", gap:"8px", padding:"8px 0", borderBottom:"1px solid #f3f4f6" }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:"13px", fontWeight:600, color:"#111827", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.name}</div>
                      <div style={{ fontSize:"11.5px", color:"#0D6E4F", fontWeight:600 }}>₦{(Number(item.price)*item.quantity).toLocaleString()}</div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:"3px" }}>
                      <button onClick={()=>updateQty(item.id,item.quantity-1)} disabled={item.quantity<=1} style={{ width:"24px", height:"24px", borderRadius:"5px", border:"1.5px solid #e5e7eb", background:"#f9fafb", cursor:item.quantity<=1?"not-allowed":"pointer", fontSize:"13px", fontWeight:700, color:"#374151" }}>−</button>
                      <span style={{ width:"24px", textAlign:"center", fontSize:"13px", fontWeight:700 }}>{item.quantity}</span>
                      <button onClick={()=>updateQty(item.id,item.quantity+1)} style={{ width:"24px", height:"24px", borderRadius:"5px", border:"1.5px solid #e5e7eb", background:"#f9fafb", cursor:"pointer", fontSize:"13px", fontWeight:700, color:"#374151" }}>+</button>
                    </div>
                    <button onClick={()=>removeFromCart(item.id)} style={{ background:"none", border:"none", cursor:"pointer", color:"#f87171", fontSize:"15px", padding:"0 2px" }}>✕</button>
                  </div>
                ))}
            </div>
            {cart.length>0 && (
              <div style={{ padding:"14px 18px", borderTop:"1.5px solid #f3f4f6" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px" }}>
                  <span style={{ fontSize:"12.5px", color:"#6b7280", fontWeight:500 }}>Total</span>
                  <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"20px", fontWeight:700, color:"#0D6E4F" }}>₦{total.toLocaleString()}</span>
                </div>
                <button onClick={placeOrder} disabled={loading} style={{ width:"100%", padding:"12px", background:loading?"#9ca3af":"linear-gradient(135deg,#0D6E4F,#16a34a)", border:"none", borderRadius:"10px", color:"white", fontSize:"14px", fontWeight:600, fontFamily:"'DM Sans',sans-serif", cursor:loading?"not-allowed":"pointer", boxShadow:loading?"none":"0 4px 14px rgba(13,110,79,0.3)" }}>
                  {loading?"Placing…":"Place Order →"}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
export default CreateOrder;