const API_BASE = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btnRegistrar");
  if (!btn) return;

  btn.addEventListener("click", async (e) => {
    e.preventDefault();

    const payload = {
      nombre_completo: document.getElementById("nombre_completo")?.value?.trim(),
      dni: document.getElementById("dni")?.value?.trim(),
      email: document.getElementById("email")?.value?.trim(),
      telefono: document.getElementById("telefono")?.value?.trim(),
      direccion: document.getElementById("direccion")?.value?.trim(),
      username: document.getElementById("username")?.value?.trim(),
      password: document.getElementById("password")?.value
    };

    // Validación rápida
    for (const k of Object.keys(payload)) {
      if (!payload[k]) {
        alert("Completa todos los campos para registrarte.");
        return;
      }
    }

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        alert(data.message || "No se pudo registrar.");
        return;
      }

      // Guardar sesión
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ Ir directo al panel único
      window.location.href = "./reportar_denuncia.html";
    } catch (err) {
      console.error(err);
      alert("No se pudo conectar con la API. ¿Backend encendido?");
    }
  });
});