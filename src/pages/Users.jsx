import { useEffect, useState } from "react";
import API from "../api/api";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap');
  .us-main { padding: 36px 40px; max-width: 1280px; margin: 0 auto; }
  .us-title { font-size: 30px; }
  .us-layout { display: grid; grid-template-columns: 340px 1fr; gap: 22px; align-items: start; }
  .us-sticky { position: sticky; top: 80px; }
  .us-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; margin-bottom: 16px; }
  .us-search { display: flex; gap: 8px; align-items: center; flex-wrap: nowrap; }
  .us-table-row { display: grid; grid-template-columns: 2fr 2fr 1fr; gap: 8px; padding: 11px 18px; align-items: center; }
  .us-mob-addstaff { display: none; }
  @media (max-width: 640px) {
    .us-main { padding: 14px; }
    .us-title { font-size: 22px; }
    .us-layout { grid-template-columns: 1fr; }
    .us-sticky { position: static; }
    .us-stats { grid-template-columns: 1fr 1fr; }
    .us-search { flex-wrap: wrap; }
    .us-table-row { grid-template-columns: 1fr auto; }
    .us-table-row .us-email-col { display: none; }
    .us-mob-addstaff { display: inline-flex; }
    .us-desktop-form { display: none !important; }
  }
  @media (min-width: 641px) and (max-width: 1024px) {
    .us-main { padding: 24px; }
    .us-layout { grid-template-columns: 1fr; }
    .us-sticky { position: static; }
  }
`;

const ROLE_CONFIG = { admin:{bg:"#faf5ff",bo:"#e9d5ff",c:"#6b21a8",icon:"👑",l:"Admin"}, pharmacist:{bg:"#f0fdf6",bo:"#bbf7d0",c:"#14532d",icon:"💊",l:"Pharmacist"}, inventory_manager:{bg:"#eff6ff",bo:"#bfdbfe",c:"#1e3a8a",icon:"📦",l:"Inv. Manager"} };

function RoleBadge({ role }) {
  const r = ROLE_CONFIG[role] || { bg:"#f3f4f6", bo:"#e5e7eb", c:"#374151", icon:"👤", l:role };
  return <span style={{ display:"inline-flex", alignItems:"center", gap:"4px", padding:"3px 9px", borderRadius:"99px", fontSize:"11.5px", fontWeight:600, fontFamily:"'DM Sans',sans-serif", background:r.bg, border:`1.5px solid ${r.bo}`, color:r.c, whiteSpace:"nowrap" }}><span style={{ fontSize:"10px" }}>{r.icon}</span>{r.l}</span>;
}

function Avatar({ name, role }) {
  const r = ROLE_CONFIG[role] || { bg:"#f3f4f6", bo:"#e5e7eb", c:"#374151" };
  const initials = name?.split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase()||"?";
  return <div style={{ width:"34px", height:"34px", borderRadius:"50%", background:r.bg, border:`1.5px solid ${r.bo}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", fontWeight:700, color:r.c, flexShrink:0, fontFamily:"'DM Sans',sans-serif" }}>{initials}</div>;
}

const iBase = { width:"100%", boxSizing:"border-box", padding:"11px 14px", border:"1.5px solid #e5e7eb", borderRadius:"10px", fontSize:"14px", color:"#111827", fontFamily:"'DM Sans',sans-serif", background:"#fff", outline:"none", transition:"border-color 0.15s, box-shadow 0.15s" };
const onFocus = e => { e.target.style.borderColor="#0D6E4F"; e.target.style.boxShadow="0 0 0 3px rgba(13,110,79,0.1)"; };
const onBlur  = e => { e.target.style.borderColor="#e5e7eb"; e.target.style.boxShadow="none"; };
const selectStyle = { ...iBase, cursor:"pointer", appearance:"none", WebkitAppearance:"none", backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat:"no-repeat", backgroundPosition:"right 14px center", paddingRight:"36px" };

