import { useEffect, useState } from "react";
import API from "../api/api";

/* ─── Status config ────────────────────────────────────────── */
const STATUS_CONFIG = {
  pending:          { bg: "#fef9c3", color: "#854d0e", dot: "#f59e0b", label: "Pending",          icon: "⏳" },
  preparing:        { bg: "#dbeafe", color: "#1e3a8a", dot: "#2563eb", label: "Preparing",        icon: "🔄" },
  ready_for_pickup: { bg: "#f0fdf6", color: "#14532d", dot: "#16a34a", label: "Ready for Pickup", icon: "✅" },
  completed:        { bg: "#f3f4f6", color: "#374151", dot: "#6b7280", label: "Completed",        icon: "📦" },
};

function StatusBadge({ status }) {
  const s = STATUS_CONFIG[status] || { bg: "#f3f4f6", color: "#374151", dot: "#9ca3af", label: status, icon: "•" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "6px",
      padding: "4px 12px", borderRadius: "99px",
      fontSize: "12px", fontWeight: 600,
      fontFamily: "'DM Sans', sans-serif",
      background: s.bg, color: s.color
    }}>
      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      {s.label}
    </span>
  );
}

/* ─── Status action button ─────────────────────────────────── */
function ActionBtn({ label, icon, onClick, scheme }) {
  const [hovered, setHovered] = useState(false);
  const schemes = {
    blue:  { bg: "#dbeafe", hov: "#bfdbfe", color: "#1e3a8a", border: "#bfdbfe" },
    green: { bg: "#dcfce7", hov: "#bbf7d0", color: "#14532d", border: "#86efac" },
    gray:  { bg: "#f3f4f6", hov: "#e5e7eb", color: "#374151", border: "#e5e7eb" },
  };
  const c = schemes[scheme] || schemes.gray;
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: "5px",
        padding: "7px 14px",
        background: hovered ? c.hov : c.bg,
        border: `1.5px solid ${c.border}`,
        borderRadius: "8px", color: c.color,
        fontSize: "12.5px", fontWeight: 600,
        fontFamily: "'DM Sans', sans-serif",
        cursor: "pointer", transition: "background 0.15s"
      }}
    >
      <span>{icon}</span> {label}
    </button>
  );
}

