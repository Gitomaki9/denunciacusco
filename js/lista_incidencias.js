(() => {
  const API_BASE = "http://localhost:3000";

  // Elements
  const elNombre = document.getElementById("nombreUsuario");
  const elRol = document.getElementById("rolUsuario");
  const elLogout = document.getElementById("logoutBtn");

  const elDesde = document.getElementById("fecha-inicio");
  const elHasta = document.getElementById("fecha-fin");
  const elEstado = document.getElementById("estado");

  const elBuscar = document.getElementById("btnBuscar");
  const elLimpiar = document.getElementById("btnLimpiar");

  const elTotal = document.getElementById("totalInc");
  const elCarga = document.getElementById("estadoCarga");
  const elTbody = document.getElementById("tbodyInc");

  const modal = document.getElementById("modalDetalle");
  const modalClose = document.getElementById("modalClose");
  const modalBody = document.getElementById("modalBody");

  function setUserSidebar() {
    try {
      const userRaw = localStorage.getItem("user");
      if (!userRaw) {
        elNombre.textContent = "Invitado";
        elRol.textContent = "—";
        return;
      }
      const user = JSON.parse(userRaw);
      elNombre.textContent = user.nombre_completo || user.username || "Usuario";
      elRol.textContent = (user.rol_id === 2) ? "Administrador" : "Ciudadano";
    } catch {
      elNombre.textContent = "Invitado";
      elRol.textContent = "—";
    }
  }

  function formatoFecha(fechaIso) {
    if (!fechaIso) return "—";
    const d = new Date(fechaIso);
    if (isNaN(d.getTime())) return String(fechaIso);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  function badgeEstado(row) {
    const code = String(row.estado_codigo || "").toUpperCase();
    if (code.includes("SOLUC")) return { text: row.estado_nombre || "SOLUCIONADO", cls: "status-solucionado" };
    if (code.includes("PROCES")) return { text: row.estado_nombre || "EN PROCESO", cls: "status-proceso" };
    return { text: row.estado_nombre || "REPORTE", cls: "status-reporte" };
  }

  function ubicacion(row) {
    const parts = [
      row.referencia_lugar,
      row.distrito,
      row.provincia,
      row.departamento
    ].filter(Boolean);
    return parts.join(" / ") || "—";
  }

  function escapeHtml(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function setLoading(msg) {
    elCarga.textContent = msg;
  }

  function renderEmpty(msg) {
    elTbody.innerHTML = `<tr><td colspan="8" class="muted">${escapeHtml(msg)}</td></tr>`;
  }

  function openModal(row) {
    const loc = ubicacion(row);
    modalBody.innerHTML = `
      <p><strong>ID:</strong> ${escapeHtml(row.id)}</p>
      <p><strong>Fecha:</strong> ${escapeHtml(formatoFecha(row.fecha_incidente))}</p>
      <p><strong>Tipo:</strong> ${escapeHtml(row.tipo_registro || "—")}</p>
      <p><strong>Categoría:</strong> ${escapeHtml(row.categoria || "—")}</p>
      <p><strong>Título:</strong> ${escapeHtml(row.titulo || "—")}</p>
      <p><strong>Ubicación:</strong> ${escapeHtml(loc)}</p>
      <p><strong>Descripción:</strong><br>${escapeHtml(row.descripcion || "—")}</p>
      <p class="muted"><strong>Coords:</strong> ${escapeHtml(row.latitud)} , ${escapeHtml(row.longitud)}</p>
    `;
    modal.style.display = "flex";
  }

  function closeModal() {
    modal.style.display = "none";
  }

  async function cargarIncidencias() {
    const params = new URLSearchParams();

    const desde = elDesde.value;
    const hasta = elHasta.value;
    const estado = elEstado.value; // todos|reporte|proceso|solucionado

    if (desde) params.set("desde", desde);
    if (hasta) params.set("hasta", hasta);
    if (estado) params.set("estado", estado);

    setLoading("Cargando...");
    elTotal.textContent = "0";
    renderEmpty("Cargando incidencias...");

    try {
      const url = `${API_BASE}/incidencias?${params.toString()}`;
      const res = await fetch(url);

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        const msg = data.message || `No se pudo cargar: Error HTTP ${res.status}`;
        setLoading("Error");
        renderEmpty(msg);
        return;
      }

      const rows = Array.isArray(data.incidencias) ? data.incidencias : [];
      elTotal.textContent = String(data.total ?? rows.length);
      setLoading("Listo");

      if (!rows.length) {
        renderEmpty("No hay incidencias para los filtros seleccionados.");
        return;
      }

      elTbody.innerHTML = "";

      for (const row of rows) {
        const st = badgeEstado(row);
        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td>${escapeHtml(row.id)}</td>
          <td>${escapeHtml(formatoFecha(row.fecha_incidente))}</td>
          <td>${escapeHtml(row.tipo_registro || "—")}</td>
          <td>${escapeHtml(row.categoria || "—")}</td>
          <td>${escapeHtml(row.titulo || "—")}</td>
          <td>${escapeHtml(ubicacion(row))}</td>
          <td><span class="status-badge ${st.cls}">${escapeHtml(st.text)}</span></td>
          <td><button class="link-btn" type="button">Ver</button></td>
        `;

        tr.querySelector("button").addEventListener("click", () => openModal(row));
        elTbody.appendChild(tr);
      }
    } catch (err) {
      console.error(err);
      setLoading("Error");
      renderEmpty("No se pudo conectar a la API. Verifica que tu backend esté corriendo en http://localhost:3000");
    }
  }

  function initFechasDefault() {
    // últimos 30 días
    const hoy = new Date();
    const inicio = new Date();
    inicio.setDate(hoy.getDate() - 30);

    elDesde.value = inicio.toISOString().slice(0, 10);
    elHasta.value = hoy.toISOString().slice(0, 10);
  }

  // INIT
  document.addEventListener("DOMContentLoaded", () => {
    setUserSidebar();
    initFechasDefault();

    elBuscar.addEventListener("click", cargarIncidencias);

    elLimpiar.addEventListener("click", () => {
      elEstado.value = "todos";
      initFechasDefault();
      cargarIncidencias();
    });

    // opcional: cargar automáticamente cuando cambias estado
    elEstado.addEventListener("change", cargarIncidencias);

    elLogout.addEventListener("click", () => {
      if (confirm("¿Estás seguro de que quieres cerrar sesión?")) {
        localStorage.clear();
        window.location.href = "index.html";
      }
    });

    modalClose.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    // primera carga
    cargarIncidencias();
  });
})();