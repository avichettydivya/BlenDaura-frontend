import { useEffect, useState } from "react";
import api from "../api";

export default function UserDashboard({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders"); // ✅ CORRECT ROUTE
        setOrders(res.data);
      } catch (err) {
        console.error(err.response || err);
  setError(err.response?.data?.message || "Failed to load orders");


      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Welcome, {user.name}</h2>

      <h3>Your Orders</h3>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>
                  {o.items.map((i, idx) => (
                    <div key={idx}>
                      {i.product?.name || "Product"} × {i.qty} = ₹{i.price}
                    </div>
                  ))}
                </td>
                <td>₹{o.total}</td>
                <td>{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
