import { useEffect, useState } from "react";

export default function Home() {
  const [username, setUsername] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkPiSDK = async () => {
      if (typeof window === "undefined" || !window.Pi) {
        setError("❌ Không tìm thấy Pi SDK. Hãy mở bằng Pi Browser.");
        return;
      }

      try {
        console.log("🔐 Pi SDK found. Đang xác thực...");
        window.Pi.authenticate(['username'], function(auth) {
          console.log("✅ Auth thành công:", auth);
          setUsername(auth.user.username);
        }, function(error) {
          console.error("❌ Lỗi khi xác thực:", error);
          setError("Lỗi khi xác thực: " + error);
        });
      } catch (err) {
        console.error("❌ Exception:", err);
        setError("Lỗi hệ thống: " + err.message);
      }
    };

    checkPiSDK();
  }, []);

  return (
    <main style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>🎮 Arena Pi (Testnet)</h1>

      {username && <p>👋 Xin chào, <strong>{username}</strong>!</p>}

      {!username && !error && <p>🔄 Đang xác thực với Pi...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </main>
  );
}
