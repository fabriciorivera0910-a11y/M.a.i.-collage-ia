const calendarioTable = document.querySelector('#calendarioApp tbody');
const monthYearLabel = document.getElementById('monthYear');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const infoDia = document.getElementById('infoDia');

let currentDate = new Date(); // Fecha inicial

// Feriados en formato MM-DD
const feriadosCR = ["01-01","04-11","05-01","08-02","09-15","12-25"];
const ultimoMesTrimestre = [2, 5, 8, 10]; // índices de mes (0-11)

// Función que devuelve el tipo de día y descripción
function getDiaTipo(year, month, day) {
    const fechaStr = ("0"+(month+1)).slice(-2) + "-" + ("0"+day).slice(-2);
    const fecha = new Date(year, month, day);
    const diaSemana = fecha.getDay(); // 0 = domingo, 6 = sábado

    // Si es sábado o domingo
    if (diaSemana === 0 || diaSemana === 6) return {tipo: 'free', texto: 'Día libre'};

    // Feriados
    if (feriadosCR.includes(fechaStr)) return {tipo: 'holiday', texto: 'Feriado'};

    // Meses de clases (febrero-noviembre)
    if (month >= 1 && month <= 10) {
        if (ultimoMesTrimestre.includes(month)) {
            const semana = Math.ceil((day + new Date(year, month, 1).getDay()) / 7);
            if (semana === 1) return {tipo: 'exam-academica', texto: 'Examen académico'};
            if (semana === 2) return {tipo: 'exam-tecnica', texto: 'Examen técnico'};
            return {tipo: 'free', texto: 'Día libre'};
        } else {
            return {tipo: 'start-class', texto: 'Clases normales'};
        }
    }

    return {tipo: 'free', texto: 'Día libre'};
}

// Función para renderizar el calendario
function renderCalendar(date) {
    calendarioTable.innerHTML = '';
    const year = date.getFullYear();
    const month = date.getMonth();
    monthYearLabel.textContent = date.toLocaleString('es-ES', { month: 'long', year: 'numeric' });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    let row = document.createElement('tr');
    for(let i = 0; i < firstDay; i++) row.appendChild(document.createElement('td'));

    for(let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement('td');
        cell.textContent = day;

        const {tipo, texto} = getDiaTipo(year, month, day);
        cell.classList.add(tipo);
        cell.setAttribute('data-texto', texto); // para Tidio

        // Click para mostrar info del día
        cell.addEventListener('click', () => {
            infoDia.textContent = `Día ${day}/${month+1}/${year}: ${texto}`;
        });

        row.appendChild(cell);
        if ((row.children.length) === 7) {
            calendarioTable.appendChild(row);
            row = document.createElement('tr');
        }
    }
    if (row.children.length > 0) calendarioTable.appendChild(row);
}

// Botones de navegación
prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
});
nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
});

// Render inicial
renderCalendar(currentDate);

// ------------------------
// Funciones para Tidio
// ------------------------
window.tidioChatApi = window.tidioChatApi || [];

// Función para responder a un día específico
function responderDiaTidio(day, month, year) {
    const celdas = calendarioTable.querySelectorAll('td');
    let respuesta = "No se encontró información para ese día.";

    celdas.forEach(td => {
        if (parseInt(td.textContent) === day) {
            respuesta = `Día ${day}/${month}/${year}: ${td.getAttribute('data-texto')}`;
        }
    });

    window.tidioChatApi.push(['message', respuesta]);
}

// Ejemplo: para probar automáticamente el día 15 de septiembre 2025
// responderDiaTidio(15, 9, 2025);
