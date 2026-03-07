import { useEffect, useState } from "react";
import API from "../api/api";

/* ─── Role Badge ───────────────────────────────────────────── */
const ROLE_CONFIG = {
  admin:             { bg: "#faf5ff", border: "#e9d5ff", color: "#6b21a8", icon: "👑", label: "Admin" },
  pharmacist:        { bg: "#f0fdf6", border: "#bbf7d0", color: "#14532d", icon: "💊", label: "Pharmacist" },
  inventory_manager: { bg: "#eff6ff", border: "#bfdbfe", color: "#1e3a8a", icon: "📦", label: "Inventory Manager" },
};

function RoleBadge({ role }) {
  const r = ROLE_CONFIG[role] || { bg: "#f3f4f6", border: "#e5e7eb", color: "#374151", icon: "👤", label: role };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      padding: "3px 10px", borderRadius: "99px",
      fontSize: "12px", fontWeight: 600,
      fontFamily: "'DM Sans', sans-serif",
      background: r.bg, border: `1.5px solid ${r.border}`, color: r.color
    }}>
      <span style={{ fontSize: "11px" }}>{r.icon}</span> {r.label}
    </span>
  );
}

/* ─── Avatar ───────────────────────────────────────────────── */
function Avatar({ name, role }) {
  const r = ROLE_CONFIG[role] || { bg: "#f3f4f6", color: "#374151" };
  const initials = name?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?";
  return (
    <div style={{
      width: "38px", height: "38px", borderRadius: "50%",
      background: r.bg, border: `1.5px solid ${r.border || "#e5e7eb"}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif", fontSize: "13px",
      fontWeight: 700, color: r.color, flexShrink: 0
    }}>{initials}</div>
  );
}

/* ─── Shared input style ───────────────────────────────────── */
const inputBase = {
  width: "100%", boxSizing: "border-box",
  padding: "11px 14px",
  border: "1.5px solid #e5e7eb", borderRadius: "10px",
  fontSize: "14px", color: "#111827",
  fontFamily: "'DM Sans', sans-serif",
  background: "#fff", outline: "none",
  transition: "border-color 0.15s, box-shadow 0.15s"
};

function Field({ label, icon, children }) {
  return (
    <div>
      <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12.5px", fontWeight: 600, color: "#374151", marginBottom: "6px", fontFamily: "'DM Sans', sans-serif" }}>
        <span>{icon}</span> {label}
      </label>
      {children}
    </div>
  );
}

/* ─── Users Page ───────────────────────────────────────────── */
function Users() {
  const [users, setUsers]     = useState([]);
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole]       = useState("pharmacist");
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState("");
  const [search, setSearch]   = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const link = document.createElement("link");
    link.rel  = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap";
    document.head.appendChild(link);
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users", { headers: { Authorization: `Bearer ${token}` } });
      setUsers(res.data);
    } catch (err) { console.log(err); }
  };

  const createUser = async () => {
    setError(""); setSuccess(false); setLoading(true);
    try {
      await API.post("/users", { name, email, password, role }, { headers: { Authorization: `Bearer ${token}` } });
      setSuccess(true);
      setName(""); setEmail(""); setPassword(""); setRole("pharmacist");
      fetchUsers();
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.log(err);
      setError("Failed to create user. Please check the details and try again.");
    } finally { setLoading(false); }
  };

  const filteredUsers = users.filter(u => {
    const matchRole   = roleFilter === "all" || u.role === roleFilter;
    const matchSearch = !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const counts = {
    all: users.length,
    admin: users.filter(u => u.role === "admin").length,
    pharmacist: users.filter(u => u.role === "pharmacist").length,
    inventory_manager: users.filter(u => u.role === "inventory_manager").length,
  };

  const focusStyle = e => { e.target.style.borderColor = "#0D6E4F"; e.target.style.boxShadow = "0 0 0 3px rgba(13,110,79,0.1)"; };
  const blurStyle  = e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(145deg, #f0fdf6 0%, #f8fafc 60%, #eff6ff 100%)", fontFamily: "'DM Sans', sans-serif" }}>

      <main style={{ padding: "36px 40px", maxWidth: "1280px", margin: "0 auto" }}>

        {/* Page heading */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "30px", fontWeight: 700, color: "#0D6E4F", margin: 0 }}>Staff Management</h1>
          <p style={{ margin: "6px 0 0", fontSize: "14px", color: "#6b7280" }}>Create and manage pharmacy staff accounts</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: "28px", alignItems: "start" }}>

          {/* ── Create Staff Form ── */}
          <div style={{ background: "#fff", borderRadius: "18px", border: "1.5px solid #e5e7eb", padding: "28px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", position: "sticky", top: "80px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "22px" }}>
              <span style={{ fontSize: "20px" }}>➕</span>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "18px", fontWeight: 700, color: "#111827", margin: 0 }}>Create Staff</h2>
            </div>

            {success && (
              <div style={{ background: "#f0fdf6", border: "1.5px solid #bbf7d0", borderRadius: "10px", padding: "11px 14px", marginBottom: "18px", fontSize: "13px", color: "#14532d", fontWeight: 500, display: "flex", alignItems: "center", gap: "7px" }}>
                ✅ Staff member created successfully!
              </div>
            )}
            {error && (
              <div style={{ background: "#fef2f2", border: "1.5px solid #fecaca", borderRadius: "10px", padding: "11px 14px", marginBottom: "18px", fontSize: "13px", color: "#dc2626", fontWeight: 500, display: "flex", alignItems: "center", gap: "7px" }}>
                ⚠️ {error}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <Field label="Full Name" icon="👤">
                <input placeholder="e.g. Amina Bello" value={name} onChange={e => setName(e.target.value)} style={inputBase} onFocus={focusStyle} onBlur={blurStyle} />
              </Field>

              <Field label="Email Address" icon="✉️">
                <input type="email" placeholder="staff@tifehhealth.com" value={email} onChange={e => setEmail(e.target.value)} style={inputBase} onFocus={focusStyle} onBlur={blurStyle} />
              </Field>

              <Field label="Password" icon="🔒">
                <div style={{ position: "relative" }}>
                  <input
                    type={showPw ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{ ...inputBase, paddingRight: "42px" }}
                    onFocus={focusStyle} onBlur={blurStyle}
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "15px", color: "#9ca3af", padding: 0 }}>
                    {showPw ? "🙈" : "👁️"}
                  </button>
                </div>
              </Field>

              <Field label="Role" icon="🏷️">
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  style={{
                    ...inputBase, cursor: "pointer", appearance: "none",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: "36px"
                  }}
                  onFocus={focusStyle} onBlur={blurStyle}
                >
                  <option value="pharmacist">💊 Pharmacist</option>
                  <option value="inventory_manager">📦 Inventory Manager</option>
                  <option value="admin">👑 Admin</option>
                </select>
              </Field>

              <button
                onClick={createUser}
                disabled={loading || !name || !email || !password}
                style={{
                  width: "100%", padding: "13px",
                  background: loading || !name || !email || !password
                    ? "#9ca3af"
                    : "linear-gradient(135deg,#0D6E4F,#16a34a)",
                  border: "none", borderRadius: "10px",
                  color: "white", fontSize: "15px", fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif",
                  cursor: loading || !name || !email || !password ? "not-allowed" : "pointer",
                  boxShadow: loading ? "none" : "0 4px 14px rgba(13,110,79,0.28)",
                  marginTop: "4px", transition: "opacity 0.15s"
                }}
                onMouseEnter={e => { if (!loading) e.target.style.opacity = "0.92"; }}
                onMouseLeave={e => { e.target.style.opacity = "1"; }}
              >
                {loading ? "Creating…" : "➕ Create Staff"}
              </button>
            </div>
          </div>

          {/* ── Staff List ── */}
          <div>

            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px", marginBottom: "20px" }}>
              {[
                { label: "Total Staff",        value: counts.all,               bg: "#f0fdf6", border: "#bbf7d0", color: "#14532d" },
                { label: "Admins",             value: counts.admin,             bg: "#faf5ff", border: "#e9d5ff", color: "#6b21a8" },
                { label: "Pharmacists",        value: counts.pharmacist,        bg: "#f0fdf6", border: "#bbf7d0", color: "#14532d" },
                { label: "Inventory Managers", value: counts.inventory_manager, bg: "#eff6ff", border: "#bfdbfe", color: "#1e3a8a" },
              ].map(s => (
                <div key={s.label} style={{ background: s.bg, border: `1.5px solid ${s.border}`, borderRadius: "14px", padding: "14px 16px" }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: 700, color: s.color }}>{s.value}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11.5px", fontWeight: 500, color: s.color, marginTop: "2px", opacity: 0.8 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Search + filter */}
            <div style={{ background: "#fff", borderRadius: "14px", border: "1.5px solid #e5e7eb", padding: "14px 18px", marginBottom: "18px", display: "flex", gap: "10px", alignItems: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ position: "relative", flex: 1 }}>
                <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "15px", pointerEvents: "none" }}>🔍</span>
                <input
                  placeholder="Search by name or email…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ ...inputBase, paddingLeft: "38px", background: "#f9fafb" }}
                  onFocus={e => { e.target.style.borderColor = "#0D6E4F"; e.target.style.boxShadow = "0 0 0 3px rgba(13,110,79,0.1)"; e.target.style.background = "#fff"; }}
                  onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; e.target.style.background = "#f9fafb"; }}
                />
              </div>
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                style={{ ...inputBase, width: "auto", cursor: "pointer", paddingRight: "32px", appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center" }}
                onFocus={focusStyle} onBlur={blurStyle}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="pharmacist">Pharmacist</option>
                <option value="inventory_manager">Inventory Manager</option>
              </select>
            </div>

            {/* Table card */}
            <div style={{ background: "#fff", borderRadius: "18px", border: "1.5px solid #e5e7eb", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ padding: "18px 22px", borderBottom: "1.5px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "18px" }}>👥</span>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "18px", fontWeight: 700, color: "#111827", margin: 0 }}>Staff List</h3>
                </div>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", color: "#6b7280" }}>
                  {filteredUsers.length} of {users.length} staff
                </span>
              </div>

              {/* Table header */}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr", gap: "8px", padding: "10px 22px", borderBottom: "1px solid #f3f4f6", background: "#f9fafb" }}>
                {["Staff Member", "Email", "Role"].map(h => (
                  <div key={h} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px", color: "#9ca3af" }}>{h}</div>
                ))}
              </div>

              {filteredUsers.length === 0 ? (
                <div style={{ textAlign: "center", padding: "50px 0", color: "#9ca3af" }}>
                  <div style={{ fontSize: "32px", marginBottom: "10px" }}>👤</div>
                  <div style={{ fontSize: "14px", fontWeight: 500 }}>No staff members found</div>
                  <div style={{ fontSize: "12.5px", marginTop: "4px" }}>Try a different search or role filter</div>
                </div>
              ) : filteredUsers.map((user, i) => (
                <div key={user.id}
                  style={{
                    display: "grid", gridTemplateColumns: "2fr 2fr 1fr",
                    gap: "8px", padding: "14px 22px", alignItems: "center",
                    borderBottom: i < filteredUsers.length - 1 ? "1px solid #f3f4f6" : "none",
                    transition: "background 0.1s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Avatar name={user.name} role={user.role} />
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 600, color: "#111827" }}>{user.name}</div>
                  </div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13.5px", color: "#6b7280" }}>{user.email}</div>
                  <div><RoleBadge role={user.role} /></div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Users;