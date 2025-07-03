import { useState, useEffect } from "react";
import { ref, get, set } from "firebase/database";
import { database } from "../firebase-config";

export default function PvP() {
  const [username, setUsername] = useState(null);
  const [opponent, setOpponent] = useState("Đối thủ");
  const [outcome, setOutcome] = useState(null);
  const [error, setError] = useState(null);

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

  const handleMatch = () => {
    // Giả lập đối thủ
    const opponentList = ["DarkBot", "CyberKnight", "MechaBeast", "PiSlayer"];
    const randomOpponent = opponentList[Math.floor(Math.random() * opponentList.length)];
    setOpponent(randomOpponent);

    // Tính kết quả ngẫu nhiên
    const result = Math.random() > 0.5 ? "Bạn đã thắng!" : "Bạn đã thua!";
    setOutcome(result);

    // Nếu thắng thì ghi dữ liệu vào Firebase
    if (result.includes("thắng") && username) {
      const userRef = ref(database, "players/" + username);
      get(userRef).then((snapshot) => {
        const currentWins = snapshot.exists() ? snapshot.val().wins || 0 : 0;
        set(userRef, { username, wins: currentWins + 1 });
      });
    }
  };

  return (
    <main style={styles.container}>
      <h1 style={styles.title}>⚔️ PvP Đối Kháng</h1>

      {error && <p style={styles.error}>{error}</p>}

      {!username && !error && <p>🔐 Đang xác thực với Pi...</p>}

      {username && (
        <>
          <p style={styles.vs}>
            👤 <strong>{username}</strong> VS 👾 <strong>{opponent}</strong>
          </p>
          <button style={styles.button} onClick={handleMatch}>
            🔍 Tìm đối thủ
          </button>
          {outcome && <p style={styles.outcome}>{outcome}</p>}
        </>
      )}
    </main>
  );
}

const styles = {
  container: {
    backgroundColor: "#121212",
    color: "#00FFAA",
    minHeight: "100vh",
    padding: "40px 20px",
    fontFamily: "'Orbitron', sans-serif",
    textAlign: "center",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "30px",
    textShadow: "0 0 10px #00FFAA",
  },
  vs: {
    fontSize: "1.2rem",
    marginBottom: "20px",
  },
  button: {
    backgroundColor: "#00FFAA",
    color: "#000",
    padding: "12px 30px",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
  },
  outcome: {
    marginTop: "20px",
    fontSize: "1.3rem",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    fontSize: "1rem",
  },
};
