import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ─── Stock Badge ──────────────────────────────────────────── */
function StockBadge({ qty }) {
  if (qty === 0)  return <span style={{ display:"inline-flex", alignItems:"center", gap:"4px", padding:"3px 10px", borderRadius:"99px", fontSize:"11.5px", fontWeight:600, background:"#fee2e2", color:"#dc2626" }}>✖ Out of Stock</span>;
  if (qty <= 10)  return <span style={{ display:"inline-flex", alignItems:"center", gap:"4px", padding:"3px 10px", borderRadius:"99px", fontSize:"11.5px", fontWeight:600, background:"#fef9c3", color:"#92400e" }}>⚠ Low Stock</span>;
  return               <span style={{ display:"inline-flex", alignItems:"center", gap:"4px", padding:"3px 10px", borderRadius:"99px", fontSize:"11.5px", fontWeight:600, background:"#dcfce7", color:"#14532d" }}>✓ In Stock</span>;
}

/* ─── MedicineCard ─────────────────────────────────────────── */
function MedicineCard({ med, user, deleteMedicine }) {
  const [hovered, setHovered]       = useState(false);
  const [confirmDelete, setConfirm] = useState(false);
  const navigate = useNavigate();

  const stock       = med.stock_quantity;
  const canManage   = user?.role === "admin" || user?.role === "inventory_manager";
  const canSeeStock = user?.role === "admin" || user?.role === "inventory_manager" || user?.role === "pharmacist";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setConfirm(false); }}
      style={{
        background: "#fff",
        border: `1.5px solid ${hovered ? "#d1fae5" : "#e5e7eb"}`,
        borderRadius: "16px",
        padding: "22px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.08)" : "0 1px 4px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        transition: "all 0.18s",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Top accent bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "3px",
        background: stock === 0
          ? "#ef4444"
          : stock <= 10
            ? "#f59e0b"
            : "linear-gradient(90deg,#0D6E4F,#4ADE80)",
        borderRadius: "16px 16px 0 0"
      }} />

      {/* Category chip */}
      {med.category && (
        <div style={{
          display: "inline-flex", alignSelf: "flex-start",
          background: "#f0fdf6", border: "1.5px solid #bbf7d0",
          borderRadius: "99px", padding: "2px 10px",
          fontSize: "11px", fontWeight: 600,
          color: "#14532d", fontFamily: "'DM Sans', sans-serif",
          letterSpacing: "0.3px", textTransform: "uppercase"
        }}>{med.category}</div>
      )}

      {/* Name + description */}
      <div>
        <div style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "16px", fontWeight: 700, color: "#111827",
          marginBottom: "5px", lineHeight: 1.3
        }}>{med.name}</div>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "12.5px", color: "#6b7280", lineHeight: 1.55,
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden"
        }}>
          {med.description || "No description provided."}
        </div>
      </div>

      {/* Price + stock status */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "20px", fontWeight: 700, color: "#0D6E4F"
        }}>₦{Number(med.price).toLocaleString()}</div>

        {canSeeStock
          ? <StockBadge qty={stock} />
          : stock === 0
            ? <span style={{ display:"inline-flex", padding:"3px 10px", borderRadius:"99px", fontSize:"11.5px", fontWeight:600, background:"#fee2e2", color:"#dc2626" }}>✖ Out of Stock</span>
            : <span style={{ display:"inline-flex", padding:"3px 10px", borderRadius:"99px", fontSize:"11.5px", fontWeight:600, background:"#dcfce7", color:"#14532d" }}>✓ Available</span>
        }
      </div>

      {/* Stock progress bar — internal staff only */}
      {canSeeStock && (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ flex: 1, height: "5px", background: "#f3f4f6", borderRadius: "99px", overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: "99px",
              width: `${Math.min(100, (stock / 100) * 100)}%`,
              background: stock === 0 ? "#ef4444" : stock <= 10 ? "#f59e0b" : "linear-gradient(90deg,#0D6E4F,#4ADE80)",
              transition: "width 0.4s"
            }} />
          </div>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11.5px", color: "#6b7280", whiteSpace: "nowrap" }}>
            {stock} units
          </span>
        </div>
      )}

      {/* Admin / inventory manager actions */}
      {canManage && (
        <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
          <button
            onClick={() => navigate(`/edit-medicine/${med.id}`)}
            style={{
              flex: 1, padding: "9px",
              background: "#f0fdf6", border: "1.5px solid #bbf7d0",
              borderRadius: "8px", color: "#0D6E4F",
              fontSize: "13px", fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
              transition: "background 0.15s"
            }}
            onMouseEnter={e => e.target.style.background = "#dcfce7"}
            onMouseLeave={e => e.target.style.background = "#f0fdf6"}
          >
            ✏️ Edit
          </button>

          {confirmDelete ? (
            <button
              onClick={() => { deleteMedicine(med.id); setConfirm(false); }}
              style={{
                flex: 1, padding: "9px",
                background: "#dc2626", border: "none",
                borderRadius: "8px", color: "white",
                fontSize: "13px", fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif", cursor: "pointer"
              }}
            >Confirm?</button>
          ) : (
            <button
              onClick={() => setConfirm(true)}
              style={{
                flex: 1, padding: "9px",
                background: "#fef2f2", border: "1.5px solid #fecaca",
                borderRadius: "8px", color: "#dc2626",
                fontSize: "13px", fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
                transition: "background 0.15s"
              }}
              onMouseEnter={e => e.target.style.background = "#fee2e2"}
              onMouseLeave={e => e.target.style.background = "#fef2f2"}
            >
              🗑️ Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default MedicineCard;