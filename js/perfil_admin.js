// Script para perfil_admin: manejar cierre de sesión
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("logoutBtn")?.addEventListener("click", function() {
    window.location.href = "index.html";
  });
});
