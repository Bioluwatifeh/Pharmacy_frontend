import { useEffect, useRef, useState } from "react";
import API from "../api/api";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap');

  .co-main {
    padding: 36px 40px;
    max-width: 1400px;
    margin: 0 auto;
    font-family: 'DM Sans', sans-serif;
  }

  .co-header {
    margin-bottom: 24px;
  }

  .co-title {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    color: #0D6E4F;
    margin: 0;
  }

  .co-subtitle {
    color: #6b7280;
    font-size: 14px;
    margin-top: 5px;
  }

  /* Search */
  .co-search-wrapper {
    position: relative;
    margin-bottom: 28px;
  }

  .co-search {
    width: 100%;
    box-sizing: border-box;
    padding: 15px 45px 15px 48px;
    border: 1.5px solid #e5e7eb;
    border-radius: 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    outline: none;
    background: #fff;
    transition: all 0.2s ease;
  }

  .co-search:focus {
    border-color: #0D6E4F;
    box-shadow: 0 0 0 3px rgba(13, 110, 79, 0.08);
  }

  .co-search-icon {
    position: absolute;
    left: 17px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 18px;
    color: #9ca3af;
    pointer-events: none;
  }

  .co-search-clear {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    border: none;
    background: transparent;
    color: #9ca3af;
    cursor: pointer;
    font-size: 18px;
  }

  .co-search-clear:hover {
    color: #374151;
  }

  .co-search-status {
    margin-top: 8px;
    font-size: 12px;
    color: #6b7280;
  }

  /* Layout */
  .co-layout {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 28px;
    align-items: start;
  }

  .co-products-section {
    min-width: 0;
  }

  .co-products-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .co-products-title {
    margin: 0;
    font-size: 18px;
    color: #111827;
  }

  .co-products-count {
    color: #6b7280;
    font-size: 13px;
  }

  /* Medicine Grid */
  .co-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
  }

  .med-card {
    background: #fff;
    border: 1.5px solid #e5e7eb;
    border-radius: 16px;
    padding: 20px;
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .med-card:hover {
    border-color: #0D6E4F;
    box-shadow: 0 10px 25px rgba(13,110,79,0.08);
    transform: translateY(-2px);
  }

  .med-brand {
    margin: 0 0 4px;
    font-size: 12px;
    font-weight: 600;
    color: #0D6E4F;
  }

  .med-details {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 8px;
  }

  .med-tag {
    background: #f3f4f6;
    color: #4b5563;
    border-radius: 6px;
    padding: 4px 7px;
    font-size: 10px;
    font-weight: 600;
  }

  /* Cart */
  .co-cart {
    position: sticky;
    top: 100px;
    background: #fff;
    border: 1.5px solid #e5e7eb;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  }

  .cart-item {
    padding: 16px 0;
    border-bottom: 1px solid #f3f4f6;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .qty-btn {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    border: 1.5px solid #e5e7eb;
    background: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    transition: all 0.15s;
  }

  .qty-btn:hover {
    background: #f0fdf6;
    border-color: #0D6E4F;
    color: #0D6E4F;
  }

  .place-order-btn {
    width: 100%;
    padding: 14px;
    margin-top: 20px;
    border: none;
    border-radius: 12px;
    background: linear-gradient(135deg, #0D6E4F, #16a34a);
    color: white;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    transition: opacity 0.2s;
    box-shadow: 0 4px 12px rgba(13,110,79,0.2);
  }

  .place-order-btn:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    box-shadow: none;
  }

  .co-empty {
    grid-column: 1 / -1;
    text-align: center;
    padding: 60px 20px;
    background: #fff;
    border: 1.5px dashed #e5e7eb;
    border-radius: 16px;
    color: #9ca3af;
  }

  .co-loading {
    grid-column: 1 / -1;
    text-align: center;
    padding: 50px;
    color: #6b7280;
  }

  @media (max-width: 1024px) {
    .co-layout {
      grid-template-columns: 1fr;
    }

    .co-cart {
      position: static;
    }
  }

  @media (max-width: 640px) {
    .co-main {
      padding: 20px;
    }

    .co-grid {
      grid-template-columns: 1fr;
    }

    .co-title {
      font-size: 27px;
    }
  }
`;


/* Human-readable label for unit type */
function unitLabel(item) {
  if (item.unit_type === "carton") {
    return item.carton_name || "Carton";
  }

  if (item.unit_type === "pack") {
    return item.pack_name || "Pack";
  }

  return item.unit_name || "Unit";
}


/* Stock badge */
function StockBadge({ qty }) {
  const styles = {
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase"
  };

  if (qty === 0) {
    return (
      <span
        style={{
          ...styles,
          background: "#fef2f2",
          color: "#dc2626"
        }}
      >
        Out of Stock
      </span>
    );
  }

  if (qty <= 10) {
    return (
      <span
        style={{
          ...styles,
          background: "#fff7ed",
          color: "#ea580c"
        }}
      >
        Low Stock ({qty})
      </span>
    );
  }

  return (
    <span
      style={{
        ...styles,
        background: "#f0fdf6",
        color: "#16a34a"
      }}
    >
      Available
    </span>
  );
}


/* Medicine card */
function MedCard({ med, onAdd, inCart }) {
  const out = Number(med.stock_units) === 0;

  return (
    <div className="med-card">

      {/* Top */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start"
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            background: "#f0fdf6",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px"
          }}
        >
          💊
        </div>

        <StockBadge qty={Number(med.stock_units) || 0} />
      </div>


      {/* Medicine information */}
      <div>

        <h4
          style={{
            margin: "0 0 4px",
            fontSize: "17px",
            color: "#111827"
          }}
        >
          {med.name}
        </h4>

        {med.brand && (
          <p className="med-brand">
            {med.brand}
          </p>
        )}

        <div className="med-details">

          {med.strength && (
            <span className="med-tag">
              {med.strength}
            </span>
          )}

          {med.form && (
            <span className="med-tag">
              {med.form}
            </span>
          )}

          {med.category && (
            <span className="med-tag">
              {med.category}
            </span>
          )}

        </div>

        <p
          style={{
            margin: "9px 0 0",
            fontSize: "13px",
            color: "#6b7280",
            lineHeight: 1.4,
            minHeight: "36px",
            maxHeight: "36px",
            overflow: "hidden"
          }}
        >
          {med.description || "No description available."}
        </p>

      </div>


      {/* Price + Add */}
      <div
        style={{
          marginTop: "auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px"
        }}
      >

        <span
          style={{
            fontSize: "18px",
            fontWeight: 700,
            color: "#0D6E4F"
          }}
        >
          ₦{Number(med.price || 0).toLocaleString()}
        </span>

        <button
          className="qty-btn"
          style={{
            width: "auto",
            padding: "0 15px",
            height: "36px",
            background: inCart ? "#f0fdf6" : "#fff",
            borderColor: inCart ? "#0D6E4F" : "#e5e7eb",
            color: inCart ? "#0D6E4F" : "#374151"
          }}
          onClick={() => onAdd(med)}
          disabled={out || inCart}
        >
          {inCart
            ? "✓ Added"
            : out
              ? "Unavailable"
              : "+ Add"}
        </button>

      </div>

    </div>
  );
}


function CreateOrder() {

  const [medicines, setMedicines] = useState([]);
  const [cart, setCart] = useState([]);

  const [loading, setLoading] = useState(false);

  /* Search states */
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);

  const searchTimer = useRef(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));


  /*
    ----------------------------------------------------
    INITIAL LOAD
    ----------------------------------------------------
    IMPORTANT:
    We still load the medicines when the page opens.

    This means the user sees the medicine catalogue
    immediately instead of seeing only a search box.
  */
  useEffect(() => {
    fetchMedicines();

    return () => {
      if (searchTimer.current) {
        clearTimeout(searchTimer.current);
      }
    };
  }, []);


  /* Load all medicines */
  const fetchMedicines = async () => {
    try {

      setSearching(true);

      const res = await API.get("/medicines", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMedicines(res.data || []);

    } catch (err) {

      console.error("Failed to load medicines:", err);

    } finally {

      setSearching(false);

    }
  };


  /*
    ----------------------------------------------------
    SEARCH
    ----------------------------------------------------
    When search is empty:
      → show all medicines again.

    When user types:
      → use existing backend /medicines/search endpoint.
  */
  const handleSearch = (value) => {

    setSearch(value);

    /*
      Clear previous timer so we don't send an API
      request for every single keystroke.
    */
    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }


    /*
      If search is empty, restore the complete
      medicine catalogue.
    */
    if (!value.trim()) {
      fetchMedicines();
      return;
    }


    /*
      Wait 300ms after the user stops typing.
    */
    searchTimer.current = setTimeout(async () => {

      try {

        setSearching(true);

        const res = await API.get(
          `/medicines/search?q=${encodeURIComponent(value.trim())}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setMedicines(res.data || []);

      } catch (err) {

        console.error("Medicine search failed:", err);

      } finally {

        setSearching(false);

      }

    }, 300);
  };


  /* Clear search */
  const clearSearch = () => {
    setSearch("");
    fetchMedicines();
  };


  /* Add medicine to cart */
  const addToCart = (medicine) => {

    if (cart.find((item) => item.id === medicine.id)) {
      return;
    }

    setCart([
      ...cart,
      {
        ...medicine,
        quantity: 1,
        unit_type: "unit"
      }
    ]);
  };


  /* Update quantity */
  const updateQty = (id, quantity) => {

    setCart(
      cart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, Number(quantity))
            }
          : item
      )
    );
  };


  /* Change unit type */
  const updateUnit = (id, unit) => {

    setCart(
      cart.map((item) =>
        item.id === id
          ? {
              ...item,
              unit_type: unit
            }
          : item
      )
    );
  };


  /* Remove from cart */
  const removeFromCart = (id) => {

    setCart(
      cart.filter((item) => item.id !== id)
    );
  };


  /*
    ----------------------------------------------------
    PRICE CALCULATION
    ----------------------------------------------------
  */
  const getUnitPrice = (item) => {

    const unitPrice =
      Number(item.price) || 0;

    const unitsPerPack =
      Number(item.units_per_pack) || 1;

    const packsPerCarton =
      Number(item.packs_per_carton) || 1;


    if (item.unit_type === "carton") {
      return (
        unitPrice *
        unitsPerPack *
        packsPerCarton
      );
    }


    if (item.unit_type === "pack") {
      return (
        unitPrice *
        unitsPerPack
      );
    }


    return unitPrice;
  };


  /* Cart total */
  const total = cart.reduce(
    (sum, item) =>
      sum +
      getUnitPrice(item) *
      item.quantity,
    0
  );


  /*
    ----------------------------------------------------
    PLACE ORDER
    ----------------------------------------------------
  */
  const placeOrder = async () => {

    if (cart.length === 0) {
      alert("Please add at least one medicine to the cart.");
      return;
    }

    setLoading(true);

    try {

      await API.post(
        "/orders",
        {
          customer_id: user.id,

          items: cart.map((item) => ({
            medicine_id: item.id,
            quantity: item.quantity,
            unit_type: item.unit_type,
            price: getUnitPrice(item)
          }))
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      alert("Order placed successfully");

      setCart([]);

    } catch (err) {

      console.error("Order error:", err);

      alert(
        err.response?.data?.message ||
        "Order failed"
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="co-main">

      <style>{CSS}</style>


      {/* Header */}
      <div className="co-header">

        <h1 className="co-title">
          Create New Order
        </h1>

        <p className="co-subtitle">
          Browse medicines and build your wholesale request
        </p>

      </div>


      {/* =================================================
          SEARCH BAR
          ================================================= */}
      <div className="co-search-wrapper">

        <span className="co-search-icon">
          🔍
        </span>

        <input
          type="text"
          className="co-search"
          placeholder="Search medicine by name, brand, strength..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />

        {search && (
          <button
            className="co-search-clear"
            onClick={clearSearch}
            title="Clear search"
          >
            ✕
          </button>
        )}

        {searching && (
          <div className="co-search-status">
            Searching medicines...
          </div>
        )}

        {!searching && search && (
          <div className="co-search-status">
            Showing results for "{search}"
          </div>
        )}

      </div>


      {/* Main layout */}
      <div className="co-layout">


        {/* =================================================
            MEDICINES
            ================================================= */}
        <div className="co-products-section">

          <div className="co-products-header">

            <h2 className="co-products-title">
              Medicines
            </h2>

            <span className="co-products-count">
              {medicines.length}{" "}
              {medicines.length === 1
                ? "medicine"
                : "medicines"}
            </span>

          </div>


          <div className="co-grid">

            {searching ? (

              <div className="co-loading">
                Loading medicines...
              </div>

            ) : medicines.length === 0 ? (

              <div className="co-empty">

                <div
                  style={{
                    fontSize: "42px",
                    marginBottom: "12px"
                  }}
                >
                  💊
                </div>

                <h3
                  style={{
                    margin: "0 0 6px",
                    color: "#374151"
                  }}
                >
                  No medicines found
                </h3>

                <p style={{ margin: 0 }}>
                  Try searching for another medicine,
                  brand, or strength.
                </p>

              </div>

            ) : (

              medicines.map((medicine) => (

                <MedCard
                  key={medicine.id}
                  med={medicine}
                  onAdd={addToCart}
                  inCart={cart.find(
                    (item) =>
                      item.id === medicine.id
                  )}
                />

              ))

            )}

          </div>

        </div>


        {/* =================================================
            CART
            ================================================= */}
        <div className="co-cart">

          <h3
            style={{
              margin: "0 0 20px",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}
          >
            🛒 Your Cart

            <span
              style={{
                background: "#0D6E4F",
                color: "#fff",
                padding: "2px 8px",
                borderRadius: "20px",
                fontSize: "12px"
              }}
            >
              {cart.length}
            </span>

          </h3>


          {cart.length === 0 ? (

            <div
              style={{
                textAlign: "center",
                padding: "40px 0",
                color: "#9ca3af"
              }}
            >

              <div
                style={{
                  fontSize: "40px",
                  marginBottom: "10px"
                }}
              >
                🛍️
              </div>

              <p>
                Your cart is empty
              </p>

            </div>

          ) : (

            <>

              <div
                style={{
                  maxHeight: "400px",
                  overflowY: "auto",
                  paddingRight: "5px"
                }}
              >

                {cart.map((item) => (

                  <div
                    key={item.id}
                    className="cart-item"
                  >

                    {/* Item name */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between"
                      }}
                    >

                      <div>

                        <strong
                          style={{
                            fontSize: "14px",
                            color: "#111827"
                          }}
                        >
                          {item.name}
                        </strong>

                        {item.brand && (
                          <div
                            style={{
                              fontSize: "11px",
                              color: "#0D6E4F",
                              marginTop: "2px"
                            }}
                          >
                            {item.brand}
                          </div>
                        )}

                      </div>


                      <button
                        onClick={() =>
                          removeFromCart(item.id)
                        }
                        style={{
                          background: "none",
                          border: "none",
                          color: "#9ca3af",
                          cursor: "pointer",
                          fontSize: "16px"
                        }}
                      >
                        ✕
                      </button>

                    </div>


                    {/* Unit + quantity */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        marginTop: "5px"
                      }}
                    >

                      <select
                        style={{
                          padding: "7px",
                          borderRadius: "6px",
                          border: "1px solid #e5e7eb",
                          fontSize: "12px",
                          outline: "none",
                          width: "100%"
                        }}
                        value={item.unit_type}
                        onChange={(e) =>
                          updateUnit(
                            item.id,
                            e.target.value
                          )
                        }
                      >

                        <option value="unit">
                          Single Unit — ₦
                          {Number(
                            item.price
                          ).toLocaleString()}
                        </option>

                        <option value="pack">
                          Full Pack (
                          {item.units_per_pack || 1}{" "}
                          units) — ₦
                          {(
                            Number(item.price) *
                            (Number(
                              item.units_per_pack
                            ) || 1)
                          ).toLocaleString()}
                        </option>

                        <option value="carton">
                          Wholesale Carton (
                          {(Number(
                            item.units_per_pack
                          ) || 1) *
                            (Number(
                              item.packs_per_carton
                            ) || 1)}{" "}
                          units) — ₦
                          {(
                            Number(item.price) *
                            (Number(
                              item.units_per_pack
                            ) || 1) *
                            (Number(
                              item.packs_per_carton
                            ) || 1)
                          ).toLocaleString()}
                        </option>

                      </select>


                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "12px"
                        }}
                      >

                        <button
                          className="qty-btn"
                          onClick={() =>
                            updateQty(
                              item.id,
                              item.quantity - 1
                            )
                          }
                        >
                          -
                        </button>

                        <span
                          style={{
                            fontWeight: 600,
                            fontSize: "14px",
                            minWidth: "20px",
                            textAlign: "center"
                          }}
                        >
                          {item.quantity}
                        </span>

                        <button
                          className="qty-btn"
                          onClick={() =>
                            updateQty(
                              item.id,
                              item.quantity + 1
                            )
                          }
                        >
                          +
                        </button>

                      </div>

                    </div>


                    {/* Line total */}
                    <div
                      style={{
                        textAlign: "right",
                        fontSize: "12.5px",
                        color: "#6b7280"
                      }}
                    >
                      {item.quantity} ×{" "}
                      {unitLabel(item)} = ₦
                      {(
                        getUnitPrice(item) *
                        item.quantity
                      ).toLocaleString()}
                    </div>

                  </div>

                ))}

              </div>


              {/* Cart totals */}
              <div
                style={{
                  marginTop: "20px",
                  paddingTop: "20px",
                  borderTop: "2px dashed #f3f4f6"
                }}
              >

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px"
                  }}
                >

                  <span
                    style={{
                      color: "#6b7280"
                    }}
                  >
                    Subtotal
                  </span>

                  <span
                    style={{
                      fontWeight: 600
                    }}
                  >
                    ₦{total.toLocaleString()}
                  </span>

                </div>


                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "18px"
                  }}
                >

                  <span
                    style={{
                      fontWeight: 700
                    }}
                  >
                    Total
                  </span>

                  <span
                    style={{
                      fontWeight: 700,
                      color: "#0D6E4F"
                    }}
                  >
                    ₦{total.toLocaleString()}
                  </span>

                </div>


                <button
                  className="place-order-btn"
                  onClick={placeOrder}
                  disabled={loading}
                >
                  {loading
                    ? "Processing..."
                    : "Confirm & Place Order"}
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