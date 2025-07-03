import { ref, get, set, update } from "firebase/database";
import { database } from "../firebase-config"; // nhớ đường dẫn đúng

// Trong hàm handleMatch, nếu thắng:
if (outcome.includes("thắng")) {
  const userRef = ref(database, "players/" + username);
  get(userRef).then((snapshot) => {
    const currentWins = snapshot.exists() ? snapshot.val().wins || 0 : 0;
    set(userRef, { username, wins: currentWins + 1 });
  });
}