function CreateForm({ onCreated }) {
  const [f, setF] = useState({ name:"", email:"", password:"", role:"pharmacist" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const token = localStorage.getItem("token");
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  const showToast = (msg,type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null),4000); };

  const submit = async () => {
    setLoading(true);
    try {
      await API.post("/users",{...f},{headers:{Authorization:`Bearer ${token}`}});
      showToast("Staff member created!"); setF({name:"",email:"",password:"",role:"pharmacist"}); onCreated();
    } catch(e) { console.log(e); showToast("Failed to create user.","error"); } finally { setLoading(false); }
  };

  const disabled = loading||!f.name||!f.email||!f.password;
  return (
    <div style={{ background:"#fff", borderRadius:"16px", border:"1.5px solid #e5e7eb", padding:"22px", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
      <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"18px" }}>
        <span>➕</span>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"17px", fontWeight:700, color:"#111827", margin:0 }}>Create Staff</h2>
      </div>
      {toast && <div style={{ background:toast.type==="success"?"#f0fdf6":"#fef2f2", border:`1.5px solid ${toast.type==="success"?"#bbf7d0":"#fecaca"}`, borderRadius:"9px", padding:"10px 12px", marginBottom:"14px", fontSize:"12.5px", color:toast.type==="success"?"#14532d":"#dc2626", fontWeight:500 }}>{toast.type==="success"?"✅":"⚠️"} {toast.msg}</div>}
      <div style={{ display:"flex", flexDirection:"column", gap:"13px" }}>
        {[["Full Name","👤","text","name","e.g. Amina Bello"],["Email","✉️","email","email","staff@tifehhealth.com"]].map(([label,icon,type,key,ph])=>(
          <div key={key}>
            <label style={{ display:"flex", alignItems:"center", gap:"4px", fontSize:"12.5px", fontWeight:600, color:"#374151", marginBottom:"5px", fontFamily:"'DM Sans',sans-serif" }}><span>{icon}</span>{label}</label>
            <input type={type} placeholder={ph} value={f[key]} onChange={e=>set(key,e.target.value)} style={iBase} onFocus={onFocus} onBlur={onBlur} />
          </div>
        ))}
        <div>
          <label style={{ display:"flex", alignItems:"center", gap:"4px", fontSize:"12.5px", fontWeight:600, color:"#374151", marginBottom:"5px", fontFamily:"'DM Sans',sans-serif" }}>🔒 Password</label>
          <div style={{ position:"relative" }}>
            <input type={showPw?"text":"password"} placeholder="••••••••" value={f.password} onChange={e=>set("password",e.target.value)} style={{...iBase,paddingRight:"42px"}} onFocus={onFocus} onBlur={onBlur} />
            <button type="button" onClick={()=>setShowPw(v=>!v)} style={{ position:"absolute", right:"12px", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:"14px", color:"#9ca3af", padding:0 }}>{showPw?"🙈":"👁️"}</button>
          </div>
        </div>
        <div>
          <label style={{ display:"flex", alignItems:"center", gap:"4px", fontSize:"12.5px", fontWeight:600, color:"#374151", marginBottom:"5px", fontFamily:"'DM Sans',sans-serif" }}>🏷️ Role</label>
          <select value={f.role} onChange={e=>set("role",e.target.value)} style={selectStyle} onFocus={onFocus} onBlur={onBlur}>
            <option value="pharmacist">💊 Pharmacist</option>
            <option value="inventory_manager">📦 Inventory Manager</option>
            <option value="admin">👑 Admin</option>
          </select>
        </div>
        <button onClick={submit} disabled={disabled} style={{ width:"100%", padding:"12px", background:disabled?"#9ca3af":"linear-gradient(135deg,#0D6E4F,#16a34a)", border:"none", borderRadius:"10px", color:"white", fontSize:"14px", fontWeight:600, fontFamily:"'DM Sans',sans-serif", cursor:disabled?"not-allowed":"pointer", boxShadow:disabled?"none":"0 4px 14px rgba(13,110,79,0.28)" }}>
          {loading?"Creating…":"➕ Create Staff"}
        </button>
      </div>
    </div>
  );
}

