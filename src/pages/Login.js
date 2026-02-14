import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import styles from "./Auth.module.css";

function Login({ setUser }) {   // ✅ CHANGE 1
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/user/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setUser(res.data.user);   // ✅ CHANGE 2 (CRITICAL)

      navigate("/");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h2 className={styles.title}>Login</h2>
        <p className={styles.subtitle}>
          Enter your credentials to access your account
        </p>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
            />
          </Form.Group>

          <Button type="submit" style={{ width: "100%", background: "#0f172a" }}>
            Login
          </Button>
        </Form>

        <p className="mt-3 text-center">
          Don’t have an account?{" "}
          <Link className={styles.link} to="/signup">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;



