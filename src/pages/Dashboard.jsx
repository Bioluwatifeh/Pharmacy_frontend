import { useEffect, useState } from "react";
import API from "../api/api";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap');
  .db-main { padding: 36px 40px; max-width: 1280px; margin: 0 auto; }
  .db-title { font-size: 30px; }
  .db-stats { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px,1fr)); gap: 14px; margin-bottom: 28px; }
  .db-tables { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
  .db-card { background:#fff; border-radius:16px; border:1.5px solid #e5e7eb; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.04); }
  .db-table-wrap { overflow-x: auto; }
  .db-chart { background:#fff; border-radius:16px; border:1.5px solid #e5e7eb; padding:24px 28px; box-shadow:0 2px 8px rgba(0,0,0,0.04); }
  @media (max-width: 768px) {
    .db-main { padding: 16px; }
    .db-title { font-size: 22px; }
    .db-stats { grid-template-columns: 1fr 1fr; gap: 10px; }
    .db-tables { grid-template-columns: 1fr; gap: 14px; }
    .db-chart { padding: 16px; }
  }
  @media (min-width: 769px) and (max-width: 1024px) {
    .db-main { padding: 24px; }
    .db-tables { grid-template-columns: 1fr; }
  }
`;

function StatCard({ title, value, icon, accent }) {
  const colors = {
    green:  { bg:"#f0fdf6", border:"#bbf7d0", iconBg:"#dcfce7", num:"#14532d" },
    blue:   { bg:"#eff6ff", border:"#bfdbfe", iconBg:"#dbeafe", num:"#1e3a8a" },
    amber:  { bg:"#fffbeb", border:"#fde68a", iconBg:"#fef3c7", num:"#78350f" },
    red:    { bg:"#fef2f2", border:"#fecaca", iconBg:"#fee2e2", num:"#7f1d1d" },
    purple: { bg:"#faf5ff", border:"#e9d5ff", iconBg:"#f3e8ff", num:"#4a1d96" },
  };
  const c = colors[accent] || colors.green;
  return (
    <div style={{ background:c.bg, border:`1.5px solid ${c.border}`, borderRadius:"14px", padding:"16px 18px", display:"flex", alignItems:"center", gap:"14px", boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
      <div style={{ width:"44px", height:"44px", borderRadius:"11px", background:c.iconBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px", flexShrink:0 }}>{icon}</div>
      <div>
        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"11px", color:"#6b7280", fontWeight:500, textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:"3px" }}>{title}</div>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"26px", fontWeight:700, color:c.num, lineHeight:1 }}>{value ?? "—"}</div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const m = { pending:{bg:"#fef9c3",c:"#854d0e",l:"Pending"}, completed:{bg:"#dcfce7",c:"#14532d",l:"Completed"}, cancelled:{bg:"#fee2e2",c:"#7f1d1d",l:"Cancelled"}, processing:{bg:"#dbeafe",c:"#1e3a8a",l:"Processing"} };
  const s = m[status?.toLowerCase()] || { bg:"#f3f4f6", c:"#374151", l:status };
  return <span style={{ display:"inline-block", padding:"3px 10px", borderRadius:"99px", fontSize:"12px", fontWeight:600, fontFamily:"'DM Sans',sans-serif", background:s.bg, color:s.c }}>{s.l}</span>;
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"#fff", border:"1.5px solid #bbf7d0", borderRadius:"10px", padding:"10px 16px", boxShadow:"0 4px 12px rgba(0,0,0,0.08)", fontFamily:"'DM Sans',sans-serif", fontSize:"13px" }}>
      <div style={{ color:"#6b7280", marginBottom:"4px" }}>{label}</div>
      <div style={{ color:"#0D6E4F", fontWeight:700, fontSize:"16px" }}>{payload[0].value} orders</div>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState({});
  const [lowStock, setLowStock] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [chartData, setChartData] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetch = async () => {
      try {
        const [s, l, o, c] = await Promise.all([
          API.get("/dashboard/stats",         { headers: { Authorization:`Bearer ${token}` } }),
          API.get("/dashboard/low-stock",     { headers: { Authorization:`Bearer ${token}` } }),
          API.get("/dashboard/recent-orders", { headers: { Authorization:`Bearer ${token}` } }),
          API.get("/dashboard/orders-chart",  { headers: { Authorization:`Bearer ${token}` } }),
        ]);
        setStats(s.data); setLowStock(l.data); setRecentOrders(o.data); setChartData(c.data);
      } catch(err) { console.log(err); }
    };
    fetch();
  }, []);

  const TH = { fontFamily:"'DM Sans',sans-serif", fontSize:"11px", fontWeight:600, textTransform:"uppercase", letterSpacing:"1px", color:"#9ca3af", padding:"10px 14px", textAlign:"left", borderBottom:"1px solid #f0f0f0", background:"#f9fafb" };
  const TD = { fontFamily:"'DM Sans',sans-serif", fontSize:"13px", color:"#374151", padding:"11px 14px", borderBottom:"1px solid #f7f7f7" };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(145deg,#f0fdf6 0%,#f8fafc 60%,#eff6ff 100%)", fontFamily:"'DM Sans',sans-serif" }}>
      <style>{CSS}</style>
      <main className="db-main">
        <div style={{ marginBottom:"22px" }}>
          <h1 className="db-title" style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, color:"#0D6E4F", margin:0 }}>Dashboard Overview</h1>
          <p style={{ margin:"5px 0 0", fontSize:"13px", color:"#6b7280" }}>{new Date().toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
        </div>

        <div className="db-stats">
          <StatCard title="Total Medicines" value={stats.medicines}      icon="💊" accent="green"  />
          <StatCard title="Total Orders"    value={stats.orders}         icon="📦" accent="blue"   />
          <StatCard title="Pending Orders"  value={stats.pending_orders} icon="⏳" accent="amber"  />
          <StatCard title="Low Stock"       value={stats.low_stock}      icon="⚠️" accent="red"    />
          <StatCard title="Customers"       value={stats.customers}      icon="👥" accent="purple" />
        </div>

        <div className="db-tables">
          <div className="db-card">
            <div style={{ padding:"16px 18px", borderBottom:"1px solid #f3f4f6", display:"flex", alignItems:"center", gap:"8px" }}>
              <span>⚠️</span>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"16px", fontWeight:700, color:"#111827", margin:0 }}>Low Stock Medicines</h3>
            </div>
            <div className="db-table-wrap">
              <table style={{ width:"100%", borderCollapse:"collapse", minWidth:"260px" }}>
                <thead><tr><th style={TH}>Medicine</th><th style={{...TH,textAlign:"right"}}>Qty</th></tr></thead>
                <tbody>
                  {lowStock.length === 0
                    ? <tr><td colSpan={2} style={{...TD,textAlign:"center",padding:"32px",color:"#9ca3af"}}>No low stock items 🎉</td></tr>
                    : lowStock.map(m => (
                      <tr key={m.id}>
                        <td style={TD}>{m.name}</td>
                        <td style={{...TD,textAlign:"right"}}>
                          <span style={{ display:"inline-block", padding:"2px 8px", borderRadius:"99px", background:m.stock_quantity<=5?"#fee2e2":"#fef9c3", color:m.stock_quantity<=5?"#dc2626":"#92400e", fontWeight:700, fontSize:"12px" }}>{m.stock_quantity}</span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="db-card">
            <div style={{ padding:"16px 18px", borderBottom:"1px solid #f3f4f6", display:"flex", alignItems:"center", gap:"8px" }}>
              <span>📋</span>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"16px", fontWeight:700, color:"#111827", margin:0 }}>Recent Orders</h3>
            </div>
            <div className="db-table-wrap">
              <table style={{ width:"100%", borderCollapse:"collapse", minWidth:"280px" }}>
                <thead><tr><th style={TH}>ID</th><th style={TH}>Customer</th><th style={{...TH,textAlign:"center"}}>Status</th></tr></thead>
                <tbody>
                  {recentOrders.length === 0
                    ? <tr><td colSpan={3} style={{...TD,textAlign:"center",padding:"32px",color:"#9ca3af"}}>No recent orders</td></tr>
                    : recentOrders.map(o => (
                      <tr key={o.id}>
                        <td style={{...TD,fontWeight:600,color:"#0D6E4F"}}>#{o.id}</td>
                        <td style={TD}>{o.users?.name||"—"}</td>
                        <td style={{...TD,textAlign:"center"}}><StatusBadge status={o.status} /></td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="db-chart">
          <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"18px" }}>
            <span>📈</span>
            <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"16px", fontWeight:700, color:"#111827", margin:0 }}>Orders Activity</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData} margin={{ top:5, right:10, left:-20, bottom:5 }}>
              <defs>
                <linearGradient id="lg" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0D6E4F" /><stop offset="100%" stopColor="#4ADE80" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="date" tick={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fill:"#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fill:"#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="orders" stroke="url(#lg)" strokeWidth={3} dot={{ r:4, fill:"#0D6E4F", strokeWidth:2, stroke:"#fff" }} activeDot={{ r:6, fill:"#0D6E4F" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
}
export default Dashboard;