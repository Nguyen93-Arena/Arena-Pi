
import { useEffect, useState } from "react";
import { ref, get, set } from "firebase/database";
import { database } from "../firebase-config";

export default function PvP() {
  const [username, setUsername] = useState(null);
  const [opponent, setOpponent] = useState("Chưa chọn");
  const [outcome, setOutcome] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra Pi SDK
    if (typeof window === "undefined" || !window.Pi) {
      setError("❌ Không tìm thấy Pi SDK. Vui lòng mở bằng Pi Browser.");
      setLoading(false);
      return;
    }

    // Xác thực với Pi
    window.Pi.authenticate(["username"], (auth) => {
      console.log("✅ Xác thực thành công:", auth);
      setUsername(auth.user.username);
      setLoading(false);
    }, (err) => {
      console.error("❌ Lỗi xác thực:", err);
      setError("Lỗi xác thực: " + err);
      setLoading(false);
    });
  }, []);

  const handleMatch = () => {
    if (!username) {
      setError("Không thể tìm đối thủ: thiếu username");
      return;
    }

    const opponents = ["CyberKnight", "PiSlayer", "ShadowBot"];
    const randomOpponent = opponents[Math.floor(Math.random() * opponents.length)];
    setOpponent(randomOpponent);

    const result = Math.random() > 0.5 ? "Bạn đã thắng!" : "Bạn đã thua!";
    setOutcome(result);

    if (result.includes("thắng")) {
      const userRef = ref(database, `players/${username}`);
      get(userRef).then((snapshot) => {
        const currentWins = snapshot.exists() ? snapshot.val().wins || 0 : 0;
        set(userRef, { username, wins: currentWins + 1 });
        console.log("✅ Đã ghi vào Firebase:", username, "wins:", currentWins + 1);
      }).catch((err) => {
        console.error("❌ Lỗi ghi Firebase:", err);
      });
    }
  };

  return (
    <main style={styles.container}>
      <h1 style={styles.title}>⚔️ PvP Đối Kháng</h1>

      {loading && <p>⏳ Đang xác thực người chơi...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {username && !loading && (
        <>
          <p>👤 <strong>{username}</strong> VS 👾 <strong>{opponent}</strong></p>
          <button style={styles.button} onClick={handleMatch}>🔍 Tìm đối thủ</button>
          {outcome && <p style={styles.result}>{outcome}</p>}
        </>
      )}
    </main>
  );
}

const styles = {
  container: {
    backgroundColor: "#0d0d0d",
    color: "#00ffcc",
    minHeight: "100vh",
    padding: "40px 20px",
    textAlign: "center",
    fontFamily: "'Orbitron', sans-serif",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "20px",
  },
  button: {
    backgroundColor: "#00ffcc",
    border: "none",
    padding: "10px 25px",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
    color: "#000",
    marginTop: "10px",
  },
  result: {
    marginTop: "20px",
    fontSize: "1.2rem",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    fontWeight: "bold",
  },
};
