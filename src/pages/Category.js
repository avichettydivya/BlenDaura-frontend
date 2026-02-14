import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../api"; // centralized API
import { Container, Row, Col, Card } from "react-bootstrap";
import LoaderSkeleton from "../components/LoaderSkeleton";

/**
 * URL slug  -> DB category name
 * must EXACTLY match backend stored category values
 */
const categoryMap = {
  anime: "Anime",
  polaroids: "Polaroids",
  paintings: "Paintings",
  sketches: "Sketches",
  crafts: "Crafts",
};

export default function Category() {
  const { name } = useParams();

  // 🔑 normalize URL param (CRITICAL FIX)
  const slug = name?.toLowerCase();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        const category = categoryMap[slug];

        // ❌ invalid category slug
        if (!category) {
          setProducts([]);
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `/products?category=${encodeURIComponent(category)}`
        );

        setProducts(res.data || []);
      } catch (err) {
        console.error("CATEGORY FETCH ERROR:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug]);

  // ⏳ loader
  if (loading) {
    return <LoaderSkeleton count={8} />;
  }

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-capitalize">{slug}</h2>

      {products.length === 0 && (
        <p className="text-muted">No products found</p>
      )}

      <Row>
        {products.map((p) => (
          <Col md={6} lg={4} key={p._id} className="mb-4">
            <Link
              to={`/product/${p._id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Card className="h-100 shadow-sm">
                <Card.Img
                  src={p.image?.url}
                  alt={p.name}
                  className="product-img"
                  loading="lazy"
                />

                <Card.Body>
                  <Card.Title>{p.name}</Card.Title>
                  <Card.Text className="fw-bold">
                    ₹{p.price}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
