import { useEffect, useState } from "react";
import API from "../api/api";

/* ─── Stock Badge ──────────────────────────────────────────── */
function StockBadge({ qty }) {
  if (qty === 0)  return <span style={{ display:"inline-flex", alignItems:"center", gap:"4px", padding:"3px 10px", borderRadius:"99px", fontSize:"11.5px", fontWeight:600, background:"#fee2e2", color:"#dc2626" }}>✖ Out of Stock</span>;
  if (qty <= 10)  return <span style={{ display:"inline-flex", alignItems:"center", gap:"4px", padding:"3px 10px", borderRadius:"99px", fontSize:"11.5px", fontWeight:600, background:"#fef9c3", color:"#92400e" }}>⚠ Limited</span>;
  return               <span style={{ display:"inline-flex", alignItems:"center", gap:"4px", padding:"3px 10px", borderRadius:"99px", fontSize:"11.5px", fontWeight:600, background:"#dcfce7", color:"#14532d" }}>✓ In Stock</span>;
}

/* ─── Medicine Card ────────────────────────────────────────── */
function MedCard({ med, onAdd, inCart }) {
  const [hovered, setHovered] = useState(false);
  const outOfStock = med.stock_quantity === 0;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: inCart ? "#f0fdf6" : "#fff",
        border: `1.5px solid ${inCart ? "#86efac" : hovered ? "#d1fae5" : "#e5e7eb"}`,
        borderRadius: "16px", padding: "20px",
        display: "flex", flexDirection: "column", gap: "10px",
        boxShadow: hovered ? "0 6px 20px rgba(0,0,0,0.07)" : "0 1px 3px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "all 0.15s", opacity: outOfStock ? 0.6 : 1,
        position: "relative"
      }}
    >
      {inCart && (
        <div style={{
          position: "absolute", top: "12px", right: "12px",
          width: "22px", height: "22px", borderRadius: "50%",
          background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "11px", color: "white", fontWeight: 700
        }}>✓</div>
      )}

      <div>
        <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "15px", fontWeight: 700, color: "#111827", marginBottom: "4px" }}>{med.name}</div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", color: "#6b7280", lineHeight: 1.5 }}>
          {med.description?.length > 70 ? med.description.slice(0, 70) + "…" : med.description || "No description"}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "4px" }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "18px", fontWeight: 700, color: "#0D6E4F" }}>
          ₦{Number(med.price).toLocaleString()}
        </div>
        <StockBadge qty={med.stock_quantity} />
      </div>

      <button
        onClick={() => onAdd(med)}
        disabled={outOfStock || inCart}
        style={{
          width: "100%", padding: "9px",
          background: inCart
            ? "#dcfce7"
            : outOfStock
              ? "#f3f4f6"
              : "linear-gradient(135deg, #0D6E4F, #16a34a)",
          border: "none", borderRadius: "8px",
          color: inCart ? "#14532d" : outOfStock ? "#9ca3af" : "white",
          fontSize: "13px", fontWeight: 600,
          fontFamily: "'DM Sans', sans-serif",
          cursor: outOfStock || inCart ? "not-allowed" : "pointer",
          transition: "opacity 0.15s"
        }}
      >
        {inCart ? "✓ Added to Cart" : outOfStock ? "Unavailable" : "+ Add to Cart"}
      </button>
    </div>
  );
}

