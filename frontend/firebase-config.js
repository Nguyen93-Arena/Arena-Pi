import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDmNeibI5BzQNjwJz20l2UbcHFrvqlx9pQ",
  authDomain: "arena-pi.firebaseapp.com",
  databaseURL: "https://arena-pi-default-rtdb.firebaseio.com",
  projectId: "arena-pi",
  storageBucket: "arena-pi.firebasestorage.app",
  messagingSenderId: "93311684976",
  appId: "1:93311684976:web:a892e68a0e44ba5660ffb5",
  measurementId: "G-V0DJ1P575L"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
