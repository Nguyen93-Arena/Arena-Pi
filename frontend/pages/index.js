// frontend/pages/index.js
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [username, setUsername] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkPiSDK = async () => {
      if (typeof window === "undefined" || !window.Pi) {
        setError("❌ Không tìm thấy Pi SDK. Vui lòng mở bằng Pi Browser.");
        return;
      }

      try {
        console.log("🔐 Pi SDK found. Đang xác thực...");
        window.Pi.authenticate(['username'], function (auth) {
          console.log("✅ Auth thành công:", auth);
          setUsername(auth.user.username);
        }, function (error) {
          console.error("❌ Lỗi khi xác thực:", error);
          setError("Lỗi khi xác thực: " + error);
        });
      } catch (err) {
        console.error("❌ Exception:", err);
        setError("Lỗi hệ thống: " + err.message);
      }
    };

    checkPiSDK();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>⚔️ Arena Pi</h1>
      {username ? (
        <p style={styles.username}>👋 Chào mừng, <strong>{username}</strong>!</p>
      ) : (
        <>
          {!error && <p style={styles.loading}>🔄 Đang xác thực với Pi...</p>}
          {error && <p style={styles.error}>{error}</p>}
        </>
      )}

      <div style={styles.buttonGroup}>
        <Link href="/pvp" legacyBehavior>
          <a style={styles.buttonPrimary}>🔥 Bắt đầu PvP</a>
        </Link>
        <Link href="/leaderboard" legacyBehavior>
          <a style={styles.button}>🏆 Bảng xếp hạng</a>
        </Link>
        <Link href="/shop" legacyBehavior>
          <a style={styles.button}>🛒 Cửa hàng</a>
        </Link>
        <Link href="/profile" legacyBehavior>
          <a style={styles.button}>👤 Hồ sơ</a>
        </Link>
      </div>

      <footer style={styles.footer}>
        <p style={{ color: "#888", fontSize: "12px" }}>
          Arena Pi (Testnet) | Pi SDK v2
        </p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#0a0a0a",
    color: "#00FFAA",
    minHeight: "100vh",
    textAlign: "center",
    padding: "40px 20px",
    fontFamily: "'Orbitron', sans-serif",
  },
  title: {
    fontSize: "2.8rem",
    marginBottom: "10px",
    textShadow: "0 0 10px #00FFAA",
  },
  username: {
    fontSize: "1rem",
    marginBottom: "30px",
  },
  loading: {
    fontSize: "1rem",
    color: "#ccc",
  },
  error: {
    color: "red",
    fontSize: "1rem",
    marginTop: "10px",
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "40px",
  },
  buttonPrimary: {
    padding: "15px 25px",
    backgroundColor: "#00FFAA",
    color: "#000",
    fontSize: "1.2rem",
    border: "none",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: "bold",
    boxShadow: "0 0 10px #00FFAA",
  },
  button: {
    padding: "12px 20px",
    backgroundColor: "#1c1c1c",
    color: "#00FFAA",
    fontSize: "1rem",
    border: "1px solid #00FFAA",
    borderRadius: "8px",
    textDecoration: "none",
    transition: "0.2s",
  },
  footer: {
    marginTop: "80px",
  },
};
