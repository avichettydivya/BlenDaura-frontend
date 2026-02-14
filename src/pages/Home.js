import { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import { FaInstagram } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import LoaderSkeleton from "../components/LoaderSkeleton";
import { Helmet } from "react-helmet-async";
import api from "../api";



export default function Home() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
  api
    .get("/products")
    .then((res) => setProducts(res.data.slice(0, 6)))
    .catch(console.error)
    .finally(() => setLoading(false));
}, []);


  if (loading) {
    return <LoaderSkeleton count={6} />;
  }
  return (
    
    <>
    <div className="top-banner">
  ✨ Customised products available • Contact us for personalised artwork
  <Link to="/contact" className="banner-link"> Get in touch →</Link>
</div>

     {/* 🔍 SEO META TAGS */}
    <Helmet>
      <title>BlenDaura | Handcrafted Art & Custom Creations</title>
      <meta
        name="description"
        content="BlenDaura is a handcrafted art store offering anime art, paintings, sketches, polaroids and custom artwork."
      />
      <meta
        name="keywords"
        content="art store, handmade art, anime art, paintings, sketches, custom artwork"
      />
    </Helmet>
      {/* 🌟 HERO / INTRO SECTION */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1 className="hero-title">Where Art Meets Aura</h1>

<p className="hero-text">
  Freshly created artworks that turn emotions into visuals —
  from anime dreams and nostalgic polaroids to timeless paintings
  and intricate sketches.
</p>

<p className="hero-subtext">
  At <strong>BlenDaura</strong>, every piece is thoughtfully crafted
  to bring personality, warmth, and elegance into your space.
</p>

<p className="contact-note">
  ✨ Want something personalized art work?  
  Reach out via Instagram, Email, or WhatsApp.
</p>



              <Button
                className="hero-btn btn-explore"
                onClick={() =>
  document.getElementById("featured")?.scrollIntoView({
    behavior: "smooth",
  })
}

                
              >
                Explore Collection →
              </Button>
            </Col>

            <Col md={6}>
              <img
                src="https://images.pexels.com/photos/102127/pexels-photo-102127.jpeg"
                alt="Art Studio"
                className="hero-image"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* 🎨 CATEGORIES SECTION */}
<section className="category-section">
  <Container>
    <h2 className="section-title text-center mb-4">
      Explore by Category
    </h2>

    <Row>
      {[
        {
          name: "Anime Arts",
          slug: "anime",
          image:
            "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
        },
        {
          name: "Polaroids",
          slug: "polaroids",
          image:
            "https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb",
        },
        {
  name: "Paintings",
  slug: "paintings",
  image:
    "https://images.pexels.com/photos/1109352/pexels-photo-1109352.jpeg",
}
,
        {
          name: "Sketches",
          slug: "sketches",
          image:
            "https://images.unsplash.com/photo-1513364776144-60967b0f800f",
        },
        {
          name: "Crafts",
          slug: "crafts",
          image:
            "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8",
        },
      ].map((cat) => (
        <Col md={6} lg={3} key={cat.slug} className="mb-4">
          <div
            className="category-card"
            onClick={() => navigate(`/category/${cat.slug}`)}
          >
            <img src={cat.image} alt={cat.name} />
            <div className="category-overlay">
              <h5>{cat.name}</h5>
            </div>
          </div>
        </Col>
      ))}
    </Row>
  </Container>
</section>

<p className="section-subtitle text-center">
  Signature creations — handcrafted and carefully curated
</p>

      {/* 🛍️ FEATURED PRODUCTS */}
      <section id="featured" className="products-section">
        <Container>
          <h2 className="section-title text-center mb-4">
            Featured Artworks
          </h2>

          <Row>
            {products.map((p) => (
              <Col md={6} lg={4} key={p._id} className="mb-4">
                <Card className="product-card h-100">
                  <Link to={`/product/${p._id}`}>
                    <Card.Img
  src={p.image?.url}
  alt={p.name}
  className="product-img"
/>

                  </Link>

                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{p.name}</Card.Title>
                    <p className="price">₹{p.price}</p>

                    <Button
                      className="mt-auto"
                      onClick={() => {
                        addToCart(p);
                        toast.success("Added to cart 🎉");
                      }}
                    >
                      Add to Cart
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

     <section className="about-section">
  <Container>
    <Row className="align-items-center about-row">

      {/* LEFT IMAGE */}
      <Col md={6} className="about-media">
        <img
          src={require("../assests/about.jpg")}
          alt="BlenDaura artwork studio"
          className="about-image"
        />
      </Col>

      {/* 📝 TEXT */}
      <Col md={6} className="about-text">
        <h2>About BlenDaura</h2>

        <p>
          Based in the vibrant city of <strong>Bengaluru</strong>, BlenDaura is a
          student-led art collective built on creativity, experimentation, and
          individuality.
        </p>

        <p>
          We bring together a curated collection of unique artworks — from
          anime-inspired illustrations and nostalgic polaroid aesthetics to
          timeless paintings and intricate sketches. Each piece tells a story
          inspired by emotions, memories, and imagination.
        </p>

        <p>
          Every artwork at BlenDaura is carefully created and selected, ensuring
          it carries not just beauty — but meaning.
        </p>

        <p className="highlight-text">
          Alongside our featured pieces, we proudly accept
          <strong> customised art commissions</strong>, collaborating closely
          with you to transform your ideas into something truly personal.
        </p>

        <p className="contact-note">
          ✨ Want something personalized artwork? Reach out via Instagram, Email,
          or WhatsApp.
        </p>

        <Button 
          variant="none" className="hero-btn btn-contact"
          onClick={() => navigate("/contact")}
        >
          Get in Touch
        </Button>
      </Col>
    </Row>
  </Container>
</section>


      {/* 🦶 FOOTER */}
      <footer className="footer">
       <Container>
  <Row>
    <Col md={6}>
      <div className="d-flex align-items-center gap-2">
        <img
          src="/logo.jpeg"
          alt="BlenDaura"
          style={{ height: "36px", opacity: 0.9 }}
        />

        <h5 className="mb-0">BlenDaura</h5>
      </div>

      <p className="mt-2">Art inspired by soul & stories.</p>
    </Col>
  


            <Col md={6} className="text-md-end">
              <p>© {new Date().getFullYear()} BlenDaura</p>
            </Col>
          </Row>
          <div className="footer-links">
       <a
    href="mailto:blendaura123@gmail.com"
    title="Email"
    className="social-icon gmail"
    aria-label="Email BlenDaura"
  >
    <MdEmail /> blendaura123@gmail.com
  </a>


      <a
        href="https://www.instagram.com/artsyyyee?igsh=MTd1cmRsM21xZmVqdQ==="
        target="_blank"
        rel="noreferrer"
        className="insta-link"
        aria-label="BlenDaura Instagram"
      >
        <FaInstagram /> BlenDaura
      </a>
    </div>
        </Container>
      </footer>
    </>
  );
}





