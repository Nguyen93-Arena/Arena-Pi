import { useEffect, useState } from "react";

export default function Home() {
  const [username, setUsername] = useState(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Chạy khi Pi SDK đã có sẵn trong Pi Browser
    if (typeof window !== "undefined" && window.Pi) {
      window.Pi.init({ version: "2.0", sandbox: true });

      const authenticate = async () => {
        try {
          const scopes = ["payments"];
          const user = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
          setUsername(user.username);
          setSdkReady(true);
        } catch (err) {
          console.error("Lỗi xác thực:", err);
        } finally {
          setLoading(false);
        }
      };

      authenticate();
    } else {
      console.warn("Không tìm thấy Pi SDK. Hãy mở trong Pi Browser.");
      setLoading(false);
    }

    function onIncompletePaymentFound(payment) {
      console.log("⚠️ Thanh toán chưa hoàn tất:", payment);
    }
  }, []);

  const handlePayment = async () => {
    try {
      const payment = await window.Pi.createPayment(
        {
          amount: 1,
          memo: "Thanh toán test bằng Pi",
          metadata: { type: "test" },
        },
        {
          onReadyForServerApproval: (paymentId) => {
            console.log("✅ Sẵn sàng phê duyệt:", paymentId);
          },
          onReadyForServerCompletion: (paymentId) => {
            console.log("✅ Sẵn sàng hoàn tất:", paymentId);
            window.Pi.completePayment(paymentId);
            alert("✅ Giao dịch test thành công!");
          },
          onCancel: () => {
            alert("❌ Bạn đã huỷ giao dịch.");
          },
          onError: (err) => {
            console.error("Lỗi:", err);
            alert("❌ Lỗi thanh toán: " + err.message);
          },
        }
      );
    } catch (err) {
      console.error("Lỗi tạo giao dịch:", err);
      alert("⚠️ Không thể tạo giao dịch.");
    }
  };

  return (
    <div style={{ padding: 30, textAlign: "center", fontFamily: "sans-serif" }}>
      <h1>🏟️ Arena Pi (Testnet)</h1>
      {loading ? (
        <p>🔄 Đang khởi tạo Pi SDK...</p>
      ) : sdkReady ? (
        <>
          <p>✅ Đăng nhập thành công: <strong>{username}</strong></p>
          <button onClick={handlePayment} style={{ padding: 12, fontSize: 16 }}>
            💰 Thanh toán Pi Test
          </button>
        </>
      ) : (
        <p>❌ Không tìm thấy Pi SDK. Hãy mở app bằng Pi Browser.</p>
      )}
    </div>
  );
}