/* ─── Order Card ───────────────────────────────────────────── */
function OrderCard({ order, updateStatus }) {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async (status) => {
    setUpdating(true);
    await updateStatus(order.id, status);
    setUpdating(false);
  };

  const total = order.order_items?.reduce(
    (sum, item) => sum + Number(item.price ?? 0) * item.quantity, 0
  );
  const itemCount = order.order_items?.reduce((s, i) => s + i.quantity, 0);

  const nextActions = {
    pending:          [{ label: "Mark Preparing",        icon: "🔄", status: "preparing",        scheme: "blue" }],
    preparing:        [{ label: "Mark Ready for Pickup", icon: "✅", status: "ready_for_pickup",  scheme: "green" }],
    ready_for_pickup: [{ label: "Mark Completed",        icon: "📦", status: "completed",         scheme: "gray" }],
    completed:        [],
  };
  const actions = nextActions[order.status] || [];

  return (
    <div style={{
      background: "#fff", borderRadius: "16px",
      border: "1.5px solid #e5e7eb", overflow: "hidden",
      boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
      opacity: updating ? 0.6 : 1, transition: "opacity 0.2s"
    }}>

      {/* Status colour strip */}
      <div style={{
        height: "3px",
        background: order.status === "pending"          ? "#f59e0b"
                  : order.status === "preparing"        ? "#3b82f6"
                  : order.status === "ready_for_pickup" ? "linear-gradient(90deg,#0D6E4F,#4ADE80)"
                  : "#d1d5db"
      }} />

      {/* Card header — clickable to expand */}
      <div
        onClick={() => setExpanded(v => !v)}
        style={{
          padding: "16px 22px",
          display: "flex", alignItems: "center",
          justifyContent: "space-between", flexWrap: "wrap",
          gap: "12px", cursor: "pointer",
          borderBottom: expanded ? "1.5px solid #f3f4f6" : "none",
          background: expanded ? "#fafafa" : "#fff",
          transition: "background 0.15s"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "10px",
            background: "#f0fdf6", border: "1.5px solid #bbf7d0",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "17px", flexShrink: 0
          }}>📋</div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "15px", fontWeight: 700, color: "#111827" }}>
              Order #{order.id}
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#6b7280", marginTop: "2px", display: "flex", gap: "10px" }}>
              <span>📅 {new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              {order.users?.name && <span>👤 {order.users.name}</span>}
              <span>💊 {itemCount} item{itemCount !== 1 ? "s" : ""}</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <StatusBadge status={order.status} />
          {total > 0 && (
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "17px", fontWeight: 700, color: "#0D6E4F" }}>
              ₦{total.toLocaleString()}
            </div>
          )}
          <div style={{ fontSize: "13px", color: "#9ca3af", transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▾</div>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div style={{ padding: "16px 22px 20px" }}>

          {/* Items table */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px", color: "#9ca3af", marginBottom: "10px" }}>
              Order Items
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {order.order_items?.map(item => (
                <div key={item.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 14px", background: "#f9fafb",
                  borderRadius: "10px", border: "1px solid #f3f4f6"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "30px", height: "30px", borderRadius: "7px", background: "#f0fdf6", border: "1px solid #bbf7d0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px" }}>💊</div>
                    <div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13.5px", fontWeight: 600, color: "#111827" }}>{item.medicines?.name}</div>
                      {item.medicines?.category && <div style={{ fontSize: "11px", color: "#6b7280" }}>{item.medicines.category}</div>}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "10px", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.5px" }}>Qty</div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 700, color: "#374151" }}>{item.quantity}</div>
                    </div>
                    {item.price && (
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "10px", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.5px" }}>Total</div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "14px", fontWeight: 700, color: "#0D6E4F" }}>₦{(Number(item.price) * item.quantity).toLocaleString()}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions + total */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", paddingTop: "14px", borderTop: "1.5px solid #f3f4f6" }}>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {actions.length > 0
                ? actions.map(a => (
                    <ActionBtn key={a.status} label={a.label} icon={a.icon} scheme={a.scheme} onClick={() => handleUpdate(a.status)} />
                  ))
                : <span style={{ fontSize: "12.5px", color: "#9ca3af", fontFamily: "'DM Sans', sans-serif" }}>No further actions available</span>
              }
            </div>
            {total > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", color: "#6b7280", fontWeight: 500 }}>Order Total</span>
                <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "20px", fontWeight: 700, color: "#0D6E4F" }}>₦{total.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Orders Page ──────────────────────────────────────────── */
function Orders() {
  const [orders, setOrders]   = useState([]);
  const [filter, setFilter]   = useState("all");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const link = document.createElement("link");
    link.rel  = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap";
    document.head.appendChild(link);
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await API.get("/orders", { headers: { Authorization: `Bearer ${token}` } });
      setOrders(res.data);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      fetchOrders();
    } catch (err) {
      console.log(err);
      alert("Status update failed");
    }
  };

  const filterKeys = ["all", "pending", "preparing", "ready_for_pickup", "completed"];
  const filterLabels = { all: "All", pending: "Pending", preparing: "Preparing", ready_for_pickup: "Ready", completed: "Completed" };
  const filterColors = {
    all:              { active: { background: "#0D6E4F", color: "white",   border: "#0D6E4F" } },
    pending:          { active: { background: "#fef9c3", color: "#854d0e", border: "#fde68a" } },
    preparing:        { active: { background: "#dbeafe", color: "#1e3a8a", border: "#bfdbfe" } },
    ready_for_pickup: { active: { background: "#dcfce7", color: "#14532d", border: "#86efac" } },
    completed:        { active: { background: "#f3f4f6", color: "#374151", border: "#d1d5db" } },
  };

  const counts = filterKeys.reduce((acc, k) => {
    acc[k] = k === "all" ? orders.length : orders.filter(o => o.status === k).length;
    return acc;
  }, {});

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(145deg, #f0fdf6 0%, #f8fafc 60%, #eff6ff 100%)", fontFamily: "'DM Sans', sans-serif" }}>

      <main style={{ padding: "36px 40px", maxWidth: "960px", margin: "0 auto" }}>

        {/* Heading + summary */}
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "30px", fontWeight: 700, color: "#0D6E4F", margin: 0 }}>Orders</h1>
          <p style={{ margin: "6px 0 0", fontSize: "14px", color: "#6b7280" }}>Manage and update all customer pharmacy orders</p>
        </div>

        {/* Summary pills */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "22px", flexWrap: "wrap" }}>
          {[
            { key: "pending",          label: "Pending",   bg: "#fef9c3", border: "#fde68a", color: "#854d0e" },
            { key: "preparing",        label: "Preparing", bg: "#dbeafe", border: "#bfdbfe", color: "#1e3a8a" },
            { key: "ready_for_pickup", label: "Ready",     bg: "#dcfce7", border: "#86efac", color: "#14532d" },
            { key: "completed",        label: "Completed", bg: "#f3f4f6", border: "#e5e7eb", color: "#374151" },
          ].map(s => counts[s.key] > 0 && (
            <div key={s.key} style={{ background: s.bg, border: `1.5px solid ${s.border}`, borderRadius: "99px", padding: "5px 14px", display: "flex", alignItems: "center", gap: "7px" }}>
              <span style={{ fontSize: "11.5px", fontWeight: 500, color: s.color }}>{s.label}</span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "14px", fontWeight: 700, color: s.color }}>{counts[s.key]}</span>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          {filterKeys.map(k => {
            const isActive = filter === k;
            const ac = filterColors[k].active;
            return (
              <button key={k} onClick={() => setFilter(k)} style={{
                padding: "7px 16px", borderRadius: "99px",
                border: `1.5px solid ${isActive ? ac.border : "#e5e7eb"}`,
                background: isActive ? ac.background : "#fff",
                color: isActive ? ac.color : "#6b7280",
                fontSize: "13px", fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                cursor: "pointer", transition: "all 0.15s",
                display: "inline-flex", alignItems: "center", gap: "6px"
              }}>
                {filterLabels[k]}
                <span style={{ background: isActive ? "rgba(0,0,0,0.1)" : "#f3f4f6", color: isActive ? "inherit" : "#9ca3af", borderRadius: "99px", padding: "0 7px", fontSize: "11px", fontWeight: 700 }}>
                  {counts[k]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Order list */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#9ca3af", fontSize: "15px" }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>⏳</div>
            Loading orders…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#9ca3af" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>📋</div>
            <div style={{ fontSize: "15px", fontWeight: 500 }}>No {filter !== "all" ? filterLabels[filter].toLowerCase() : ""} orders</div>
            <div style={{ fontSize: "13px", marginTop: "6px" }}>
              {filter !== "all" ? "Try a different filter" : "No orders have been placed yet"}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filtered.map(order => (
              <OrderCard key={order.id} order={order} updateStatus={updateStatus} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Orders;