// Script extraído de Estado_Reporte.html
document.addEventListener('DOMContentLoaded', ()=>{
  const logoutBtn = document.getElementById("logoutBtn");
  if(logoutBtn) logoutBtn.addEventListener('click', ()=> window.location.href = 'index.html');

  const DATA = [
    { id:1052, fecha:'2024-04-20', dir:'Av. El Sol 500', tipo:'Accidente', estado:'Recibido', desc:'Colisión leve, sin heridos.', lat:-13.5185, lng:-71.9769 },
    { id:1048, fecha:'2024-04-18', dir:'Calle Pumacurco 210', tipo:'Semáforo dañado', estado:'En proceso', desc:'Semáforo intermitente.', lat:-13.5176, lng:-71.9740 },
    { id:1034, fecha:'2024-04-15', dir:'Jirón Santiago 320', tipo:'Mal estacionamiento', estado:'Solucionado', desc:'Vehículo removido.', lat:-13.5240, lng:-71.9795 },
    { id:1027, fecha:'2024-04-13', dir:'Calle Mantas 120', tipo:'Obstrucción de vía', estado:'Solucionado', desc:'Limpieza de escombros completada.', lat:-13.5189, lng:-71.9799 },
    { id:1013, fecha:'2024-04-10', dir:'Av. Garcilaso 1204', tipo:'Señal caída', estado:'En proceso', desc:'Cuadrilla en camino.', lat:-13.5226, lng:-71.9678 },
    { id:1009, fecha:'2024-04-08', dir:'Calle Hospital 50', tipo:'Accidente', estado:'Recibido', desc:'Atención policial solicitada.', lat:-13.5153, lng:-71.9752 },
  ];

  const $ = (s,r=document)=>r.querySelector(s);
  const tbody = $('#tabla tbody');

  const tag = (estado)=>{
    const cls = estado==='Recibido' ? 'rojo' : estado==='En proceso' ? 'amarillo' : 'verde';
    return `<span class="tag ${cls}">${estado}</span>`;
  };

  let selectedId = null;
  function renderRows(list){
    tbody.innerHTML = list.map(r=>`
      <tr data-id="${r.id}">
        <td>${r.id}</td>
        <td>${r.fecha}</td>
        <td>${r.dir}</td>
        <td>${r.tipo}</td>
        <td>${tag(r.estado)}</td>
      </tr>`).join('');

    tbody.querySelectorAll('tr').forEach(tr=>{
      tr.addEventListener('click', ()=>{
        selectedId = Number(tr.dataset.id);
        tbody.querySelectorAll('tr').forEach(x=>x.classList.toggle('selected', Number(x.dataset.id)===selectedId));
        const row = DATA.find(x=>x.id===selectedId);
        showDetail(row);
      });
    });
  }

  let map, marker;
  function initMap(){
    if(typeof L === 'undefined') return;
    map = L.map('map', { zoomControl: true }).setView([-13.517, -71.978], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom:19, attribution:'&copy; OpenStreetMap' }).addTo(map);
    marker = L.marker([-13.517, -71.978]).addTo(map);
  }

  function showDetail(r){
    if(!r){ return; }
    $('#d-id').textContent    = r.id;
    $('#d-fecha').textContent = r.fecha;
    $('#d-estado').innerHTML  = tag(r.estado);
    $('#d-tipo').textContent  = r.tipo;
    $('#d-dir').textContent   = r.dir;
    $('#d-desc').textContent  = r.desc;

    if(map){
      map.setView([r.lat, r.lng], 16, { animate:true });
      marker.setLatLng([r.lat, r.lng]).bindPopup(`<b>ID ${r.id}</b><br>${r.tipo}<br>${r.dir}`).openPopup();
    }
  }

  function applyFilters(){
    const d = $('#fDesde').value;
    const h = $('#fHasta').value;
    const e = $('#fEstado').value;
    const q = $('#buscar').value.trim().toLowerCase();
    let list = DATA.slice();
    if(d) list = list.filter(x=>x.fecha >= d);
    if(h) list = list.filter(x=>x.fecha <= h);
    if(e!=='TODOS') list = list.filter(x=>x.estado===e);
    if(q) list = list.filter(x=>String(x.id).includes(q)||x.dir.toLowerCase().includes(q)||x.tipo.toLowerCase().includes(q));
    renderRows(list);
    if(list.length){
      selectedId=list[0].id;
      const first = tbody.querySelector('tr[data-id="'+selectedId+'"]');
      if(first) first.classList.add('selected');
      showDetail(list[0]);
    } else {
      selectedId=null;
      $('#d-id').textContent='—'; $('#d-fecha').textContent='—';
      $('#d-estado').textContent='—'; $('#d-tipo').textContent='—';
      $('#d-dir').textContent='—'; $('#d-desc').textContent='—';
    }
  }

  window.addEventListener('DOMContentLoaded', ()=>{
    initMap();
    const btn = document.getElementById('btnFiltrar'); if(btn) btn.addEventListener('click', applyFilters);
    const buscar = document.getElementById('buscar'); if(buscar) buscar.addEventListener('input', applyFilters);
    const fDesde = document.getElementById('fDesde'); if(fDesde) fDesde.addEventListener('change', applyFilters);
    const fHasta = document.getElementById('fHasta'); if(fHasta) fHasta.addEventListener('change', applyFilters);
    const fEstado = document.getElementById('fEstado'); if(fEstado) fEstado.addEventListener('change', applyFilters);
    applyFilters();
  });
});
