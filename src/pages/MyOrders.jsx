import { useEffect, useState } from "react";
import API from "../api/api";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap');
  .mo-main { padding: 36px 40px; max-width: 860px; margin: 0 auto; }
  .mo-title { font-size: 30px; }
  .mo-filters { display: flex; gap: 6px; margin-bottom: 20px; flex-wrap: wrap; }
  .mo-card-header { padding: 13px 16px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; cursor: pointer; }
  .mo-card-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
  .mo-item-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: #f9fafb; border-radius: 9px; border: 1px solid #f3f4f6; }
  .mo-item-right { display: flex; gap: 16px; align-items: center; }
  @media (max-width: 640px) {
    .mo-main { padding: 14px; }
    .mo-title { font-size: 22px; }
    .mo-item-right { gap: 10px; }
  }
  @media (min-width: 641px) and (max-width: 1024px) {
    .mo-main { padding: 24px; }
  }
`;

function StatusBadge({ status }) {
  const m = { pending:{bg:"#fef9c3",c:"#854d0e",dot:"#f59e0b",l:"Pending"}, completed:{bg:"#dcfce7",c:"#14532d",dot:"#16a34a",l:"Completed"}, cancelled:{bg:"#fee2e2",c:"#7f1d1d",dot:"#dc2626",l:"Cancelled"}, processing:{bg:"#dbeafe",c:"#1e3a8a",dot:"#2563eb",l:"Processing"} };
  const s = m[status?.toLowerCase()] || { bg:"#f3f4f6", c:"#374151", dot:"#9ca3af", l:status };
  return <span style={{ display:"inline-flex", alignItems:"center", gap:"5px", padding:"4px 10px", borderRadius:"99px", fontSize:"12px", fontWeight:600, fontFamily:"'DM Sans',sans-serif", background:s.bg, color:s.c, whiteSpace:"nowrap" }}><span style={{ width:"6px", height:"6px", borderRadius:"50%", background:s.dot, flexShrink:0 }} />{s.l}</span>;
}

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);
  const total = order.order_items?.reduce((s,i)=>s+Number(i.price??0)*i.quantity,0);
  const itemCount = order.order_items?.reduce((s,i)=>s+i.quantity,0);
  return (
    <div style={{ background:"#fff", border:"1.5px solid #e5e7eb", borderRadius:"14px", overflow:"hidden", boxShadow:"0 2px 6px rgba(0,0,0,0.04)" }}>
      <div className="mo-card-header" onClick={()=>setExpanded(v=>!v)} style={{ background:expanded?"#fafafa":"#fff", borderBottom:expanded?"1.5px solid #f3f4f6":"none" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          <div style={{ width:"36px", height:"36px", borderRadius:"9px", background:"linear-gradient(135deg,#f0fdf6,#dcfce7)", border:"1.5px solid #bbf7d0", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"15px", flexShrink:0 }}>📦</div>
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"15px", fontWeight:700, color:"#111827" }}>Order #{order.id}</div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"12px", color:"#6b7280", marginTop:"1px" }}>{new Date(order.created_at).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})} · {itemCount} item{itemCount!==1?"s":""}</div>
          </div>
        </div>
        <div className="mo-card-right">
          <StatusBadge status={order.status} />
          {total>0 && <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"16px", fontWeight:700, color:"#0D6E4F" }}>₦{total.toLocaleString()}</div>}
          <span style={{ fontSize:"12px", color:"#9ca3af", transform:expanded?"rotate(180deg)":"rotate(0deg)", transition:"transform 0.2s", display:"inline-block" }}>▾</span>
        </div>
      </div>
      {expanded && (
        <div style={{ padding:"14px 18px 18px" }}>
          <div style={{ fontSize:"10.5px", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.8px", color:"#9ca3af", marginBottom:"10px", fontFamily:"'DM Sans',sans-serif" }}>Order Items</div>
          <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
            {order.order_items?.map(item => (
              <div key={item.id} className="mo-item-row">
                <div style={{ display:"flex", alignItems:"center", gap:"9px" }}>
                  <div style={{ width:"28px", height:"28px", borderRadius:"7px", background:"#f0fdf6", border:"1px solid #bbf7d0", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", flexShrink:0 }}>💊</div>
                  <div><div style={{ fontSize:"13px", fontWeight:600, color:"#111827" }}>{item.medicines?.name}</div>{item.medicines?.category&&<div style={{ fontSize:"11px", color:"#6b7280" }}>{item.medicines.category}</div>}</div>
                </div>
                <div className="mo-item-right">
                  <div style={{ textAlign:"center" }}><div style={{ fontSize:"10px", color:"#9ca3af", textTransform:"uppercase" }}>Qty</div><div style={{ fontSize:"13px", fontWeight:700, color:"#374151" }}>{item.quantity}</div></div>
                  {item.price && <div style={{ textAlign:"right" }}><div style={{ fontSize:"10px", color:"#9ca3af", textTransform:"uppercase" }}>Total</div><div style={{ fontFamily:"'Playfair Display',serif", fontSize:"13px", fontWeight:700, color:"#0D6E4F" }}>₦{(Number(item.price)*item.quantity).toLocaleString()}</div></div>}
                </div>
              </div>
            ))}
          </div>
          {total>0 && <div style={{ display:"flex", justifyContent:"flex-end", alignItems:"center", gap:"10px", marginTop:"14px", paddingTop:"12px", borderTop:"1.5px solid #f3f4f6" }}><span style={{ fontSize:"12.5px", color:"#6b7280", fontWeight:500 }}>Order Total</span><span style={{ fontFamily:"'Playfair Display',serif", fontSize:"20px", fontWeight:700, color:"#0D6E4F" }}>₦{total.toLocaleString()}</span></div>}
        </div>
      )}
    </div>
  );
}

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetch = async () => { setLoading(true); try { const r = await API.get("/orders/my-orders",{headers:{Authorization:`Bearer ${token}`}}); setOrders(r.data); } catch(e){console.log(e);} finally{setLoading(false);} };
    fetch();
  }, []);

  const statuses = ["all","pending","processing","completed","cancelled"];
  const filtered = filter==="all" ? orders : orders.filter(o=>o.status?.toLowerCase()===filter);
  const counts = statuses.reduce((a,k)=>{ a[k]=k==="all"?orders.length:orders.filter(o=>o.status?.toLowerCase()===k).length; return a; },{});
  const activeBg = { all:"#0D6E4F", pending:"#fef9c3", processing:"#dbeafe", completed:"#dcfce7", cancelled:"#fee2e2" };
  const activeCl = { all:"white", pending:"#854d0e", processing:"#1e3a8a", completed:"#14532d", cancelled:"#7f1d1d" };
  const activeBo = { all:"#0D6E4F", pending:"#fde68a", processing:"#bfdbfe", completed:"#86efac", cancelled:"#fca5a5" };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(145deg,#f0fdf6 0%,#f8fafc 60%,#eff6ff 100%)", fontFamily:"'DM Sans',sans-serif" }}>
      <style>{CSS}</style>
      <main className="mo-main">
        <div style={{ marginBottom:"22px" }}>
          <h1 className="mo-title" style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, color:"#0D6E4F", margin:0 }}>My Orders</h1>
          <p style={{ margin:"5px 0 0", fontSize:"13px", color:"#6b7280" }}>Track and review all your pharmacy orders</p>
        </div>
        <div className="mo-filters">
          {statuses.map(s=>{ const isA=filter===s; return (
            <button key={s} onClick={()=>setFilter(s)} style={{ padding:"6px 13px", borderRadius:"99px", border:`1.5px solid ${isA?activeBo[s]:"#e5e7eb"}`, background:isA?activeBg[s]:"#fff", color:isA?activeCl[s]:"#6b7280", fontSize:"12.5px", fontWeight:600, fontFamily:"'DM Sans',sans-serif", cursor:"pointer", display:"inline-flex", alignItems:"center", gap:"5px" }}>
              {s.charAt(0).toUpperCase()+s.slice(1)} <span style={{ background:isA?"rgba(0,0,0,0.12)":"#f3f4f6", color:isA?"inherit":"#9ca3af", borderRadius:"99px", padding:"0 6px", fontSize:"11px", fontWeight:700 }}>{counts[s]}</span>
            </button>
          );})}
        </div>
        {loading
          ? <div style={{ textAlign:"center", padding:"60px 0", color:"#9ca3af" }}><div style={{ fontSize:"28px", marginBottom:"10px" }}>⏳</div>Loading…</div>
          : filtered.length===0
            ? <div style={{ textAlign:"center", padding:"60px 0", color:"#9ca3af" }}><div style={{ fontSize:"36px", marginBottom:"10px" }}>📋</div><div style={{ fontWeight:500 }}>No orders found</div></div>
            : <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>{filtered.map(o=><OrderCard key={o.id} order={o} />)}</div>
        }
      </main>
    </div>
  );
}
export default MyOrders;