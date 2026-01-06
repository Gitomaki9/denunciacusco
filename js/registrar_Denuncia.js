// Script extraído de registrar_Denuncia.html
document.addEventListener('DOMContentLoaded', () => {
  // Logout
  document.getElementById("logoutBtn")?.addEventListener("click", ()=>window.location.href="index.html");

  // Mapa de Cusco (si existe el contenedor)
  if (document.getElementById('mapContainer') && typeof L !== 'undefined') {
    const map = L.map('mapContainer').setView([-13.5171,-71.9784],15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{ attribution:'&copy; OpenStreetMap contributors', maxZoom:19 }).addTo(map);

    let marcador = null;
    map.on('click', function(e){
      if(marcador) map.removeLayer(marcador);
      marcador = L.marker(e.latlng).addTo(map)
        .bindPopup(`Ubicación seleccionada: ${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`)
        .openPopup();
    });
  }

  // Modales
  const modalVictima = document.getElementById("modalVictima");
  const modalDenunciado = document.getElementById("modalDenunciado");
  document.getElementById("btnVictima")?.addEventListener('click', ()=>modalVictima.style.display="flex");
  document.getElementById("btnDenunciado")?.addEventListener('click', ()=>modalDenunciado.style.display="flex");
  document.getElementById("closeVictima")?.addEventListener('click', ()=>modalVictima.style.display="none");
  document.getElementById("closeDenunciado")?.addEventListener('click', ()=>modalDenunciado.style.display="none");
  window.addEventListener('click', (e)=>{
    if(e.target==modalVictima) modalVictima.style.display="none";
    if(e.target==modalDenunciado) modalDenunciado.style.display="none";
  });

  // Mostrar campo "Otro" si se selecciona
  const tipoSelect = document.getElementById("tipo_incidente");
  const otroInput = document.getElementById("otro_incidente");
  if (tipoSelect) {
    tipoSelect.addEventListener("change", function(){
      if (otroInput) otroInput.style.display = (this.value==="otro") ? "block":"none";
    });
  }
});
