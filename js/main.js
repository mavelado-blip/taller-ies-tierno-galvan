/***** NAVEGACIÓN *****/
window.mostrarSeccion = function (id) {
  document.querySelectorAll("main section").forEach(s => s.classList.remove("active"));
  const sec = document.getElementById(id);
  if (sec) sec.classList.add("active");
};

/***** INICIALIZACIÓN GLOBAL *****/
document.addEventListener("DOMContentLoaded", () => {
  // Si quieres hacer algo al arrancar la app (por ejemplo, mostrar Inicio)
  mostrarSeccion("inicio");
});
