// js/firestore-user.js
import { db } from "./db.js";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const auth = getAuth();

/* ---------------------------------------------------
   🔹 GUARDAR CLIENTE DEL USUARIO LOGUEADO
-----------------------------------------------------*/
export async function guardarClienteFirestore(cliente) {

  const user = auth.currentUser;

  if (!user) {
    alert("⚠️ Debes iniciar sesión para guardar datos.");
    return;
  }

  try {
    await addDoc(collection(db, "usuarios", user.uid, "clientes"), cliente);
    console.log("✅ Cliente guardado para", user.email);
  } catch (error) {
    console.error("❌ Error guardando cliente:", error);
  }
}

/* ---------------------------------------------------
   🔹 CARGAR TODOS LOS CLIENTES DEL USUARIO
-----------------------------------------------------*/
export async function cargarClientesFirestore() {

  const user = auth.currentUser;
  if (!user) return [];

  const lista = [];
  const ref = collection(db, "usuarios", user.uid, "clientes");
  const snapshot = await getDocs(ref);

  snapshot.forEach(doc => lista.push({ id: doc.id, ...doc.data() }));

  return lista;
}

/* ---------------------------------------------------
   🔹 GUARDAR DATOS GENERALES DEL USUARIO
-----------------------------------------------------*/
export async function guardarDatosUsuario(data) {

  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(db, "usuarios", user.uid);

  await setDoc(ref, data, { merge: true });

  console.log("🟢 Datos del usuario actual guardados en Firestore");
}

/* ---------------------------------------------------
   🔹 CARGAR PERFIL DEL USUARIO
-----------------------------------------------------*/
export async function cargarDatosUsuario() {

  const user = auth.currentUser;
  if (!user) return null;

  const ref = doc(db, "usuarios", user.uid);
  const snap = await getDoc(ref);

  return snap.exists() ? snap.data() : {};
}
