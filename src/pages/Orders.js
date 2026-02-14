import { useEffect, useState } from "react";
import api from "../api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const email = localStorage.getItem("blendaura_user_email");

  useEffect(() => {
    if (!email) return;

    async function load() {
      try {
        const res = await api.get(`/orders?email=${email}`);
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, [email]);

  if (!email) {
    return <p className="container mt-4">
      Login / place an order first to see your orders.
    </p>;
  }

  return (
    <div className="container my-4">
      <h3>Your Orders</h3>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="card my-3 p-3">
            <div className="d-flex justify-content-between">
              <strong>Order ID:</strong> {order._id}
              <span>Status: {order.status}</span>
            </div>

            <ul className="mt-2">
              {order.items.map((i) => (
                <li key={i._id}>
                  {i.title || i.name} × {i.qty || 1} — ₹
                  {i.price * (i.qty || 1)}
                </li>
              ))}
            </ul>

            <h5>Total: ₹{order.total}</h5>
          </div>
        ))
      )}
    </div>
  );
}

