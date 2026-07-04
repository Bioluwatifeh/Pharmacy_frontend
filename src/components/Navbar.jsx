import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

/* ─── Role config ──────────────────────────────────────────── */
const ROLE_CONFIG = {
  admin:             { bg: "#faf5ff", border: "#e9d5ff", color: "#6b21a8", icon: "👑", label: "Admin" },
  pharmacist:         { bg: "#f0fdf6", border: "#bbf7d0", color: "#14532d", icon: "💊", label: "Pharmacist" },
  inventory_manager: { bg: "#eff6ff", border: "#bfdbfe", color: "#1e3a8a", icon: "📦", label: "Inv. Manager" },
  wholesale_customer:{ bg: "#fef9c3", border: "#fde68a", color: "#854d0e", icon: "🛒", label: "Customer" },
};

function RoleBadge({ role }) {
  const r = ROLE_CONFIG[role] || { bg: "#f3f4f6", border: "#e5e7eb", color: "#374151", icon: "👤", label: role };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "4px",
      padding: "3px 9px", borderRadius: "99px",
      fontSize: "11px", fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
      background: r.bg, border: `1.5px solid ${r.border}`, color: r.color
    }}>
      <span style={{ fontSize: "10px" }}>{r.icon}</span> {r.label}
    </span>
  );
}

