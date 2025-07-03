import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIza...pppjonifp6ycdjeck3gk10bsvjoyu0kkycb4fpbusyhotkaueqrah7ygj6m0hwoq",
  authDomain: "arena-pi.firebaseapp.com",
  databaseURL: "https://arena-pi-default-rtdb.firebaseio.com",
  projectId: "arena-pi",
  storageBucket: "arena-pi.appspot.com",
  messagingSenderId: "YOUR_ID",
  appId: "1:93311684976:web:a892e68a0e44ba5660ffb5"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
