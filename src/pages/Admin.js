import { useState, useEffect } from "react";
import axios from "axios";


import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Image,
} from "react-bootstrap";
import { useDropzone } from "react-dropzone";

const API = "http://localhost:5000";

export default function Admin() {
  /* ================= AUTH ================= */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  /* ================= PRODUCTS ================= */
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  /* ================= ORDERS ================= */
  const [orders, setOrders] = useState([]);
  const [searchUser, setSearchUser] = useState("");

  /* ================= AUTH HEADER ================= */
  const authHeader = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  /* ================= INIT ================= */
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setLoggedIn(true);
      fetchProducts();
      fetchOrders();
    }
  }, []);

  /* ================= LOGIN ================= */
  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API}/api/user/login`, {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      setLoggedIn(true);
      fetchProducts();
      fetchOrders();
    } catch {
      alert("Login failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
  };

  /* ================= FETCH ================= */
  const fetchProducts = async () => {
    const res = await axios.get(`${API}/api/products`);
    setProducts(res.data);
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API}/api/orders/all`, authHeader());
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= IMAGE DROPZONE ================= */
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (files) => {
      setImageFile(files[0]);
      setPreview(URL.createObjectURL(files[0]));
    },
  });

  /* ================= ADD PRODUCT ================= */
  const handleAddProduct = async () => {
    if (!name || !price || !description || !category || !imageFile) {
      return alert("Please fill all fields");
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("image", imageFile); // 🔥 MUST MATCH BACKEND

    await axios.post(`${API}/api/products`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    });

    setName("");
    setPrice("");
    setDescription("");
    setCategory("");
    setImageFile(null);
    setPreview(null);

    fetchProducts();
  };

  /* ================= DELETE PRODUCT ================= */
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await axios.delete(`${API}/api/products/${id}`, authHeader());
    fetchProducts();
  };

  /* ================= SAVE EDIT ================= */
  const saveEdit = async () => {
    await axios.put(
      `${API}/api/products/${editProduct._id}`,
      editProduct,
      authHeader()
    );
    setEditProduct(null);
    fetchProducts();
  };

  /* ================= ORDER STATUS ================= */
  const changeStatus = async (id, status) => {
    await axios.put(
      `${API}/api/orders/${id}/status`,
      { status },
      authHeader()
    );
    fetchOrders();
  };

  const totalRevenue = orders
    .filter((o) => o.status === "delivered")
    .reduce((sum, o) => sum + o.total, 0);

  /* ================= LOGIN PAGE ================= */
  if (!loggedIn) {
    return (
      <Container className="my-5">
        <h3>Admin Login</h3>
        <Form>
          <Form.Control
            className="mb-2"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Form.Control
            className="mb-2"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button onClick={handleLogin}>Login</Button>
        </Form>
      </Container>
    );
  }

  /* ================= DASHBOARD ================= */
  return (
    <Container className="my-4">
      <Button variant="danger" onClick={handleLogout}>
        Logout
      </Button>

      <h2 className="my-3">Admin Dashboard</h2>
      <h5>Total Revenue: ₹{totalRevenue}</h5>

      <Row className="my-4">
        {/* ADD PRODUCT */}
        <Col md={4}>
          <h4>Add Product</h4>
          <Form>
            <Form.Control
              className="mb-2"
              placeholder="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Form.Control
              className="mb-2"
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <Form.Control
              className="mb-2"
              as="textarea"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {/* CATEGORY */}
            <Form.Select
              className="mb-2"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              <option value="Anime">Anime</option>
              <option value="Polaroids">Polaroids</option>
              <option value="Paintings">Paintings</option>
              <option value="Sketches">Sketches</option>
              <option value="Crafts">Crafts</option>
            </Form.Select>

            {/* IMAGE */}
            <div {...getRootProps()} className="border p-2 text-center mb-2">
              <input {...getInputProps()} />
              {preview ? (
                <Image src={preview} thumbnail width={150} />
              ) : (
                "Click or drop image"
              )}
            </div>

            <Button onClick={handleAddProduct}>Add Product</Button>
          </Form>
        </Col>

        {/* PRODUCT LIST */}
        <Col md={8}>
          <Row>
            {products.map((p) => (
              <Col md={4} key={p._id}>
                <Card className="mb-3">
                  <Card.Img
                    src={p.image}
                    style={{ height: 180, objectFit: "cover" }}
                  />
                  <Card.Body>
                    {editProduct?._id === p._id ? (
                      <>
                        <Form.Control
                          className="mb-1"
                          value={editProduct.name}
                          onChange={(e) =>
                            setEditProduct({
                              ...editProduct,
                              name: e.target.value,
                            })
                          }
                        />
                        <Form.Control
                          className="mb-1"
                          type="number"
                          value={editProduct.price}
                          onChange={(e) =>
                            setEditProduct({
                              ...editProduct,
                              price: e.target.value,
                            })
                          }
                        />
                        <Form.Select
                          className="mb-1"
                          value={editProduct.category}
                          onChange={(e) =>
                            setEditProduct({
                              ...editProduct,
                              category: e.target.value,
                            })
                          }
                        >
                          <option value="Anime">Anime</option>
                          <option value="Polaroids">Polaroids</option>
                          <option value="Paintings">Paintings</option>
                          <option value="Sketches">Sketches</option>
                          <option value="Crafts">Crafts</option>
                        </Form.Select>
                        <Button size="sm" onClick={saveEdit}>
                          Save
                        </Button>
                      </>
                    ) : (
                      <>
                        <Card.Title>{p.name}</Card.Title>
                        <Card.Text>₹{p.price}</Card.Text>
                        <Card.Text>
                          <strong>{p.category}</strong>
                        </Card.Text>
                        <Button
                          size="sm"
                          onClick={() => setEditProduct(p)}
                        >
                          Edit
                        </Button>{" "}
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => deleteProduct(p._id)}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
