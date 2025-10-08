// --- Mostrar archivos de cada materia ---
function mostrarMateria(materia) {
  const contenedor = document.getElementById("contenido");
  contenedor.innerHTML = `
    <div class="card">
      <h2>${materia.charAt(0).toUpperCase() + materia.slice(1)}</h2>
      <div id="archivos-lista"></div>

      <div class="agregar-archivo">
        <input type="file" id="inputArchivo">
        <button onclick="guardarArchivo('${materia}')">Agregar Archivo</button>
      </div>
    </div>
  `;

  // Mostrar archivos guardados
  renderizarArchivos(materia);
}

// --- Renderizar lista de archivos ---
function renderizarArchivos(materia) {
  const lista = document.getElementById("archivos-lista");
  const archivos = obtenerArchivos(materia);

  if (archivos.length === 0) {
    lista.innerHTML = "<p>No hay archivos guardados para esta materia.</p>";
    return;
  }

  lista.innerHTML = "<ul>" + archivos.map((archivo, i) => `
    <li>
      <a href="${archivo.data}" download="${archivo.nombre}">${archivo.nombre}</a>
      <button onclick="eliminarArchivo('${materia}', '${archivo.nombre}')">❌</button>
    </li>
  `).join("") + "</ul>";
}

// --- Guardar un archivo nuevo ---
function guardarArchivo(materia) {
  const input = document.getElementById("inputArchivo");
  const file = input.files[0];

  if (!file) {
    alert("Selecciona un archivo para subir");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const archivoData = {
      nombre: file.name,
      data: e.target.result  // Base64 del archivo
    };

    agregarArchivo(materia, archivoData);
    renderizarArchivos(materia);
    input.value = ""; // Limpiar input
  };

  reader.readAsDataURL(file); // Convertir a Base64
}

// --- Eliminar archivo ---
function eliminarArchivo(materia, archivoNombre) {
  if (confirm(`¿Seguro que quieres eliminar "${archivoNombre}" de ${materia}?`)) {
    baseDatos.materias[materia] = baseDatos.materias[materia].filter(a => a.nombre !== archivoNombre);
    guardarBase();
    renderizarArchivos(materia);
  }
}
