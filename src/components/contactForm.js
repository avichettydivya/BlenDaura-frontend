import { useState } from "react";

import { toast } from "react-toastify";
import "./contactForm.css";
import contactImage from "../assests/contact.jpg"; // clean import
import api from "../api";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/contact", form);

      toast.success("Message sent successfully 🎉");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <div className="contact-section">
      <div className="container py-5">
        <h2 className="text-center mb-5 fw-bold">CONTACT US</h2>
        <div className="row align-items-center justify-content-center">

          {/* FORM BOX */}
          <div className="col-lg-6 mb-4">
            <div className="card form-card p-5 shadow-sm border-0">
              <form onSubmit={handleSubmit}>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className="form-control mb-3"
                  required
                />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="form-control mb-3"
                  required
                />
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="form-control mb-3"
                />
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Message"
                  className="form-control mb-3"
                  required
                />
                <button type="submit" className="btn btn-dark w-100 py-2">
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* IMAGE */}
          <div className="col-lg-5 text-center">
            <img
              src={contactImage}
              alt="Contact illustration"
              className="img-fluid rounded shadow"
              style={{ height: 450, width: "auto", objectFit: "cover" }}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
