/***** INFORMES *****/
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ informes.js cargado correctamente");

  // --- VARIABLES PRINCIPALES ---
  const selectVehiculoInforme = document.getElementById("vehiculoInforme");
  const selectTecnico = document.getElementById("tecnicoAsignado");
  const selectTipoInforme = document.getElementById("tipoMantenimientoInforme");
  const divDetalles = document.getElementById("detallesMantenimiento");
  const tablaInformes = document.querySelector("#tablaInformes tbody");

  let informes = JSON.parse(localStorage.getItem("informes") || "[]");

  // --- CARGA INICIAL ---
  actualizarSelectVehiculosInforme();
  actualizarSelectTecnicos();
  actualizarTablaInformes();

  // --- FUNCIONES ---

  // Vehículos
  function actualizarSelectVehiculosInforme() {
    if (!selectVehiculoInforme) return;
    selectVehiculoInforme.innerHTML = "";
    const vehiculosGuardados = JSON.parse(localStorage.getItem("vehiculos") || "[]");

    console.log("🚗 Vehículos cargados:", vehiculosGuardados.length);

    if (vehiculosGuardados.length === 0) {
      const opt = document.createElement("option");
      opt.textContent = "-- No hay vehículos guardados --";
      selectVehiculoInforme.appendChild(opt);
      return;
    }

    vehiculosGuardados.forEach((v, i) => {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = `${v.matricula} (${v.clienteNombre})`;
      selectVehiculoInforme.appendChild(opt);
    });
  }

  // Técnicos
  function actualizarSelectTecnicos() {
    if (!selectTecnico) return;
    selectTecnico.innerHTML = "";
    const tecnicosGuardados = JSON.parse(localStorage.getItem("tecnicos") || "[]");
    console.log("👷 Técnicos cargados:", tecnicosGuardados.length);

    if (tecnicosGuardados.length === 0) {
      const opt = document.createElement("option");
      opt.textContent = "-- No hay técnicos registrados --";
      selectTecnico.appendChild(opt);
      return;
    }

    tecnicosGuardados.forEach((t, i) => {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = `${t.nombre} (${t.tipo}, ${t.precio.toFixed(2)} €/h)`;
      selectTecnico.appendChild(opt);
    });
  }

  // Tabla de informes

function actualizarTablaInformes() {
  if (!tablaInformes) return;
  tablaInformes.innerHTML = "";

  if (informes.length === 0) {
    const fila = document.createElement("tr");
    fila.innerHTML = `<td colspan="6" style="text-align:center; color:gray;">No hay informes generados</td>`;
    tablaInformes.appendChild(fila);
    return;
  }

  // Cabecera si no está en el HTML
  if (!document.querySelector("#tablaInformes thead")) {
    const thead = document.createElement("thead");
    thead.innerHTML = `
      <tr>
        <th>Vehículo</th>
        <th>Tipo</th>
        <th>Técnico</th>
        <th>Horas</th>
        <th>Coste (€)</th>
        <th>Detalle</th>
      </tr>
    `;
    tablaInformes.parentNode.insertBefore(thead, tablaInformes);
  }

  informes.forEach((inf) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${inf.vehiculo}</td>
      <td>${inf.tipo}</td>
      <td>${inf.tecnico}</td>
      <td>${inf.horas || "-"}</td>
      <td>${inf.coste || "0.00"}</td>
      <td>${inf.detalle}</td>
    `;
    tablaInformes.appendChild(tr);
  });
}


  // --- CAMPOS SEGÚN TIPO ---
  selectTipoInforme?.addEventListener("change", () => {
    const tipo = selectTipoInforme.value;
    divDetalles.innerHTML = "";

    if (tipo === "preventivo") {
      divDetalles.innerHTML = `
        <label>Filtros revisados:</label><input placeholder="Sí/No"><br>
        <label>Aceite cambiado:</label><input placeholder="Sí/No"><br>
        <label>Presión neumáticos:</label><input placeholder="Correcta/Incorrecta"><br>
      `;
    } else if (tipo === "correctivo") {
      divDetalles.innerHTML = `
        <label>Elemento reparado:</label><input placeholder="Ej. frenos, luces..."><br>
        <label>Piezas sustituidas:</label><input placeholder="Nº de piezas"><br>
      `;
    } else if (tipo === "revision") {
      divDetalles.innerHTML = `
        <h4>Lista de comprobaciones generales</h4>
        <div id="tareasRevision" style="display:flex; flex-direction:column; gap:4px;">
          <label><input type="checkbox" value="Aceite y filtros"> Aceite y filtros revisados</label>
          <label><input type="checkbox" value="Presión neumáticos"> Presión de neumáticos correcta</label>
          <label><input type="checkbox" value="Luces y señalización"> Luces y señalización funcionales</label>
          <label><input type="checkbox" value="Frenos"> Frenos en buen estado</label>
          <label><input type="checkbox" value="Suspensión y dirección"> Suspensión y dirección revisadas</label>
          <label><input type="checkbox" value="Niveles líquidos"> Niveles de líquidos comprobados</label>
          <label><input type="checkbox" value="Batería"> Batería revisada</label>
        </div>
        <label>Km actuales:</label><input id="kmRevision" placeholder="Ej. 125000"><br>
        <label>Observaciones:</label><input id="obsRevision" placeholder="Notas del técnico"><br>
      `;
    }
  });

  // --- GUARDAR INFORME ---
window.generarInforme = function () {
  const vehiculos = JSON.parse(localStorage.getItem("vehiculos") || "[]");
  const tecnicos = JSON.parse(localStorage.getItem("tecnicos") || "[]");

  const vehiculoIndex = selectVehiculoInforme.value;
  const tipo = selectTipoInforme.value;
  const tecnicoIndex = selectTecnico.value;
  const horas = parseFloat(document.getElementById("horasTrabajo").value) || 0;

  if (vehiculoIndex === "" || tipo === "" || tecnicoIndex === "") {
    alert("Completa todos los campos antes de generar el informe.");
    return;
  }

  const v = vehiculos[vehiculoIndex];
  const t = tecnicos[tecnicoIndex];
  let detalle = "";

  // Si es revisión, recoger las tareas marcadas
  if (tipo === "revision") {
    const checks = document.querySelectorAll("#tareasRevision input[type='checkbox']");
    const tareasMarcadas = Array.from(checks)
      .filter(c => c.checked)
      .map(c => c.value);
    const km = document.querySelector("#kmRevision")?.value || "";
    const obs = document.querySelector("#obsRevision")?.value || "";

    detalle = `
      ✅ Tareas realizadas: ${tareasMarcadas.join(", ") || "Ninguna marcada"}<br>
      Km actuales: ${km}<br>
      Observaciones: ${obs}
    `;
  } else {
    detalle = divDetalles.textContent || "";
  }

  // 💰 Calcular coste total
  const coste = horas * t.precio;
  const costeTexto = coste.toFixed(2);

  const nuevoInforme = {
    vehiculo: `${v.matricula} (${v.clienteNombre})`,
    tipo,
    tecnico: `${t.nombre} (${t.tipo}, ${t.precio.toFixed(2)} €/h)`,
    horas,
    coste: costeTexto,
    detalle
  };

  informes.push(nuevoInforme);
  localStorage.setItem("informes", JSON.stringify(informes));
  actualizarTablaInformes();
  document.getElementById("formInforme").reset();
  divDetalles.innerHTML = "";
};
});
