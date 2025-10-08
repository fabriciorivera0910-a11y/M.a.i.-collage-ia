document.getElementById('perfilForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Obtener valores
    const nombre = document.getElementById('nombre').value;
    const seccion = document.getElementById('seccion').value;
    const grupo = document.getElementById('grupo').value;
    const fecha = document.getElementById('fechaNacimiento').value;
    const foto = document.getElementById('fotoPerfil').files[0];

    // Mostrar datos en la vista previa
    document.getElementById('mostrarNombre').textContent = nombre;
    document.getElementById('mostrarSeccion').textContent = seccion;
    document.getElementById('mostrarGrupo').textContent = grupo;
    document.getElementById('mostrarFecha').textContent = fecha;

    if(foto) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('imgPerfil').src = e.target.result;
        };
        reader.readAsDataURL(foto);
    }

    document.getElementById('vistaPerfil').style.display = 'block';
});
