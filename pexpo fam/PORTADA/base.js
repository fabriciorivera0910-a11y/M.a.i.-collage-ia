// --- Inicialización de la "base de datos" ---
let baseDatos = {
  materias: {}
};

// Cargar datos desde localStorage si existen
if (localStorage.getItem("baseDatos")) {
  baseDatos = JSON.parse(localStorage.getItem("baseDatos"));
}

// --- Funciones de la base de datos ---
function guardarBase() {
  localStorage.setItem("baseDatos", JSON.stringify(baseDatos));
}

function agregarArchivo(materia, archivo) {
  if (!baseDatos.materias[materia]) {
    baseDatos.materias[materia] = [];
  }
  baseDatos.materias[materia].push(archivo);
  guardarBase();
}

function obtenerArchivos(materia) {
  return baseDatos.materias[materia] || [];
}
