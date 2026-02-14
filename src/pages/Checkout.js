import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { CartContext } from "../context/CartContext";

export default function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isReady, setIsReady] = useState(false); // ✅ wait for token check

  /* 🔐 Redirect if not logged in */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { state: { from: "/checkout" } });
    } else {
      setIsReady(true); // allow rendering
    }
  }, [navigate]);

  /* 🛑 Prevent checkout if cart empty */
  if (!isReady) return null; // don’t render until token check is done
  if (cart.length === 0) {
    return (
      <div className="container text-center mt-5">
        <h4>Your cart is empty</h4>
      </div>
    );
  }

  /* 💰 Currency Format */
  const formatPrice = (n) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  /* 🧮 CALCULATIONS */
  const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);
  const SHIPPING_FEE = 50;
  const grandTotal = subtotal + SHIPPING_FEE;

  /* 🔁 FORM HANDLER */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setEmailError("");
  };

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  /* 🚀 PLACE ORDER */
  const placeOrder = async () => {
    if (loading) return;

    if (!form.name.trim()) return alert("Name is required");
    if (!form.email.trim()) return setEmailError("Email is required");
    if (!isValidEmail(form.email.trim())) return setEmailError("Enter a valid email address");
    if (!form.phone.trim() || !/^[0-9]{10}$/.test(form.phone)) return alert("Enter a valid 10-digit phone number");
    if (!form.address.trim()) return alert("Address is required");

    setEmailError("");

    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to place an order.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post(
        "/orders",
        {
          items: cart.map((item) => ({ product: item._id, qty: item.qty || 1 })),
          paymentMode: "UPI",
          shippingDetails: {
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone,
            address: form.address.trim(),
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      clearCart();

      const orderId = res.data?._id;
      if (!orderId) throw new Error("Order ID missing in response");

      window.location.href = `/order-success?id=${orderId}&amount=${grandTotal}`;
    } catch (err) {
      console.error("ORDER ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || err.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4">
      <h3 className="fw-bold mb-3">Checkout</h3>
      <div className="row">
        {/* LEFT */}
        <div className="col-md-7">
          <h5>Delivery Details</h5>
          <input name="name" className="form-control mb-2" placeholder="Full Name" value={form.name} onChange={handleChange} />
          <input
            name="email"
            type="email"
            className="form-control mb-1"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          {emailError && <small className="text-danger">{emailError}</small>}
          <input name="phone" className="form-control mb-2" placeholder="Phone" value={form.phone} onChange={handleChange} />
          <textarea name="address" className="form-control mb-2" placeholder="Full Address" value={form.address} onChange={handleChange} />
        </div>

        {/* RIGHT */}
        <div className="col-md-5">
          <h5>Order Summary</h5>
          <p>Total Items: {totalItems}</p>
          <p>Subtotal: {formatPrice(subtotal)}</p>
          <p>Shipping: {formatPrice(SHIPPING_FEE)}</p>
          <p>
            Payment Method: <strong>UPI</strong>
          </p>
          <h4 className="fw-bold">Total: {formatPrice(grandTotal)}</h4>
          <button className="btn btn-warning mt-3 w-100" onClick={placeOrder} disabled={loading}>
            {loading ? "Placing Order..." : "Place Order & Continue to Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}