function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => { fetchUsers(); }, []);
  const fetchUsers = async () => { try { const r = await API.get("/users",{headers:{Authorization:`Bearer ${token}`}}); setUsers(r.data); } catch(e){console.log(e);} };

  const filtered = users.filter(u => {
    const matchRole = roleFilter==="all" || u.role===roleFilter;
    const matchSearch = !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });
  const counts = { all:users.length, admin:users.filter(u=>u.role==="admin").length, pharmacist:users.filter(u=>u.role==="pharmacist").length, inventory_manager:users.filter(u=>u.role==="inventory_manager").length };
  const TH = { fontFamily:"'DM Sans',sans-serif", fontSize:"10.5px", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.8px", color:"#9ca3af" };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(145deg,#f0fdf6 0%,#f8fafc 60%,#eff6ff 100%)", fontFamily:"'DM Sans',sans-serif" }}>
      <style>{CSS}</style>
      <main className="us-main">
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"22px", flexWrap:"wrap", gap:"12px" }}>
          <div>
            <h1 className="us-title" style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, color:"#0D6E4F", margin:0 }}>Staff Management</h1>
            <p style={{ margin:"5px 0 0", fontSize:"13px", color:"#6b7280" }}>Create and manage pharmacy staff accounts</p>
          </div>
          <button className="us-mob-addstaff" onClick={()=>setShowForm(v=>!v)} style={{ display:"none", alignItems:"center", gap:"6px", padding:"9px 16px", background:"linear-gradient(135deg,#0D6E4F,#16a34a)", border:"none", borderRadius:"9px", color:"white", fontSize:"13px", fontWeight:600, fontFamily:"'DM Sans',sans-serif", cursor:"pointer" }}>➕ {showForm?"Hide":"Add Staff"}</button>
        </div>

        {/* Mobile collapsible form */}
        {showForm && <div style={{ marginBottom:"16px" }} className="us-desktop-form"><CreateForm onCreated={fetchUsers} /></div>}

        <div className="us-layout">
          <div className="us-sticky us-desktop-form"><CreateForm onCreated={fetchUsers} /></div>

          <div>
            {/* Stats */}
            <div className="us-stats">
              {[{l:"Total",v:counts.all,bg:"#f0fdf6",bo:"#bbf7d0",c:"#14532d"},{l:"Admins",v:counts.admin,bg:"#faf5ff",bo:"#e9d5ff",c:"#6b21a8"},{l:"Pharmacists",v:counts.pharmacist,bg:"#f0fdf6",bo:"#bbf7d0",c:"#14532d"},{l:"Inv. Managers",v:counts.inventory_manager,bg:"#eff6ff",bo:"#bfdbfe",c:"#1e3a8a"}].map(s=>(
                <div key={s.l} style={{ background:s.bg, border:`1.5px solid ${s.bo}`, borderRadius:"12px", padding:"12px 14px" }}>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"22px", fontWeight:700, color:s.c }}>{s.v}</div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"11px", fontWeight:500, color:s.c, opacity:.8, marginTop:"1px" }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Search */}
            <div style={{ background:"#fff", borderRadius:"12px", border:"1.5px solid #e5e7eb", padding:"12px 14px", marginBottom:"14px" }}>
              <div className="us-search">
                <div style={{ position:"relative", flex:1, minWidth:"120px" }}>
                  <span style={{ position:"absolute", left:"11px", top:"50%", transform:"translateY(-50%)", fontSize:"14px", pointerEvents:"none" }}>🔍</span>
                  <input placeholder="Search by name or email…" value={search} onChange={e=>setSearch(e.target.value)} style={{...iBase,paddingLeft:"36px",background:"#f9fafb"}} onFocus={e=>{e.target.style.borderColor="#0D6E4F";e.target.style.background="#fff";}} onBlur={e=>{e.target.style.borderColor="#e5e7eb";e.target.style.background="#f9fafb";}} />
                </div>
                <select value={roleFilter} onChange={e=>setRoleFilter(e.target.value)} style={{...selectStyle,width:"auto",paddingRight:"30px",backgroundPosition:"right 10px center",flexShrink:0}} onFocus={onFocus} onBlur={onBlur}>
                  <option value="all">All Roles</option><option value="admin">Admin</option><option value="pharmacist">Pharmacist</option><option value="inventory_manager">Inv. Manager</option>
                </select>
              </div>
            </div>

            {/* Staff table */}
            <div style={{ background:"#fff", borderRadius:"16px", border:"1.5px solid #e5e7eb", overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ padding:"14px 18px", borderBottom:"1.5px solid #f3f4f6", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"8px" }}><span>👥</span><h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"16px", fontWeight:700, color:"#111827", margin:0 }}>Staff List</h3></div>
                <span style={{ fontSize:"12px", color:"#6b7280" }}>{filtered.length} of {users.length}</span>
              </div>
              {/* Desktop header */}
              <div className="us-table-row" style={{ borderBottom:"1px solid #f3f4f6", background:"#f9fafb" }}>
                <div style={TH}>Staff Member</div>
                <div className="us-email-col" style={TH}>Email</div>
                <div style={TH}>Role</div>
              </div>
              {filtered.length===0
                ? <div style={{ textAlign:"center", padding:"40px 0", color:"#9ca3af" }}><div style={{ fontSize:"28px", marginBottom:"8px" }}>👤</div><div style={{ fontSize:"13.5px", fontWeight:500 }}>No staff found</div></div>
                : filtered.map((user,i)=>(
                  <div key={user.id} className="us-table-row" style={{ borderBottom:i<filtered.length-1?"1px solid #f7f7f7":"none", transition:"background 0.1s" }}
                    onMouseEnter={e=>e.currentTarget.style.background="#fafafa"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <div style={{ display:"flex", alignItems:"center", gap:"9px", minWidth:0 }}>
                      <Avatar name={user.name} role={user.role} />
                      <div style={{ minWidth:0 }}>
                        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"13.5px", fontWeight:600, color:"#111827", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user.name}</div>
                        {/* Show email here on mobile since email col is hidden */}
                        <div style={{ fontSize:"11.5px", color:"#6b7280", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }} className="us-mob-email">{user.email}</div>
                      </div>
                    </div>
                    <div className="us-email-col" style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"13px", color:"#6b7280", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user.email}</div>
                    <div><RoleBadge role={user.role} /></div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
export default Users;