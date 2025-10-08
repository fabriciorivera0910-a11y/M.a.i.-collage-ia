// === Datos de materias (consultas) y profesores ===
const consultas = {
  "Matemáticas": ["Profesor 1", "Profesor 2", "Profesor 3"],
  "Química": ["Profesor 1", "Profesor 2", "Profesor 3"],
  "Física": ["Profesor 1", "Profesor 2", "Profesor 3"],
  "Biología": ["Profesor 1", "Profesor 2", "Profesor 3"],
  "Cívica": ["Profesor 1", "Profesor 2", "Profesor 3"],
  "Estudios Sociales": ["Profesor 1", "Profesor 2", "Profesor 3"],
  "Español": ["Profesor 1", "Profesor 2", "Profesor 3"],
  "Inglés": ["Profesor 1", "Profesor 2", "Profesor 3"],
  "Portugués": ["Profesor 1", "Profesor 2", "Profesor 3"],
  "Técnicas": ["Profesor 1", "Profesor 2", "Profesor 3"]
};

const dias = ["Lunes","Martes","Miércoles","Jueves","Viernes"];
const bloques = [
  { label:"Bloque 1", start:"07:00" },
  { label:"Bloque 2", start:"09:00" },
  { label:"Bloque 3", start:"12:00" },
  { label:"Bloque 4", start:"15:00" }
];
const leccionesPorBloque=5, duracionMin=20;
const STORAGE_KEY="maicollege_consultas";

let reservas=JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}");
const profesores=[];
Object.keys(consultas).forEach(c=>{
  consultas[c].forEach(p=>profesores.push({id:Math.random().toString(36).slice(2,9),consulta:c,nombre:p}));
});

function pad(n){return n.toString().padStart(2,"0");}
function addMinutes(t,m){let [h,mi]=t.split(":").map(Number);let d=new Date(2000,0,1,h,mi);d.setMinutes(d.getMinutes()+m);return pad(d.getHours())+":"+pad(d.getMinutes());}

function buildTime(start,slot){return addMinutes(start,slot*duracionMin);}
function nameById(id){const p=profesores.find(x=>x.id===id);return p?`${p.nombre} (${p.consulta})`:id;}

// DOM
const consultaSel=document.getElementById("consulta");
const profesorSel=document.getElementById("profesor");
const scheduleWrapper=document.getElementById("schedule-wrapper");
const infoResumen=document.getElementById("info-resumen");

function populateConsultas(){
  consultaSel.innerHTML="";
  Object.keys(consultas).forEach(c=>{
    let o=document.createElement("option");o.value=c;o.textContent=c;consultaSel.appendChild(o);
  });
}
function populateProfesores(consulta){
  profesorSel.innerHTML="";
  consultas[consulta].forEach(n=>{
    let obj=profesores.find(p=>p.nombre===n && p.consulta===consulta);
    let o=document.createElement("option");o.value=obj.id;o.textContent=obj.nombre;profesorSel.appendChild(o);
  });
}

function renderSchedule(profId){
  scheduleWrapper.innerHTML="";
  const table=document.createElement("table");table.className="schedule-table";
  let thead=document.createElement("thead"), tr=document.createElement("tr");
  tr.appendChild(document.createElement("th"));
  dias.forEach(d=>{let th=document.createElement("th");th.textContent=d;tr.appendChild(th);});
  thead.appendChild(tr);table.appendChild(thead);

  let tbody=document.createElement("tbody");
  for(let b=0;b<bloques.length;b++){
    for(let s=0;s<leccionesPorBloque;s++){
      let row=document.createElement("tr");
      let time=document.createElement("th");
      let start=buildTime(bloques[b].start,s), end=addMinutes(start,duracionMin);
      time.textContent=`${bloques[b].label} — ${start}-${end}`;row.appendChild(time);

      dias.forEach((d,diaIdx)=>{
        let td=document.createElement("td"), slot=document.createElement("div");
        slot.className="slot";let key=`${diaIdx}-${b}-${s}`;
        reservas[profId]=reservas[profId]||{};
        let rec=reservas[profId][key];
        if(rec&&rec.reserved){slot.classList.add(rec.by==="user"?"mine":"reserved");slot.textContent=rec.by==="user"?"Reservado (tú)":"Reservado";}
        else {slot.classList.add("free");slot.textContent="Libre";}
        slot.onclick=()=>{
          if(rec&&rec.reserved){
            if(rec.by==="user"&&confirm("¿Cancelar tu reserva?")){delete reservas[profId][key];save();renderSchedule(profId);}
            return;
          }
          if(confirm(`¿Reservar ${d}, ${bloques[b].label}, ${start}?`)){reservas[profId][key]={reserved:true,by:"user"};save();renderSchedule(profId);}
        };
        td.appendChild(slot);row.appendChild(td);
      });
      tbody.appendChild(row);
    }
  }
  table.appendChild(tbody);scheduleWrapper.appendChild(table);

  let map=reservas[profId]||{}, tot=dias.length*bloques.length*leccionesPorBloque;
  let res=Object.values(map).filter(r=>r.reserved).length;
  let mine=Object.values(map).filter(r=>r.by==="user").length;
  infoResumen.textContent=`Profesor: ${nameById(profId)} · Turnos totales: ${tot} · Reservados: ${res} · Tus reservas: ${mine}`;
}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(reservas));}

document.addEventListener("DOMContentLoaded",()=>{
  populateConsultas();populateProfesores(Object.keys(consultas)[0]);
  renderSchedule(profesorSel.options[0].value);
  consultaSel.onchange=e=>{populateProfesores(e.target.value);renderSchedule(profesorSel.value);};
  profesorSel.onchange=e=>renderSchedule(e.target.value);
  document.getElementById("mostrar-todo").onclick=()=>renderSchedule(profesorSel.value);
  document.getElementById("limpiar-reservas").onclick=()=>{
    let id=profesorSel.value;if(confirm("¿Eliminar tus reservas?")){for(let k in reservas[id])if(reservas[id][k].by==="user")delete reservas[id][k];save();renderSchedule(id);}
  };
  document.getElementById("btn-ai").onclick=()=>alert("M.A.I College AI — módulo de consultas");
});
