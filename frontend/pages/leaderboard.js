export default function Leaderboard() {
  return (
    <main style={styles.page}>
      <h1 style={styles.title}>🏆 Bảng xếp hạng</h1>
      <p>Top người chơi sẽ hiển thị ở đây (sẽ kết nối API sau).</p>
    </main>
  );
}

const styles = {
  page: {
    padding: "40px 20px",
    backgroundColor: "#0a0a0a",
    color: "#00FFAA",
    minHeight: "100vh",
    textAlign: "center",
    fontFamily: "'Orbitron', sans-serif",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "20px",
    textShadow: "0 0 10px #00FFAA",
  },
};
