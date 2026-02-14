import { Navbar, Container, Nav, Button, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import "./Navbar.css";

import {
  HiHome,
  HiShoppingCart,
  HiMail,
  HiUserCircle,
  HiLogout,
  HiViewGrid,
} from "react-icons/hi";

const AppNavbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const { cartItems = [] } = useContext(CartContext); // Safe default
  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        <img
          src="/logo.jpeg"
          alt="BlenDaura"
          style={{
            height: "42px",
            objectFit: "contain",
          }}
        />
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          BlenDaura
        </Navbar.Brand>

        <Nav className="ms-auto align-items-center gap-3">
          {/* Home */}
          <Nav.Link as={Link} to="/" title="Home">
            <HiHome size={22} />
          </Nav.Link>

          {/* Cart */}
          <Nav.Link as={Link} to="/cart" title="Cart">
  <div className="cart-wrapper">
    <HiShoppingCart size={22} />
    {totalItems > 0 && (
      <Badge pill className="cart-badge">
        {totalItems}
      </Badge>
    )}
  </div>
</Nav.Link>


          {/* Contact */}
          <Nav.Link as={Link} to="/contact" title="Contact">
            <HiMail size={22} />
          </Nav.Link>

          {/* Admin */}
          {user?.role === "admin" && (
            <Nav.Link as={Link} to="/admin" title="Admin">
              <HiViewGrid size={22} />
            </Nav.Link>
          )}

          {/* Auth */}
          {user ? (
            <Button
              variant="outline-light"
              size="sm"
              onClick={handleLogout}
              className="d-flex align-items-center gap-1"
            >
              <HiLogout size={18} /> Logout
            </Button>
          ) : (
            <Nav.Link as={Link} to="/login" title="Login">
              <HiUserCircle size={24} />
            </Nav.Link>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;

