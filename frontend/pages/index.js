import { useEffect, useState } from "react";

export default function Home() {
  const [username, setUsername] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkPiSDK = async () => {
      if (typeof window === "undefined") return;

      console.log("🌐 Đang kiểm tra môi trường...");
      console.log("📱 User-Agent:", navigator.userAgent);

      if (!window.Pi) {
  setError("❌ Không tìm thấy Pi SDK. Vui lòng đảm bảo mở bằng Pi Browser.");
  return;
}

      if (!window.Pi) {
        setError("❌ Không tìm thấy Pi SDK. Hãy mở bằng Pi Browser.");
        return;
      }

      try {
        console.log("🔐 Pi SDK đã sẵn sàng. Đang xác thực...");
        window.Pi.authenticate(["username"], function (auth) {
          console.log("✅ Xác thực thành công:", auth);
          setUsername(auth.user.username);
        }, function (err) {
          console.error("❌ Lỗi khi xác thực:", err);
          setError("Lỗi khi xác thực: " + err);
        });
      } catch (err) {
        console.error("❌ Lỗi hệ thống:", err);
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
