import { useEffect, useState } from "react";

export default function Home() {
  const [status, setStatus] = useState("🔄 Đang kiểm tra Pi SDK...");
  const [pi, setPi] = useState(null);

  useEffect(() => {
    const checkPi = setInterval(() => {
      if (window.Pi && window.Pi.createPayment && window.Pi.init) {
        try {
          window.Pi.init({ version: "2.0", sandbox: true }); // 👉 Testnet
          setPi(window.Pi);
          setStatus("✅ Pi SDK đã sẵn sàng.");
        } catch (err) {
          setStatus("❌ Pi SDK chưa sẵn sàng.");
          console.error(err);
        }
        clearInterval(checkPi);
      }
    }, 500);
    return () => clearInterval(checkPi);
  }, []);

  const createPayment = async () => {
    if (!pi) {
      alert("❌ Pi SDK chưa sẵn sàng!");
      return;
    }

    try {
      const payment = await pi.createPayment({
        amount: 1,
        memo: "Arena Test Payment",
        metadata: { arena: true },
        onReadyForServerApproval: async (paymentId) => {
          try {
            const res = await fetch("https://arena-pi-backend.onrender.com/api/payment/approve", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId }),
            });
            const data = await res.json();
            console.log("✅ Approve response:", data);
          } catch (err) {
            console.error("❌ Approve failed:", err);
          }
        },
        onReadyForServerCompletion: async (paymentId, txid) => {
          try {
            const res = await fetch("https://arena-pi-backend.onrender.com/api/payment/complete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId, txid }),
            });
            const data = await res.json();
            console.log("✅ Complete response:", data);
          } catch (err) {
            console.error("❌ Completion failed:", err);
          }
        },
        onCancel: (paymentId) => {
          console.log("❌ Payment cancelled:", paymentId);
        },
        onError: (error, payment) => {
          console.error("❌ Payment error:", error, payment);
        },
      });

      console.log("💰 Payment created:", payment);
    } catch (error) {
      console.error("❌ Error creating payment:", error);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>🏟 Arena Pi Payment Test (Testnet)</h1>
      <p>{status}</p>
      <button onClick={createPayment} disabled={!pi}>
        💰 Thanh toán Test Pi
      </button>
    </div>
  );
}
