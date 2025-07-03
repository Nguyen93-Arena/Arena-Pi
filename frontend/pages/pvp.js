import { useState, useEffect } from "react";

const characterData = {
  warrior: { name: "Chiến Binh", icon: "🛡️" },
  mage: { name: "Pháp Sư", icon: "🔥" },
  assassin: { name: "Sát Thủ", icon: "🗡️" },
};

export default function PvP() {
  const [status, setStatus] = useState("idle"); // idle, matching, matched
  const [result, setResult] = useState(null);
  const [playerChar, setPlayerChar] = useState(null);

  useEffect(() => {
    const charId = localStorage.getItem("arenaPiCharacter");
    if (charId && characterData[charId]) {
      setPlayerChar(characterData[charId]);
    } else {
      setPlayerChar({ name: "Chưa chọn", icon: "❓" });
    }
  }, []);

  const handleMatch = () => {
    setStatus("matching");
    setTimeout(() => {
      setStatus("matched");
      const outcome = Math.random() > 0.5 ? "🎉 Bạn thắng!" : "😢 Bạn thua...";
      setResult(outcome);
    }, 2000);
  };

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>⚔️ PvP Đối Kháng</h1>

      <div style={styles.avatars}>
        <div style={styles.player}>
          <div style={styles.avatar}>{playerChar?.icon}</div>
          <p>{playerChar?.name || "Bạn"}</p>
        </div>
        <div style={styles.vs}>VS</div>
        <div style={styles.player}>
          <div style={styles.avatar}>👾</div>
          <p>Đối thủ</p>
        </div>
      </div>

      {status === "idle" && (
        <button style={styles.button} onClick={handleMatch}>
          🔍 Tìm đối thủ
        </button>
      )}

      {status === "matching" && <p style={styles.status}>Đang tìm đối thủ...</p>}
      {status === "matched" && <p style={styles.result}>{result}</p>}
    </main>
  );
}

const styles = {
  page: {
    backgroundColor: "#0a0a0a",
    color: "#00FFAA",
    minHeight: "100vh",
    padding: "40px 20px",
    textAlign: "center",
    fontFamily: "'Orbitron', sans-serif",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "30px",
    textShadow: "0 0 10px #00FFAA",
  },
  avatars: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "40px",
    gap: "40px",
  },
  player: {
    textAlign: "center",
  },
  avatar: {
    fontSize: "4rem",
  },
  vs: {
    fontSize: "2rem",
    color: "#fff",
  },
  button: {
    padding: "15px 25px",
    backgroundColor: "#00FFAA",
    color: "#000",
    fontSize: "1.2rem",
    border: "none",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 0 10px #00FFAA",
  },
  status: {
    color: "#ccc",
    fontSize: "1rem",
  },
  result: {
    fontSize: "1.4rem",
    marginTop: "20px",
    color: "#00ffcc",
  },
};
