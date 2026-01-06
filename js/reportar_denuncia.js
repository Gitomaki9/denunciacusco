// reportar_denuncia.js (corregido + listo para consulta por placa)
// Requisitos en tu HTML:
// - <form id="formInc"> ... </form>
// - inputs/selects con estos IDs:
//   fecha_incidente, categoria_id, placa, titulo, referencia_lugar, distrito,
//   departamento, provincia, descripcion, archivo
// - si usas mapa: hidden/inputs lat, lng (ids: lat, lng)
// - un elemento para mensajes: id="msg"
// - (opcional) sección consulta por placa:
//   input id="placaConsulta", boton id="btnConsultarPlaca", div id="resultadoPlaca"

const API_BASE = "http://localhost:3000";

const $ = (id) => document.getElementById(id);

function setMsg(text, kind = "muted") {
  const el = $("msg");
  if (!el) return;
  el.className = kind; // define clases en CSS: .muted .ok .error
  el.textContent = text || "";
}

function getUserFromStorage() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function hoyISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function normalizePlaca(p) {
  return String(p || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/[^A-Z0-9-]/g, "");
}

function validateRequired(fields) {
  for (const f of fields) {
    if (!f || !String(f.value || "").trim()) {
      return false;
    }
  }
  return true;
}

async function safeJson(res) {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  const txt = await res.text();
  return { ok: false, message: txt || "Respuesta no JSON" };
}

/* =========================
   1) REGISTRAR INCIDENCIA
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  // fecha por defecto
  const fechaEl = $("fecha_incidente");
  if (fechaEl && !fechaEl.value) fechaEl.value = hoyISO();

  const form = $("formInc");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setMsg("");

    // Traer elementos (evita variables no definidas como "fecha", "categoria", etc.)
    const fecha = $("fecha_incidente");
    const categoria = $("categoria_id");
    const placa = $("placa");
    const titulo = $("titulo");
    const referencia = $("referencia_lugar");
    const distrito = $("distrito");
    const departamento = $("departamento");
    const provincia = $("provincia");
    const descripcion = $("descripcion");
    const lat = $("lat");
    const lng = $("lng");
    const archivo = $("archivo");

    // Validación mínima (ajusta según tu BD)
    if (!validateRequired([fecha, titulo, referencia, distrito, descripcion])) {
      setMsg("Completa los campos obligatorios (fecha, título, referencia, distrito, descripción).", "error");
      return;
    }

    const fd = new FormData();
    fd.append("fecha_incidente", fecha.value);

    // categoria_id puede ser null
    if (categoria && categoria.value) fd.append("categoria_id", categoria.value);

    // placa opcional (normalizada)
    const placaNorm = normalizePlaca(placa?.value);
    if (placaNorm) fd.append("placa", placaNorm);

    fd.append("titulo", titulo.value.trim());
    fd.append("referencia_lugar", referencia.value.trim());
    fd.append("distrito", distrito.value.trim());

    // defaults Cusco si no existen inputs o están vacíos
    fd.append("departamento", (departamento?.value || "Cusco").trim());
    fd.append("provincia", (provincia?.value || "Cusco").trim());

    fd.append("descripcion", descripcion.value.trim());

    // coords opcional
    if (lat && String(lat.value || "").trim()) fd.append("lat", String(lat.value).trim());
    if (lng && String(lng.value || "").trim()) fd.append("lng", String(lng.value).trim());

    // usuario_id: null si anónimo
    const user = getUserFromStorage();
    fd.append("usuario_id", user?.id ? String(user.id) : "");

    // evidencia opcional
    if (archivo && archivo.files && archivo.files[0]) {
      fd.append("archivo", archivo.files[0]); // debe llamarse "archivo" para multer.single("archivo")
    }

    try {
      setMsg("Registrando reporte...", "muted");

      const res = await fetch(`${API_BASE}/incidencias`, {
        method: "POST",
        body: fd,
      });

      const data = await safeJson(res);

      if (!res.ok || !data.ok) {
        setMsg(data.message || `Error HTTP ${res.status}`, "error");
        return;
      }

      setMsg(`✅ Reporte registrado correctamente (ID: ${data.id}).`, "ok");

      // Opcional: autocompletar consulta por placa con la placa registrada
      const placaConsulta = $("placaConsulta");
      if (placaConsulta && placaNorm) placaConsulta.value = placaNorm;

      // Reset sin borrar fecha (la dejamos en hoy)
      form.reset();
      if (fechaEl) fechaEl.value = hoyISO();
    } catch (err) {
      console.error(err);
      setMsg("No se pudo conectar con el backend. Verifica que esté corriendo en http://localhost:3000", "error");
    }
  });
});

/* =========================
   2) CONSULTA POR PLACA
   =========================
   Backend recomendado:
   GET /incidencias/placa/:placa
   Respuesta ejemplo:
   { ok:true, reportado:true, total:2, incidencias:[...] }
*/
async function consultarPlaca() {
  const input = $("placaConsulta");
  const out = $("resultadoPlaca");

  if (!input) return;
  const placa = normalizePlaca(input.value);

  if (!placa) {
    if (out) out.textContent = "Ingresa una placa válida.";
    return;
  }

  if (out) out.textContent = "Consultando...";

  try {
    const res = await fetch(`${API_BASE}/incidencias/placa/${encodeURIComponent(placa)}`);
    const data = await safeJson(res);

    if (!res.ok || !data.ok) {
      if (out) out.textContent = data.message || `Error HTTP ${res.status}`;
      return;
    }

    if (data.reportado) {
      const total = data.total ?? (data.incidencias?.length ?? 0);
      if (out) out.textContent = `🚨 Placa ${placa} está REPORTADA. Registros: ${total}`;
    } else {
      if (out) out.textContent = `✅ Placa ${placa} NO tiene reportes.`;
    }
  } catch (err) {
    console.error(err);
    if (out) out.textContent = "No se pudo conectar al backend para consultar la placa.";
  }
}
const btnConsultar = document.getElementById("btnConsultarPlaca");
const placaConsulta = document.getElementById("placaConsulta");
const resultadoPlaca = document.getElementById("resultadoPlaca");

btnConsultar.addEventListener("click", async () => {
  const placa = placaConsulta.value.trim();

  if (!placa) {
    resultadoPlaca.textContent = "⚠️ Ingresa una placa válida.";
    resultadoPlaca.className = "error";
    return;
  }

  resultadoPlaca.textContent = "Consultando...";
  resultadoPlaca.className = "muted";

  try {
    const res = await fetch(`http://localhost:3000/incidencias/placa/${placa}`);
    const data = await res.json();

    if (!data.ok) {
      resultadoPlaca.textContent = "❌ No se pudo realizar la consulta.";
      resultadoPlaca.className = "error";
      return;
    }

    if (data.reportado) {
      resultadoPlaca.innerHTML = `
        🚨 <strong>PLACA REPORTADA</strong><br>
        Total reportes: ${data.total}
      `;
      resultadoPlaca.className = "error";
    } else {
      resultadoPlaca.textContent = "✅ La placa NO tiene reportes registrados.";
      resultadoPlaca.className = "ok";
    }

  } catch (err) {
    console.error(err);
    resultadoPlaca.textContent = "❌ Error de conexión con el servidor.";
    resultadoPlaca.className = "error";
  }
});
