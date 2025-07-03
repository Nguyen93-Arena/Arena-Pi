import { ref, get, set } from "firebase/database";
import { database } from "../firebase-config"; // đúng đường dẫn

// Giả sử bạn đã có `username` từ Pi SDK
if (outcome.includes("thắng") && username) {
  const userRef = ref(database, "players/" + username);
  get(userRef).then((snapshot) => {
    const currentWins = snapshot.exists() ? snapshot.val().wins || 0 : 0;
    set(userRef, { username, wins: currentWins + 1 });
  });
}
