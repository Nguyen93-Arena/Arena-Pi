import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIza...YOUR_API_KEY",
  authDomain: "arena-pi.firebaseapp.com",
  databaseURL: "https://arena-pi-default-rtdb.firebaseio.com",
  projectId: "arena-pi",
  storageBucket: "arena-pi.appspot.com",
  messagingSenderId: "YOUR_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
