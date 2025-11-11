/***** DATOS DE LA EMPRESA *****/
let empresa = JSON.parse(localStorage.getItem("empresa") || "{}");

window.guardarEmpresa = function () {
  const nombre = document.querySelector("#nombreEmpresa").value.trim();
  const cif = document.querySelector("#cifEmpresa").value.trim();
  const direccion = document.querySelector("#direccionEmpresa").value.trim();
  const telefono = document.querySelector("#telefonoEmpresa").value.trim();
  const correo = document.querySelector("#correoEmpresa").value.trim();

  if (!nombre || !cif) {
    alert("Por favor, completa al menos el nombre y el CIF de la empresa.");
    return;
  }

  empresa = { nombre, cif, direccion, telefono, correo };
  localStorage.setItem("empresa", JSON.stringify(empresa));
  mostrarDatosEmpresa();
};

function mostrarDatosEmpresa() {
  document.querySelector("#empNombre").textContent = empresa.nombre || "";
  document.querySelector("#empCif").textContent = empresa.cif || "";
  document.querySelector("#empDireccion").textContent = empresa.direccion || "";
  document.querySelector("#empTelefono").textContent = empresa.telefono || "";
  document.querySelector("#empCorreo").textContent = empresa.correo || "";
}

document.addEventListener("DOMContentLoaded", mostrarDatosEmpresa);

/***** GESTIÓN DE TÉCNICOS *****/
let tecnicos = JSON.parse(localStorage.getItem("tecnicos") || "[]");
const formTecnico = document.querySelector("#formTecnico");
const tablaTecnicos = document.querySelector("#tablaTecnicos tbody");

// Guardar técnico
window.guardarTecnico = function () {
  const nombre = document.querySelector("#nombreTecnico").value.trim();
  const tipo = document.querySelector("#tipoTecnico").value;
  const precio = parseFloat(document.querySelector("#precioHora").value);

  if (!nombre || !tipo || isNaN(precio)) {
    alert("Completa todos los campos correctamente.");
    return;
  }

  const nuevoTecnico = { nombre, tipo, precio };
  tecnicos.push(nuevoTecnico);
  localStorage.setItem("tecnicos", JSON.stringify(tecnicos));
  actualizarTablaTecnicos();
  formTecnico.reset();
};

// Eliminar técnico
window.eliminarTecnico = function (i) {
  if (!confirm("¿Eliminar este técnico?")) return;
  tecnicos.splice(i, 1);
  localStorage.setItem("tecnicos", JSON.stringify(tecnicos));
  actualizarTablaTecnicos();
};

// Mostrar técnicos en tabla
function actualizarTablaTecnicos() {
  if (!tablaTecnicos) return;
  tablaTecnicos.innerHTML = "";

  if (tecnicos.length === 0) {
    const fila = document.createElement("tr");
    fila.innerHTML = `<td colspan="4" style="text-align:center; color:gray;">No hay técnicos registrados</td>`;
    tablaTecnicos.appendChild(fila);
    return;
  }

  tecnicos.forEach((t, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${t.nombre}</td>
      <td>${t.tipo}</td>
      <td>${t.precio.toFixed(2)}</td>
      <td><button onclick="eliminarTecnico(${i})">Eliminar</button></td>
    `;
    tablaTecnicos.appendChild(tr);
  });
}

document.addEventListener("DOMContentLoaded", actualizarTablaTecnicos);
