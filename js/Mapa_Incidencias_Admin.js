// Script extraído de Mapa_Incidencias_Admin.html
const INCIDENTES = [
  { id:1052, fecha:'2024-04-20', estado:'Recibido',     tipo:'Accidente',           dir:'Av. El Sol 500',     lat:-13.5185, lng:-71.9769 },
  { id:1048, fecha:'2024-04-18', estado:'En proceso',   tipo:'Semáforo dañado',     dir:'Calle Pumacurco 210', lat:-13.5176, lng:-71.9740 },
  { id:1034, fecha:'2024-04-15', estado:'Solucionado',  tipo:'Mal estacionamiento', dir:'Jirón Santiago 320',  lat:-13.5240, lng:-71.9795 },
  { id:1027, fecha:'2024-04-13', estado:'Solucionado',  tipo:'Obstrucción de vía',  dir:'Calle Mantas 120',    lat:-13.5189, lng:-71.9799 },
  { id:1013, fecha:'2024-04-10', estado:'En proceso',   tipo:'Señal caída',         dir:'Av. Garcilaso 1204',  lat:-13.5226, lng:-71.9678 },
  { id:1009, fecha:'2024-04-08', estado:'Recibido',     tipo:'Accidente',           dir:'Calle Hospital 50',   lat:-13.5153, lng:-71.9752 },
  { id:1003, fecha:'2024-04-06', estado:'Recibido',     tipo:'Congestión',          dir:'Av. de la Cultura',   lat:-13.5220, lng:-71.9588 },
  { id:1001, fecha:'2024-04-05', estado:'Solucionado',  tipo:'Hueco en vía',        dir:'Urb. Ttio D-12',      lat:-13.5270, lng:-71.9487 }
];

const $ = (s,r=document)=>r.querySelector(s);
const colorByEstado = (e)=> e==='Recibido' ? '#dc2626' : e==='En proceso' ? '#f59e0b' : '#16a34a';
const chip = (e)=> {
  const cls = e==='Recibido' ? 'red' : e==='En proceso' ? 'yellow' : 'green';
  return `<span class="chip ${cls}">${e}</span>`;
};

function updateCounters(list){
  const rece = document.getElementById('c-reci');
  const proc = document.getElementById('c-proc');
  const solu = document.getElementById('c-solu');
  if(rece) rece.textContent = list.filter(x=>x.estado==='Recibido').length;
  if(proc) proc.textContent = list.filter(x=>x.estado==='En proceso').length;
  if(solu) solu.textContent = list.filter(x=>x.estado==='Solucionado').length;
}

function setDetalle(r){
  const dId = document.getElementById('d-id');
  const dFecha = document.getElementById('d-fecha');
  const dEstado = document.getElementById('d-estado');
  const dTipo = document.getElementById('d-tipo');
  const dDir = document.getElementById('d-dir');
  if(dId) dId.textContent = r ? r.id : '—';
  if(dFecha) dFecha.textContent = r ? r.fecha : '—';
  if(dEstado) dEstado.innerHTML = r ? chip(r.estado) : '—';
  if(dTipo) dTipo.textContent = r ? r.tipo : '—';
  if(dDir) dDir.textContent = r ? r.dir : '—';
}

let map, markersLayer;

function initMap(){
  map = L.map('map').setView([-13.518, -71.975], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);
  markersLayer = L.layerGroup().addTo(map);
}

function renderMarkers(list){
  markersLayer.clearLayers();
  if(!list || !list.length) return;

  const bounds = [];
  list.forEach(r=>{
    const marker = L.circleMarker([r.lat, r.lng], {
      radius: 9,
      color: '#111',
      weight: 1,
      fillColor: colorByEstado(r.estado),
      fillOpacity: .9
    })
    .bindPopup(`
      <b>ID ${r.id}</b><br>
      ${r.tipo}<br>
      ${r.dir}<br>
      ${chip(r.estado)} · ${r.fecha}
    `)
    .on('click', ()=> setDetalle(r));
    marker.addTo(markersLayer);
    bounds.push([r.lat, r.lng]);
  });

  if(bounds.length===1){ map.setView(bounds[0], 16); }
  else{ map.fitBounds(bounds, { padding:[24,24] }); }
}

function applyFilter(){
  const estadoEl = document.getElementById('fEstado');
  const estado = estadoEl ? estadoEl.value : 'TODOS';
  const filtered = estado==='TODOS' ? INCIDENTES : INCIDENTES.filter(x=>x.estado===estado);
  renderMarkers(filtered);
  updateCounters(filtered);
  setDetalle(filtered[0] || null);
}

window.addEventListener('DOMContentLoaded', ()=>{
  // logout handler
  const logoutBtn = document.getElementById('logoutBtn');
  if(logoutBtn) logoutBtn.addEventListener('click', ()=> window.location.href = 'index.html');

  initMap();
  const btnAplicar = document.getElementById('btnAplicar');
  if(btnAplicar) btnAplicar.addEventListener('click', applyFilter);
  const fEstado = document.getElementById('fEstado');
  if(fEstado) fEstado.addEventListener('change', applyFilter);
  applyFilter();
});
