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
