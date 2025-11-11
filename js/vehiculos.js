/***** VEHÍCULOS *****/
let vehiculos = JSON.parse(localStorage.getItem("vehiculos") || "[]");
const tablaVehiculos = document.querySelector("#tablaVehiculos tbody");
const formVehiculo = document.querySelector("#formVehiculo");
const selectClientes = document.querySelector("#clienteAsociado");

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

window.eliminarVehiculo = function (i) {
  if (!confirm("¿Eliminar este vehículo?")) return;
  vehiculos.splice(i, 1);
  localStorage.setItem("vehiculos", JSON.stringify(vehiculos));
  actualizarTablaVehiculos();
};

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

document.addEventListener("DOMContentLoaded", () => {
  actualizarSelectClientes();
  actualizarTablaVehiculos();
});
