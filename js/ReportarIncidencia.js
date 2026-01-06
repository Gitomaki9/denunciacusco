document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  const btn = document.getElementById("btnEnviar");
  const detalle = document.getElementById("detalle");

  btn?.addEventListener("click", () => {
    const titulo = document.getElementById("titulo").value;
    const categoria = document.getElementById("categoria").value;
    const descripcion = document.getElementById("descripcion").value;
    const imagenes = document.getElementById("imagenes").files;

    if (!titulo || !categoria || !descripcion) {
      alert("Completa todos los campos obligatorios.");
      return;
    }

    document.getElementById("d-titulo").textContent = titulo;
    document.getElementById("d-categoria").textContent = categoria;
    document.getElementById("d-descripcion").textContent = descripcion;

    const contenedor = document.getElementById("d-imagenes");
    if (contenedor) {
      contenedor.innerHTML = "";

      [...imagenes].forEach(file => {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        img.style.width = "150px";
        img.style.borderRadius = "10px";
        contenedor.appendChild(img);
      });
    }

    if (detalle) {
      detalle.style.display = "block";
      window.scrollTo(0, document.body.scrollHeight);
    }
  });

  window.cambiarEstado = function(estado) {
    const t = document.getElementById("estado-texto");
    if (!t) return;
    t.textContent = estado;

    if (estado === "Pendiente") t.style.color = "#b22222";
    else if (estado === "En proceso") t.style.color = "#d38a00";
    else t.style.color = "#008000";
  }
});
