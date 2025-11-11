/***** REPARACIONES / MANTENIMIENTO *****/
let reparaciones = JSON.parse(localStorage.getItem("reparaciones") || "[]");
const tablaReparaciones = document.querySelector("#tablaReparaciones tbody");
const formReparacion = document.querySelector("#formReparacion");
const selectVehiculo = document.querySelector("#vehiculoAsociado");

// Rellena el desplegable con los vehículos existentes
function actualizarSelectVehiculos() {
  if (!selectVehiculo) return;
  selectVehiculo.innerHTML = "";
  vehiculos.forEach((v, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = `${v.matricula} (${v.clienteNombre})`;
    selectVehiculo.appendChild(opt);
  });
}

// Guardar una nueva reparación
window.guardarReparacion = function () {
  const vehiculoIndex = selectVehiculo.value;
  const tipoMantenimiento = document.querySelector("#tipoMantenimiento").value;
  const fechaEntrada = document.querySelector("#fechaEntrada").value;
  const descripcion = document.querySelector("#descripcion").value.trim();
  const coste = document.querySelector("#coste").value.trim();

  if (vehiculoIndex === "" || tipoMantenimiento === "" || !fechaEntrada || !descripcion || !coste) {
    alert("Completa todos los campos antes de guardar.");
    return;
  }

  const v = vehiculos[vehiculoIndex];
  const nueva = {
    vehiculo: `${v.matricula} (${v.clienteNombre})`,
    tipo: tipoMantenimiento,
    fechaEntrada,
    descripcion,
    coste
  };

  reparaciones.push(nueva);
  localStorage.setItem("reparaciones", JSON.stringify(reparaciones));
  actualizarTablaReparaciones();
  if (formReparacion) formReparacion.reset();
};

// Eliminar reparación
window.eliminarReparacion = function (i) {
  if (!confirm("¿Eliminar esta reparación?")) return;
  reparaciones.splice(i, 1);
  localStorage.setItem("reparaciones", JSON.stringify(reparaciones));
  actualizarTablaReparaciones();
};

// Mostrar todas las reparaciones
function actualizarTablaReparaciones() {
  if (!tablaReparaciones) return;
  tablaReparaciones.innerHTML = "";

  if (reparaciones.length === 0) {
    const fila = document.createElement("tr");
    fila.innerHTML = `<td colspan="5" style="text-align:center; color:gray;">No hay reparaciones registradas</td>`;
    tablaReparaciones.appendChild(fila);
    return;
  }

  reparaciones.forEach((r, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.vehiculo}</td>
      <td>${r.tipo}</td>
      <td>${r.fechaEntrada}</td>
      <td>${r.descripcion}</td>
      <td>${r.coste}</td>
      <td><button onclick="eliminarReparacion(${i})">Eliminar</button></td>
    `;
    tablaReparaciones.appendChild(tr);
  });
}

// Al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  actualizarSelectVehiculos();
  actualizarTablaReparaciones();
});

