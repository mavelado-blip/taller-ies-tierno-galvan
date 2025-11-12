// js/firestore-user.js
import { db } from "./db.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const auth = getAuth();

// ✅ Guardar cliente del usuario logueado
export async function guardarClienteFirestore(cliente) {
  const user = auth.currentUser;
  if (!user) {
    alert("⚠️ Debes iniciar sesión para guardar datos.");
    return;
  }

  try {
    await addDoc(collection(db, "usuarios", user.uid, "clientes"), cliente);
    console.log("✅ Cliente guardado en Firestore para:", user.email);
  } catch (e) {
    console.error("❌ Error guardando cliente:", e);
  }
}

// ✅ Cargar clientes del usuario
export async function cargarClientesFirestore() {
  const user = auth.currentUser;
  if (!user) return [];

  const clientes = [];
  const q = collection(db, "usuarios", user.uid, "clientes");
  const snapshot = await getDocs(q);
  snapshot.forEach(doc => {
    clientes.push({ id: doc.id, ...doc.data() });
  });

  return clientes;
}

// js/firestore-user.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// 🔧 Configuración Firebase (la misma que en auth-visual.js)
const firebaseConfig = {
  apiKey: "AIzaSyBya-ZCpikAFuu2_8Oziz3vdS9taDcrFAk",
  authDomain: "taller-ies.firebaseapp.com",
  projectId: "taller-ies",
  storageBucket: "taller-ies.firebasestorage.app",
  messagingSenderId: "461220947601",
  appId: "1:461220947601:web:78acfebca486f4bfff0130",
  measurementId: "G-DEC9QECYH0"
};

// 🔥 Inicializar Firestore y Auth
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// 📦 Guardar datos del usuario actual
export async function guardarDatosUsuario(data) {
  const user = auth.currentUser;
  if (!user) return alert("⚠️ No hay usuario logueado.");

  const ref = doc(db, "usuarios", user.uid);
  await setDoc(ref, data, { merge: true });
  console.log("✅ Datos guardados en Firestore para", user.email);
}

// 📦 Cargar datos del usuario actual
export async function cargarDatosUsuario() {
  const user = auth.currentUser;
  if (!user) return null;

  const ref = doc(db, "usuarios", user.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    console.log("📄 Datos cargados:", snap.data());
    return snap.data();
  } else {
    console.log("⚠️ No hay datos guardados aún.");
    return {};
  }
}

// Escuchar cambios de sesión
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const datos = await cargarDatosUsuario();
    console.log("🔄 Usuario autenticado:", user.email, datos);
  }
});

