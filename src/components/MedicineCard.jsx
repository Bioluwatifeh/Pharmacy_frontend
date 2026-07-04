import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ─── Stock Badge ──────────────────────────────────────────── */
function StockBadge({ qty }) {
  if (qty === 0)
    return <span style={{ padding:"3px 10px", borderRadius:"99px", fontSize:"11.5px", fontWeight:600, background:"#fee2e2", color:"#dc2626" }}>✖ Out of Stock</span>;

  if (qty <= 10)
    return <span style={{ padding:"3px 10px", borderRadius:"99px", fontSize:"11.5px", fontWeight:600, background:"#fef9c3", color:"#92400e" }}>⚠ Low Stock</span>;

  return <span style={{ padding:"3px 10px", borderRadius:"99px", fontSize:"11.5px", fontWeight:600, background:"#dcfce7", color:"#14532d" }}>✓ In Stock</span>;
}

/* 🔥 STOCK FORMAT FUNCTION */
function formatStock(med) {

  let units = med.stock_units || 0;

  const unitsPerPack = med.units_per_pack || 1;
  const packsPerCarton = med.packs_per_carton || 1;

  const unitsPerCarton = unitsPerPack * packsPerCarton;

  const cartons = Math.floor(units / unitsPerCarton);
  units = units % unitsPerCarton;

  const packs = Math.floor(units / unitsPerPack);
  units = units % unitsPerPack;

  return `${cartons} carton(s), ${packs} pack(s), ${units} ${med.unit_name || "unit"}(s)`;
}

/* ─── MedicineCard ─────────────────────────────────────────── */
function MedicineCard({ med, user, deleteMedicine }) {

  const [hovered, setHovered] = useState(false);
  const [confirmDelete, setConfirm] = useState(false);

  const navigate = useNavigate();

  // ✅ FIXED
  const stock = med.stock_units;

  const canManage =
    user?.role === "admin" ||
    user?.role === "inventory_manager";

  const canSeeStock =
    user?.role === "admin" ||
    user?.role === "inventory_manager" ||
    user?.role === "pharmacist";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setConfirm(false);
      }}
      style={{
        background: "#fff",
        border: `1.5px solid ${hovered ? "#d1fae5" : "#e5e7eb"}`,
        borderRadius: "16px",
        padding: "22px",
        display: "flex",
        flexDirection: "column",
        gap: "12px"
      }}
    >

      {/* Name */}
      <h4>{med.name}</h4>

      {/* Description */}
      <p>{med.description}</p>

      {/* 🔥 NEW STOCK DISPLAY */}
      <p style={{ fontSize: "12px", color: "#6b7280" }}>
        {formatStock(med)}
      </p>

      {/* Price */}
      <p>₦{med.price}</p>

      {/* Stock Badge */}
      {canSeeStock
        ? <StockBadge qty={stock} />
        : stock === 0
          ? <span style={{ color: "red" }}>Out of Stock</span>
          : <span style={{ color: "green" }}>Available</span>
      }

      {/* ACTIONS */}
      {canManage && (
        <div style={{ display: "flex", gap: "10px" }}>

          {/* EDIT */}
          <button onClick={() => navigate(`/edit-medicine/${med.id}`)}>
            Edit
          </button>

          {/* DELETE */}
          {confirmDelete ? (
            <button
              onClick={() => {
                deleteMedicine(med.id); // ✅ CORRECT CALL
                setConfirm(false);
              }}
              style={{ background: "red", color: "white" }}
            >
              Confirm Delete
            </button>
          ) : (
            <button onClick={() => setConfirm(true)}>
              Delete
            </button>
          )}

        </div>
      )}

    </div>
  );
}

export default MedicineCard;