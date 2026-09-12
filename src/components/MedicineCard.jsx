import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ─── Stock Badge ──────────────────────────────────────────── */
function StockBadge({ qty }) {
  if (qty === 0)
    return (
      <span
        style={{
          padding: "3px 10px",
          borderRadius: "99px",
          fontSize: "11.5px",
          fontWeight: 600,
          background: "#fee2e2",
          color: "#dc2626"
        }}
      >
        ✖ Out of Stock
      </span>
    );

  if (qty <= 10)
    return (
      <span
        style={{
          padding: "3px 10px",
          borderRadius: "99px",
          fontSize: "11.5px",
          fontWeight: 600,
          background: "#fef9c3",
          color: "#92400e"
        }}
      >
        ⚠ Low Stock
      </span>
    );

  return (
    <span
      style={{
        padding: "3px 10px",
        borderRadius: "99px",
        fontSize: "11.5px",
        fontWeight: 600,
        background: "#dcfce7",
        color: "#14532d"
      }}
    >
      ✓ In Stock
    </span>
  );
}

/* ─── STOCK FORMAT ─────────────────────────────────────────── */
function formatStock(med) {
  let units = Number(med.stock_units || 0);

  const unitsPerPack = Number(med.units_per_pack || 1);
  const packsPerCarton = Number(med.packs_per_carton || 1);

  const unitsPerCarton = unitsPerPack * packsPerCarton;

  const cartons = Math.floor(units / unitsPerCarton);
  units = units % unitsPerCarton;

  const packs = Math.floor(units / unitsPerPack);
  units = units % unitsPerPack;

  const parts = [];

  if (cartons > 0) {
    parts.push(
      `${cartons} ${
        med.carton_name || "carton"
      }${cartons !== 1 ? "s" : ""}`
    );
  }

  if (packs > 0) {
    parts.push(
      `${packs} ${
        med.pack_name || "pack"
      }${packs !== 1 ? "s" : ""}`
    );
  }

  if (units > 0 || parts.length === 0) {
    parts.push(
      `${units} ${
        med.unit_name || "unit"
      }${units !== 1 ? "s" : ""}`
    );
  }

  return parts.join(", ");
}

/* ─── MedicineCard ─────────────────────────────────────────── */
function MedicineCard({ med, user, deleteMedicine }) {
  const [hovered, setHovered] = useState(false);
  const [confirmDelete, setConfirm] = useState(false);

  const navigate = useNavigate();

  const stock = Number(med.stock_units || 0);

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
        border: `1.5px solid ${
          hovered ? "#d1fae5" : "#e5e7eb"
        }`,
        borderRadius: "16px",
        padding: "22px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        boxShadow: hovered
          ? "0 8px 24px rgba(13,110,79,0.08)"
          : "none",
        transition: "all 0.2s ease"
      }}
    >

      {/* MEDICINE NAME */}
      <div>
        <h4
          style={{
            margin: 0,
            fontSize: "18px",
            fontWeight: 700,
            color: "#111827",
            textTransform: "capitalize"
          }}
        >
          {med.name}
        </h4>

        {/* BRAND / MANUFACTURER */}
        {med.brand && (
          <p
            style={{
              margin: "4px 0 0",
              fontSize: "13px",
              fontWeight: 600,
              color: "#0D6E4F"
            }}
          >
            {med.brand}
          </p>
        )}
      </div>

      {/* MEDICINE DETAILS */}
      {(med.strength || med.form || med.category) && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px"
          }}
        >
          {med.strength && (
            <span
              style={{
                padding: "4px 8px",
                borderRadius: "6px",
                background: "#f3f4f6",
                color: "#4b5563",
                fontSize: "11px",
                fontWeight: 500
              }}
            >
              {med.strength}
            </span>
          )}

          {med.form && (
            <span
              style={{
                padding: "4px 8px",
                borderRadius: "6px",
                background: "#f3f4f6",
                color: "#4b5563",
                fontSize: "11px",
                fontWeight: 500,
                textTransform: "capitalize"
              }}
            >
              {med.form}
            </span>
          )}

          {med.category && (
            <span
              style={{
                padding: "4px 8px",
                borderRadius: "6px",
                background: "#f3f4f6",
                color: "#4b5563",
                fontSize: "11px",
                fontWeight: 500
              }}
            >
              {med.category}
            </span>
          )}
        </div>
      )}

      {/* DESCRIPTION */}
      {med.description && (
        <p
          style={{
            margin: 0,
            fontSize: "12.5px",
            color: "#6b7280",
            lineHeight: 1.5
          }}
        >
          {med.description}
        </p>
      )}

      {/* STOCK */}
      <div
        style={{
          background: "#f8fafc",
          borderRadius: "10px",
          padding: "10px 12px"
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "11px",
            color: "#9ca3af",
            fontWeight: 600,
            textTransform: "uppercase"
          }}
        >
          Stock
        </p>

        <p
          style={{
            margin: "4px 0 0",
            fontSize: "13px",
            color: "#374151",
            fontWeight: 600
          }}
        >
          {formatStock(med)}
        </p>
      </div>

      {/* PRICE */}
      <p
        style={{
          margin: 0,
          fontSize: "15px",
          fontWeight: 700,
          color: "#111827"
        }}
      >
        ₦{Number(med.price || 0).toLocaleString()}
        <span
          style={{
            fontSize: "11px",
            fontWeight: 400,
            color: "#9ca3af",
            marginLeft: "4px"
          }}
        >
          / {med.unit_name || "unit"}
        </span>
      </p>

      {/* STOCK BADGE */}
      {canSeeStock ? (
        <StockBadge qty={stock} />
      ) : stock === 0 ? (
        <span style={{ color: "red" }}>
          Out of Stock
        </span>
      ) : (
        <span style={{ color: "green" }}>
          Available
        </span>
      )}

      {/* ACTIONS */}
      {canManage && (
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "4px"
          }}
        >

          {/* EDIT */}
          <button
            onClick={() =>
              navigate(`/edit-medicine/${med.id}`)
            }
            style={{
              flex: 1,
              padding: "9px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              background: "#fff",
              color: "#374151",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            Edit
          </button>

          {/* DELETE */}
          {confirmDelete ? (
            <button
              onClick={() => {
                deleteMedicine(med.id);
                setConfirm(false);
              }}
              style={{
                flex: 1,
                padding: "9px 12px",
                border: "none",
                borderRadius: "8px",
                background: "#dc2626",
                color: "white",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Confirm Delete
            </button>
          ) : (
            <button
              onClick={() => setConfirm(true)}
              style={{
                flex: 1,
                padding: "9px 12px",
                border: "1px solid #fecaca",
                borderRadius: "8px",
                background: "#fff",
                color: "#dc2626",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Delete
            </button>
          )}

        </div>
      )}

    </div>
  );
}

export default MedicineCard;