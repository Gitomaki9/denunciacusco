document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');

  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();

      if (!username || !password) {
        alert('Por favor, completa ambos campos.');
        return;
      }

      // Simulación de login exitoso
      console.log('Intento de login:', { username, password });

      // Aquí iría la conexión real con Supabase
      // Por ahora, simulamos éxito
      alert('✅ ¡Inicio de sesión exitoso!\n\nEn una versión real, esto conectaría con Supabase Auth.');

      // Redirigir al panel (puedes cambiar la página)
      // window.location.href = 'panel.html';

      // Opcional: Limpiar formulario
      // loginForm.reset();
    });
  }

  // Mensaje de bienvenida
  console.log('Página de login cargada correctamente');

  // Verificar que el botón Registrarse funciona
  const registroBtn = document.querySelector('.auth-btn-register');
  if (registroBtn) {
    console.log('Botón Registrarse encontrado, href:', registroBtn.href);
  }
});
