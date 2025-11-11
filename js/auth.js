console.log("✅ auth.js cargado correctamente");

// --- Firebase v10 ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// 🔧 CONFIGURACIÓN DE TU PROYECTO FIREBASE
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "taller-ies.firebaseapp.com",
  projectId: "taller-ies",
  storageBucket: "taller-ies.appspot.com",
  messagingSenderId: "XXXXXXXXXXXX",
  appId: "1:XXXXXXXXXXXX:web:XXXXXXXXXXXXXX"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// --- REFERENCIAS A LOS ELEMENTOS ---
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const btnRegistrar = document.getElementById("btnRegistrar");
const btnLogin = document.getElementById("btnLogin");
const btnLogout = document.getElementById("btnLogout");
const estadoUsuario = document.getElementById("estadoUsuario");

// Nueva barra superior
const userBar = document.getElementById("userBar");
const userEmail = document.getElementById("userEmail");
const btnLogoutTop = document.getElementById("btnLogoutTop");

// --- FUNCIONES DE AUTENTICACIÓN ---

// Registrar usuario (solo @educa.madrid.org)
btnRegistrar.addEventListener("click", async () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  if (!email.endsWith("@educa.madrid.org")) {
    alert("Solo se permiten correos del dominio @educa.madrid.org");
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("✅ Usuario registrado correctamente.");
  } catch (error) {
    alert("❌ Error al registrar: " + error.message);
  }
});

// Iniciar sesión
btnLogin.addEventListener("click", async () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("✅ Sesión iniciada correctamente.");
  } catch (error) {
    alert("❌ Error al iniciar sesión: " + error.message);
  }
});

// Cerrar sesión (desde formulario o barra superior)
const cerrarSesion = async () => {
  await signOut(auth);
  alert("👋 Sesión cerrada.");
};
btnLogout.addEventListener("click", cerrarSesion);
btnLogoutTop?.addEventListener("click", cerrarSesion);

// --- MONITOREO DEL ESTADO DE SESIÓN ---
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Usuario conectado ✅
    document.querySelector("#auth").style.display = "none";
    document.querySelector("main").style.display = "block";
    userBar.style.display = "flex";
    userEmail.textContent = user.email;
  } else {
    // Usuario desconectado ❌
    document.querySelector("#auth").style.display = "block";
    document.querySelector("main").style.display = "none";
    userBar.style.display = "none";
  }
});
// --- FIN DE auth.js ---