import { useEffect, useState } from 'react';

export default function Home() {
  const [pi, setPi] = useState(null);
  const [status, setStatus] = useState("🔄 Đang kiểm tra Pi SDK...");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const interval = setInterval(() => {
        if (window.Pi && window.Pi.init && window.Pi.createPayment) {
          try {
            window.Pi.init({ version: "2.0", sandbox: true }); // 👉 chạy Testnet
            setPi(window.Pi);
            setStatus("✅ Pi SDK đã sẵn sàng.");
            clearInterval(interval);
          } catch (err) {
            console.error("Lỗi init Pi SDK:", err);
            setStatus("❌ Lỗi khởi tạo SDK.");
            clearInterval(interval);
          }
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, []);

  const handlePayment = async () => {
    if (!pi) {
      setError("❌ Pi SDK chưa sẵn sàng.");
      return;
    }

    try {
      const payment = await pi.createPayment({
        amount: 0.001,
        memo: "Arena Pi Testnet Payment",
        metadata: { arena: "testnet" },
        onReadyForServerApproval: async (paymentId) => {
          try {
            const res = await fetch("https://piarena-backend.onrender.com/api/payment/approve", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId }),
            });
            const data = await res.json();
            console.log("✅ Phê duyệt server:", data);
          } catch (err) {
            console.error("❌ Lỗi phê duyệt:", err);
          }
        },
        onReadyForServerCompletion: async (paymentId, txid) => {
          try {
            const res = await fetch("https://piarena-backend.onrender.com/api/payment/complete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId, txid }),
            });
            const data = await res.json();
            console.log("✅ Hoàn tất server:", data);
          } catch (err) {
            console.error("❌ Lỗi hoàn tất:", err);
          }
        },
        onCancel: (paymentId) => {
          console.warn("❌ Người dùng huỷ:", paymentId);
        },
        onError: (error, paymentId) => {
          console.error("❌ Lỗi giao dịch:", error, paymentId);
          setError("❌ Không thể tạo thanh toán.");
        },
      });

      console.log("📦 Đã tạo thanh toán:", payment);
    } catch (err) {
      console.error("❌ Lỗi ngoài:", err);
      setError("❌ Không thể tạo thanh toán.");
    }
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>🏟 Arena Pi Payment Test (Testnet)</h1>
      <p>{status}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button
        onClick={handlePayment}
        style={{
          padding: '10px 20px',
          backgroundColor: '#0080ff',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        💰 Thanh toán Test Pi
      </button>
    </main>
  );
}
