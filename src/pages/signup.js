import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import api from "../api"; // ✅ FIXED
import styles from "./Auth.module.css";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/user/signup", {
        name,
        email,
        password,
      });

      // ✅ SAVE TOKEN (THIS WAS MISSING)
      localStorage.setItem("token", res.data.token);

      // optional but good practice
      localStorage.setItem("userInfo", JSON.stringify(res.data));

      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "User already exists or invalid data"
      );
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h2 className={styles.title}>Sign Up</h2>
        <p className={styles.subtitle}>
          Create an account to start shopping
        </p>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </Form.Group>

          <Button type="submit" style={{ width: "100%", background: "#0f172a" }}>
            Create Account
          </Button>
        </Form>

        <p className="mt-3 text-center">
          Already have an account?{" "}
          <Link className={styles.link} to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;



