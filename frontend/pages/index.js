import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!window.Pi) {
        alert("❌ Không tìm thấy Pi SDK. Hãy mở app bằng Pi Browser.");
      } else {
        console.log("✅ Pi SDK found. Tiến hành đăng nhập...");

        window.Pi.authenticate(
          ["username", "payments"],
          function (auth) {
            console.log("✅ Đăng nhập thành công:", auth);
          },
          function (error) {
            console.error("❌ Lỗi đăng nhập:", error);
          }
        );
      }
    }
  }, []);

  return (
    <main style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>🎮 Arena Pi (Testnet)</h1>
      <p>Đang kiểm tra SDK & đăng nhập...</p>
    </main>
  );
}
