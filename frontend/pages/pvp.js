import { useEffect, useState } from "react";
import { ref, get, set } from "firebase/database";
import { database } from "../firebase-config";

export default function PvP() {
  const [username, setUsername] = useState(null);
  const [opponent, setOpponent] = useState("Đối thủ");
  const [outcome, setOutcome] = useState(null);
  const [error, setError] = useState(null);

  // Lấy username từ Pi SDK
  useEffect(() => {
    if (typeof window === "undefined" || !window.Pi) {
      setError("❌ Không tìm thấy Pi SDK. Vui lòng mở bằng Pi Browser.");
      return;
    }

    window.Pi.authenticate(["username"], function (auth) {
      console.log("✅ Auth thành công:", auth);
      setUsername(auth.user.username);
    }, function (err) {
      console.error("❌ Lỗi khi xác thực:", err);
      setError("Lỗi khi xác thực: " + err);
    });
  }, []);

  // Khi nhấn tìm đối thủ
  const handleMatch = () => {
    if (!username) {
      setError("❌ Không có username. Không thể ghi dữ liệu.");
      return;
    }

    const opponents = ["CyberKnight", "PiSlayer", "ShadowBot"];
    const randomOpponent = opponents[Math.floor(Math.random() * opponents.length)];
    setOpponent(randomOpponent);

    const result = Math.random() > 0.5 ? "Bạn đã thắng!" : "Bạn đã thua!";
    setOutcome(result);

    // Ghi dữ liệu nếu thắng
    if (result.includes("thắng")) {
      const userRef = ref(database, `players/${username}`);
      get(userRef).then((snapshot) => {
        const currentWins = snapshot.exists() ? snapshot.val().wins || 0 : 0;
        set(userRef, { username: username, wins: currentWins + 1 });
        console.log(`✅ Ghi dữ liệu: ${username} thắng ${currentWins + 1} lần`);
      }).catch((err) => {
        console.error("❌ Lỗi ghi Firebase:", err);
      });
    }
  };

  return (
    <main style={{ textAlign: "center", marginTop: "60px", fontFamily: "sans-serif" }}>
      <h1>⚔️ Arena Pi - PvP</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!username && !error && <p>⏳ Đang xác thực Pi...</p>}

      {username && (
        <>
          <p>👤 <strong>{username}</strong> VS 👾 <strong>{opponent}</strong></p>
          <button onClick={handleMatch}>🔍 Tìm đối thủ</button>
          {outcome && <p><strong>{outcome}</strong></p>}
        </>
      )}
    </main>
  );
}
