// ✅ Conexión a Firebase Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where } 
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Configuración del proyecto (igual que tu index.html)
const firebaseConfig = {
  apiKey: "AIzaSyBya-ZCpikAFuu2_8Oziz3vdS9taDcrFAk",
  authDomain: "taller-ies.firebaseapp.com",
  projectId: "taller-ies",
  storageBucket: "taller-ies.firebasestorage.app",
  messagingSenderId: "461220947601",
  appId: "1:461220947601:web:78acfebca486f4bfff0130",
  measurementId: "G-DEC9QECYH0"
};

// Inicializa la app y la base de datos
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🟢 Exporta la conexión para usarla en otros archivos
export { db, collection, addDoc, getDocs, query, where };
