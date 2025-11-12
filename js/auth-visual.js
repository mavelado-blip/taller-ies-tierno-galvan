// js/auth-visual.js  (MÓDULO)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { initLoginUI, showLoggedIn, showLoggedOut } from "./ui-login.js";

// --- Config Firebase ---
const firebaseConfig = {
  apiKey: "AIzaSyBya-ZCpikAFuu2_8Oziz3vdS9taDcrFAk",
  authDomain: "taller-ies.firebaseapp.com",
  projectId: "taller-ies",
  storageBucket: "taller-ies.firebasestorage.app",
  messagingSenderId: "461220947601",
  appId: "1:461220947601:web:78acfebca486f4bfff0130",
  measurementId: "G-DEC9QECYH0"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM (solo para botones/campos)
const emailInput   = document.getElementById("email");
const passInput    = document.getElementById("password");
const btnReg       = document.getElementById("btnRegistrar");
const btnLogin     = document.getElementById("btnLogin");
const btnLogout    = document.getElementById("btnLogout");
const btnLogoutTop = document.getElementById("btnLogoutTop");
const estado       = document.getElementById("estadoUsuario");

// Estado inicial de UI
initLoginUI();

// Eventos
btnReg?.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const pass  = passInput.value.trim();

  // 🔒 Solo permitir correos del dominio educa.madrid.org
  const dominioPermitido = "@educa.madrid.org";
  if (!email.endsWith(dominioPermitido)) {
    estado.textContent = "❌ Solo se permiten correos del dominio " + dominioPermitido;
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, pass);
    estado.textContent = "✅ Usuario registrado correctamente.";
  } catch (e) {
    estado.textContent = "⚠️ " + e.message;
  }
});


btnLogin?.addEventListener("click", async () => {
  try {
    await signInWithEmailAndPassword(auth, emailInput.value.trim(), passInput.value.trim());
  } catch (e) {
    estado.textContent = "⚠️ " + e.message;
  }
});

async function doLogout() { await signOut(auth); }
btnLogout?.addEventListener("click", doLogout);
btnLogoutTop?.addEventListener("click", doLogout);

// Sesión
onAuthStateChanged(auth, (user) => {
  if (user) {
    showLoggedIn(user.email || "");
  } else {
    showLoggedOut();
  }
});
