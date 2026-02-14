import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link } from "react-router-dom";

const formatPrice = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export default function Cart() {
  const navigate = useNavigate();
  const { cart, updateQty, removeFromCart, subtotal, shipping, total } = useContext(CartContext);

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  if (cart.length === 0) {
    return (
      <div className="container text-center my-5">
        <img
          src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png"
          alt="Empty cart"
          style={{ width: "180px", opacity: 0.9 }}
        />
        <h4 className="mt-3 fw-bold">Your cart is empty</h4>
        <p className="text-muted">Looks like you haven’t added anything yet.</p>
        <button className="btn btn-dark px-4 py-2 mt-2 rounded-pill" onClick={() => navigate("/")}>
          Continue Shopping
        </button>
      </div>
    );
  }

  const handleProceed = () => {
    // ✅ check token
    const token = localStorage.getItem("token");
    if (!token) {
      // redirect to login with return path
      navigate("/login", { state: { from: "/checkout" } });
    } else {
      // already logged in → go to checkout
      navigate("/checkout");
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">Shopping Cart</h2>
      <div className="row">
        <div className="col-md-8">
          {cart.map((item) => (
            <div
              key={item._id}
              className="d-flex p-3 mb-3 rounded-3 bg-white border cart-item"
              style={{ transition: "0.2s", boxShadow: "0 4px 14px rgba(0,0,0,0.03)" }}
            >
              <Link to={`/product/${item._id}`}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: "90px", height: "90px", borderRadius: "10px", objectFit: "cover", cursor: "pointer" }}
                  onError={(e) => (e.target.src = "https://via.placeholder.com/100")}
                />
              </Link>

              <div className="ms-3 flex-grow-1">
                <h5 className="mb-1">{item.name}</h5>
                <small className="text-muted">{item.category}</small>
                <h6 className="mt-2">{formatPrice(item.price * item.qty)}</h6>
              </div>

              <div className="d-flex align-items-center">
                <button className="btn btn-light border" onClick={() => updateQty(item._id, "dec")}>−</button>
                <span className="mx-3">{item.qty}</span>
                <button className="btn btn-light border" onClick={() => updateQty(item._id, "inc")}>+</button>
                <button className="btn btn-outline-danger ms-3" onClick={() => removeFromCart(item._id)}>
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="col-md-4">
          <div className="p-4 rounded shadow-sm bg-white">
            <h4 className="fw-bold mb-3">Order Summary</h4>
            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal ({totalItems} items)</span>
              <span className="fw-semibold">{formatPrice(subtotal)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Shipping</span>
              <span className="text-success">{formatPrice(shipping)}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between mb-3">
              <strong>Total</strong>
              <strong>{formatPrice(total)}</strong>
            </div>
            <button className="btn btn-dark w-100" onClick={handleProceed}>
              Proceed to Checkout
            </button>
            <p className="text-muted text-center mt-2" style={{ fontSize: "12px" }}>
              Taxes included. Secure checkout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
