import { Link, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{
        width: "220px",
        background: "#0f172a",
        color: "#fff",
        padding: "20px"
      }}>
        <h3>BlenDaura Admin</h3>
        <nav>
          <p><Link to="/admin" style={{ color: "#fff" }}>Dashboard</Link></p>
          <p><Link to="/admin/products" style={{ color: "#fff" }}>Products</Link></p>
          <p><Link to="/admin/orders" style={{ color: "#fff" }}>Orders</Link></p>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
}
