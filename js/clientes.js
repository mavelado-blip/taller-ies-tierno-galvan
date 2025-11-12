import { guardarDatosUsuario } from "./firestore-user.js";

/***** CLIENTES *****/
let clientes = JSON.parse(localStorage.getItem("clientes") || "[]");
const formClientes = document.querySelector("#formClientes");
const tablaClientes = document.querySelector("#tablaClientes tbody");

window.guardarCliente = function () {
  const nombre = document.querySelector("#nombreCliente").value.trim();
  const correo = document.querySelector("#correoCliente").value.trim();
  const telefono = document.querySelector("#telefonoCliente").value.trim();
  const direccion = document.querySelector("#direccionCliente").value.trim();
  const dni = document.querySelector("#dniCliente").value.trim();

  if (!nombre) { alert("Escribe al menos el nombre."); return; }

    const cliente = { nombre, correo, telefono, direccion, dni };

  // 🔹 Guardar localmente
  clientes.push(cliente);
  localStorage.setItem("clientes", JSON.stringify(clientes));

  // 🔹 Guardar también en Firestore (base de datos online)
guardarDatosUsuario({ clientes });


  actualizarTablaClientes();
  if (formClientes) formClientes.reset();
  if (typeof actualizarSelectClientes === "function") actualizarSelectClientes();
};

window.eliminarCliente = function (i) {
  if (!confirm("¿Eliminar este cliente?")) return;
  clientes.splice(i, 1);
  localStorage.setItem("clientes", JSON.stringify(clientes));
  actualizarTablaClientes();
  if (typeof actualizarSelectClientes === "function") actualizarSelectClientes();
};

function actualizarTablaClientes() {
  if (!tablaClientes) return;
  tablaClientes.innerHTML = "";
  clientes.forEach((c, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.nombre || ""}</td>
      <td>${c.correo || ""}</td>
      <td>${c.telefono || ""}</td>
      <td>${c.direccion || ""}</td>
      <td>${c.dni || ""}</td>
      <td><button onclick="eliminarCliente(${i})">Eliminar</button></td>
    `;
    tablaClientes.appendChild(tr);
  });
}

document.addEventListener("DOMContentLoaded", actualizarTablaClientes);
