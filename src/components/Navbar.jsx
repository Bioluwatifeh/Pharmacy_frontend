import { Link, useLocation } from "react-router-dom";

/* ─── TifehHealth Logo ─────────────────────────────────────── */
function TifehLogo() {
  return (
    <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect width="36" height="36" rx="10" fill="#0D6E4F" />
        <rect x="15" y="7" width="6" height="22" rx="2" fill="white" />
        <rect x="7" y="15" width="22" height="6" rx="2" fill="white" />
        <circle cx="27" cy="9" r="4" fill="#4ADE80" opacity="0.85" />
      </svg>
      <div style={{ lineHeight: 1 }}>
        <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: "20px", color: "#0D6E4F" }}>Tifeh</span>
        <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 400, fontSize: "20px", color: "#1a1a2e" }}>Health</span>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "9px", color: "#6b7280", letterSpacing: "2px", textTransform: "uppercase", marginTop: "1px" }}>Pharmacy System</div>
      </div>
    </Link>
  );
}

/* ─── Role Badge ───────────────────────────────────────────── */
const ROLE_CONFIG = {
  admin:             { bg: "#faf5ff", border: "#e9d5ff", color: "#6b21a8", icon: "👑", label: "Admin" },
  pharmacist:        { bg: "#f0fdf6", border: "#bbf7d0", color: "#14532d", icon: "💊", label: "Pharmacist" },
  inventory_manager: { bg: "#eff6ff", border: "#bfdbfe", color: "#1e3a8a", icon: "📦", label: "Inv. Manager" },
  wholesale_customer:{ bg: "#fef9c3", border: "#fde68a", color: "#854d0e", icon: "🛒", label: "Customer" },
};

function RoleBadge({ role }) {
  const r = ROLE_CONFIG[role] || { bg: "#f3f4f6", border: "#e5e7eb", color: "#374151", icon: "👤", label: role };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "4px",
      padding: "3px 9px", borderRadius: "99px",
      fontSize: "11px", fontWeight: 600,
      fontFamily: "'DM Sans', sans-serif",
      background: r.bg, border: `1.5px solid ${r.border}`, color: r.color
    }}>
      <span style={{ fontSize: "10px" }}>{r.icon}</span> {r.label}
    </span>
  );
}

/* ─── Nav Link ─────────────────────────────────────────────── */
function NavLink({ to, label, icon }) {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(to + "/");

  return (
    <Link
      to={to}
      style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        padding: "7px 13px", borderRadius: "8px",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "13.5px", fontWeight: isActive ? 600 : 500,
        color: isActive ? "#0D6E4F" : "#4b5563",
        background: isActive ? "#f0fdf6" : "transparent",
        border: `1.5px solid ${isActive ? "#bbf7d0" : "transparent"}`,
        textDecoration: "none",
        transition: "all 0.15s",
        whiteSpace: "nowrap"
      }}
      onMouseEnter={e => {
        if (!isActive) {
          e.currentTarget.style.background = "#f9fafb";
          e.currentTarget.style.color = "#111827";
        }
      }}
      onMouseLeave={e => {
        if (!isActive) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "#4b5563";
        }
      }}
    >
      <span style={{ fontSize: "14px" }}>{icon}</span>
      {label}
    </Link>
  );
}

/* ─── Navbar ───────────────────────────────────────────────── */
function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  const initials = user?.name?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?";
  const roleConf = ROLE_CONFIG[user?.role] || { color: "#374151" };

  return (
    <>
      {/* Google Fonts */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap');`}</style>

      <header style={{
        background: "rgba(255,255,255,0.96)",
        backdropFilter: "blur(12px)",
        borderBottom: "1.5px solid #e5e7eb",
        padding: "0 32px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
        fontFamily: "'DM Sans', sans-serif"
      }}>

        {/* Logo */}
        <TifehLogo />

        {/* Nav links */}
        <nav style={{ display: "flex", alignItems: "center", gap: "2px", flex: 1, justifyContent: "center", flexWrap: "wrap" }}>

          {user?.role === "admin" && (
            <NavLink to="/dashboard"   label="Dashboard"    icon="📊" />
          )}

          <NavLink to="/medicines"     label="Medicines"    icon="💊" />
          <NavLink to="/create-order"  label="Create Order" icon="🛒" />

          {(user?.role === "admin" || user?.role === "pharmacist") && (
            <NavLink to="/orders"      label="Orders"       icon="📋" />
          )}

          {(user?.role === "admin" || user?.role === "inventory_manager") && (
            <NavLink to="/add-medicine" label="Add Medicine" icon="➕" />
          )}

          {user?.role === "admin" && (
            <NavLink to="/users"       label="Staff"        icon="👥" />
          )}

          {user?.role === "wholesale_customer" && (
            <NavLink to="/my-orders"   label="My Orders"    icon="📦" />
          )}

        </nav>

        {/* User info + logout */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>

          {/* Avatar */}
          <div style={{
            width: "34px", height: "34px", borderRadius: "50%",
            background: `linear-gradient(135deg, #0D6E4F, #16a34a)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontWeight: 700, fontSize: "13px",
            flexShrink: 0
          }}>{initials}</div>

          {/* Name + role */}
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13.5px", fontWeight: 600, color: "#111827" }}>
              {user?.name}
            </div>
            <RoleBadge role={user?.role} />
          </div>

          {/* Divider */}
          <div style={{ width: "1px", height: "28px", background: "#e5e7eb", margin: "0 4px" }} />

          {/* Logout */}
          <button
            onClick={logout}
            style={{
              display: "inline-flex", alignItems: "center", gap: "5px",
              padding: "7px 14px",
              background: "#fef2f2", border: "1.5px solid #fecaca",
              borderRadius: "8px", color: "#dc2626",
              fontSize: "13px", fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              cursor: "pointer", transition: "background 0.15s"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#fee2e2"}
            onMouseLeave={e => e.currentTarget.style.background = "#fef2f2"}
          >
            <span style={{ fontSize: "13px" }}>🚪</span> Logout
          </button>

        </div>
      </header>
    </>
  );
}

export default Navbar;