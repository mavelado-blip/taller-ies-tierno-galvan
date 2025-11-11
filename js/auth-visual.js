// --- Firebase v10 ---
import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// --- Configuración Firebase ---
const firebaseConfig = {
  apiKey: "AIzaSyBya-ZCpikAFuu2_8Oziz3vdS9taDcrFAk",
  authDomain: "taller-ies.firebaseapp.com",
  projectId: "taller-ies",
  storageBucket: "taller-ies.firebasestorage.app",
  messagingSenderId: "461220947601",
  appId: "1:461220947601:web:78acfebca486f4bfff0130",
  measurementId: "G-DEC9QECYH0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// --- Referencias DOM ---
const mainContent = document.querySelector("main");
const authSection = document.getElementById("auth");
const userBar = document.getElementById("userBar");
const userEmailSpan = document.getElementById("userEmail");
const estadoUsuario = document.getElementById("estadoUsuario");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const btnRegistrar = document.getElementById("btnRegistrar");
const btnLogin = document.getElementById("btnLogin");
const btnLogout = document.getElementById("btnLogout");
const btnLogoutTop = document.getElementById("btnLogoutTop");

// Estado inicial
mainContent.style.display = "none";
userBar.style.display = "none";
authSection.style.display = "flex";

// --- Registro / Login ---
btnRegistrar?.addEventListener("click", async () => {
  try {
    await createUserWithEmailAndPassword(auth, emailInput.value.trim(), passwordInput.value.trim());
    estadoUsuario.textContent = "✅ Usuario registrado correctamente.";
  } catch (error) {
    estadoUsuario.textContent = "⚠️ " + error.message;
  }
});

btnLogin?.addEventListener("click", async () => {
  try {
    await signInWithEmailAndPassword(auth, emailInput.value.trim(), passwordInput.value.trim());
  } catch (error) {
    estadoUsuario.textContent = "⚠️ " + error.message;
  }
});

// --- Cierre de sesión ---
async function cerrarSesion() {
  await signOut(auth);
}
btnLogout?.addEventListener("click", cerrarSesion);
btnLogoutTop?.addEventListener("click", cerrarSesion);

// --- Escuchar cambios de sesión ---
onAuthStateChanged(auth, (user) => {
  if (user) {
    // 🔹 Usuario autenticado
    mainContent.style.display = "block";
    userBar.style.display = "flex";
    authSection.style.display = "none";
    userEmailSpan.textContent = user.email;
  } else {
    // 🔹 Sin sesión
    mainContent.style.display = "none";
    userBar.style.display = "none";
    authSection.style.display = "flex";
    estadoUsuario.textContent = "No conectado";
  }
});
