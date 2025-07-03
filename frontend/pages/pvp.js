import { useEffect, useState } from "react";
import { ref, get, set } from "firebase/database";
import { database } from "../firebase-config";

export default function PvP() {
  const [username, setUsername] = useState(null);
  const [opponent, setOpponent] = useState("...");
  const [outcome, setOutcome] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || !window.Pi) {
      setError("❌ Không tìm thấy Pi SDK. Vui lòng mở bằng Pi Browser.");
      setLoading(false);
      return;
    }

    window.Pi.authenticate(["username"], function (auth) {
      setUsername(auth.user.username);
      setLoading(false);
    }, function (err) {
      setError("❌ Lỗi xác thực: " + err);
      setLoading(false);
    });
  }, []);

  const handleMatch = () => {
    if (!username) {
      setError("❌ Không có username, không thể đấu");
      return;
    }

    const opponents = ["CyberKnight", "MechaBot", "PiShadow"];
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
    <main style={{ textAlign: "center", marginTop: "60px", fontFamily: "Arial", color: "#00ffaa" }}>
      <h1>⚔️ Arena Pi - PvP</h1>

      {loading && <p>🔄 Đang xác thực...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {username && (
        <>
          <p>👤 <strong>{username}</strong> VS 👾 <strong>{opponent}</strong></p>
          <button onClick={handleMatch} style={{ padding: "10px 20px", marginTop: "20px" }}>🔍 Tìm đối thủ</button>
          {outcome && <p style={{ marginTop: "20px" }}>{outcome}</p>}
        </>
      )}
    </main>
  );
}
