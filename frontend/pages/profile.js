export default function Profile() {
  return (
    <main style={styles.page}>
      <h1 style={styles.title}>👤 Hồ sơ người chơi</h1>
      <p>Thông tin người chơi sẽ hiển thị ở đây.</p>
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
