/***** NAVEGACIÓN *****/
window.mostrarSeccion = function (id) {
  document.querySelectorAll("main section").forEach(s => s.classList.remove("active"));
  const sec = document.getElementById(id);
  if (sec) sec.classList.add("active");
};

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

  clientes.push({ nombre, correo, telefono, direccion, dni });
  localStorage.setItem("clientes", JSON.stringify(clientes));

  actualizarTablaClientes();
  if (formClientes) formClientes.reset();
  actualizarSelectClientes(); // <-- llamada correcta
};

window.eliminarCliente = function (i) {
  if (!confirm("¿Eliminar este cliente?")) return;
  clientes.splice(i, 1);
  localStorage.setItem("clientes", JSON.stringify(clientes));
  actualizarTablaClientes();
  actualizarSelectClientes();
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

/***** VEHÍCULOS *****/
let vehiculos = JSON.parse(localStorage.getItem("vehiculos") || "[]");
const tablaVehiculos = document.querySelector("#tablaVehiculos tbody"); // <-- nombre correcto
const formVehiculo = document.querySelector("#formVehiculo");
const selectClientes = document.querySelector("#clienteAsociado");

// Rellena el desplegable con los clientes actuales
function actualizarSelectClientes() {
  if (!selectClientes) return;
  selectClientes.innerHTML = "";
  clientes.forEach((c, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = c.nombre;
    selectClientes.appendChild(opt);
  });
}

// Guarda un nuevo vehículo
window.guardarVehiculo = function () {
  if (!selectClientes) { alert("No se encontró el selector de clientes."); return; }

  const clienteIndex = selectClientes.value;
  const vin = document.querySelector("#vin").value.trim().toUpperCase();
  const matricula = document.querySelector("#matricula").value.trim().toUpperCase();
  const marca = document.querySelector("#marca").value.trim();
  const modelo = document.querySelector("#modelo").value.trim();

  if (clienteIndex === "" || !vin || !matricula) {
    alert("Selecciona un cliente y completa VIN y Matrícula.");
    return;
  }

  const cliente = clientes[Number(clienteIndex)];
  const v = { clienteNombre: cliente?.nombre || "—", vin, matricula, marca, modelo };

  vehiculos.push(v);
  localStorage.setItem("vehiculos", JSON.stringify(vehiculos));

  actualizarTablaVehiculos();
  if (formVehiculo) formVehiculo.reset();
};

// Eliminar vehículo
window.eliminarVehiculo = function (i) {
  if (!confirm("¿Eliminar este vehículo?")) return;
  vehiculos.splice(i, 1);
  localStorage.setItem("vehiculos", JSON.stringify(vehiculos));
  actualizarTablaVehiculos();
};

// Mostrar tabla de vehículos
function actualizarTablaVehiculos() {
  if (!tablaVehiculos) return;
  tablaVehiculos.innerHTML = "";

  if (vehiculos.length === 0) {
    const fila = document.createElement("tr");
    fila.innerHTML = `<td colspan="6" style="text-align:center; color:gray;">No hay vehículos registrados</td>`;
    tablaVehiculos.appendChild(fila);
    return;
  }

  vehiculos.forEach((v, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><b>${v.clienteNombre}</b></td>
      <td>${v.vin}</td>
      <td>${v.matricula}</td>
      <td>${v.marca}</td>
      <td>${v.modelo}</td>
      <td><button onclick="eliminarVehiculo(${i})">Eliminar</button></td>
    `;
    tablaVehiculos.appendChild(tr);
  });
}

/***** INICIALIZACIÓN *****/
document.addEventListener("DOMContentLoaded", () => {
  actualizarTablaClientes();
  actualizarSelectClientes();
  actualizarTablaVehiculos();
});
