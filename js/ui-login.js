// js/ui-login.js
function $(sel) { return document.querySelector(sel); }
function byId(id) { return document.getElementById(id); }

export function showLoggedIn(email = "") {
  const main   = $("main");
  const auth   = byId("auth");
  const bar    = byId("userBar");
  const span   = byId("userEmail");
  const estado = byId("estadoUsuario");

  if (main)  main.style.display = "block";
  if (auth)  auth.style.display = "none";
  if (bar)   bar.style.display  = "flex";
  if (span)  span.textContent   = email;
  if (estado) estado.textContent = "Conectado como " + (email || "");
}

export function showLoggedOut() {
  const main   = $("main");
  const auth   = byId("auth");
  const bar    = byId("userBar");
  const estado = byId("estadoUsuario");

  if (main)  main.style.display = "none";
  if (bar)   bar.style.display  = "none";
  if (auth)  auth.style.display = "block";
  if (estado) estado.textContent = "No conectado";
}

// estado inicial seguro
export function initLoginUI() {
  showLoggedOut();
}

