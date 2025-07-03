import { useState } from "react";
import { useRouter } from "next/router";

export default function SelectCharacter() {
  const router = useRouter();
  const [selected, setSelected] = useState(null);

  const characters = [
    {
      id: "warrior",
      name: "Chiến Binh",
      icon: "🛡️",
      desc: "Sức mạnh cao, phòng thủ tốt",
    },
    {
      id: "mage",
      name: "Pháp Sư",
      icon: "🔥",
      desc: "Tấn công phép, khống chế",
    },
    {
      id: "assassin",
      name: "Sát Thủ",
      icon: "🗡️",
      desc: "Tốc độ cao, sát thương mạnh",
    },
  ];

  const handleSelect = (char) => {
    setSelected(char.id);
    localStorage.setItem("arenaPiCharacter", char.id);
    alert(`Đã chọn: ${char.name}`);
    router.push("/pvp"); // Chuyển sang PvP
  };

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>🧙‍♂️ Chọn Nhân Vật</h1>
      <div style={styles.list}>
        {characters.map((char) => (
          <div key={char.id} style={styles.card} onClick={() => handleSelect(char)}>
            <div style={styles.icon}>{char.icon}</div>
            <h2>{char.name}</h2>
            <p>{char.desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

const styles = {
  page: {
    backgroundColor: "#0a0a0a",
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
  list: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "20px",
  },
  card: {
    backgroundColor: "#111",
    borderRadius: "12px",
    padding: "20px",
    width: "200px",
    cursor: "pointer",
    boxShadow: "0 0 10px #00FFAA",
    transition: "transform 0.2s",
  },
  icon: {
    fontSize: "3rem",
    marginBottom: "10px",
  },
};
