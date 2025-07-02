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
          window.Pi.init({ version: "2.0", sandbox: false }); // ✅ MAINNET
          setPi(window.Pi);
          setStatus("✅ Pi SDK đã sẵn sàng.");
        } catch (err) {
          setStatus("❌ Không khởi tạo được Pi SDK.");
          alert("❌ Lỗi khi init Pi SDK: " + err.message);
        } finally {
          clearInterval(interval);
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handlePayment = async () => {
    if (!pi) {
      alert("❌ Pi SDK chưa sẵn sàng. Hãy mở app bằng Pi Browser (Mainnet).");
      return;
    }

    try {
      const payment = await pi.createPayment({
        amount: 1,
        memo: "Arena Pi Mainnet Payment",
        metadata: { arena: true },
        onReadyForServerApproval: async (paymentId) => {
          alert("🔁 Đang gọi approve: " + paymentId);
          try {
            const res = await fetch(
              "https://arena-pi.onrender.com/api/payment/approve",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentId }),
              }
            );
            const data = await res.json();
            alert("✅ Server approve thành công.");
          } catch (err) {
            alert("❌ Approve thất bại: " + err.message);
          }
        },
        onReadyForServerCompletion: async (paymentId, txid) => {
          alert("🔁 Đang gọi complete: " + paymentId + ", TXID: " + txid);
          try {
            const res = await fetch(
              "https://arena-pi.onrender.com/api/payment/complete",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentId, txid }),
              }
            );
            const data = await res.json();
            alert("✅ Server complete thành công.");
          } catch (err) {
            alert("❌ Completion thất bại: " + err.message);
          }
        },
        onCancel: (paymentId) => {
          alert("❌ Giao dịch bị huỷ: " + paymentId);
        },
        onError: (error, payment) => {
          alert("❌ Lỗi thanh toán: " + error.message);
        },
      });

      alert("💰 Payment created: " + payment.identifier);
    } catch (err) {
      alert("❌ Không thể tạo payment: " + err.message);
    }
  };

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>🏟 Arena Pi Payment Test (Mainnet)</h1>
      <p>{status}</p>
      <button onClick={handlePayment} disabled={!pi}>
        💰 Thanh toán Pi Thật
      </button>
    </main>
  );
}
