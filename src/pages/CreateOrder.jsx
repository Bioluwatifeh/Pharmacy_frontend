import { useEffect, useState, useRef } from "react";
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

  .co-layout {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 28px;
    align-items: start;
  }

  /* SEARCH */

  .co-search-wrapper {
    position: relative;
    margin-bottom: 18px;
  }

  .co-search-input {
    width: 100%;
    box-sizing: border-box;
    padding: 14px 48px 14px 45px;
    border: 1.5px solid #e5e7eb;
    border-radius: 12px;
    background: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #111827;
    outline: none;
    transition: all 0.15s ease;
  }

  .co-search-input:focus {
    border-color: #0D6E4F;
    box-shadow: 0 0 0 3px rgba(13,110,79,0.08);
  }

  .co-search-icon {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 17px;
    color: #9ca3af;
    pointer-events: none;
  }

  .co-search-clear {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 27px;
    height: 27px;
    border-radius: 50%;
    border: none;
    background: #f3f4f6;
    color: #6b7280;
    cursor: pointer;
    font-size: 12px;
  }

  .co-search-clear:hover {
    background: #e5e7eb;
  }

  .co-search-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 22px;
    margin-bottom: 12px;
    font-size: 12px;
    color: #6b7280;
  }

  /* MEDICINE GRID */

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
    font-size: 12px;
    font-weight: 600;
    color: #0D6E4F;
    margin-bottom: 3px;
  }

  .med-details {
    font-size: 11px;
    color: #6b7280;
    margin-bottom: 5px;
  }

  /* CART */

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
    background: linear-gradient(135deg,#0D6E4F,#16a34a);
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

  /* EMPTY / LOADING */

  .co-empty {
    background: #fff;
    border: 1.5px solid #e5e7eb;
    border-radius: 16px;
    padding: 55px 20px;
    text-align: center;
    color: #9ca3af;
  }

  .co-loading {
    background: #fff;
    border: 1.5px solid #e5e7eb;
    border-radius: 16px;
    padding: 45px 20px;
    text-align: center;
    color: #9ca3af;
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

    .co-title {
      font-size: 26px;
    }

    .co-grid {
      grid-template-columns: 1fr;
    }
  }
`;


/* =========================================================
   UNIT LABEL
========================================================= */

function unitLabel(item) {

  if (item.unit_type === "carton") {
    return item.carton_name || "Carton";
  }

  if (item.unit_type === "pack") {
    return item.pack_name || "Pack";
  }

  return item.unit_name || "Unit";
}


/* =========================================================
   STOCK BADGE
========================================================= */

function StockBadge({ qty }) {

  const styles = {
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase"
  };

  const stock = Number(qty || 0);

  if (stock === 0) {
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

  if (stock <= 10) {
    return (
      <span
        style={{
          ...styles,
          background: "#fff7ed",
          color: "#ea580c"
        }}
      >
        Low Stock ({stock})
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


/* =========================================================
   MEDICINE CARD
========================================================= */

function MedCard({ med, onAdd, inCart }) {

  const stock = Number(med.stock_units || 0);
  const out = stock === 0;

  return (
    <div className="med-card">

      {/* TOP */}

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

        <StockBadge qty={stock} />

      </div>


      {/* INFORMATION */}

      <div>

        <h4
          style={{
            margin: "0 0 3px",
            fontSize: "17px",
            color: "#111827"
          }}
        >
          {med.name}
        </h4>


        {med.brand && (
          <div className="med-brand">
            {med.brand}
          </div>
        )}


        {(med.strength || med.form) && (
          <div className="med-details">
            {[med.strength, med.form]
              .filter(Boolean)
              .join(" • ")}
          </div>
        )}


        {med.category && (
          <div
            style={{
              fontSize: "11px",
              color: "#9ca3af",
              marginBottom: "5px"
            }}
          >
            {med.category}
          </div>
        )}


        <p
          style={{
            margin: 0,
            fontSize: "13px",
            color: "#6b7280",
            lineHeight: 1.4,
            height: "36px",
            overflow: "hidden"
          }}
        >
          {med.description || "No description available"}
        </p>

      </div>


      {/* PRICE + ADD */}

      <div
        style={{
          marginTop: "auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "8px"
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
            background: inCart
              ? "#f0fdf6"
              : "#fff",
            borderColor: inCart
              ? "#0D6E4F"
              : "#e5e7eb",
            color: inCart
              ? "#0D6E4F"
              : "#374151"
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


/* =========================================================
   CREATE ORDER
========================================================= */

function CreateOrder() {

  /*
  ---------------------------------------------------------
  IMPORTANT

  We DO NOT load the entire medicines table.

  Medicines are loaded only when the customer searches.

  This is much better for a pharmacy with thousands
  of medicines.
  ---------------------------------------------------------
  */

  const [medicines, setMedicines] = useState([]);

  const [cart, setCart] = useState([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [searching, setSearching] = useState(false);

  const [searchMessage, setSearchMessage] = useState(
    "Search for a medicine to begin"
  );

  const token = localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user")
  );


  /*
  ---------------------------------------------------------
  SEARCH DEBOUNCE
  ---------------------------------------------------------

  Prevents an API request on every single keystroke.

  Example:

  User types:

  P
  Pa
  Par
  Para

  Instead of making 4 requests, we wait briefly and
  search once.
  ---------------------------------------------------------
  */

  const searchTimer = useRef(null);


  useEffect(() => {

    return () => {

      if (searchTimer.current) {
        clearTimeout(searchTimer.current);
      }

    };

  }, []);


  /*
  =========================================================
  SEARCH MEDICINES
  =========================================================
  */

  const searchMedicines = (value) => {

    setSearch(value);

    /*
    Clear previous timer
    */

    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }


    const query = value.trim();


    /*
    Empty search
    */

    if (!query) {

      setMedicines([]);

      setSearching(false);

      setSearchMessage(
        "Search for a medicine to begin"
      );

      return;
    }


    /*
    Don't search with just one character.

    This prevents unnecessary database requests.
    */

    if (query.length < 2) {

      setMedicines([]);

      setSearching(false);

      setSearchMessage(
        "Type at least 2 characters"
      );

      return;
    }


    /*
    Wait 300ms after the user stops typing.
    */

    searchTimer.current = setTimeout(
      async () => {

        try {

          setSearching(true);

          setSearchMessage("Searching medicines...");


          const response = await API.get(
            `/medicines/search?q=${encodeURIComponent(query)}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );


          const results =
            response.data || [];


          setMedicines(results);


          if (results.length === 0) {

            setSearchMessage(
              `No medicines found for "${query}"`
            );

          } else {

            setSearchMessage(
              `${results.length} medicine${
                results.length !== 1
                  ? "s"
                  : ""
              } found`
            );

          }

        } catch (error) {

          console.error(
            "Medicine search failed:",
            error
          );

          setMedicines([]);

          setSearchMessage(
            error.response?.data?.message ||
            "Unable to search medicines"
          );

        } finally {

          setSearching(false);

        }

      },
      300
    );
  };


  /*
  =========================================================
  ADD TO CART
  =========================================================
  */

  const addToCart = (medicine) => {

    if (
      cart.find(
        (item) => item.id === medicine.id
      )
    ) {
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


  /*
  =========================================================
  UPDATE QUANTITY
  =========================================================
  */

  const updateQty = (id, quantity) => {

    const newQuantity = Math.max(
      1,
      Number(quantity)
    );


    setCart(
      cart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: newQuantity
            }
          : item
      )
    );
  };


  /*
  =========================================================
  UPDATE UNIT
  =========================================================
  */

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


  /*
  =========================================================
  REMOVE FROM CART
  =========================================================
  */

  const removeFromCart = (id) => {

    setCart(
      cart.filter(
        (item) => item.id !== id
      )
    );
  };


  /*
  =========================================================
  PRICE CALCULATION
  =========================================================
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


  /*
  =========================================================
  CART TOTAL
  =========================================================
  */

  const total = cart.reduce(
    (sum, item) =>
      sum +
      getUnitPrice(item) *
      item.quantity,
    0
  );


  /*
  =========================================================
  PLACE ORDER
  =========================================================
  */

  const placeOrder = async () => {

    if (cart.length === 0) {

      alert(
        "Please add at least one medicine."
      );

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
            Authorization:
              `Bearer ${token}`
          }
        }
      );


      alert(
        "Order placed successfully"
      );


      setCart([]);

    } catch (error) {

      console.error(
        "Order failed:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Order failed"
      );

    } finally {

      setLoading(false);

    }
  };


  /*
  =========================================================
  RENDER
  =========================================================
  */

  return (

    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(145deg,#f0fdf6 0%,#f8fafc 60%,#eff6ff 100%)"
      }}
    >

      <style>
        {CSS}
      </style>


      <main className="co-main">

        {/* HEADER */}

        <div className="co-header">

          <h1 className="co-title">
            Create New Order
          </h1>

          <p className="co-subtitle">
            Search medicines and build your
            wholesale request
          </p>

        </div>


        {/* MAIN LAYOUT */}

        <div className="co-layout">


          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <div>

            {/* SEARCH */}

            <div className="co-search-wrapper">

              <span className="co-search-icon">
                🔍
              </span>


              <input
                className="co-search-input"
                type="text"
                value={search}
                onChange={(e) =>
                  searchMedicines(
                    e.target.value
                  )
                }
                placeholder="Search medicine, brand, strength..."
                autoComplete="off"
              />


              {search && (

                <button
                  className="co-search-clear"
                  onClick={() =>
                    searchMedicines("")
                  }
                  type="button"
                >
                  ✕
                </button>

              )}

            </div>


            {/* SEARCH INFO */}

            <div className="co-search-info">

              <span>
                {searchMessage}
              </span>


              {searching && (
                <span>
                  ⏳
                </span>
              )}

            </div>


            {/* RESULTS */}

            {searching ? (

              <div className="co-loading">

                <div
                  style={{
                    fontSize: "30px",
                    marginBottom: "8px"
                  }}
                >
                  🔍
                </div>

                Searching medicines...

              </div>

            ) : medicines.length === 0 ? (

              <div className="co-empty">

                <div
                  style={{
                    fontSize: "42px",
                    marginBottom: "10px"
                  }}
                >
                  💊
                </div>

                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: "5px"
                  }}
                >
                  {search
                    ? "No medicines found"
                    : "Search for a medicine"}
                </div>

                <div
                  style={{
                    fontSize: "13px"
                  }}
                >
                  {search
                    ? "Try another medicine name, brand or strength."
                    : "Enter at least 2 characters to search the pharmacy inventory."}
                </div>

              </div>

            ) : (

              <div className="co-grid">

                {medicines.map(
                  (medicine) => (

                    <MedCard
                      key={medicine.id}
                      med={medicine}
                      onAdd={addToCart}
                      inCart={cart.find(
                        (item) =>
                          item.id ===
                          medicine.id
                      )}
                    />

                  )
                )}

              </div>

            )}

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

                {/* CART ITEMS */}

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

                      {/* ITEM NAME */}

                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between"
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
                                fontWeight: 600,
                                marginTop: "2px"
                              }}
                            >
                              {item.brand}
                            </div>

                          )}

                        </div>


                        <button
                          onClick={() =>
                            removeFromCart(
                              item.id
                            )
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


                      {/* UNIT + QUANTITY */}

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent:
                            "space-between",
                          marginTop: "5px",
                          gap: "10px"
                        }}
                      >

                        <select
                          style={{
                            padding: "5px",
                            borderRadius: "6px",
                            border:
                              "1px solid #e5e7eb",
                            fontSize: "12px",
                            outline: "none",
                            width: "100%"
                          }}
                          value={
                            item.unit_type
                          }
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
                            {item.units_per_pack ||
                              1}{" "}
                            units) — ₦
                            {(
                              Number(
                                item.price
                              ) *
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
                              Number(
                                item.price
                              ) *
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


                      {/* LINE TOTAL */}

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


                {/* TOTAL */}

                <div
                  style={{
                    marginTop: "20px",
                    paddingTop: "20px",
                    borderTop:
                      "2px dashed #f3f4f6"
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
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
                      ₦
                      {total.toLocaleString()}
                    </span>

                  </div>


                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
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
                      ₦
                      {total.toLocaleString()}
                    </span>

                  </div>


                  {/* PLACE ORDER */}

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

      </main>

    </div>
  );
}


export default CreateOrder;