/* ─── CreateOrder Page ─────────────────────────────────────── */
function CreateOrder() {
  const [medicines, setMedicines] = useState([]);
  const [cart, setCart]           = useState([]);
  const [search, setSearch]       = useState("");
  const [loading, setLoading]     = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError]     = useState("");

  const token = localStorage.getItem("token");
  const user  = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const link = document.createElement("link");
    link.rel  = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap";
    document.head.appendChild(link);
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const res = await API.get("/medicines", { headers: { Authorization: `Bearer ${token}` } });
      setMedicines(res.data);
    } catch (err) { console.log(err); }
  };

  const searchMedicine = async () => {
    try {
      const res = await API.get(`/medicines/search?q=${search}`, { headers: { Authorization: `Bearer ${token}` } });
      setMedicines(res.data);
    } catch (err) { console.log(err); }
  };

  const addToCart = (medicine) => {
    if (cart.find(i => i.id === medicine.id)) return;
    setCart([...cart, { ...medicine, quantity: 1 }]);
  };

  const updateQuantity = (id, quantity) => {
    const val = Math.max(1, Number(quantity));
    setCart(cart.map(item => item.id === id ? { ...item, quantity: val } : item));
  };

  const removeFromCart = (id) => setCart(cart.filter(i => i.id !== id));

  const cartTotal = cart.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);

  const placeOrder = async () => {
    setOrderError(""); setLoading(true);
    try {
      const items = cart.map(i => ({ medicine_id: i.id, quantity: i.quantity, price: i.price }));
      await API.post("/orders", { customer_id: user.id, items }, { headers: { Authorization: `Bearer ${token}` } });
      setOrderSuccess(true);
      setCart([]);
      setTimeout(() => setOrderSuccess(false), 5000);
    } catch (err) {
      console.log(err);
      setOrderError("Order failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cartIds = new Set(cart.map(i => i.id));

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(145deg, #f0fdf6 0%, #f8fafc 60%, #eff6ff 100%)", fontFamily: "'DM Sans', sans-serif" }}>

      <main style={{ padding: "36px 40px", maxWidth: "1400px", margin: "0 auto" }}>

        {/* Page heading */}
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "30px", fontWeight: 700, color: "#0D6E4F", margin: 0 }}>Create Order</h1>
          <p style={{ margin: "6px 0 0", fontSize: "14px", color: "#6b7280" }}>Browse medicines, build your cart, and place the order</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "28px", alignItems: "start" }}>

          {/* ── Left: search + medicine grid ── */}
          <div>

            {/* Search bar */}
            <div style={{
              background: "#fff", borderRadius: "14px", border: "1.5px solid #e5e7eb",
              padding: "16px 20px", marginBottom: "24px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              display: "flex", gap: "12px", alignItems: "center"
            }}>
              <div style={{ position: "relative", flex: 1 }}>
                <span style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", pointerEvents: "none" }}>🔍</span>
                <input
                  placeholder="Search medicine by name…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && searchMedicine()}
                  style={{
                    width: "100%", boxSizing: "border-box",
                    padding: "11px 14px 11px 42px",
                    border: "1.5px solid #e5e7eb", borderRadius: "10px",
                    fontSize: "14px", color: "#111827",
                    fontFamily: "'DM Sans', sans-serif",
                    outline: "none", background: "#f9fafb",
                    transition: "border-color 0.15s, box-shadow 0.15s"
                  }}
                  onFocus={e => { e.target.style.borderColor="#0D6E4F"; e.target.style.boxShadow="0 0 0 3px rgba(13,110,79,0.1)"; e.target.style.background="#fff"; }}
                  onBlur={e => { e.target.style.borderColor="#e5e7eb"; e.target.style.boxShadow="none"; e.target.style.background="#f9fafb"; }}
                />
              </div>
              <button
                onClick={searchMedicine}
                style={{
                  padding: "11px 22px", background: "linear-gradient(135deg,#0D6E4F,#16a34a)",
                  border: "none", borderRadius: "10px", color: "white",
                  fontSize: "14px", fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                  cursor: "pointer", whiteSpace: "nowrap",
                  boxShadow: "0 3px 10px rgba(13,110,79,0.25)"
                }}
              >Search</button>
              <button
                onClick={fetchMedicines}
                style={{
                  padding: "11px 16px", background: "#f3f4f6",
                  border: "1.5px solid #e5e7eb", borderRadius: "10px",
                  color: "#6b7280", fontSize: "13px", fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif", cursor: "pointer"
                }}
              >Reset</button>
            </div>

            {/* Medicine grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
              {medicines.length === 0
                ? <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0", color: "#9ca3af", fontSize: "15px" }}>No medicines found</div>
                : medicines.map(med => (
                    <MedCard key={med.id} med={med} onAdd={addToCart} inCart={cartIds.has(med.id)} />
                  ))
              }
            </div>
          </div>

          {/* ── Right: Cart ── */}
          <div style={{
            background: "#fff", borderRadius: "18px",
            border: "1.5px solid #e5e7eb", overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            position: "sticky", top: "80px"
          }}>

            {/* Cart header */}
            <div style={{
              padding: "18px 22px", borderBottom: "1.5px solid #f3f4f6",
              display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "18px", fontWeight: 700, color: "#111827", margin: 0 }}>
                🛒 Cart
              </h3>
              {cart.length > 0 && (
                <span style={{ background: "#0D6E4F", color: "white", borderRadius: "99px", padding: "2px 9px", fontSize: "12px", fontWeight: 700 }}>
                  {cart.length}
                </span>
              )}
            </div>

            {/* Toasts */}
            {orderSuccess && (
              <div style={{ margin: "14px 16px 0", background: "#f0fdf6", border: "1.5px solid #bbf7d0", borderRadius: "10px", padding: "11px 14px", fontSize: "13px", color: "#14532d", fontWeight: 500, display: "flex", alignItems: "center", gap: "7px" }}>
                ✅ Order placed successfully!
              </div>
            )}
            {orderError && (
              <div style={{ margin: "14px 16px 0", background: "#fef2f2", border: "1.5px solid #fecaca", borderRadius: "10px", padding: "11px 14px", fontSize: "13px", color: "#dc2626", fontWeight: 500, display: "flex", alignItems: "center", gap: "7px" }}>
                ⚠️ {orderError}
              </div>
            )}

            {/* Cart items */}
            <div style={{ maxHeight: "380px", overflowY: "auto", padding: "12px 16px" }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#9ca3af" }}>
                  <div style={{ fontSize: "36px", marginBottom: "10px" }}>🛒</div>
                  <div style={{ fontSize: "13.5px" }}>Your cart is empty.<br />Add medicines to get started.</div>
                </div>
              ) : cart.map(item => (
                <div key={item.id} style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "10px 0", borderBottom: "1px solid #f3f4f6"
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
                    <div style={{ fontSize: "12px", color: "#0D6E4F", fontWeight: 600, marginTop: "2px" }}>
                      ₦{(Number(item.price) * item.quantity).toLocaleString()}
                    </div>
                  </div>

                  {/* Qty stepper */}
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}
                      style={{ width:"26px", height:"26px", borderRadius:"6px", border:"1.5px solid #e5e7eb", background:"#f9fafb", cursor: item.quantity <= 1 ? "not-allowed" : "pointer", fontSize:"14px", fontWeight:700, color:"#374151", display:"flex", alignItems:"center", justifyContent:"center" }}>−</button>
                    <span style={{ width:"28px", textAlign:"center", fontSize:"13px", fontWeight:700, color:"#111827" }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={{ width:"26px", height:"26px", borderRadius:"6px", border:"1.5px solid #e5e7eb", background:"#f9fafb", cursor:"pointer", fontSize:"14px", fontWeight:700, color:"#374151", display:"flex", alignItems:"center", justifyContent:"center" }}>+</button>
                  </div>

                  <button onClick={() => removeFromCart(item.id)}
                    style={{ background:"none", border:"none", cursor:"pointer", color:"#f87171", fontSize:"16px", padding:"0 2px", lineHeight:1 }}>✕</button>
                </div>
              ))}
            </div>

            {/* Cart footer */}
            {cart.length > 0 && (
              <div style={{ padding: "16px 20px", borderTop: "1.5px solid #f3f4f6" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px" }}>
                  <span style={{ fontSize:"13px", color:"#6b7280", fontWeight:500 }}>Order Total</span>
                  <span style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"22px", fontWeight:700, color:"#0D6E4F" }}>
                    ₦{cartTotal.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={placeOrder}
                  disabled={loading}
                  style={{
                    width: "100%", padding: "13px",
                    background: loading ? "#9ca3af" : "linear-gradient(135deg,#0D6E4F,#16a34a)",
                    border: "none", borderRadius: "10px",
                    color: "white", fontSize: "15px", fontWeight: 600,
                    fontFamily: "'DM Sans', sans-serif",
                    cursor: loading ? "not-allowed" : "pointer",
                    boxShadow: loading ? "none" : "0 4px 14px rgba(13,110,79,0.3)",
                    transition: "opacity 0.15s"
                  }}
                >
                  {loading ? "Placing Order…" : "Place Order →"}
                </button>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

export default CreateOrder;