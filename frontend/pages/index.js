import { useEffect, useState } from "react";

export default function Home() {
  const [status, setStatus] = useState("🔄 Đang kiểm tra Pi SDK...");
  const [pi, setPi] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        typeof window !== "undefined" &&
        window.Pi &&
        window.Pi.createPayment &&
        window.Pi.init
      ) {
        try {
          window.Pi.init({ version: "2.0", sandbox: true });  // Testnet
          setPi(window.Pi);
          setStatus("✅ Pi SDK đã sẵn sàng.");
        } catch (err) {
          setStatus("❌ Không khởi tạo được Pi SDK.");
          console.error(err);
        } finally {
          clearInterval(interval);
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handlePayment = async () => {
    if (!pi) {
      alert("❌ Pi SDK chưa sẵn sàng. Hãy mở trong Pi Browser Testnet.");
      return;
    }

    try {
      const payment = await pi.createPayment({
        amount: 1,
        memo: "Arena Pi Testnet Payment",
        metadata: { arena: true },
        onReadyForServerApproval: async (paymentId) => {
          console.log("🔁 Approving:", paymentId);
          // Gọi API backend sau khi gọi approve
          try {
            const res = await fetch(
              "https://YOUR_RENDER_BACKEND_URL/api/payment/approve",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentId }),
              }
            );
            const data = await res.json();
            console.log("✅ Approve response:", data);
          } catch (err) {
            console.error("❌ Approve failed:", err);
          }
        },
        onReadyForServerCompletion: async (paymentId, txid) => {
          console.log("🔁 Completing:", paymentId, txid);
          try {
            const res = await fetch(
              "https://YOUR_RENDER_BACKEND_URL/api/payment/complete",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentId, txid }),
              }
            );
            const data = await res.json();
            console.log("✅ Complete response:", data);
          } catch (err) {
            console.error("❌ Completion failed:", err);
          }
        },
        onCancel: (paymentId) => console.warn("❌ Cancelled:", paymentId),
        onError: (error, pmt) => console.error("❌ Error:", error, pmt),
      });

      console.log("💰 Payment created:", payment);
    } catch (err) {
      console.error("❌ Tạo payment lỗi:", err);
    }
  };

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>🏟 Arena Pi Payment Test (Testnet)</h1>
      <p>{status}</p>
      <button onClick={handlePayment} disabled={!pi}>
        💰 Thanh toán Test Pi
      </button>
    </main>
  );
}
