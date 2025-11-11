/***** RECAMBIOS *****/
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ recambios.js cargado correctamente");

  const selectVehiculoRecambio = document.getElementById("vehiculoRecambio");
  const tablaRecambios = document.querySelector("#tablaRecambios tbody");
  const inputPieza = document.getElementById("nombrePieza");

  // Cargar vehículos guardados para seleccionar
  function cargarVehiculosEnSelect() {
    const vehiculos = JSON.parse(localStorage.getItem("vehiculos") || "[]");
    selectVehiculoRecambio.innerHTML = "";

    if (vehiculos.length === 0) {
      const opt = document.createElement("option");
      opt.textContent = "-- No hay vehículos guardados --";
      selectVehiculoRecambio.appendChild(opt);
      return;
    }

    vehiculos.forEach((v, i) => {
      const opt = document.createElement("option");
      opt.value = v.vin || i;
      opt.textContent = `${v.matricula} (${v.clienteNombre})`;
      selectVehiculoRecambio.appendChild(opt);
    });
  }

 // Buscar recambios desde archivo JSON local
window.buscarRecambios = async function () {
  const pieza = inputPieza.value.trim().toLowerCase();
  const vin = selectVehiculoRecambio.value;

  if (!pieza || !vin) {
    alert("Selecciona un vehículo e introduce una pieza.");
    return;
  }

  try {
    const response = await fetch("data/recambios.json");
    const data = await response.json();

    // Filtrar resultados según VIN o nombre de pieza
    const resultados = data.filter(r =>
      r.vin === vin || r.pieza.toLowerCase().includes(pieza)
    );

    if (resultados.length === 0) {
      alert("No se encontraron recambios para este vehículo o pieza.");
      tablaRecambios.innerHTML = "";
      return;
    }

    mostrarResultados(resultados);
  } catch (error) {
    console.error("Error al cargar recambios:", error);
    alert("Error al obtener los datos de recambios.");
  }
};
 

  // Mostrar resultados en la tabla
function mostrarResultados(resultados) {
  tablaRecambios.innerHTML = "";

  resultados.forEach((r, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input type="checkbox" class="seleccionar-recambio" data-index="${index}"></td>
      <td>${r.proveedor}</td>
      <td>
        <b>${r.pieza}</b><br>
        <small>Marca: ${r.marca || "—"}</small><br>
        <small>Ref: ${r.referencia || "—"}</small>
      </td>
      <td>
        <img src="${r.imagen}" 
             alt="${r.pieza}" 
             width="80" height="80"
             referrerpolicy="no-referrer"
             onerror="this.src='https://via.placeholder.com/80?text=Sin+imagen'">
      </td>
      <td>${r.precio.toFixed(2)}</td>
      <td><a href="${r.enlace}" target="_blank">Ver</a></td>
    `;
    tablaRecambios.appendChild(tr);
  });

  // Añadir botón para guardar selección
  const botonGuardar = document.createElement("button");
  botonGuardar.textContent = "Guardar selección en Presupuesto";
  botonGuardar.onclick = guardarSeleccionRecambios;
  tablaRecambios.parentNode.appendChild(botonGuardar);

  // Guardar resultados globalmente para usarlos después
  window.ultimosResultadosRecambios = resultados;
}

// Guardar piezas seleccionadas en localStorage
function guardarSeleccionRecambios() {
  const seleccionadas = [];
  const checkboxes = document.querySelectorAll(".seleccionar-recambio:checked");

  checkboxes.forEach(chk => {
    const index = chk.dataset.index;
    const pieza = window.ultimosResultadosRecambios[index];
    seleccionadas.push(pieza);
  });

  if (seleccionadas.length === 0) {
    alert("No has seleccionado ninguna pieza.");
    return;
  }

  // Guardar en localStorage para Presupuesto
  localStorage.setItem("presupuestoPiezas", JSON.stringify(seleccionadas));

  alert("✅ Piezas guardadas en presupuesto.");
}


  // Inicializar
  cargarVehiculosEnSelect();
});
