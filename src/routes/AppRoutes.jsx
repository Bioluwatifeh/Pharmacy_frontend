import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
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

  if (!token) {
    return <Login />;
  }

  return (
    <Routes>

      <Route path="/" element={<Medicines />} />

      <Route path="/medicines" element={<Medicines />} />

      <Route path="/create-order" element={<CreateOrder />} />

      <Route path="/orders" element={<Orders />} />

      <Route path="/my-orders" element={<MyOrders />} />

      <Route path="/add-medicine" element={<AddMedicine />} />

      <Route path="/edit-medicine/:id" element={<EditMedicine />} />

      <Route path="/users" element={<Users />} />

      <Route path="/dashboard" element={<Dashboard />} />

    </Routes>
  );
}

export default AppRoutes;