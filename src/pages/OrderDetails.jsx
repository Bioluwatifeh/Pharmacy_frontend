import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
      padding: "5px 14px", borderRadius: "99px",
      fontSize: "13px", fontWeight: 600,
      fontFamily: "'DM Sans', sans-serif",
      background: s.bg, color: s.color
    }}>
      <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: s.dot, display: "inline-block", flexShrink: 0 }} />
      {s.label}
    </span>
  );
}

/* ─── Timeline Step ────────────────────────────────────────── */
function TimelineStep({ label, done, active }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", flex: 1 }}>
      <div style={{
        width: "28px", height: "28px", borderRadius: "50%",
        background: done || active ? "#0D6E4F" : "#e5e7eb",
        border: `2px solid ${done || active ? "#0D6E4F" : "#e5e7eb"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "12px", color: "white", fontWeight: 700,
        transition: "background 0.2s"
      }}>
        {done ? "✓" : active ? "●" : ""}
      </div>
      <div style={{
        fontSize: "11px", fontWeight: active ? 700 : 500,
        color: active ? "#0D6E4F" : done ? "#374151" : "#9ca3af",
        fontFamily: "'DM Sans', sans-serif", textAlign: "center"
      }}>{label}</div>
    </div>
  );
}

/* ─── OrderDetails Component ───────────────────────────────── */
function OrderDetails({ orderId }) {
  const [order, setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate            = useNavigate();
  const token               = localStorage.getItem("token");

  useEffect(() => {
    const link = document.createElement("link");
    link.rel  = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap";
    document.head.appendChild(link);
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/orders/${orderId}`, { headers: { Authorization: `Bearer ${token}` } });
      setOrder(res.data);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const statusSteps   = ["pending", "processing", "completed"];
  const currentStep   = statusSteps.indexOf(order?.status?.toLowerCase());
  const isCancelled   = order?.status?.toLowerCase() === "cancelled";

  const orderTotal = order?.order_items?.reduce(
    (sum, item) => sum + Number(item.price ?? 0) * item.quantity, 0
  ) ?? 0;

  const itemCount = order?.order_items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(145deg, #f0fdf6 0%, #f8fafc 60%, #eff6ff 100%)", fontFamily: "'DM Sans', sans-serif" }}>

      <main style={{ padding: "36px 40px", maxWidth: "860px", margin: "0 auto" }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
          <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: "13.5px", fontWeight: 500, fontFamily: "'DM Sans', sans-serif", padding: 0 }}>
            ← Back
          </button>
          <span style={{ color: "#d1d5db" }}>›</span>
          <span style={{ fontSize: "13.5px", color: "#0D6E4F", fontWeight: 600 }}>Order Details</span>
        </div>

        {/* Loading */}
        {loading ? (
          <div style={{ background: "#fff", borderRadius: "18px", border: "1.5px solid #e5e7eb", padding: "80px", textAlign: "center", color: "#9ca3af", fontSize: "15px" }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>⏳</div>
            Loading order details…
          </div>
        ) : !order ? (
          <div style={{ background: "#fff", borderRadius: "18px", border: "1.5px solid #e5e7eb", padding: "80px", textAlign: "center", color: "#9ca3af" }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>📋</div>
            <div style={{ fontSize: "15px", fontWeight: 500 }}>Order not found</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* ── Header card ── */}
            <div style={{ background: "#fff", borderRadius: "18px", border: "1.5px solid #e5e7eb", padding: "26px 28px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
                <div>
                  <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "26px", fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>
                    Order #{order.id}
                  </h1>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "13px", color: "#6b7280" }}>
                      📅 {new Date(order.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </span>
                    <span style={{ fontSize: "13px", color: "#6b7280" }}>
                      💊 {itemCount} item{itemCount !== 1 ? "s" : ""}
                    </span>
                    {order.users?.name && (
                      <span style={{ fontSize: "13px", color: "#6b7280" }}>
                        👤 {order.users.name}
                      </span>
                    )}
                  </div>
                </div>
                <StatusBadge status={order.status} />
              </div>
            </div>

            {/* ── Status timeline ── */}
            {!isCancelled && (
              <div style={{ background: "#fff", borderRadius: "18px", border: "1.5px solid #e5e7eb", padding: "24px 28px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", color: "#9ca3af", marginBottom: "20px" }}>
                  Order Progress
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", position: "relative" }}>
                  {/* Connecting line */}
                  <div style={{ position: "absolute", top: "14px", left: "14px", right: "14px", height: "2px", background: "#e5e7eb", zIndex: 0 }} />
                  <div style={{
                    position: "absolute", top: "14px", left: "14px",
                    height: "2px", zIndex: 1,
                    background: "linear-gradient(90deg,#0D6E4F,#4ADE80)",
                    width: currentStep === 0 ? "0%" : currentStep === 1 ? "50%" : "100%",
                    transition: "width 0.4s"
                  }} />
                  {statusSteps.map((step, i) => (
                    <TimelineStep key={step} label={step.charAt(0).toUpperCase() + step.slice(1)} done={i < currentStep} active={i === currentStep} />
                  ))}
                </div>
              </div>
            )}

            {isCancelled && (
              <div style={{ background: "#fef2f2", borderRadius: "18px", border: "1.5px solid #fecaca", padding: "18px 22px", display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "22px" }}>❌</span>
                <div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 600, color: "#7f1d1d" }}>This order was cancelled</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", color: "#b91c1c", marginTop: "2px" }}>No further actions are available for this order.</div>
                </div>
              </div>
            )}

            {/* ── Order items ── */}
            <div style={{ background: "#fff", borderRadius: "18px", border: "1.5px solid #e5e7eb", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ padding: "18px 22px", borderBottom: "1.5px solid #f3f4f6", display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "18px" }}>💊</span>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "18px", fontWeight: 700, color: "#111827", margin: 0 }}>Order Items</h3>
              </div>

              {/* Table header */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 100px", gap: "8px", padding: "10px 22px", borderBottom: "1px solid #f3f4f6", background: "#f9fafb" }}>
                {["Medicine", "Qty", "Unit Price", "Total"].map(h => (
                  <div key={h} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px", color: "#9ca3af" }}>{h}</div>
                ))}
              </div>

              {order.order_items.map((item, index) => (
                <div key={index} style={{
                  display: "grid", gridTemplateColumns: "1fr 80px 80px 100px",
                  gap: "8px", padding: "14px 22px",
                  borderBottom: index < order.order_items.length - 1 ? "1px solid #f3f4f6" : "none",
                  alignItems: "center"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: "#f0fdf6", border: "1px solid #bbf7d0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", flexShrink: 0 }}>💊</div>
                    <div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 600, color: "#111827" }}>{item.medicines?.name}</div>
                      {item.medicines?.category && (
                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#6b7280", marginTop: "1px" }}>{item.medicines.category}</div>
                      )}
                    </div>
                  </div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 600, color: "#374151" }}>{item.quantity}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#6b7280" }}>
                    {item.price ? `₦${Number(item.price).toLocaleString()}` : "—"}
                  </div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "15px", fontWeight: 700, color: "#0D6E4F" }}>
                    {item.price ? `₦${(Number(item.price) * item.quantity).toLocaleString()}` : "—"}
                  </div>
                </div>
              ))}

              {/* Total row */}
              {orderTotal > 0 && (
                <div style={{
                  display: "flex", justifyContent: "flex-end", alignItems: "center",
                  gap: "16px", padding: "16px 22px",
                  borderTop: "1.5px solid #f3f4f6", background: "#f9fafb"
                }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 500, color: "#6b7280" }}>Order Total</span>
                  <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "24px", fontWeight: 700, color: "#0D6E4F" }}>
                    ₦{orderTotal.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

          </div>
        )}
      </main>
    </div>
  );
}

export default OrderDetails;