import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import api from "../api";

export default function OrderSuccess() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const orderId = params.get("id");
  const amountParam = params.get("amount");
  const totalAmount = amountParam ? Number(amountParam) : 0;

  const [utr, setUtr] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const upiId = "9864686966@superyes";
  const merchantName = "BlenDaura";

  const upiLink = `upi://pay?pa=${upiId}&pn=${merchantName}&am=${totalAmount}&cu=INR`;

  // 🔥 CHECK PAYMENT STATUS ON LOAD (NO BACKEND CHANGE NEEDED)
  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!orderId) return;

      try {
        const res = await api.get(`/orders`);
        const order = res.data.find((o) => o._id === orderId);

        if (order && order.paymentStatus === "verification_pending") {
          setSubmitted(true);
        }
      } catch (err) {
        console.error("Error checking order:", err);
      }
    };

    checkPaymentStatus();
  }, [orderId]);

  const submitUTR = async () => {
    if (!utr.trim()) {
      alert("Please enter UTR / Transaction ID");
      return;
    }

    if (!orderId) {
      alert("Order ID missing");
      return;
    }

    try {
      setLoading(true);
      await api.put(`/orders/${orderId}/utr`, { utr });
      setSubmitted(true);
    } catch (err) {
      console.error("UTR ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to submit payment details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container text-center mt-5">

      {/* 🔥 DYNAMIC HEADING */}
      <h2 className={submitted ? "text-success" : "text-warning"}>
        {submitted
          ? "✅ Payment Submitted Successfully"
          : "🟡 Complete Payment to Confirm Order"}
      </h2>

      <p className="mt-2">
        {submitted
          ? "Your payment is under verification."
          : "Your order is created but NOT confirmed yet. Complete UPI payment and submit UTR."}
      </p>

      <div
        style={{
          maxWidth: "420px",
          margin: "30px auto",
          padding: "20px",
          border: "1px solid #e5e5e5",
          borderRadius: "12px",
          background: "#fafafa",
        }}
      >
        {totalAmount > 0 ? (
          <>
            {!submitted ? (
              <>
                <h5 className="mb-3">UPI Payment</h5>

                <p>
                  <strong>UPI ID:</strong> {upiId}
                  <br />
                  <strong>Amount:</strong> ₹{totalAmount}
                </p>

                <QRCodeCanvas value={upiLink} size={180} />

                <p style={{ fontSize: "13px", marginTop: "8px", color: "#555" }}>
                  Scan using any UPI app (GPay / PhonePe / Paytm)
                </p>

                <a href={upiLink} className="btn btn-dark w-100 mt-2">
                  Pay via UPI App
                </a>

                <hr />

                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Enter UTR / Transaction ID"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                />

                <button
                  className="btn btn-success w-100"
                  onClick={submitUTR}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Payment Details"}
                </button>
              </>
            ) : (
              <div className="alert alert-success mt-3">
                ✅ Payment details submitted successfully.
                <br />
                Your payment is under verification.
                <br />
                You will be notified once confirmed.
              </div>
            )}
          </>
        ) : (
          <p style={{ color: "red" }}>
            Payment amount not found. Please contact support.
          </p>
        )}

        <p style={{ fontSize: "12px", color: "#777", marginTop: "12px" }}>
          ⚠️ Payments are manually verified. You will receive confirmation via
          WhatsApp or email within 24 hours.
        </p>
      </div>
    </div>
  );
}

