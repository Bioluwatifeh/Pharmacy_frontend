import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";

import Medicines from "../pages/Medicines";
import Orders from "../pages/Orders";
import MyOrders from "../pages/MyOrders";
import CreateOrder from "../pages/CreateOrder";
import AddMedicine from "../pages/AddMedicine";
import EditMedicine from "../pages/EditMedicine";
import Users from "../pages/Users";
import Dashboard from "../pages/Dashboard";

function AppRoutes() {
  // 🗑️ REMOVE: const token = localStorage.getItem("token");
  // Check localStorage directly inside the elements so it's always accurate on render!

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/"
        element={localStorage.getItem("token") ? <Navigate to="/medicines" /> : <Login />}
      />
      <Route
        path="/register"
        element={localStorage.getItem("token") ? <Navigate to="/medicines" /> : <Register />}
      />

      {/* Protected routes */}
      <Route
        path="/medicines"
        element={localStorage.getItem("token") ? <Medicines /> : <Navigate to="/" />}
      />
      <Route
        path="/create-order"
        element={localStorage.getItem("token") ? <CreateOrder /> : <Navigate to="/" />}
      />
      <Route
        path="/orders"
        element={localStorage.getItem("token") ? <Orders /> : <Navigate to="/" />}
      />
      <Route
        path="/my-orders"
        element={localStorage.getItem("token") ? <MyOrders /> : <Navigate to="/" />}
      />
      <Route
        path="/add-medicine"
        element={localStorage.getItem("token") ? <AddMedicine /> : <Navigate to="/" />}
      />
      <Route
        path="/edit-medicine/:id"
        element={localStorage.getItem("token") ? <EditMedicine /> : <Navigate to="/" />}
      />
      <Route
        path="/users"
        element={localStorage.getItem("token") ? <Users /> : <Navigate to="/" />}
      />
      <Route
        path="/dashboard"
        element={localStorage.getItem("token") ? <Dashboard /> : <Navigate to="/" />}
      />
    </Routes>
  );
}

export default AppRoutes;