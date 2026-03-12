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

  const token = localStorage.getItem("token");

  return (

    <Routes>

      {/* Public routes */}

      <Route
        path="/"
        element={token ? <Navigate to="/medicines" /> : <Login />}
      />

      <Route
        path="/register"
        element={token ? <Navigate to="/medicines" /> : <Register />}
      />

      {/* Protected routes */}

      <Route
        path="/medicines"
        element={token ? <Medicines /> : <Navigate to="/" />}
      />

      <Route
        path="/create-order"
        element={token ? <CreateOrder /> : <Navigate to="/" />}
      />

      <Route
        path="/orders"
        element={token ? <Orders /> : <Navigate to="/" />}
      />

      <Route
        path="/my-orders"
        element={token ? <MyOrders /> : <Navigate to="/" />}
      />

      <Route
        path="/add-medicine"
        element={token ? <AddMedicine /> : <Navigate to="/" />}
      />

      <Route
        path="/edit-medicine/:id"
        element={token ? <EditMedicine /> : <Navigate to="/" />}
      />

      <Route
        path="/users"
        element={token ? <Users /> : <Navigate to="/" />}
      />

      <Route
        path="/dashboard"
        element={token ? <Dashboard /> : <Navigate to="/" />}
      />

    </Routes>

  );
}

export default AppRoutes;