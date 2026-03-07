import { useState, useEffect } from "react";
import API from "../api/api";

/* ─── TifehHealth Logo ─────────────────────────────────────── */
function TifehLogo({ size = "lg" }) {
  const iconSize = size === "lg" ? 48 : 36;
  const fontSize = size === "lg" ? 28 : 20;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "center" }}>
      <svg width={iconSize} height={iconSize} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="36" height="36" rx="10" fill="#0D6E4F" />
        <rect x="15" y="7" width="6" height="22" rx="2" fill="white" />
        <rect x="7" y="15" width="22" height="6" rx="2" fill="white" />
        <circle cx="27" cy="9" r="4" fill="#4ADE80" opacity="0.85" />
      </svg>
      <div style={{ lineHeight: 1 }}>
        <span style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontWeight: 700, fontSize: `${fontSize}px`, color: "#0D6E4F", letterSpacing: "-0.3px"
        }}>Tifeh</span>
        <span style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontWeight: 400, fontSize: `${fontSize}px`, color: "#1a1a2e", letterSpacing: "-0.3px"
        }}>Health</span>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "10px", color: "#6b7280",
          letterSpacing: "2.5px", textTransform: "uppercase", marginTop: "3px"
        }}>Pharmacy System</div>
      </div>
    </div>
  );
}

/* ─── Login Page ───────────────────────────────────────────── */
function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [showPw, setShowPw]     = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel  = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.location.reload();
    } catch (err) {
      console.log(err);
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      fontFamily: "'DM Sans', sans-serif",
      background: "linear-gradient(145deg, #f0fdf6 0%, #f8fafc 55%, #eff6ff 100%)"
    }}>

      {/* ── Left decorative panel ── */}
      <div style={{
        width: "45%",
        background: "linear-gradient(160deg, #0D6E4F 0%, #065f46 50%, #064e3b 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Decorative circles */}
        <div style={{
          position: "absolute", top: "-80px", right: "-80px",
          width: "300px", height: "300px", borderRadius: "50%",
          background: "rgba(74,222,128,0.08)", pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", bottom: "-60px", left: "-60px",
          width: "240px", height: "240px", borderRadius: "50%",
          background: "rgba(255,255,255,0.04)", pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", top: "40%", left: "-30px",
          width: "140px", height: "140px", borderRadius: "50%",
          background: "rgba(74,222,128,0.05)", pointerEvents: "none"
        }} />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: "320px" }}>
          {/* Large cross icon */}
          <div style={{
            width: "80px", height: "80px", borderRadius: "20px",
            background: "rgba(255,255,255,0.12)",
            border: "1.5px solid rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 32px", backdropFilter: "blur(8px)"
          }}>
            <svg width="40" height="40" viewBox="0 0 36 36" fill="none">
              <rect x="15" y="4"  width="6" height="28" rx="3" fill="white" />
              <rect x="4"  y="15" width="28" height="6" rx="3" fill="white" />
            </svg>
          </div>

          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "32px", fontWeight: 700,
            color: "white", margin: "0 0 16px", lineHeight: 1.2
          }}>Welcome back</h2>

          <p style={{
            fontSize: "15px", color: "rgba(255,255,255,0.65)",
            lineHeight: 1.7, margin: "0 0 48px"
          }}>
            Sign in to manage your pharmacy inventory, orders, and customer records.
          </p>

          {/* Feature pills */}
          {["💊 Medicine Inventory", "📦 Order Management", "👥 Customer Records"].map(f => (
            <div key={f} style={{
              display: "flex", alignItems: "center", gap: "10px",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "10px", padding: "10px 16px",
              marginBottom: "10px", textAlign: "left"
            }}>
              <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right login form ── */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 40px"
      }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>

          {/* Logo */}
          <div style={{ marginBottom: "40px" }}>
            <TifehLogo size="lg" />
          </div>

          {/* Heading */}
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "26px", fontWeight: 700,
            color: "#111827", margin: "0 0 6px"
          }}>Sign in to your account</h1>
          <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 32px" }}>
            Enter your credentials to continue
          </p>

          {/* Error message */}
          {error && (
            <div style={{
              background: "#fef2f2", border: "1.5px solid #fecaca",
              borderRadius: "10px", padding: "12px 16px",
              marginBottom: "20px", fontSize: "13.5px",
              color: "#dc2626", fontWeight: 500,
              display: "flex", alignItems: "center", gap: "8px"
            }}>
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin}>

            {/* Email */}
            <div style={{ marginBottom: "18px" }}>
              <label style={{
                display: "block", fontSize: "13px", fontWeight: 600,
                color: "#374151", marginBottom: "6px", letterSpacing: "0.2px"
              }}>Email address</label>
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute", left: "14px", top: "50%",
                  transform: "translateY(-50%)", fontSize: "16px", pointerEvents: "none"
                }}>✉️</span>
                <input
                  type="email"
                  placeholder="admin@tifehhealth.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: "100%", boxSizing: "border-box",
                    padding: "13px 14px 13px 44px",
                    border: "1.5px solid #e5e7eb", borderRadius: "10px",
                    fontSize: "14px", color: "#111827",
                    fontFamily: "'DM Sans', sans-serif",
                    background: "#fff", outline: "none",
                    transition: "border-color 0.15s, box-shadow 0.15s"
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = "#0D6E4F";
                    e.target.style.boxShadow = "0 0 0 3px rgba(13,110,79,0.1)";
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: "26px" }}>
              <label style={{
                display: "block", fontSize: "13px", fontWeight: 600,
                color: "#374151", marginBottom: "6px"
              }}>Password</label>
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute", left: "14px", top: "50%",
                  transform: "translateY(-50%)", fontSize: "16px", pointerEvents: "none"
                }}>🔒</span>
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: "100%", boxSizing: "border-box",
                    padding: "13px 44px 13px 44px",
                    border: "1.5px solid #e5e7eb", borderRadius: "10px",
                    fontSize: "14px", color: "#111827",
                    fontFamily: "'DM Sans', sans-serif",
                    background: "#fff", outline: "none",
                    transition: "border-color 0.15s, box-shadow 0.15s"
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = "#0D6E4F";
                    e.target.style.boxShadow = "0 0 0 3px rgba(13,110,79,0.1)";
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  style={{
                    position: "absolute", right: "14px", top: "50%",
                    transform: "translateY(-50%)", background: "none",
                    border: "none", cursor: "pointer", fontSize: "15px",
                    color: "#9ca3af", padding: 0, lineHeight: 1
                  }}
                >{showPw ? "🙈" : "👁️"}</button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "14px",
                background: loading
                  ? "#9ca3af"
                  : "linear-gradient(135deg, #0D6E4F 0%, #16a34a 100%)",
                border: "none", borderRadius: "10px",
                color: "white", fontSize: "15px", fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: "0.3px",
                boxShadow: loading ? "none" : "0 4px 14px rgba(13,110,79,0.3)",
                transition: "opacity 0.15s, transform 0.1s"
              }}
              onMouseEnter={e => { if (!loading) e.target.style.opacity = "0.92"; }}
              onMouseLeave={e => { e.target.style.opacity = "1"; }}
              onMouseDown={e => { if (!loading) e.target.style.transform = "scale(0.99)"; }}
              onMouseUp={e => { e.target.style.transform = "scale(1)"; }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>

          </form>

          <p style={{
            textAlign: "center", marginTop: "32px",
            fontSize: "12px", color: "#9ca3af"
          }}>
            © {new Date().getFullYear()} TifehHealth · Pharmacy Management System
          </p>

        </div>
      </div>

    </div>
  );
}

export default Login;