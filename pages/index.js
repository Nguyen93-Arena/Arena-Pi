// 📄 pages/index.js - Giao diện chính của Arena-Pi import { useEffect, useState } from "react";

export default function Home() { const [pi, setPi] = useState(null); const [status, setStatus] = useState("🔄 Đang khởi tạo Pi SDK..."); const [error, setError] = useState(null);

useEffect(() => { if (typeof window !== "undefined") { const checkPi = setInterval(() => { if (window.Pi && window.Pi.init && window.Pi.createPayment) { try { window.Pi.init({ version: "2.0", sandbox: true }); setPi(window.Pi); setStatus("✅ Pi SDK đã sẵn sàng (Testnet)."); clearInterval(checkPi); } catch (err) { console.error("❌ Lỗi SDK:", err); setStatus("❌ Lỗi khởi tạo Pi SDK"); clearInterval(checkPi); } } }, 500);

return () => clearInterval(checkPi);
}

}, []);

const handlePayment = async () => { if (!pi) return setError("❌ SDK chưa sẵn sàng");

try {
  const payment = await pi.createPayment({
    amount: 1,
    memo: "PvP Arena Testnet",
    metadata: { action: "pvp_battle" },
    onReadyForServerApproval: async (paymentId) => {
      console.log("✅ Đợi duyệt:", paymentId);
      await fetch("https://arena-pi-backend.onrender.com/api/payment/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId })
      });
    },
    onReadyForServerCompletion: async (paymentId, txid) => {
      console.log("✅ Đợi hoàn tất:", paymentId, txid);
      await fetch("https://arena-pi-backend.onrender.com/api/payment/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId, txid })
      });
    },
    onCancel: (paymentId) => {
      console.warn("❌ Hủy:", paymentId);
    },
    onError: (error, paymentId) => {
      console.error("❌ Lỗi:", error, paymentId);
      setError("❌ Không thể tạo thanh toán.");
    }
  });

  console.log("🎉 Thanh toán khởi tạo:", payment);
} catch (err) {
  console.error("❌ Ngoại lệ:", err);
  setError("❌ Giao dịch thất bại");
}

};

return ( <main style={{ padding: "2rem", fontFamily: "Arial" }}> <h1>🏟 Arena Pi Payment Test (Testnet)</h1> <p>{status}</p> {error && <p style={{ color: "red" }}>{error}</p>} <button onClick={handlePayment} style={{ padding: "10px 20px", backgroundColor: "#0080ff", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }} > 💰 Thanh toán Test Pi </button> </main> ); }

