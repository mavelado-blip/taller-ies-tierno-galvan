/***** PRESUPUESTO *****/
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ presupuesto.js cargado correctamente");
});

/* Utilidades */
function formatearEUR(n) {
  const x = Number(n || 0);
  return x.toFixed(2) + " €";
}
function fechaHoyISO() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
}
function obtenerEmpresa() {
  return JSON.parse(localStorage.getItem("empresa") || "{}");
}
function obtenerPiezasSeleccionadas() {
  return JSON.parse(localStorage.getItem("presupuestoPiezas") || "[]");
}
function obtenerInformes() {
  return JSON.parse(localStorage.getItem("informes") || "[]");
}

/* Vista rápida en pantalla */
window.mostrarPresupuesto = function () {
  const div = document.getElementById("resumenPresupuesto");
  div.innerHTML = "";

  const piezas = obtenerPiezasSeleccionadas();
  const informes = obtenerInformes();

  let totalPiezas = 0;
  let totalManoObra = 0;

  if (piezas.length > 0) {
    const ul = document.createElement("ul");
    ul.innerHTML = "<h3>🧩 Piezas seleccionadas:</h3>";
    piezas.forEach(p => {
      totalPiezas += Number(p.precio) || 0;
      const li = document.createElement("li");
      li.textContent = `${p.pieza} (${p.marca}${p.referencia ? " - Ref: " + p.referencia : ""}) — ${formatearEUR(p.precio)}`;
      ul.appendChild(li);
    });
    div.appendChild(ul);
  }

  if (informes.length > 0) {
    const ul = document.createElement("ul");
    ul.innerHTML = "<h3>🛠️ Mano de obra:</h3>";
    informes.forEach(i => {
      const coste = Number(i.coste) || 0;
      totalManoObra += coste;
      const li = document.createElement("li");
      li.textContent = `${i.tecnico} — ${i.horas || 0} h — ${formatearEUR(coste)}`;
      ul.appendChild(li);
    });
    div.appendChild(ul);
  }

  const total = totalPiezas + totalManoObra;
  const totales = document.createElement("div");
  totales.innerHTML = `
    <h3>Total piezas: ${formatearEUR(totalPiezas)}</h3>
    <h3>Total mano de obra: ${formatearEUR(totalManoObra)}</h3>
    <h2>Total presupuesto: ${formatearEUR(total)}</h2>
  `;
  div.appendChild(totales);

  // Render del documento imprimible
  renderPresupuestoImprimible({ piezas, informes, totalPiezas, totalManoObra, total });
};

/* Construcción del documento listo para PDF */
function renderPresupuestoImprimible({ piezas, informes, totalPiezas, totalManoObra, total }) {
  const empresa = obtenerEmpresa();
  const cont = document.getElementById("presupuestoImprimible");
  const fecha = fechaHoyISO();

  // Si hay informes, usamos el primer "vehiculo" para mostrarlo en cabecera
  const vehiculoLinea = informes.length > 0 ? (informes[0].vehiculo || "—") : "—";

  // Tablas
  const tablaPiezas = piezas.length > 0 ? `
    <h3>Piezas</h3>
    <table>
      <thead>
        <tr>
          <th>Pieza</th>
          <th>Marca / Ref</th>
          <th>Proveedor</th>
          <th>Precio</th>
        </tr>
      </thead>
      <tbody>
        ${piezas.map(p => `
          <tr>
            <td>${p.pieza}</td>
            <td>${p.marca || "—"}${p.referencia ? " / " + p.referencia : ""}</td>
            <td>${p.proveedor || "—"}</td>
            <td>${formatearEUR(p.precio)}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  ` : "";

  const tablaMO = informes.length > 0 ? `
    <h3>Mano de obra</h3>
    <table>
      <thead>
        <tr>
          <th>Técnico</th>
          <th>Tipo / Tarifa</th>
          <th>Horas</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${informes.map(i => `
          <tr>
            <td>${i.tecnico?.split("(")[0] || i.tecnico || "—"}</td>
            <td>${i.tecnico?.match(/\((.*?)\)/)?.[1] || "—"}</td>
            <td>${i.horas || 0}</td>
            <td>${formatearEUR(i.coste || 0)}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  ` : "";

  cont.innerHTML = `
    <div class="doc-header">
      <img src="assets/logo.png" alt="Logo" onerror="this.style.display='none'">
      <div class="empresa">
        <div><b>${empresa.nombre || "Taller"}</b></div>
        <div>CIF: ${empresa.cif || "—"}</div>
        <div>${empresa.direccion || ""}</div>
        <div>${empresa.telefono || ""} ${empresa.correo ? "· " + empresa.correo : ""}</div>
      </div>
      <div style="margin-left:auto; text-align:right;">
        <div><b>PRESUPUESTO</b></div>
        <div>Fecha: ${fecha}</div>
        <div>Vehículo/Cliente: ${vehiculoLinea}</div>
      </div>
    </div>

    ${tablaPiezas || "<p>No hay piezas seleccionadas.</p>"}
    ${tablaMO || "<p>No hay líneas de mano de obra.</p>"}

    <div class="doc-resumen">
      <p>Total piezas: <b>${formatearEUR(totalPiezas)}</b></p>
      <p>Total mano de obra: <b>${formatearEUR(totalManoObra)}</b></p>
      <p class="total">TOTAL: ${formatearEUR(total)}</p>
      <!-- Si quieres incluir IVA más adelante, lo añadimos aquí -->
    </div>
  `;
}

/* Exportar a PDF */
window.exportarPresupuestoPDF = function () {
  const el = document.getElementById("presupuestoImprimible");
  if (!el || !el.innerHTML.trim()) {
    alert("Primero pulsa 'Actualizar presupuesto' para generar el documento.");
    return;
  }
  const opt = {
    margin: 10,
    filename: `presupuesto_${fechaHoyISO()}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(el).save();
};
