import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { database } from "../firebase-config";

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      const dbRef = ref(database, "players");
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const playerArray = Object.values(data).sort((a, b) => b.wins - a.wins);
        setPlayers(playerArray);
      }
    };

    fetchPlayers();
  }, []);

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>🏆 Bảng Xếp Hạng</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Hạng</th>
            <th>Người chơi</th>
            <th>Thắng</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr key={index}>
              <td>#{index + 1}</td>
              <td>{player.username}</td>
              <td>{player.wins}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
  table: {
    width: "100%",
    maxWidth: "500px",
    margin: "0 auto",
    borderCollapse: "collapse",
  },
};
