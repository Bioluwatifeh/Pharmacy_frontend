import { useEffect, useState } from "react";
import API from "../api/api";

/* ─── Status Badge ─────────────────────────────────────────── */
function StatusBadge({ status }) {
  const map = {
    pending:    { bg: "#fef9c3", color: "#854d0e", dot: "#f59e0b", label: "Pending" },
    completed:  { bg: "#dcfce7", color: "#14532d", dot: "#16a34a", label: "Completed" },
    cancelled:  { bg: "#fee2e2", color: "#7f1d1d", dot: "#dc2626", label: "Cancelled" },
    processing: { bg: "#dbeafe", color: "#1e3a8a", dot: "#2563eb", label: "Processing" },
  };
  const s = map[status?.toLowerCase()] || { bg: "#f3f4f6", color: "#374151", dot: "#9ca3af", label: status };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "6px",
      padding: "4px 12px", borderRadius: "99px",
      fontSize: "12px", fontWeight: 600,
      fontFamily: "'DM Sans', sans-serif",
      background: s.bg, color: s.color
    }}>
      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: s.dot, display: "inline-block" }} />
      {s.label}
    </span>
  );
}

/* ─── Order Card ───────────────────────────────────────────── */
function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);

  const total = order.order_items?.reduce(
    (sum, item) => sum + Number(item.price ?? item.medicines?.price ?? 0) * item.quantity, 0
  );

  const itemCount = order.order_items?.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div style={{
      background: "#fff",
      border: "1.5px solid #e5e7eb",
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      transition: "box-shadow 0.15s"
    }}>
      {/* Card header */}
      <div
        onClick={() => setExpanded(v => !v)}
        style={{
          padding: "18px 22px",
          display: "flex", alignItems: "center",
          justifyContent: "space-between", flexWrap: "wrap",
          gap: "12px", cursor: "pointer",
          borderBottom: expanded ? "1.5px solid #f3f4f6" : "none",
          background: expanded ? "#fafafa" : "#fff",
          transition: "background 0.15s"
        }}
      >
        {/* Left: ID + date */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{
            width: "42px", height: "42px", borderRadius: "10px",
            background: "linear-gradient(135deg,#f0fdf6,#dcfce7)",
            border: "1.5px solid #bbf7d0",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px", flexShrink: 0
          }}>📦</div>
          <div>
            <div style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "16px", fontWeight: 700, color: "#111827"
            }}>Order #{order.id}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", color: "#6b7280", marginTop: "2px" }}>
              {new Date(order.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
              {" · "}{itemCount} item{itemCount !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* Right: status + total + chevron */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <StatusBadge status={order.status} />
          {total > 0 && (
            <div style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "18px", fontWeight: 700, color: "#0D6E4F"
            }}>₦{total.toLocaleString()}</div>
          )}
          <div style={{
            fontSize: "14px", color: "#9ca3af",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s"
          }}>▾</div>
        </div>
      </div>

      {/* Expanded items */}
      {expanded && (
        <div style={{ padding: "16px 22px 20px" }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: "11px",
            fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px",
            color: "#9ca3af", marginBottom: "12px"
          }}>Order Items</div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {order.order_items?.map(item => (
              <div key={item.id} style={{
                display: "flex", alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 14px",
                background: "#f9fafb",
                borderRadius: "10px",
                border: "1px solid #f3f4f6"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    width: "32px", height: "32px", borderRadius: "8px",
                    background: "#f0fdf6", border: "1px solid #bbf7d0",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "14px", flexShrink: 0
                  }}>💊</div>
                  <div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13.5px", fontWeight: 600, color: "#111827" }}>
                      {item.medicines?.name}
                    </div>
                    {item.medicines?.category && (
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#6b7280", marginTop: "1px" }}>
                        {item.medicines.category}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.5px" }}>Qty</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 700, color: "#374151" }}>{item.quantity}</div>
                  </div>
                  {item.price && (
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.5px" }}>Total</div>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "14px", fontWeight: 700, color: "#0D6E4F" }}>
                        ₦{(Number(item.price) * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Order total footer */}
          {total > 0 && (
            <div style={{
              display: "flex", justifyContent: "flex-end", alignItems: "center",
              gap: "12px", marginTop: "16px",
              paddingTop: "14px", borderTop: "1.5px solid #f3f4f6"
            }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#6b7280", fontWeight: 500 }}>Order Total</span>
              <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "22px", fontWeight: 700, color: "#0D6E4F" }}>
                ₦{total.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── MyOrders Page ────────────────────────────────────────── */
function MyOrders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("all");

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
      const res = await API.get("/orders/my-orders", { headers: { Authorization: `Bearer ${token}` } });
      setOrders(res.data);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const statuses   = ["all", "pending", "processing", "completed", "cancelled"];
  const filtered   = filter === "all" ? orders : orders.filter(o => o.status?.toLowerCase() === filter);

  const counts = {
    all:        orders.length,
    pending:    orders.filter(o => o.status?.toLowerCase() === "pending").length,
    processing: orders.filter(o => o.status?.toLowerCase() === "processing").length,
    completed:  orders.filter(o => o.status?.toLowerCase() === "completed").length,
    cancelled:  orders.filter(o => o.status?.toLowerCase() === "cancelled").length,
  };

  const filterColors = {
    all:        { active: { background: "#0D6E4F", color: "white", border: "#0D6E4F" } },
    pending:    { active: { background: "#fef9c3", color: "#854d0e", border: "#fde68a" } },
    processing: { active: { background: "#dbeafe", color: "#1e3a8a", border: "#bfdbfe" } },
    completed:  { active: { background: "#dcfce7", color: "#14532d", border: "#86efac" } },
    cancelled:  { active: { background: "#fee2e2", color: "#7f1d1d", border: "#fca5a5" } },
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(145deg, #f0fdf6 0%, #f8fafc 60%, #eff6ff 100%)", fontFamily: "'DM Sans', sans-serif" }}>

      <main style={{ padding: "36px 40px", maxWidth: "860px", margin: "0 auto" }}>

        {/* Heading */}
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "30px", fontWeight: 700, color: "#0D6E4F", margin: 0 }}>My Orders</h1>
          <p style={{ margin: "6px 0 0", fontSize: "14px", color: "#6b7280" }}>Track and review all your pharmacy orders</p>
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          {statuses.map(s => {
            const isActive = filter === s;
            const ac = filterColors[s]?.active;
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                style={{
                  padding: "7px 16px",
                  borderRadius: "99px",
                  border: `1.5px solid ${isActive ? ac.border : "#e5e7eb"}`,
                  background: isActive ? ac.background : "#fff",
                  color: isActive ? ac.color : "#6b7280",
                  fontSize: "13px", fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  display: "flex", alignItems: "center", gap: "6px"
                }}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
                <span style={{
                  background: isActive ? "rgba(0,0,0,0.1)" : "#f3f4f6",
                  color: isActive ? "inherit" : "#9ca3af",
                  borderRadius: "99px", padding: "0px 7px",
                  fontSize: "11px", fontWeight: 700
                }}>{counts[s]}</span>
              </button>
            );
          })}
        </div>

        {/* Orders list */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#9ca3af", fontSize: "15px" }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>⏳</div>
            Loading your orders…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#9ca3af" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>📋</div>
            <div style={{ fontSize: "15px", fontWeight: 500 }}>No {filter !== "all" ? filter : ""} orders found</div>
            <div style={{ fontSize: "13px", marginTop: "6px" }}>
              {filter !== "all" ? "Try a different filter" : "Place an order to get started"}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {filtered.map(order => <OrderCard key={order.id} order={order} />)}
          </div>
        )}
      </main>
    </div>
  );
}

export default MyOrders;