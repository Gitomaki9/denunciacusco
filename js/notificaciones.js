document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("logoutBtn")?.addEventListener("click", function() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      alert("Sesión cerrada correctamente.");
      window.location.href = "./index.html";
    }
  });

  document.querySelectorAll('.btn-mark-read').forEach(button => {
    button.addEventListener('click', function() {
      const notificationItem = this.closest('.notification-item');
      if (!notificationItem) return;

      // Cambiar a estado leído
      notificationItem.style.backgroundColor = '#f8f9fa';

      // Cambiar el botón por texto "Leída"
      const actions = notificationItem.querySelector('.notification-actions') || this.parentElement;
      actions.innerHTML = '<span style="color: #28a745; font-weight: 500;">✓ Leída</span>';

      alert('Notificación marcada como leída');
    });
  });
});