function NavLink({ to, label, icon }) {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(to + "/");
  return (
    <Link to={to} style={{
      display: "inline-flex", alignItems: "center", gap: "6px",
      padding: "7px 13px", borderRadius: "8px",
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "13.5px", fontWeight: isActive ? 600 : 500,
      color: isActive ? "#0D6E4F" : "#4b5563",
      background: isActive ? "#f0fdf6" : "transparent",
      border: `1.5px solid ${isActive ? "#bbf7d0" : "transparent"}`,
      textDecoration: "none", transition: "all 0.15s", whiteSpace: "nowrap"
    }}
    onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "#f9fafb"; e.currentTarget.style.color = "#111827"; }}}
    onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#4b5563"; }}}
    >
      <span style={{ fontSize: "14px" }}>{icon}</span>{label}
    </Link>
  );
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user     = JSON.parse(localStorage.getItem("user"));
  const initials = user?.name?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?";

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setMenuOpen(false);
    navigate("/");
  };
  
  const navItems = [
    user?.role === "admin" ? { to: "/dashboard", label: "Dashboard", icon: "📊" } : null,
    { to: "/medicines", label: "Medicines", icon: "💊" },
    { to: "/create-order", label: "Create Order", icon: "🛒" },
    (user?.role === "admin" || user?.role === "pharmacist") ? { to: "/orders", label: "Orders", icon: "📋" } : null,
    (user?.role === "admin" || user?.role === "inventory_manager") ? { to: "/add-medicine", label: "Add Medicine", icon: "➕" } : null,
    user?.role === "admin" ? { to: "/users", label: "Staff", icon: "👥" } : null,
    user?.role === "wholesale_customer" ? { to: "/my-orders", label: "My Orders", icon: "📦" } : null,
  ].filter(Boolean);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap');
        .th-hamburger { display: none !important; }
        .th-mobile-drawer {
          display: flex; flex-direction: column; gap: 4px;
          position: fixed; top: 56px; left: 0; right: 0;
          background: #fff; border-bottom: 1.5px solid #e5e7eb;
          box-shadow: 0 8px 24px rgba(0,0,0,0.10); z-index: 99;
          padding: 12px 16px 20px;
          transform: translateY(-12px); opacity: 0;
          pointer-events: none; visibility: hidden;
          transition: transform 0.2s ease, opacity 0.2s ease, visibility 0.2s;
        }
        .th-mobile-drawer.open { transform: translateY(0); opacity: 1; pointer-events: all; visibility: visible; }
        @media (min-width: 768px) { .th-mobile-drawer { display: none !important; } }
        @media (max-width: 767px) {
          .th-desktop-nav  { display: none !important; }
          .th-hamburger    { display: flex !important; }
          .th-user-name    { display: none !important; }
          .th-nav-divider  { display: none !important; }
          .th-logout-label { display: none !important; }
        }
        @media (min-width: 768px) and (max-width: 1023px) { .th-user-name { display: none !important; } }
        .th-mlink {
          display: flex; align-items: center; gap: 12px;
          padding: 11px 14px; border-radius: 10px;
          font-size: 14px; font-weight: 500; color: #374151;
          text-decoration: none; font-family: 'DM Sans', sans-serif;
          transition: background 0.12s; border: none; background: transparent; cursor: pointer;
          width: 100%; text-align: left;
        }
        .th-mlink:hover, .th-mlink.active { background: #f0fdf6; color: #0D6E4F; font-weight: 600; }
        .th-mlink-logout:hover { background: #fef2f2 !important; color: #dc2626 !important; }
        .th-mdivider { height: 1px; background: #f3f4f6; margin: 8px 0; }
      `}</style>

      <header style={{
        background: "rgba(255,255,255,0.96)", backdropFilter: "blur(12px)",
        borderBottom: "1.5px solid #e5e7eb",
        padding: "0 clamp(16px, 4vw, 32px)",
        height: "64px",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: "12px",
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 1px 8px rgba(0,0,0,0.05)"
      }}>
        
        {/* BRAND / LOGO SECTION */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", flexShrink: 0 }}>
          <div style={{ width: "36px", height: "36px", background: "#0D6E4F", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", boxShadow: "0 4px 10px rgba(13,110,79,0.2)" }}>
            💊
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "19px", fontWeight: 700, color: "#0D6E4F", letterSpacing: "-0.5px" }}>
            Tifeh<span style={{ color: "#16a34a" }}>Health</span>
          </span>
        </Link>

        {/* Desktop nav (Center) */}
        <nav className="th-desktop-nav" style={{ display: "flex", alignItems: "center", gap: "2px", flex: 1, justifyContent: "center" }}>
          {navItems.map(i => <NavLink key={i.to} to={i.to} label={i.label} icon={i.icon} />)}
        </nav>

        {/* Right side (User/Logout) */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg,#0D6E4F,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: "13px", flexShrink: 0 }}>{initials}</div>
          <div className="th-user-name" style={{ lineHeight: 1.2 }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13.5px", fontWeight: 600, color: "#111827" }}>{user?.name}</div>
            <RoleBadge role={user?.role} />
          </div>
          <div className="th-nav-divider" style={{ width: "1px", height: "28px", background: "#e5e7eb", margin: "0 2px" }} />
          <button onClick={logout} style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "7px 14px", background: "#fef2f2", border: "1.5px solid #fecaca", borderRadius: "8px", color: "#dc2626", fontSize: "13px", fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", transition: "background 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#fee2e2"}
            onMouseLeave={e => e.currentTarget.style.background = "#fef2f2"}>
            🚪 <span className="th-logout-label">Logout</span>
          </button>
          {/* Hamburger */}
          <button className="th-hamburger" onClick={() => setMenuOpen(v => !v)}
            style={{ alignItems: "center", justifyContent: "center", background: "none", border: "1.5px solid #e5e7eb", borderRadius: "8px", padding: "6px 10px", cursor: "pointer", fontSize: "18px", color: "#374151" }}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <div className={`th-mobile-drawer${menuOpen ? " open" : ""}`}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", marginBottom: "4px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg,#0D6E4F,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: "13px" }}>{initials}</div>
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 600, color: "#111827" }}>{user?.name}</div>
            <RoleBadge role={user?.role} />
          </div>
        </div>
        <div className="th-mdivider" />
        {navItems.map(item => {
          const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + "/");
          return (
            <Link key={item.to} to={item.to} onClick={() => setMenuOpen(false)}
              className={`th-mlink${isActive ? " active" : ""}`}>
              <span style={{ fontSize: "18px", width: "26px", textAlign: "center" }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
        <div className="th-mdivider" />
        <button onClick={logout} className="th-mlink th-mlink-logout" style={{ color: "#dc2626" }}>
          <span style={{ fontSize: "18px", width: "26px", textAlign: "center" }}>🚪</span> Logout
        </button>
      </div>

      {menuOpen && <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 98, background: "rgba(0,0,0,0.18)" }} />}
    </>
  );
}

export default Navbar;