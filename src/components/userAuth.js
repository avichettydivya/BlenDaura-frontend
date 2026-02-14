import { useState } from "react";
import api from "../api"; // your Axios instance

export default function UserAuth({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isSignup ? "/auth/signup" : "/auth/login";
      const payload = isSignup ? { name, email, password } : { email, password };
      const res = await api.post(endpoint, payload);

      // Save token in localStorage
      localStorage.setItem("token", res.data.token);

      // Pass user info to parent (App.js) to show dashboard
      onLogin(res.data.user);
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h3>{isSignup ? "Sign Up" : "Login"}</h3>
      <form onSubmit={handleSubmit}>
        {isSignup && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isSignup ? "Sign Up" : "Login"}</button>
      </form>

      <button onClick={() => setIsSignup(!isSignup)}>
        {isSignup ? "Already have an account? Login" : "New? Sign Up"}
      </button>
    </div>
  );
}
