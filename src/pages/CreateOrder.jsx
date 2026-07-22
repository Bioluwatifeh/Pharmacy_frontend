import { useEffect, useState } from "react";
import API from "../api/api";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap');
  
  .co-main { padding: 36px 40px; max-width: 1400px; margin: 0 auto; font-family: 'DM Sans', sans-serif; }
  .co-header { margin-bottom: 30px; }
  .co-title { font-family: 'Playfair Display', serif; font-size: 32px; color: #0D6E4F; margin: 0; }
  .co-subtitle { color: #6b7280; fontSize: 14px; margin-top: 5px; }
  
  .co-layout { display: grid; grid-template-columns: 1fr 380px; gap: 28px; align-items: start; }
  
  /* Medicine Grid */
  .co-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }
  
  .med-card { 
    background: #fff; border: 1.5px solid #e5e7eb; border-radius: 16px; 
    padding: 20px; transition: all 0.2s ease; display: flex; flex-direction: column; gap: 12px;
  }
  .med-card:hover { border-color: #0D6E4F; box-shadow: 0 10px 25px rgba(13,110,79,0.08); transform: translateY(-2px); }
  
  /* Cart Styling */
  .co-cart { 
    position: sticky; top: 100px; background: #fff; border: 1.5px solid #e5e7eb; 
    border-radius: 20px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); 
  }
  .cart-item { 
    padding: 16px 0; border-bottom: 1px solid #f3f4f6; display: flex; flex-direction: column; gap: 8px; 
  }
  .qty-btn { 
    width: 28px; height: 28px; border-radius: 8px; border: 1.5px solid #e5e7eb; 
    background: #fff; cursor: pointer; display: flex; alignItems: center; justifyContent: center;
    font-weight: bold; transition: all 0.15s;
  }
  .qty-btn:hover { background: #f0fdf6; border-color: #0D6E4F; color: #0D6E4F; }

  .place-order-btn {
    width: 100%; padding: 14px; margin-top: 20px; border: none; border-radius: 12px;
    background: linear-gradient(135deg, #0D6E4F, #16a34a); color: white;
    font-weight: 600; font-size: 15px; cursor: pointer; transition: opacity 0.2s;
    box-shadow: 0 4px 12px rgba(13,110,79,0.2);
  }
  .place-order-btn:disabled { background: #9ca3af; cursor: not-allowed; box-shadow: none; }

  @media (max-width: 1024px) {
    .co-layout { grid-template-columns: 1fr; }
    .co-cart { position: static; }
  }
  @media (max-width: 640px) {
    .co-main { padding: 20px; }
    .co-grid { grid-template-columns: 1fr; }
  }
`;

// Human-readable label for unit type dropdown
function unitLabel(item) {
  if (item.unit_type === "carton") return item.carton_name || "Carton";
  if (item.unit_type === "pack")   return item.pack_name   || "Pack";
  return item.unit_name || "Unit";
}

function StockBadge({ qty }) {
  const styles = {
    padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: 600, textTransform: "uppercase"
  };
  if (qty === 0) return <span style={{ ...styles, background: "#fef2f2", color: "#dc2626" }}>Out of Stock</span>;
  if (qty <= 10) return <span style={{ ...styles, background: "#fff7ed", color: "#ea580c" }}>Low Stock ({qty})</span>;
  return <span style={{ ...styles, background: "#f0fdf6", color: "#16a34a" }}>Available</span>;
}

function MedCard({ med, onAdd, inCart }) {
  const out = med.stock_units === 0;

  return (
    <div className="med-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ width: "40px", height: "40px", background: "#f0fdf6", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>💊</div>
        <StockBadge qty={med.stock_units} />
      </div>
      <div>
        <h4 style={{ margin: "0 0 4px", fontSize: "17px", color: "#111827" }}>{med.name}</h4>
        <p style={{ margin: 0, fontSize: "13px", color: "#6b7280", lineHeight: 1.4, height: "36px", overflow: "hidden" }}>{med.description}</p>
      </div>
      <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "18px", fontWeight: 700, color: "#0D6E4F" }}>₦{Number(med.price).toLocaleString()}</span>
        <button
          className="qty-btn"
          style={{ width: "auto", padding: "0 15px", height: "36px", background: inCart ? "#f0fdf6" : "#fff", borderColor: inCart ? "#0D6E4F" : "#e5e7eb", color: inCart ? "#0D6E4F" : "#374151" }}
          onClick={() => onAdd(med)}
          disabled={out || inCart}
        >
          {inCart ? "✓ Added" : out ? "Unavailable" : "+ Add"}
        </button>
      </div>
    </div>
  );
}

function CreateOrder() {
  const [medicines, setMedicines] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => { fetchMedicines(); }, []);

  const fetchMedicines = async () => {
    try {
      const res = await API.get("/medicines", { headers: { Authorization: `Bearer ${token}` } });
      setMedicines(res.data);
    } catch (err) { console.log(err); }
  };

  const addToCart = (m) => {
    if (cart.find(i => i.id === m.id)) return;
    setCart([...cart, { ...m, quantity: 1, unit_type: "unit" }]);
  };

  const updateQty = (id, q) => {
    setCart(cart.map(i => i.id === id ? { ...i, quantity: Math.max(1, Number(q)) } : i));
  };

  const updateUnit = (id, unit) => {
    setCart(cart.map(i => i.id === id ? { ...i, unit_type: unit } : i));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(i => i.id !== id));
  };

  // ✅ Single source of truth for pricing by unit_type
  const getUnitPrice = (item) => {
    const unitPrice      = Number(item.price) || 0;
    const unitsPerPack   = Number(item.units_per_pack)   || 1;
    const packsPerCarton = Number(item.packs_per_carton) || 1;

    if (item.unit_type === "carton") return unitPrice * unitsPerPack * packsPerCarton;
    if (item.unit_type === "pack")   return unitPrice * unitsPerPack;
    return unitPrice; // "unit"
  };

  // ✅ FIXED: total now respects unit_type via getUnitPrice
  const total = cart.reduce((sum, i) => sum + getUnitPrice(i) * i.quantity, 0);

  const placeOrder = async () => {
    setLoading(true);
    try {
      await API.post("/orders", {
        customer_id: user.id,
        items: cart.map(i => ({
          medicine_id: i.id,
          quantity: i.quantity,
          unit_type: i.unit_type,
          price: getUnitPrice(i) // ✅ FIXED: send the correct per-unit-type price, not raw i.price
        }))
      }, { headers: { Authorization: `Bearer ${token}` } });
      alert("Order placed successfully");
      setCart([]);
    } catch (err) {
      alert(err.response?.data?.message || "Order failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="co-main">
      <style>{CSS}</style>
      
      <div className="co-header">
        <h1 className="co-title">Create New Order</h1>
        <p className="co-subtitle">Browse medicines and build your wholesale request</p>
      </div>

      <div className="co-layout">
        <div className="co-grid">
          {medicines.map(med => (
            <MedCard
              key={med.id}
              med={med}
              onAdd={addToCart}
              inCart={cart.find(i => i.id === med.id)}
            />
          ))}
        </div>

        <div className="co-cart">
          <h3 style={{ margin: "0 0 20px", display: "flex", alignItems: "center", gap: "10px" }}>
            🛒 Your Cart <span style={{ background: "#0D6E4F", color: "#fff", padding: "2px 8px", borderRadius: "20px", fontSize: "12px" }}>{cart.length}</span>
          </h3>

          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#9ca3af" }}>
              <div style={{ fontSize: "40px", marginBottom: "10px" }}>🛍️</div>
              <p>Your cart is empty</p>
            </div>
          ) : (
            <>
              <div style={{ maxHeight: "400px", overflowY: "auto", paddingRight: "5px" }}>
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <strong style={{ fontSize: "14px", color: "#111827" }}>{item.name}</strong>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer", fontSize: "16px" }}
                      >✕</button>
                    </div>
                    
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "5px" }}>
                      
                      <select
                        style={{ padding: "5px", borderRadius: "6px", border: "1px solid #e5e7eb", fontSize: "12px", outline: "none", width: "100%" }}
                        value={item.unit_type}
                        onChange={(e) => updateUnit(item.id, e.target.value)}
                      >
                        <option value="unit">
                          Single Unit — ₦{Number(item.price).toLocaleString()}
                        </option>
                        <option value="pack">
                          Full Pack ({item.units_per_pack || 1} units) — ₦{(Number(item.price) * (Number(item.units_per_pack) || 1)).toLocaleString()}
                        </option>
                        <option value="carton">
                          Wholesale Carton ({(Number(item.units_per_pack) || 1) * (Number(item.packs_per_carton) || 1)} units) — ₦{(Number(item.price) * (Number(item.units_per_pack) || 1) * (Number(item.packs_per_carton) || 1)).toLocaleString()}
                        </option>
                      </select>

                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <button className="qty-btn" onClick={() => updateQty(item.id, item.quantity - 1)}>-</button>
                        <span style={{ fontWeight: 600, fontSize: "14px", minWidth: "20px", textAlign: "center" }}>{item.quantity}</span>
                        <button className="qty-btn" onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
                      </div>
                    </div>

                    {/* ✅ Shows the actual line total for this item at its selected unit_type */}
                    <div style={{ textAlign: "right", fontSize: "12.5px", color: "#6b7280" }}>
                      {item.quantity} × {unitLabel(item)} = ₦{(getUnitPrice(item) * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "2px dashed #f3f4f6" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span style={{ color: "#6b7280" }}>Subtotal</span>
                  <span style={{ fontWeight: 600 }}>₦{total.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "18px" }}>
                  <span style={{ fontWeight: 700 }}>Total</span>
                  <span style={{ fontWeight: 700, color: "#0D6E4F" }}>₦{total.toLocaleString()}</span>
                </div>

                <button 
                  className="place-order-btn" 
                  onClick={placeOrder}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Confirm & Place Order"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateOrder;