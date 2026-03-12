import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .lg-root {
    min-height: 100vh;
    display: flex;
    flex-direction: row;
    font-family: 'DM Sans', sans-serif;
    background: linear-gradient(145deg, #f0fdf6 0%, #f8fafc 55%, #eff6ff 100%);
  }

  .lg-panel {
    width: 45%;
    background: linear-gradient(160deg, #0D6E4F 0%, #065f46 50%, #064e3b 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px;
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
  }

  .lg-form-side {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(32px, 6vw, 60px) clamp(24px, 5vw, 60px);
  }

  .lg-card {
    width: 100%;
    max-width: 400px;
  }

  @media (max-width: 844px) {
    .lg-root {
      flex-direction: column;
      background: linear-gradient(160deg, #0D6E4F 0%, #065f46 28%, #f0fdf6 28%);
      align-items: center;
    }

    .lg-panel { display: none; }

    .lg-form-side {
      width: 100%;
      align-items: flex-start;
      justify-content: center;
      padding: 40px 20px 48px;
    }

    .lg-card {
      background: #fff;
      border-radius: 20px;
      border: 1.5px solid #e5e7eb;
      padding: 32px 28px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.10);
      max-width: 420px;
    }
  }

  @media (max-width: 400px) {
    .lg-form-side { padding: 32px 14px 40px; }
    .lg-card { padding: 28px 20px; }
  }
`;

function TifehLogo() {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"10px", justifyContent:"center" }}>
      <svg width="40" height="40" viewBox="0 0 36 36" fill="none">
        <rect width="36" height="36" rx="10" fill="#0D6E4F" />
        <rect x="15" y="7" width="6" height="22" rx="2" fill="white" />
        <rect x="7" y="15" width="22" height="6" rx="2" fill="white" />
        <circle cx="27" cy="9" r="4" fill="#4ADE80" opacity="0.85" />
      </svg>
      <div style={{ lineHeight:1 }}>
        <span style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"22px", color:"#0D6E4F" }}>Tifeh</span>
        <span style={{ fontFamily:"'Playfair Display',serif", fontWeight:400, fontSize:"22px", color:"#1a1a2e" }}>Health</span>
        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"9px", color:"#6b7280", letterSpacing:"2.5px", textTransform:"uppercase", marginTop:"3px" }}>Pharmacy System</div>
      </div>
    </div>
  );
}

function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [showPw, setShowPw]     = useState(false);

  const iBase = { width:"100%", padding:"13px 14px", border:"1.5px solid #e5e7eb", borderRadius:"10px", fontSize:"14px", color:"#111827", fontFamily:"'DM Sans',sans-serif", background:"#fff", outline:"none", transition:"border-color 0.15s, box-shadow 0.15s" };
  const onFocus = e => { e.target.style.borderColor="#0D6E4F"; e.target.style.boxShadow="0 0 0 3px rgba(13,110,79,0.1)"; };
  const onBlur  = e => { e.target.style.borderColor="#e5e7eb"; e.target.style.boxShadow="none"; };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.location.reload();
    } catch (err) {
      console.log(err);
      setError("Invalid email or password. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="lg-root">
      <style>{CSS}</style>

      {/* Left panel — desktop only */}
      <div className="lg-panel">
        <div style={{ position:"absolute", top:"-80px", right:"-80px", width:"300px", height:"300px", borderRadius:"50%", background:"rgba(74,222,128,0.08)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:"-60px", left:"-60px", width:"240px", height:"240px", borderRadius:"50%", background:"rgba(255,255,255,0.04)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:"40%", left:"-30px", width:"140px", height:"140px", borderRadius:"50%", background:"rgba(74,222,128,0.05)", pointerEvents:"none" }} />
        <div style={{ position:"relative", zIndex:1, textAlign:"center", maxWidth:"300px" }}>
          <div style={{ width:"72px", height:"72px", borderRadius:"18px", background:"rgba(255,255,255,0.12)", border:"1.5px solid rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 28px", backdropFilter:"blur(8px)" }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <rect x="15" y="4" width="6" height="28" rx="3" fill="white" />
              <rect x="4" y="15" width="28" height="6" rx="3" fill="white" />
            </svg>
          </div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"30px", fontWeight:700, color:"white", margin:"0 0 14px", lineHeight:1.2 }}>Welcome back</h2>
          <p style={{ fontSize:"14px", color:"rgba(255,255,255,0.65)", lineHeight:1.7, margin:"0 0 40px" }}>Sign in to manage your pharmacy inventory, orders, and customer records.</p>
          {["💊 Medicine Inventory","📦 Order Management","👥 Customer Records"].map(f => (
            <div key={f} style={{ display:"flex", alignItems:"center", background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:"10px", padding:"10px 16px", marginBottom:"10px" }}>
              <span style={{ fontSize:"14px", color:"rgba(255,255,255,0.9)", fontWeight:500 }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right form side */}
      <div className="lg-form-side">
        <div className="lg-card">

          <div style={{ marginBottom:"28px" }}><TifehLogo /></div>

          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"24px", fontWeight:700, color:"#111827", margin:"0 0 5px" }}>Sign in to your account</h1>
          <p style={{ fontSize:"13.5px", color:"#6b7280", margin:"0 0 24px" }}>Enter your credentials to continue</p>

          {error && (
            <div style={{ background:"#fef2f2", border:"1.5px solid #fecaca", borderRadius:"10px", padding:"11px 14px", marginBottom:"18px", fontSize:"13px", color:"#dc2626", fontWeight:500, display:"flex", alignItems:"center", gap:"8px" }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom:"16px" }}>
              <label style={{ display:"block", fontSize:"13px", fontWeight:600, color:"#374151", marginBottom:"6px" }}>Email address</label>
              <div style={{ position:"relative" }}>
                <span style={{ position:"absolute", left:"14px", top:"50%", transform:"translateY(-50%)", fontSize:"15px", pointerEvents:"none" }}>✉️</span>
                <input type="email" placeholder="admin@tifehhealth.com" value={email} onChange={e=>setEmail(e.target.value)} required style={{...iBase, paddingLeft:"44px"}} onFocus={onFocus} onBlur={onBlur} />
              </div>
            </div>

            <div style={{ marginBottom:"24px" }}>
              <label style={{ display:"block", fontSize:"13px", fontWeight:600, color:"#374151", marginBottom:"6px" }}>Password</label>
              <div style={{ position:"relative" }}>
                <span style={{ position:"absolute", left:"14px", top:"50%", transform:"translateY(-50%)", fontSize:"15px", pointerEvents:"none" }}>🔒</span>
                <input type={showPw?"text":"password"} placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} required style={{...iBase, paddingLeft:"44px", paddingRight:"44px"}} onFocus={onFocus} onBlur={onBlur} />
                <button type="button" onClick={()=>setShowPw(v=>!v)} style={{ position:"absolute", right:"14px", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:"15px", color:"#9ca3af", padding:0 }}>{showPw?"🙈":"👁️"}</button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ width:"100%", padding:"13px", background:loading?"#9ca3af":"linear-gradient(135deg,#0D6E4F,#16a34a)", border:"none", borderRadius:"10px", color:"white", fontSize:"15px", fontWeight:600, fontFamily:"'DM Sans',sans-serif", cursor:loading?"not-allowed":"pointer", boxShadow:loading?"none":"0 4px 14px rgba(13,110,79,0.3)", letterSpacing:"0.3px", transition:"opacity 0.15s" }}
              onMouseEnter={e=>{ if(!loading) e.target.style.opacity="0.92"; }} onMouseLeave={e=>e.target.style.opacity="1"}>
              {loading?"Signing in…":"Sign In"}
            </button>
          </form>

          <p style={{ textAlign:"center", marginTop:"18px", fontSize:"14px", color:"#6b7280" }}>
            New pharmacy?{" "}
            <Link to="/register" style={{ color:"#0D6E4F", fontWeight:600, textDecoration:"none" }}>Register here</Link>
          </p>

          <p style={{ textAlign:"center", marginTop:"24px", fontSize:"12px", color:"#9ca3af" }}>
            © {new Date().getFullYear()} TifehHealth · Pharmacy Management System
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;