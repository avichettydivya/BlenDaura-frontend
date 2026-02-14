import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { CartContext } from "../context/CartContext";
import api from "../api";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext); // ✅ SAME AS HOME PAGE

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => toast.error("Failed to load product"));
  }, [id]);

  if (!product) {
    return (
      <Container className="my-5 text-center">
        <p>Loading product...</p>
      </Container>
    );
  }

  return (
  <Container className="my-5">
    <Row className="align-items-center g-5">
      {/* Image */}
      <Col md={6}>
        <div
          style={{
            padding: "15px",
            background: "#f8f9fa",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <img
            src={product.image?.url}
            alt={product.name}
            style={{
              maxWidth: "100%",
              maxHeight: "500px",
              objectFit: "contain",
              borderRadius: "10px",
            }}
          />
        </div>
      </Col>

      {/* Details */}
      <Col md={6}>
        <h2 style={{ fontWeight: 700 }}>{product.name}</h2>

        <h3 style={{ color: "#198754", marginTop: "10px" }}>
          ₹{product.price}
        </h3>

        <hr />

        <ul style={{ paddingLeft: "18px", lineHeight: "1.9", color: "#555" }}>
  {product.description.split("\n").map((point, index) => (
    <li key={index}>{point}</li>
  ))}
</ul>


        <Button
        variant="dark" size="lg" className="add-btn"
          
          onClick={() => {
            addToCart({
              _id: product._id,
              name: product.name,
              price: product.price,
              image: product.image?.url || "",
              category: product.category,
              qty: 1,
            });
            toast.success("Added to cart 🎉");
          }}
        >
          Add to Cart
        </Button>
        <style>
{`
.add-btn {
  background-color: #2c2c2c !important;
  color: white !important;
  border: none !important;
}

.add-btn:hover {
  background-color: black !important;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.25);
}
`}
</style>

      </Col>
    </Row>
  </Container>
);
}