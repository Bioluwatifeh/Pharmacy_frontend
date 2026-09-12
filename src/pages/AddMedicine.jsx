import { useEffect, useMemo, useState } from "react";
import API from "../api/api";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap');

  .am-main {
    padding: 36px 40px;
    max-width: 1400px;
    margin: 0 auto;
    font-family: 'DM Sans', sans-serif;
  }

  .am-header {
    margin-bottom: 26px;
  }

  .am-title {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    color: #0D6E4F;
    margin: 0;
  }

  .am-subtitle {
    color: #6b7280;
    font-size: 14px;
    margin-top: 5px;
  }

  .am-tabs {
    display: flex;
    gap: 8px;
    background: #f3f4f6;
    padding: 5px;
    border-radius: 12px;
    width: fit-content;
    margin-bottom: 24px;
  }

  .am-tab {
    border: none;
    padding: 10px 18px;
    border-radius: 9px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
  }

  .am-tab-active {
    background: white;
    color: #0D6E4F;
    box-shadow: 0 2px 7px rgba(0,0,0,.08);
  }

  .am-tab-inactive {
    background: transparent;
    color: #6b7280;
  }

  .am-layout {
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 28px;
    align-items: start;
  }

  .am-card {
    background: #fff;
    border: 1.5px solid #e5e7eb;
    border-radius: 20px;
    padding: 32px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.02);
  }

  .am-section-title {
    font-size: 13px;
    font-weight: 700;
    color: #0D6E4F;
    margin: 24px 0 16px;
    text-transform: uppercase;
    letter-spacing: 1px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .am-section-title::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #dff3e8;
  }

  .am-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }

  .am-input-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .am-label {
    font-size: 12.5px;
    font-weight: 600;
    color: #374151;
  }

  .am-input {
    width: 100%;
    box-sizing: border-box;
    padding: 12px 16px;
    border: 1.5px solid #e5e7eb;
    border-radius: 12px;
    font-size: 14px;
    color: #111827;
    background: #fff;
    outline: none;
    font-family: 'DM Sans', sans-serif;
  }

  .am-input:focus {
    border-color: #0D6E4F;
    box-shadow: 0 0 0 4px rgba(13,110,79,0.1);
  }

  .am-search-box {
    position: relative;
    margin-bottom: 12px;
  }

  .am-search-box input {
    padding-left: 42px;
  }

  .am-search-icon {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
  }

  .am-results {
    border: 1.5px solid #e5e7eb;
    border-radius: 13px;
    overflow: hidden;
    margin-bottom: 20px;
  }

  .am-result {
    padding: 14px 16px;
    border-bottom: 1px solid #f3f4f6;
    cursor: pointer;
  }

  .am-result:hover {
    background: #f0fdf6;
  }

  .am-result-selected {
    background: #f0fdf6;
    border-left: 4px solid #0D6E4F;
  }

  .am-result-name {
    font-size: 14px;
    font-weight: 700;
    color: #111827;
  }

  .am-result-meta {
    font-size: 12px;
    color: #6b7280;
    margin-top: 4px;
  }

  .am-stock-card {
    background: linear-gradient(135deg, #f0fdf6, #ecfdf5);
    border: 1.5px solid #bbf7d0;
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 22px;
  }

  .am-stock-title {
    font-size: 12px;
    color: #166534;
    font-weight: 600;
  }

  .am-stock-number {
    font-size: 28px;
    font-weight: 700;
    color: #14532d;
    margin-top: 4px;
  }

  .am-stock-label {
    font-size: 12px;
    color: #4b5563;
    margin-top: 3px;
  }

  .am-calculation {
    border: 1.5px solid #e5e7eb;
    border-radius: 15px;
    padding: 18px;
    margin-top: 18px;
    background: #fafafa;
  }

  .am-calc-row {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    margin-bottom: 9px;
    color: #4b5563;
  }

  .am-calc-total {
    border-top: 1px solid #e5e7eb;
    padding-top: 12px;
    margin-top: 12px;
    font-weight: 700;
    color: #0D6E4F;
    font-size: 15px;
  }

  .am-pack-info {
    background: #f8fafc;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 13px 15px;
    margin-top: 12px;
    color: #4b5563;
    font-size: 12.5px;
    line-height: 1.6;
  }

  .am-sidebar {
    position: sticky;
    top: 100px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .am-tip-card {
    background: #fff;
    border: 1.5px solid #e5e7eb;
    border-radius: 16px;
    padding: 20px;
  }

  .am-submit-btn {
    width: 100%;
    padding: 14px;
    margin-top: 10px;
    border: none;
    border-radius: 12px;
    background: linear-gradient(135deg, #0D6E4F, #16a34a);
    color: white;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
  }

  .am-submit-btn:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }

  .am-empty {
    padding: 18px;
    text-align: center;
    color: #9ca3af;
    font-size: 13px;
  }

  @media (max-width: 1024px) {
    .am-layout {
      grid-template-columns: 1fr;
    }

    .am-sidebar {
      position: static;
    }
  }

  @media (max-width: 700px) {
    .am-main {
      padding: 25px 18px;
    }

    .am-card {
      padding: 20px;
    }

    .am-row {
      grid-template-columns: 1fr;
    }

    .am-tabs {
      width: 100%;
    }

    .am-tab {
      flex: 1;
    }
  }
`;

function AddMedicine() {

  const [mode, setMode] = useState("add");

  // New medicine
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [strength, setStrength] = useState("");
  const [form, setForm] = useState("");

  // Packaging
  const [unitName, setUnitName] = useState("");
  const [packName, setPackName] = useState("");
  const [cartonName, setCartonName] = useState("");
  const [unitsPerPack, setUnitsPerPack] = useState("");
  const [packsPerCarton, setPacksPerCarton] = useState("");

  // Initial stock entry
  const [initialStockQuantity, setInitialStockQuantity] = useState("");
  const [initialStockType, setInitialStockType] = useState("unit");

  // Restocking
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [restockQuantity, setRestockQuantity] = useState("");
  const [restockType, setRestockType] = useState("unit");

  const [loading, setLoading] = useState(false);
  const [loadingMedicines, setLoadingMedicines] = useState(false);
  const [toast, setToast] = useState(null);

  const token = localStorage.getItem("token");

  const categories = [
    "Antibiotic",
    "Analgesic",
    "Antiviral",
    "Antifungal",
    "Vitamin",
    "Supplement",
    "Other"
  ];

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });

    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  /*
  ========================================================
  LOAD MEDICINES
  ========================================================
  */

  const loadMedicines = async () => {

    setLoadingMedicines(true);

    try {

      const response = await API.get("/medicines", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMedicines(response.data || []);

    } catch (error) {

      console.error("Failed to load medicines:", error);

      showToast(
        "Unable to load medicines.",
        "error"
      );

    } finally {

      setLoadingMedicines(false);

    }
  };

  useEffect(() => {

    if (mode === "restock") {
      loadMedicines();
    }

  }, [mode]);

  /*
  ========================================================
  SEARCH
  ========================================================
  */

  const filteredMedicines = useMemo(() => {

    const query = search.trim().toLowerCase();

    if (!query) {
      return [];
    }

    return medicines
      .filter((medicine) => {

        const searchableText = [
          medicine.name,
          medicine.brand,
          medicine.strength,
          medicine.form,
          medicine.category
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(query);

      })
      .slice(0, 10);

  }, [search, medicines]);

  /*
  ========================================================
  CALCULATE RESTOCK UNITS
  ========================================================
  */

  const unitsToAdd = useMemo(() => {

    if (!selectedMedicine || !restockQuantity) {
      return 0;
    }

    const quantity = Number(restockQuantity);

    if (!Number.isFinite(quantity) || quantity <= 0) {
      return 0;
    }

    const unitsPerPack =
      Number(selectedMedicine.units_per_pack || 1);

    const packsPerCarton =
      Number(selectedMedicine.packs_per_carton || 1);

    if (restockType === "carton") {

      return (
        quantity *
        packsPerCarton *
        unitsPerPack
      );

    }

    if (restockType === "pack") {

      return (
        quantity *
        unitsPerPack
      );

    }

    return quantity;

  }, [
    selectedMedicine,
    restockQuantity,
    restockType
  ]);

  const currentStock = Number(
    selectedMedicine?.stock_units || 0
  );

  const newStock =
    currentStock + unitsToAdd;

  /*
  ========================================================
  CALCULATE INITIAL STOCK
  ========================================================
  Stock is always saved as the smallest unit.
  ========================================================
  */

  const initialStockUnits = useMemo(() => {
    const quantity = Number(initialStockQuantity);

    if (!Number.isFinite(quantity) || quantity < 0) {
      return 0;
    }

    const upp = Number(unitsPerPack);
    const ppc = Number(packsPerCarton);

    const safeUpp = Number.isFinite(upp) && upp > 0 ? upp : 1;
    const safePpc = Number.isFinite(ppc) && ppc > 0 ? ppc : 1;

    if (initialStockType === "carton") {
      return quantity * safePpc * safeUpp;
    }

    if (initialStockType === "pack") {
      return quantity * safeUpp;
    }

    return quantity;
  }, [
    initialStockQuantity,
    initialStockType,
    unitsPerPack,
    packsPerCarton
  ]);

  /*
  ========================================================
  ADD NEW MEDICINE
  ========================================================
  */

  const handleAddMedicine = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      await API.post(
        "/medicines",
        {
          name: name.trim(),
          brand: brand.trim(),
          description,
          category,
          price,
          strength,
          form,

          unit_name: unitName,
          pack_name: packName,
          carton_name: cartonName,

          units_per_pack:
            unitsPerPack
              ? Number(unitsPerPack)
              : null,

          packs_per_carton:
            packsPerCarton
              ? Number(packsPerCarton)
              : null,

          stock_units: initialStockUnits
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      showToast(
        "Medicine added successfully!"
      );

      setName("");
      setBrand("");
      setDescription("");
      setCategory("");
      setPrice("");
      setStrength("");
      setForm("");

      setUnitName("");
      setPackName("");
      setCartonName("");
      setUnitsPerPack("");
      setPacksPerCarton("");
      setInitialStockQuantity("");
      setInitialStockType("unit");

    } catch (error) {

      console.error(error);

      showToast(
        error?.response?.data?.message ||
        "Failed to add medicine.",
        "error"
      );

    } finally {

      setLoading(false);

    }
  };

  /*
  ========================================================
  RESTOCK EXISTING MEDICINE
  ========================================================
  
  IMPORTANT:
  This now uses:

  POST /medicines/:id/restock

  instead of:

  PUT /medicines/:id

  ========================================================
  */

  const handleRestock = async (e) => {

    e.preventDefault();

    if (!selectedMedicine) {

      showToast(
        "Please search and select a medicine first.",
        "error"
      );

      return;
    }

    if (unitsToAdd <= 0) {

      showToast(
        "Enter a valid restock quantity.",
        "error"
      );

      return;
    }

    setLoading(true);

    try {

      /*
      ================================================
      THIS IS THE IMPORTANT CHANGE
      ================================================
      */

      const response = await API.post(
        `/medicines/${selectedMedicine.id}/restock`,
        {
          quantity: Number(restockQuantity),
          unit_type: restockType
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      /*
      The backend gives us the updated medicine.
      */

      const updatedMedicine =
        response.data?.medicine;

      /*
      Update the local medicine list.
      */

      if (updatedMedicine) {

        setMedicines((previous) =>
          previous.map((medicine) =>
            medicine.id === updatedMedicine.id
              ? updatedMedicine
              : medicine
          )
        );

        setSelectedMedicine(updatedMedicine);

      } else {

        /*
        Fallback in case backend doesn't return
        the updated medicine.
        */

        setMedicines((previous) =>
          previous.map((medicine) =>
            medicine.id === selectedMedicine.id
              ? {
                  ...medicine,
                  stock_units: newStock
                }
              : medicine
          )
        );

        setSelectedMedicine((previous) =>
          previous
            ? {
                ...previous,
                stock_units: newStock
              }
            : previous
        );

      }

      setRestockQuantity("");

      showToast(
        `${selectedMedicine.name} restocked successfully!`
      );

    } catch (error) {

      console.error(
        "Restock error:",
        error
      );

      showToast(
        error?.response?.data?.message ||
        "Failed to restock medicine.",
        "error"
      );

    } finally {

      setLoading(false);

    }
  };

  /*
  ========================================================
  RENDER
  ========================================================
  */

  return (
    <div className="am-main">

      <style>{CSS}</style>

      <div className="am-header">

        <h1 className="am-title">
          Inventory Management
        </h1>

        <p className="am-subtitle">
          Add new medicines or restock existing medicines
        </p>

      </div>

      {/* TABS */}

      <div className="am-tabs">

        <button
          className={`am-tab ${
            mode === "add"
              ? "am-tab-active"
              : "am-tab-inactive"
          }`}
          onClick={() => setMode("add")}
        >
          ➕ Add New Medicine
        </button>

        <button
          className={`am-tab ${
            mode === "restock"
              ? "am-tab-active"
              : "am-tab-inactive"
          }`}
          onClick={() => setMode("restock")}
        >
          📦 Restock Existing
        </button>

      </div>

      <div className="am-layout">

        <div className="am-card">

          {/* TOAST */}

          {toast && (

            <div
              style={{
                background:
                  toast.type === "success"
                    ? "#f0fdf6"
                    : "#fef2f2",

                border:
                  `1.5px solid ${
                    toast.type === "success"
                      ? "#bbf7d0"
                      : "#fecaca"
                  }`,

                padding: "14px",
                borderRadius: "12px",
                marginBottom: "24px",

                color:
                  toast.type === "success"
                    ? "#14532d"
                    : "#dc2626",

                fontSize: "14px",
                fontWeight: 500
              }}
            >

              {toast.type === "success"
                ? "✅ "
                : "⚠️ "}

              {toast.msg}

            </div>

          )}

          {/* ==================================================
              ADD NEW MEDICINE
          ================================================== */}

          {mode === "add" && (

            <form onSubmit={handleAddMedicine}>

              <div className="am-section-title">
                General Information
              </div>

              <div className="am-row">

                <div className="am-input-group">

                  <label className="am-label">
                    💊 Medicine Name
                  </label>

                  <input
                    className="am-input"
                    placeholder="e.g. Paracetamol"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    required
                  />

                </div>

                <div className="am-input-group">

                  <label className="am-label">
                    🏭 Brand / Manufacturer
                  </label>

                  <input
                    className="am-input"
                    placeholder="e.g. Emzor"
                    value={brand}
                    onChange={(e) =>
                      setBrand(e.target.value)
                    }
                    required
                  />

                </div>

              </div>

              <div className="am-row">

                <div className="am-input-group">

                  <label className="am-label">
                    🏷️ Category
                  </label>

                  <select
                    className="am-input"
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value)
                    }
                    required
                  >

                    <option value="">
                      Select Category
                    </option>

                    {categories.map((categoryName) => (

                      <option
                        key={categoryName}
                        value={categoryName}
                      >
                        {categoryName}
                      </option>

                    ))}

                  </select>

                </div>

                <div className="am-input-group">

                  <label className="am-label">
                    🧪 Form
                  </label>

                  <select
                    className="am-input"
                    value={form}
                    onChange={(e) =>
                      setForm(e.target.value)
                    }
                  >

                    <option value="">
                      Select Form
                    </option>

                    <option value="tablet">
                      Tablet
                    </option>

                    <option value="capsule">
                      Capsule
                    </option>

                    <option value="syrup">
                      Syrup
                    </option>

                    <option value="injection">
                      Injection
                    </option>

                    <option value="cream">
                      Cream
                    </option>

                    <option value="ointment">
                      Ointment
                    </option>

                    <option value="suspension">
                      Suspension
                    </option>

                    <option value="drops">
                      Drops
                    </option>

                    <option value="inhaler">
                      Inhaler
                    </option>

                    <option value="other">
                      Other
                    </option>

                  </select>

                </div>

              </div>

              <div className="am-row">

                <div className="am-input-group">

                  <label className="am-label">
                    ⚗️ Strength
                  </label>

                  <input
                    className="am-input"
                    placeholder="e.g. 500mg"
                    value={strength}
                    onChange={(e) =>
                      setStrength(e.target.value)
                    }
                  />

                </div>

                <div className="am-input-group">

                  <label className="am-label">
                    📝 Description
                  </label>

                  <input
                    className="am-input"
                    placeholder="Optional description"
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                  />

                </div>

              </div>

              {/* PACKAGING */}

              <div className="am-section-title">
                Packaging
              </div>

              <div className="am-pack-info">

                Define the packaging from the smallest
                individual unit upward.

                <br />

                Example:
                <strong>
                  {" "}
                  1 pack = 10 tablets
                </strong>
                {" "}
                and
                <strong>
                  {" "}
                  1 carton = 10 packs
                </strong>.

              </div>

              <div className="am-row">

                <div className="am-input-group">

                  <label className="am-label">
                    🔹 Smallest Unit
                  </label>

                  <input
                    className="am-input"
                    placeholder="Tablet, Bottle, Sachet..."
                    value={unitName}
                    onChange={(e) =>
                      setUnitName(e.target.value)
                    }
                    required
                  />

                </div>

                <div className="am-input-group">

                  <label className="am-label">
                    📦 Pack
                  </label>

                  <input
                    className="am-input"
                    placeholder="Strip, Box, Bottle..."
                    value={packName}
                    onChange={(e) =>
                      setPackName(e.target.value)
                    }
                  />

                </div>

              </div>

              <div className="am-row">

                <div className="am-input-group">

                  <label className="am-label">
                    🚚 Bulk / Carton
                  </label>

                  <input
                    className="am-input"
                    placeholder="Carton, Case..."
                    value={cartonName}
                    onChange={(e) =>
                      setCartonName(e.target.value)
                    }
                  />

                </div>

                <div className="am-input-group">

                  <label className="am-label">
                    🔢 Units per Pack
                  </label>

                  <input
                    type="number"
                    min="1"
                    className="am-input"
                    placeholder="e.g. 10"
                    value={unitsPerPack}
                    onChange={(e) =>
                      setUnitsPerPack(e.target.value)
                    }
                  />

                </div>

              </div>

              <div className="am-row">

                <div className="am-input-group">

                  <label className="am-label">
                    🔢 Packs per Carton
                  </label>

                  <input
                    type="number"
                    min="1"
                    className="am-input"
                    placeholder="e.g. 10"
                    value={packsPerCarton}
                    onChange={(e) =>
                      setPacksPerCarton(e.target.value)
                    }
                  />

                </div>

                <div className="am-input-group">

                  <label className="am-label">
                    📦 Initial Stocking Unit
                  </label>

                  <select
                    className="am-input"
                    value={initialStockType}
                    onChange={(e) =>
                      setInitialStockType(e.target.value)
                    }
                  >
                    <option value="unit">
                      {unitName || "Smallest Unit"}
                    </option>

                    {packName && (
                      <option value="pack">
                        {packName}
                      </option>
                    )}

                    {cartonName && (
                      <option value="carton">
                        {cartonName}
                      </option>
                    )}
                  </select>

                </div>

              </div>

              {/* INITIAL STOCK */}

              <div className="am-section-title">
                Initial Stock
              </div>

              <div className="am-row">

                <div className="am-input-group">

                  <label className="am-label">
                    🔢 Quantity Received
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="1"
                    className="am-input"
                    placeholder="e.g. 5"
                    value={initialStockQuantity}
                    onChange={(e) =>
                      setInitialStockQuantity(e.target.value)
                    }
                    required
                  />

                </div>

                <div className="am-input-group">

                  <label className="am-label">
                    📊 Starting Stock
                  </label>

                  <div
                    className="am-input"
                    style={{
                      background: "#f0fdf6",
                      borderColor: "#bbf7d0",
                      color: "#14532d",
                      fontWeight: 700
                    }}
                  >
                    {initialStockUnits.toLocaleString()}{" "}
                    {unitName || "units"}
                  </div>

                </div>

              </div>

              {initialStockQuantity !== "" && (
                <div className="am-calculation">

                  <div className="am-calc-row">
                    <span>Quantity received</span>
                    <strong>
                      {Number(initialStockQuantity || 0).toLocaleString()}{" "}
                      {initialStockType === "carton"
                        ? cartonName || "carton"
                        : initialStockType === "pack"
                          ? packName || "pack"
                          : unitName || "unit"}
                    </strong>
                  </div>

                  {initialStockType === "pack" && (
                    <div className="am-calc-row">
                      <span>Units per pack</span>
                      <strong>
                        {Number(unitsPerPack || 1).toLocaleString()}
                      </strong>
                    </div>
                  )}

                  {initialStockType === "carton" && (
                    <>
                      <div className="am-calc-row">
                        <span>Packs per carton</span>
                        <strong>
                          {Number(packsPerCarton || 1).toLocaleString()}
                        </strong>
                      </div>

                      <div className="am-calc-row">
                        <span>Units per pack</span>
                        <strong>
                          {Number(unitsPerPack || 1).toLocaleString()}
                        </strong>
                      </div>
                    </>
                  )}

                  <div className="am-calc-row am-calc-total">
                    <span>System starting stock</span>
                    <strong>
                      {initialStockUnits.toLocaleString()}{" "}
                      {unitName || "units"}
                    </strong>
                  </div>

                </div>
              )}

              {/* FINANCIALS */}

              <div className="am-section-title">
                Financials
              </div>

              <div style={{ maxWidth: "300px" }}>

                <div className="am-input-group">

                  <label className="am-label">
                    💰 Price per Smallest Unit (₦)
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="am-input"
                    placeholder="e.g. 10.00"
                    value={price}
                    onChange={(e) =>
                      setPrice(e.target.value)
                    }
                    required
                  />

                </div>

              </div>

              <button
                type="submit"
                disabled={loading}
                className="am-submit-btn"
              >
                {loading
                  ? "Adding Medicine..."
                  : "➕ Add to Inventory"}
              </button>

            </form>

          )}

          {/* ==================================================
              RESTOCK EXISTING
          ================================================== */}

          {mode === "restock" && (

            <form onSubmit={handleRestock}>

              <div className="am-section-title">
                Find Medicine
              </div>

              <div className="am-search-box">

                <span className="am-search-icon">
                  🔍
                </span>

                <input
                  className="am-input"
                  placeholder="Search medicine, brand, strength..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setSelectedMedicine(null);
                  }}
                />

              </div>

              {/* SEARCH RESULTS */}

              {search.trim() && (

                <div className="am-results">

                  {loadingMedicines ? (

                    <div className="am-empty">
                      Loading medicines...
                    </div>

                  ) : filteredMedicines.length === 0 ? (

                    <div className="am-empty">
                      No matching medicines found.
                    </div>

                  ) : (

                    filteredMedicines.map((medicine) => (

                      <div
                        key={medicine.id}
                        className={`am-result ${
                          selectedMedicine?.id === medicine.id
                            ? "am-result-selected"
                            : ""
                        }`}
                        onClick={() => {

                          setSelectedMedicine(medicine);
                          setRestockQuantity("");
                          setRestockType("unit");

                        }}
                      >

                        <div className="am-result-name">

                          {medicine.name}

                          {medicine.strength
                            ? ` ${medicine.strength}`
                            : ""}

                        </div>

                        <div className="am-result-meta">

                          {medicine.brand
                            ? `${medicine.brand} • `
                            : ""}

                          {medicine.form || "Medicine"}

                          {" • Stock: "}

                          <strong>
                            {Number(
                              medicine.stock_units || 0
                            ).toLocaleString()}
                          </strong>

                          {" "}

                          {medicine.unit_name || "units"}

                        </div>

                      </div>

                    ))

                  )}

                </div>

              )}

              {/* SELECTED MEDICINE */}

              {selectedMedicine && (

                <>

                  <div className="am-section-title">
                    Selected Medicine
                  </div>

                  <div className="am-stock-card">

                    <div className="am-stock-title">
                      CURRENT STOCK
                    </div>

                    <div className="am-stock-number">
                      {currentStock.toLocaleString()}
                    </div>

                    <div className="am-stock-label">

                      {selectedMedicine.unit_name ||
                        "individual units"}

                      {selectedMedicine.brand
                        ? ` • ${selectedMedicine.brand}`
                        : ""}

                    </div>

                  </div>

                  {/* PACKAGING INFO */}

                  <div className="am-pack-info">

                    <strong>
                      📦 Packaging
                    </strong>

                    <br />

                    1{" "}
                    {selectedMedicine.pack_name ||
                      "pack"}{" "}
                    ={" "}
                    {selectedMedicine.units_per_pack ||
                      1}{" "}
                    {selectedMedicine.unit_name ||
                      "units"}

                    <br />

                    1{" "}
                    {selectedMedicine.carton_name ||
                      "carton"}{" "}
                    ={" "}
                    {selectedMedicine.packs_per_carton ||
                      1}{" "}
                    {selectedMedicine.pack_name ||
                      "packs"}

                    {" = "}

                    {(
                      Number(
                        selectedMedicine.packs_per_carton || 1
                      ) *
                      Number(
                        selectedMedicine.units_per_pack || 1
                      )
                    ).toLocaleString()}

                    {" "}

                    {selectedMedicine.unit_name ||
                      "units"}

                  </div>

                  {/* RESTOCK */}

                  <div className="am-section-title">
                    Add Stock
                  </div>

                  <div className="am-row">

                    <div className="am-input-group">

                      <label className="am-label">
                        🔢 Quantity
                      </label>

                      <input
                        type="number"
                        min="1"
                        className="am-input"
                        placeholder="e.g. 5"
                        value={restockQuantity}
                        onChange={(e) =>
                          setRestockQuantity(
                            e.target.value
                          )
                        }
                        required
                      />

                    </div>

                    <div className="am-input-group">

                      <label className="am-label">
                        📦 Adding as
                      </label>

                      <select
                        className="am-input"
                        value={restockType}
                        onChange={(e) =>
                          setRestockType(
                            e.target.value
                          )
                        }
                      >

                        <option value="unit">
                          {selectedMedicine.unit_name ||
                            "Units"}
                        </option>

                        {selectedMedicine.pack_name && (

                          <option value="pack">
                            {selectedMedicine.pack_name}
                          </option>

                        )}

                        {selectedMedicine.carton_name && (

                          <option value="carton">
                            {selectedMedicine.carton_name}
                          </option>

                        )}

                      </select>

                    </div>

                  </div>

                  {/* CALCULATION */}

                  {unitsToAdd > 0 && (

                    <div className="am-calculation">

                      <div className="am-calc-row">

                        <span>
                          Current stock
                        </span>

                        <strong>
                          {currentStock.toLocaleString()}
                        </strong>

                      </div>

                      <div className="am-calc-row">

                        <span>
                          Stock being added
                        </span>

                        <strong>
                          +
                          {unitsToAdd.toLocaleString()}
                        </strong>

                      </div>

                      <div className="am-calc-row am-calc-total">

                        <span>
                          New stock
                        </span>

                        <strong>
                          {newStock.toLocaleString()}
                        </strong>

                      </div>

                    </div>

                  )}

                  <button
                    type="submit"
                    disabled={
                      loading ||
                      !selectedMedicine ||
                      unitsToAdd <= 0
                    }
                    className="am-submit-btn"
                  >

                    {loading
                      ? "Updating Stock..."
                      : "📦 Add Stock to Inventory"}

                  </button>

                </>

              )}

            </form>

          )}

        </div>

        {/* SIDEBAR */}

        <div className="am-sidebar">

          {mode === "restock" ? (

            <>

              <div className="am-tip-card">

                <h3
                  style={{
                    margin: "0 0 12px",
                    fontSize: "16px"
                  }}
                >
                  📦 Restocking
                </h3>

                <p
                  style={{
                    fontSize: "13px",
                    color: "#6b7280",
                    lineHeight: 1.6,
                    margin: 0
                  }}
                >
                  Search for the medicine and select the
                  exact brand you want to restock.
                </p>

              </div>

              <div className="am-tip-card">

                <h4
                  style={{
                    margin: "0 0 10px",
                    fontSize: "14px"
                  }}
                >
                  💡 Example
                </h4>

                <p
                  style={{
                    margin: 0,
                    fontSize: "12.5px",
                    color: "#6b7280",
                    lineHeight: 1.7
                  }}
                >

                  Current stock:
                  <br />

                  <strong>
                    400 tablets
                  </strong>

                  <br /><br />

                  Add:
                  <br />

                  <strong>
                    5 cartons
                  </strong>

                  <br /><br />

                  If 1 carton = 100 tablets:

                  <br />

                  <strong>
                    5 × 100 = 500 tablets
                  </strong>

                  <br /><br />

                  New stock:

                  <br />

                  <strong>
                    400 + 500 = 900 tablets
                  </strong>

                </p>

              </div>

            </>

          ) : (

            <>

              <div className="am-tip-card">

                <h3
                  style={{
                    margin: "0 0 12px",
                    fontSize: "16px"
                  }}
                >
                  📋 Stock Rules
                </h3>

                <p
                  style={{
                    fontSize: "13px",
                    color: "#6b7280",
                    lineHeight: 1.6,
                    margin: 0
                  }}
                >
                  Enter the quantity physically received
                  as units, packs, or cartons. The system
                  converts it to the smallest unit automatically.
                </p>

              </div>

            </>

          )}

        </div>

      </div>

    </div>
  );
}

export default AddMedicine;