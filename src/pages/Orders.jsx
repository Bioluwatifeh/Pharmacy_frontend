import { useEffect, useState } from "react";
import API from "../api/api";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap');
  .ord-main { padding: 36px 40px; max-width: 960px; margin: 0 auto; }
  .ord-title { font-size: 30px; }
  .ord-filters { display: flex; gap: 6px; margin-bottom: 20px; flex-wrap: wrap; }
  .ord-meta { display: flex; align-items: center; gap: 14px; font-size: 12px; color: #6b7280; flex-wrap: wrap; }
  .ord-item-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: #f9fafb; border-radius: 9px; border: 1px solid #f3f4f6; }
  .ord-item-right { display: flex; gap: 16px; align-items: center; }
  @media (max-width: 640px) {
    .ord-main { padding: 14px; }
    .ord-title { font-size: 22px; }
    .ord-item-right { gap: 10px; }
  }
  @media (min-width: 641px) and (max-width: 1024px) {
    .ord-main { padding: 24px; }
  }
`;

const STATUS_CONFIG = {
  pending:{bg:"#fef9c3",c:"#854d0e",dot:"#f59e0b",l:"Pending"},
  preparing:{bg:"#dbeafe",c:"#1e3a8a",dot:"#2563eb",l:"Preparing"},
  ready_for_pickup:{bg:"#f0fdf6",c:"#14532d",dot:"#16a34a",l:"Ready for Pickup"},
  completed:{bg:"#f3f4f6",c:"#374151",dot:"#6b7280",l:"Completed"},
};

function StatusBadge({ status }) {
  const s = STATUS_CONFIG[status] || { bg:"#f3f4f6", c:"#374151", dot:"#9ca3af", l:status };
  return <span style={{ display:"inline-flex", alignItems:"center", gap:"5px", padding:"4px 10px", borderRadius:"99px", fontSize:"12px", fontWeight:600, fontFamily:"'DM Sans',sans-serif", background:s.bg, color:s.c, whiteSpace:"nowrap" }}><span style={{ width:"6px", height:"6px", borderRadius:"50%", background:s.dot, flexShrink:0 }} />{s.l}</span>;
}

function OrderCard({ order, updateStatus, deleteOrder }) {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);
  const total = order.order_items?.reduce((s,i)=>s+Number(i.price??0)*i.quantity,0);
  const itemCount = order.order_items?.reduce((s,i)=>s+i.quantity,0);
  const nextActions = { pending:[{label:"Mark Preparing",icon:"🔄",status:"preparing",bg:"#dbeafe",hov:"#bfdbfe",c:"#1e3a8a",bo:"#bfdbfe"}], preparing:[{label:"Mark Ready",icon:"✅",status:"ready_for_pickup",bg:"#dcfce7",hov:"#bbf7d0",c:"#14532d",bo:"#86efac"}], ready_for_pickup:[{label:"Mark Completed",icon:"📦",status:"completed",bg:"#f3f4f6",hov:"#e5e7eb",c:"#374151",bo:"#e5e7eb"}], completed:[] };
  const actions = nextActions[order.status] || [];
  const stripColor = { pending:"#f59e0b", preparing:"#3b82f6", ready_for_pickup:"#0D6E4F", completed:"#d1d5db" };

  return (
    <div style={{ background:"#fff", borderRadius:"14px", border:"1.5px solid #e5e7eb", overflow:"hidden", boxShadow:"0 2px 6px rgba(0,0,0,0.04)", opacity:updating?0.6:1, transition:"opacity 0.2s" }}>
      <div style={{ height:"3px", background:stripColor[order.status]||"#e5e7eb" }} />
      <div onClick={()=>setExpanded(v=>!v)} style={{ padding:"14px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"10px", cursor:"pointer", background:expanded?"#fafafa":"#fff" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          <div style={{ width:"36px", height:"36px", borderRadius:"9px", background:"#f0fdf6", border:"1.5px solid #bbf7d0", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"15px", flexShrink:0 }}>📋</div>
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"15px", fontWeight:700, color:"#111827" }}>Order #{order.id}</div>
            <div className="ord-meta">
              <span>📅 {new Date(order.created_at).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</span>
              {order.users?.name && <span>👤 {order.users.name}</span>}
              <span>💊 {itemCount} item{itemCount!==1?"s":""}</span>
            </div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <StatusBadge status={order.status} />
          {total>0 && <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"16px", fontWeight:700, color:"#0D6E4F" }}>₦{total.toLocaleString()}</div>}
          <span style={{ fontSize:"12px", color:"#9ca3af", transform:expanded?"rotate(180deg)":"rotate(0deg)", transition:"transform 0.2s", display:"inline-block" }}>▾</span>
        </div>
      </div>
      {expanded && (
        <div style={{ padding:"14px 18px 18px", borderTop:"1.5px solid #f3f4f6" }}>
          <div style={{ display:"flex", flexDirection:"column", gap:"6px", marginBottom:"14px" }}>
            {order.order_items?.map(item => (
              <div key={item.id} className="ord-item-row">
                <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                  <div style={{ width:"28px", height:"28px", borderRadius:"7px", background:"#f0fdf6", border:"1px solid #bbf7d0", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", flexShrink:0 }}>💊</div>
                  <div><div style={{ fontSize:"13px", fontWeight:600, color:"#111827" }}>{item.medicines?.name}</div>{item.medicines?.category&&<div style={{ fontSize:"11px", color:"#6b7280" }}>{item.medicines.category}</div>}</div>
                </div>
                <div className="ord-item-right">
                  <div style={{ textAlign:"center" }}><div style={{ fontSize:"10px", color:"#9ca3af", textTransform:"uppercase" }}>Qty</div><div style={{ fontSize:"13px", fontWeight:700, color:"#374151" }}>{item.quantity}</div></div>
                  {item.price && <div style={{ textAlign:"right" }}><div style={{ fontSize:"10px", color:"#9ca3af", textTransform:"uppercase" }}>Total</div><div style={{ fontFamily:"'Playfair Display',serif", fontSize:"13px", fontWeight:700, color:"#0D6E4F" }}>₦{(Number(item.price)*item.quantity).toLocaleString()}</div></div>}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"10px", paddingTop:"12px", borderTop:"1.5px solid #f3f4f6" }}>
            <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
              {actions.length>0 ? actions.map(a=>(
                <button key={a.status} onClick={async()=>{ setUpdating(true); await updateStatus(order.id,a.status); setUpdating(false); }}
                  style={{ display:"inline-flex", alignItems:"center", gap:"5px", padding:"7px 13px", background:a.bg, border:`1.5px solid ${a.bo}`, borderRadius:"8px", color:a.c, fontSize:"12.5px", fontWeight:600, fontFamily:"'DM Sans',sans-serif", cursor:"pointer" }}
                  onMouseEnter={e=>e.currentTarget.style.background=a.hov} onMouseLeave={e=>e.currentTarget.style.background=a.bg}>
                  {a.icon} {a.label}
                </button>
              )) : <span style={{ fontSize:"12px", color:"#9ca3af" }}>No further actions</span>}
            </div>
              
                <button
              onClick={()=>{
                if(!window.confirm("Delete this order?")) return;
                deleteOrder(order.id);
              }}
              style={{ background:"red", color:"white" }}
            >
              🗑 Delete
            </button>

            {total>0 && <div style={{ display:"flex", alignItems:"center", gap:"8px" }}><span style={{ fontSize:"12px", color:"#6b7280", fontWeight:500 }}>Total</span><span style={{ fontFamily:"'Playfair Display',serif", fontSize:"19px", fontWeight:700, color:"#0D6E4F" }}>₦{total.toLocaleString()}</span></div>}
          </div>
        </div>
      )}
    </div>
  );
}

function Orders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders(true);
    const interval = setInterval(() => fetchOrders(false), 5000);
    return () => clearInterval(interval);
  }, []);
  const fetchOrders = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const r = await API.get("/orders", { headers: { Authorization: `Bearer ${token}` } });
      // Sort newest first
      const sorted = (r.data || []).slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setOrders(sorted);
    } catch(e) { console.log(e); }
    finally { if (showLoading) setLoading(false); }
  };
  
  const updateStatus = async (id, status) => { try { await API.put(`/orders/${id}/status`,{status},{headers:{Authorization:`Bearer ${token}`}}); fetchOrders(); } catch(e){alert("Status update failed");} };
    const deleteOrder = async (id)=>{
    try{
      await API.delete(`/orders/${id}`,{
        headers:{Authorization:`Bearer ${token}`}
      });
      fetchOrders();
    }catch{
      alert("Delete failed");
    }
  };


  const filterKeys = ["all","pending","preparing","ready_for_pickup","completed"];
  const filterLabels = { all:"All", pending:"Pending", preparing:"Preparing", ready_for_pickup:"Ready", completed:"Completed" };
  const counts = filterKeys.reduce((a,k)=>{ a[k]=k==="all"?orders.length:orders.filter(o=>o.status===k).length; return a; },{});
  const filtered = filter==="all" ? orders : orders.filter(o=>o.status===filter);
  const activeBg = { all:"#0D6E4F", pending:"#fef9c3", preparing:"#dbeafe", ready_for_pickup:"#dcfce7", completed:"#f3f4f6" };
  const activeCl = { all:"white", pending:"#854d0e", preparing:"#1e3a8a", ready_for_pickup:"#14532d", completed:"#374151" };
  const activeBo = { all:"#0D6E4F", pending:"#fde68a", preparing:"#bfdbfe", ready_for_pickup:"#86efac", completed:"#d1d5db" };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(145deg,#f0fdf6 0%,#f8fafc 60%,#eff6ff 100%)", fontFamily:"'DM Sans',sans-serif" }}>
      <style>{CSS}</style>
      <main className="ord-main">
        <div style={{ marginBottom:"22px" }}>
          <h1 className="ord-title" style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, color:"#0D6E4F", margin:0 }}>Orders</h1>
          <p style={{ margin:"5px 0 0", fontSize:"13px", color:"#6b7280" }}>Manage and update all customer pharmacy orders</p>
        </div>
        <div className="ord-filters">
          {filterKeys.map(k => { const isA=filter===k; return (
            <button key={k} onClick={()=>setFilter(k)} style={{ padding:"6px 13px", borderRadius:"99px", border:`1.5px solid ${isA?activeBo[k]:"#e5e7eb"}`, background:isA?activeBg[k]:"#fff", color:isA?activeCl[k]:"#6b7280", fontSize:"12.5px", fontWeight:600, fontFamily:"'DM Sans',sans-serif", cursor:"pointer", display:"inline-flex", alignItems:"center", gap:"5px" }}>
              {filterLabels[k]} <span style={{ background:isA?"rgba(0,0,0,0.12)":"#f3f4f6", color:isA?"inherit":"#9ca3af", borderRadius:"99px", padding:"0 6px", fontSize:"11px", fontWeight:700 }}>{counts[k]}</span>
            </button>
          );})}
        </div>
        {loading
          ? <div style={{ textAlign:"center", padding:"60px 0", color:"#9ca3af" }}><div style={{ fontSize:"28px", marginBottom:"10px" }}>⏳</div>Loading…</div>
          : filtered.length===0
            ? <div style={{ textAlign:"center", padding:"60px 0", color:"#9ca3af" }}><div style={{ fontSize:"36px", marginBottom:"10px" }}>📋</div><div style={{ fontWeight:500 }}>No orders found</div></div>
            : <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>{filtered.map(o=><OrderCard key={o.id} order={o} updateStatus={updateStatus}  deleteOrder={deleteOrder} />)}</div>
        }
      </main>
    </div>
  );
}
export default Orders;