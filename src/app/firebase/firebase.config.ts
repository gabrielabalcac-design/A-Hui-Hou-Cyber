import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database'; // 👈 Importante

const firebaseConfig = {
  apiKey: "AIzaSyAW2TaSi4mGYx2SBJMXstdf4YTmxYZHh30",
  authDomain: "a-hui-hou-cyber.firebaseapp.com",
  databaseURL: "https://a-hui-hou-cyber-default-rtdb.firebaseio.com",
  projectId: "a-hui-hou-cyber",
  storageBucket: "a-hui-hou-cyber.firebasestorage.app",
  messagingSenderId: "833510311583",
  appId: "1:833510311583:web:abf129cdba5af8226bc4aa",
  measurementId: "G-3JP2H305WY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app); // 👈 Exportamos la base de datos