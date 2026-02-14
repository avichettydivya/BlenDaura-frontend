import { useEffect, useState } from "react";
import api from "../api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/all");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const markPaid = async (id) => {
    try {
      await api.put(`/orders/${id}/mark-paid`);
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("Failed to mark paid");
    }
  };

  return (
    <div className="container my-4">
      <h3 className="mb-3">All Orders</h3>

      <table className="table table-bordered table-hover align-middle">
        <thead className="table-dark">
          <tr>
            <th>Customer Details</th>
            <th>Products</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Order Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => {
            const customer = order.shippingDetails;
            const isPaid = order.paymentStatus === "paid";

            return (
              <tr key={order._id}>
                {/* CUSTOMER */}
                <td>
                  {customer ? (
                    <>
                      <strong>{customer.name}</strong>
                      <br />
                      📧 {customer.email}
                      <br />
                      📞 {customer.phone}
                      <br />
                      🏠 {customer.address}
                    </>
                  ) : (
                    <>
                      <strong>{order.user?.email}</strong>
                      <br />
                      <span className="text-muted">No shipping details</span>
                    </>
                  )}
                </td>

                {/* PRODUCTS */}
                <td>
                  {order.items?.length > 0 ? (
                    <ul className="mb-0 ps-3">
                      {order.items.map((item, index) => (
                        <li key={index}>
                          {item.product?.name || "Product"} × {item.qty}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-muted">No items</span>
                  )}
                </td>

                {/* TOTAL */}
                <td>
                  <strong>₹{order.total}</strong>
                </td>

                {/* PAYMENT */}
                <td>
                  <span className="badge bg-info d-block mb-1">
                    {order.paymentMethod}
                  </span>

                  {isPaid ? (
                    <span className="badge bg-success">Paid</span>
                  ) : (
                    <span className="badge bg-warning text-dark">
                      Pending
                    </span>
                  )}
                </td>

                {/* ORDER STATUS */}
                <td>
                  <span className="badge bg-secondary">
                    {order.status}
                  </span>
                </td>

                {/* ACTIONS */}
                <td>
                  {!isPaid && (
                    <button
                      className="btn btn-success btn-sm mb-1 w-100"
                      onClick={() => markPaid(order._id)}
                    >
                      Mark Paid
                    </button>
                  )}

                  <a
                    href={`http://localhost:5000/api/invoice/${order._id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline-dark btn-sm w-100 mb-1"
                  >
                    Invoice
                  </a>

                  {customer?.phone && (
                    <a
                      href={`https://wa.me/91${customer.phone}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline-success btn-sm w-100"
                    >
                      WhatsApp
                    </a>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}


