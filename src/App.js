import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import AppNavbar from "./components/Navbar";

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";
import Contact from "./pages/contact";
import Login from "./pages/Login";
import Signup from "./pages/signup";
import ProductPage from "./pages/productPage";
import Category from "./pages/Category";
import UserDashboard from "./components/userDashboard";
import OrderSuccess from "./pages/OrderSuccess";


import { CartProvider } from "./context/CartContext";
import { ToastContainer } from "react-toastify";

import AdminRoute from "./components/AdminRoutes";





// ADMIN
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminProducts from "./admin/AdminProducts";
import AdminOrders from "./admin/AdminOrders";

import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user"));
    if (token && userData) {
      setUser(userData);
    }
  }, []);

  return (
    <CartProvider>
      <Router>
        {/* ✅ SINGLE NAVBAR SOURCE */}
        <AppNavbar user={user} setUser={setUser} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/category/:name" element={<Category />} />
          <Route path="/dashboard" element={<UserDashboard user={user} />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/order-success" element={<OrderSuccess />} />



          {/* ADMIN */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>
        </Routes>
      </Router>

      <ToastContainer position="top-center" autoClose={1200} />
    </CartProvider>
  );
}
