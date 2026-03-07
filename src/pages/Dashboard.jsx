import { useEffect, useState } from "react";
import API from "../api/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

/* ─── Stat Card ────────────────────────────────────────────── */
function Card({ title, value, icon, accent }) {
  const colors = {
    green:  { bg: "#f0fdf6", border: "#bbf7d0", iconBg: "#dcfce7", numColor: "#14532d" },
    blue:   { bg: "#eff6ff", border: "#bfdbfe", iconBg: "#dbeafe", numColor: "#1e3a8a" },
    amber:  { bg: "#fffbeb", border: "#fde68a", iconBg: "#fef3c7", numColor: "#78350f" },
    red:    { bg: "#fef2f2", border: "#fecaca", iconBg: "#fee2e2", numColor: "#7f1d1d" },
    purple: { bg: "#faf5ff", border: "#e9d5ff", iconBg: "#f3e8ff", numColor: "#4a1d96" },
  };
  const c = colors[accent] || colors.green;
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{
      background: c.bg, border: `1.5px solid ${c.border}`,
      borderRadius: "16px", padding: "22px 24px",
      display: "flex", alignItems: "center", gap: "16px",
      boxShadow: hovered ? "0 6px 20px rgba(0,0,0,0.08)" : "0 1px 3px rgba(0,0,0,0.05)",
      transform: hovered ? "translateY(-2px)" : "translateY(0)",
      transition: "transform 0.15s, box-shadow 0.15s", cursor: "default"
    }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      <div style={{
        width: "48px", height: "48px", borderRadius: "12px",
        background: c.iconBg, display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: "22px", flexShrink: 0
      }}>{icon}</div>
      <div>
        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: "11px",
          color: "#6b7280", fontWeight: 500, textTransform: "uppercase",
          letterSpacing: "0.8px", marginBottom: "4px"
        }}>{title}</div>
        <div style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "28px", fontWeight: 700, color: c.numColor, lineHeight: 1
        }}>{value ?? "—"}</div>
      </div>
    </div>
  );
}

/* ─── Status Badge ─────────────────────────────────────────── */
function StatusBadge({ status }) {
  const map = {
    pending:    { bg: "#fef9c3", color: "#854d0e", label: "Pending" },
    completed:  { bg: "#dcfce7", color: "#14532d", label: "Completed" },
    cancelled:  { bg: "#fee2e2", color: "#7f1d1d", label: "Cancelled" },
    processing: { bg: "#dbeafe", color: "#1e3a8a", label: "Processing" },
  };
  const s = map[status?.toLowerCase()] || { bg: "#f3f4f6", color: "#374151", label: status };
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: "99px",
      fontSize: "11.5px", fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
      background: s.bg, color: s.color, letterSpacing: "0.3px"
    }}>{s.label}</span>
  );
}

/* ─── Custom Chart Tooltip ─────────────────────────────────── */
function CustomTooltip({ active, payload, label }) {
  if (active && payload?.length) {
    return (
      <div style={{
        background: "#fff", border: "1.5px solid #bbf7d0", borderRadius: "10px",
        padding: "10px 16px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        fontFamily: "'DM Sans', sans-serif", fontSize: "13px"
      }}>
        <div style={{ color: "#6b7280", marginBottom: "4px" }}>{label}</div>
        <div style={{ color: "#0D6E4F", fontWeight: 700, fontSize: "16px" }}>
          {payload[0].value} orders
        </div>
      </div>
    );
  }
  return null;
}

