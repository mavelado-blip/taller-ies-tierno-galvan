// --- Firebase v10 ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
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

// --- Inicializar Firebase ---
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

// --- Estado inicial seguro ---
document.addEventListener("DOMContentLoaded", () => {
  mainContent.style.display = "none";
  userBar.style.display = "none";
  authSection.style.display = "block";
});

// --- Función de cierre de sesión ---
async function cerrarSesion() {
  await signOut(auth);
  authSection.style.display = "block";
  userBar.style.display = "none";
  mainContent.style.display = "none";
  estadoUsuario.textContent = "👋 Sesión cerrada.";
}

// --- Registro de usuario ---
btnRegistrar?.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // Solo permitir correos de educa.madrid.org
  if (!email.endsWith("@educa.madrid.org")) {
    estadoUsuario.textContent = "⚠️ Solo se permiten correos @educa.madrid.org";
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    estadoUsuario.textContent = "✅ Usuario registrado correctamente.";
  } catch (error) {
    estadoUsuario.textContent = "⚠️ " + error.message;
  }
});

// --- Inicio de sesión ---
btnLogin?.addEventListener("click", async () => {
  try {
    await signInWithEmailAndPassword(auth, emailInput.value.trim(), passwordInput.value.trim());
  } catch (error) {
    estadoUsuario.textContent = "⚠️ " + error.message;
  }
});

// --- Cierre de sesión desde botones ---
btnLogout?.addEventListener("click", cerrarSesion);
btnLogoutTop?.addEventListener("click", cerrarSesion);

// --- Cambios de sesión ---
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("✅ Usuario autenticado:", user.email);

    // Mostrar la barra superior con el correo del usuario
    userBar.style.display = "flex";
    userEmailSpan.textContent = user.email || "";

    // Mostrar el contenido principal
    mainContent.style.display = "block";

    // Ocultar completamente el acceso al taller (login y registro)
    authSection.style.display = "none";

    estadoUsuario.textContent = "Conectado como " + user.email;

  } else {
    console.log("🔒 Usuario no autenticado");

    // Mostrar solo el login
    authSection.style.display = "block";

    // Ocultar contenido y barra
    mainContent.style.display = "none";
    userBar.style.display = "none";

    estadoUsuario.textContent = "No conectado";
  }
});

