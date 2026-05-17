import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyA0mA2YjiIfHU7soCjzSkcddAgVaFE1UMY",
  authDomain: "trustbridge-a8ab2.firebaseapp.com",
  databaseURL: "https://trustbridge-a8ab2-default-rtdb.firebaseio.com",
  projectId: "trustbridge-a8ab2",
  storageBucket: "trustbridge-a8ab2.appspot.com",
  messagingSenderId: "933754600933",
  appId: "1:933754600933:web:b4d5cdfd0b6adc9b11030c"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);