/* ─── Main Dashboard ───────────────────────────────────────── */
function Dashboard() {
  const [stats, setStats]               = useState({});
  const [lowStock, setLowStock]         = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [chartData, setChartData]       = useState([]);

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const statsRes    = await API.get("/dashboard/stats",         { headers: { Authorization: `Bearer ${token}` } });
      const lowStockRes = await API.get("/dashboard/low-stock",     { headers: { Authorization: `Bearer ${token}` } });
      const ordersRes   = await API.get("/dashboard/recent-orders", { headers: { Authorization: `Bearer ${token}` } });
      const chartRes    = await API.get("/dashboard/orders-chart",  { headers: { Authorization: `Bearer ${token}` } });
      setStats(statsRes.data);
      setLowStock(lowStockRes.data);
      setRecentOrders(ordersRes.data);
      setChartData(chartRes.data);
    } catch (err) { console.log(err); }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel  = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);

  const TH = {
    fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 600,
    textTransform: "uppercase", letterSpacing: "1px", color: "#9ca3af",
    padding: "12px 16px", textAlign: "left",
    borderBottom: "1.5px solid #f0fdf6", background: "#f9fafb"
  };
  const TD = {
    fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#374151",
    padding: "13px 16px", borderBottom: "1px solid #f3f4f6"
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(145deg, #f0fdf6 0%, #f8fafc 60%, #eff6ff 100%)",
      fontFamily: "'DM Sans', sans-serif"
    }}>

      {/* ── Body ── */}
      <main style={{ padding: "36px 40px", maxWidth: "1280px", margin: "0 auto" }}>

        {/* Page title */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "30px", fontWeight: 700, color: "#0D6E4F", margin: 0
          }}>Dashboard Overview</h1>
          <p style={{ margin: "6px 0 0", fontSize: "14px", color: "#6b7280" }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "16px", marginBottom: "36px"
        }}>
          <Card title="Total Medicines" value={stats.medicines}      icon="💊" accent="green"  />
          <Card title="Total Orders"    value={stats.orders}         icon="📦" accent="blue"   />
          <Card title="Pending Orders"  value={stats.pending_orders} icon="⏳" accent="amber"  />
          <Card title="Low Stock"       value={stats.low_stock}      icon="⚠️" accent="red"    />
          <Card title="Customers"       value={stats.customers}      icon="👥" accent="purple" />
        </div>

        {/* Two-column tables */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>

          {/* Low Stock */}
          <div style={{
            background: "#fff", borderRadius: "18px",
            border: "1.5px solid #e5e7eb", overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
          }}>
            <div style={{
              padding: "20px 24px 16px", borderBottom: "1.5px solid #f3f4f6",
              display: "flex", alignItems: "center", gap: "10px"
            }}>
              <span style={{ fontSize: "18px" }}>⚠️</span>
              <h3 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "18px", fontWeight: 700, color: "#111827", margin: 0
              }}>Low Stock Medicines</h3>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={TH}>Medicine</th>
                  <th style={{ ...TH, textAlign: "right" }}>Stock Qty</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.length === 0
                  ? <tr><td colSpan={2} style={{ ...TD, color: "#9ca3af", textAlign: "center", padding: "32px" }}>No low stock items 🎉</td></tr>
                  : lowStock.map(med => (
                    <tr key={med.id}>
                      <td style={TD}>{med.name}</td>
                      <td style={{ ...TD, textAlign: "right" }}>
                        <span style={{
                          display: "inline-block", padding: "2px 10px", borderRadius: "99px",
                          background: med.stock_quantity <= 5 ? "#fee2e2" : "#fef9c3",
                          color: med.stock_quantity <= 5 ? "#dc2626" : "#92400e",
                          fontWeight: 700, fontSize: "13px"
                        }}>{med.stock_quantity}</span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Recent Orders */}
          <div style={{
            background: "#fff", borderRadius: "18px",
            border: "1.5px solid #e5e7eb", overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
          }}>
            <div style={{
              padding: "20px 24px 16px", borderBottom: "1.5px solid #f3f4f6",
              display: "flex", alignItems: "center", gap: "10px"
            }}>
              <span style={{ fontSize: "18px" }}>📋</span>
              <h3 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "18px", fontWeight: 700, color: "#111827", margin: 0
              }}>Recent Orders</h3>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={TH}>Order ID</th>
                  <th style={TH}>Customer</th>
                  <th style={{ ...TH, textAlign: "center" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0
                  ? <tr><td colSpan={3} style={{ ...TD, color: "#9ca3af", textAlign: "center", padding: "32px" }}>No recent orders</td></tr>
                  : recentOrders.map(order => (
                    <tr key={order.id}>
                      <td style={{ ...TD, fontWeight: 600, color: "#0D6E4F" }}>#{order.id}</td>
                      <td style={TD}>{order.users?.name || "—"}</td>
                      <td style={{ ...TD, textAlign: "center" }}><StatusBadge status={order.status} /></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart */}
        <div style={{
          background: "#fff", borderRadius: "18px",
          border: "1.5px solid #e5e7eb", padding: "24px 28px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
            <span style={{ fontSize: "18px" }}>📈</span>
            <h3 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "18px", fontWeight: 700, color: "#111827", margin: 0
            }}>Orders Activity</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%"   stopColor="#0D6E4F" />
                  <stop offset="100%" stopColor="#4ADE80" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="date" tick={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="orders" stroke="url(#lineGrad)" strokeWidth={3}
                dot={{ r: 4, fill: "#0D6E4F", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6, fill: "#0D6E4F" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </main>
    </div>
  );
}

export default Dashboard;