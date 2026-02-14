import { useEffect, useState } from "react";
import api from "../api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders/all").then(res => setOrders(res.data));
  }, []);

  return (
    <>
      <h2>All Orders</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>User</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o._id}>
              <td>{o.user?.email}</td>
              <td>₹{o.total}</td>
              <td>{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
