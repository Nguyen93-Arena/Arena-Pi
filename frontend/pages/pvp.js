import { useEffect, useState } from "react";
import { ref, get, set } from "firebase/database";
import { database } from "../firebase-config";

export default function PvP() {
  const [username, setUsername] = useState(null);
  const [opponent, setOpponent] = useState("❓");
  const [outcome, setOutcome] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || !window.Pi) {
      setError("❌ Không tìm thấy Pi SDK. Hãy mở bằng Pi Browser.");
      setLoading(false);
      return;
    }

    window.Pi.authenticate(["username"], (auth) => {
      setUsername(auth.user.username);
      setLoading(false);
    }, (err) => {
      setError("❌ Lỗi xác thực: " + err);
      setLoading(false);
    });
  }, []);

  const handleMatch = () => {
    console.log("🔍 Tìm đối thủ đã được nhấn");
    if (!username) {
      setError("❌ Không có username, không thể đấu");
      return;
    }

    const opponents = ["🔥 MechaBot", "🧊 CyberKnight", "💀 PiShadow"];
    const chosen = opponents[Math.floor(Math.random() * opponents.length)];
    setOpponent(chosen);

    const didWin = Math.random() > 0.5;
    const result = didWin ? "✅ Bạn đã thắng!" : "❌ Bạn đã thua!";
    setOutcome(result);

    if (didWin) {
      const userRef = ref(database, "players/" + username);
      get(userRef).then(snapshot => {
        const wins = snapshot.exists() ? snapshot.val().wins || 0 : 0;
        set(userRef, { username, wins: wins + 1 });
      });
    }
  };

  return (
    <main style={{
      textAlign: "center",
      marginTop: "60px",
      fontFamily: "Arial",
      color: "#00ffaa",
      background: "#000",
      minHeight: "100vh"
    }}>
      <h1>⚔️ Arena Pi - PvP</h1>

      {loading && <p>🔄 Đang xác thực...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {username && (
        <>
          <p>👤 <strong>{username}</strong> VS <strong>{opponent}</strong></p>
          <button onClick={handleMatch} style={{
            padding: "12px 24px",
            marginTop: "20px",
            fontSize: "16px",
            background: "#222",
            color: "#0f0",
            border: "2px solid #0f0",
            borderRadius: "8px",
            cursor: "pointer"
          }}>
            🔍 Tìm đối thủ
          </button>
          {outcome && <p style={{ marginTop: "20px", fontSize: "18px" }}>{outcome}</p>}
        </>
      )}
    </main>
  );
}
