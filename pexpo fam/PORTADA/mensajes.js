// Objeto para almacenar mensajes de usuarios
const mensajes = {};

// Función para mostrar la sección correspondiente
function mostrarSeccion(seccionId) {
    document.getElementById('redactar').style.display = 'none';
    document.getElementById('bandeja').style.display = 'none';
    document.getElementById(seccionId).style.display = 'block';

    // Si cambiamos a redactar, limpiamos los campos
    if (seccionId === 'redactar') {
        document.getElementById('usuarioDestino').value = '';
        document.getElementById('mensajeTexto').value = '';
    }
}

// Función para enviar mensaje
function enviarMensaje() {
    const usuario = document.getElementById('usuarioDestino').value.trim();
    const texto = document.getElementById('mensajeTexto').value.trim();

    if (!usuario || !texto) {
        alert("Por favor ingresa el nombre del usuario y el mensaje.");
        return;
    }

    // Si no existe el usuario en el objeto, lo creamos
    if (!mensajes[usuario]) {
        mensajes[usuario] = [];
    }

    // Guardamos el mensaje
    mensajes[usuario].push(texto);

    // Limpiamos los campos
    document.getElementById('usuarioDestino').value = '';
    document.getElementById('mensajeTexto').value = '';

    alert(`Mensaje enviado a ${usuario}`);
}

// Función para recibir mensajes de un usuario específico
function recibirMensajes(usuario) {
    const contenedor = document.getElementById('mensajesRecibidos');
    contenedor.innerHTML = ''; // Limpiamos contenido

    if (mensajes[usuario] && mensajes[usuario].length > 0) {
        mensajes[usuario].forEach((msg, index) => {
            const p = document.createElement('p');
            p.textContent = `Mensaje ${index + 1}: ${msg}`;
            contenedor.appendChild(p);
        });
    } else {
        contenedor.innerHTML = '<p>No hay mensajes para este usuario.</p>';
    }
}

// Ejemplo: Mostrar mensajes de un usuario específico al cargar la bandeja
document.getElementById('bandeja').addEventListener('click', () => {
    const usuario = prompt("Ingrese el nombre del usuario para ver sus mensajes:");
    if (usuario) {
        recibirMensajes(usuario.trim());
    }
});
