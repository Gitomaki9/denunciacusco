// js/main.js - VERSIÓN MEJORADA Y SEGURA
console.log("✅ Cusco Reporta - Script principal cargado");

// ========== CONFIGURACIÓN POR PÁGINA ==========
const PAGE_CONFIG = {
  // Identificar en qué página estamos
  getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('iniciar-sesion')) return 'login';
    if (path.includes('registrar_tu_denuncia')) return 'denuncia';
    if (path.includes('perfil')) return 'perfil';
    if (path.includes('gestion_usuarios')) return 'gestion';
    if (path.includes('notificaciones')) return 'notificaciones';
    if (path.includes('panel')) return 'panel';
    return 'index';
  },

  // Configurar solo lo necesario para cada página
  initPage() {
    const page = this.getCurrentPage();
    console.log(`📄 Página detectada: ${page}`);

    switch(page) {
      case 'login':
        this.initLogin();
        break;
      case 'denuncia':
        this.initDenuncia();
        break;
      case 'perfil':
        this.initPerfil();
        break;
      case 'gestion':
        this.initGestionUsuarios();
        break;
      case 'notificaciones':
        this.initNotificaciones();
        break;
      case 'panel':
        this.initPanel();
        break;
      default:
        this.initGeneral();
    }
  },

  // ========== FUNCIONES ESPECÍFICAS POR PÁGINA ==========

  // LOGIN (compatible con Supabase)
  initLogin() {
    console.log('🔐 Inicializando página de login...');
    
    // Solo si NO hay Supabase (formulario tradicional)
    const form = document.querySelector("form");
    const hasSupabase = typeof supabase !== 'undefined';
    
    if (form && !hasSupabase) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        
        // Buscar campos de manera segura
        const usernameInput = document.getElementById("username");
        const passwordInput = document.getElementById("password");
        
        if (!usernameInput || !passwordInput) {
          console.warn('Campos de login no encontrados');
          return;
        }
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
          alert("Por favor, complete ambos campos.");
          return;
        }

        alert("¡Inicio de sesión exitoso!");
        window.location.href = "/panel";
      });
    } else if (hasSupabase) {
      console.log('✅ Login manejado por Supabase');
    }
  },

  // REGISTRAR DENUNCIA
  initDenuncia() {
    console.log('📍 Inicializando página de denuncias...');
    
    const mapContainer = document.getElementById('mapContainer');
    const btnMapa = document.getElementById('btnMapa');
    const form = document.getElementById('formDenuncia');

    if (btnMapa && mapContainer) {
      btnMapa.addEventListener('click', () => {
        mapContainer.textContent = 'Haga clic en el mapa para seleccionar ubicación';
        mapContainer.style.cursor = 'pointer';

        mapContainer.addEventListener('click', () => {
          mapContainer.textContent = 'Ubicación seleccionada ✓';
          mapContainer.style.backgroundColor = '#d4edda';
          mapContainer.style.color = '#155724';
          mapContainer.style.cursor = 'default';
        }, { once: true });
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Denuncia enviada correctamente. Recibirá un número de seguimiento.');
      });
    }
  },

  // PERFIL DE USUARIO
  initPerfil() {
    console.log('👤 Inicializando página de perfil...');
    
    const btnEditar = document.getElementById("btnEditarPerfil");
    const inputs = document.querySelectorAll(".campo-perfil");

    if (btnEditar && inputs.length > 0) {
      let modoEdicion = false;

      btnEditar.addEventListener("click", function() {
        modoEdicion = !modoEdicion;

        inputs.forEach(input => {
          input.disabled = !modoEdicion;
        });

        if (modoEdicion) {
          btnEditar.textContent = "Guardar Cambios";
          btnEditar.style.backgroundColor = "#004aad";
        } else {
          btnEditar.textContent = "Editar Perfil";
          btnEditar.style.backgroundColor = "#b22222";
          alert("Cambios guardados correctamente ✅");
        }
      });
    }
  },

  // GESTIÓN DE USUARIOS (solo en esa página)
  initGestionUsuarios() {
    console.log('👥 Inicializando gestión de usuarios...');
    
    const tabla = document.querySelector("#tablaUsuarios tbody");
    if (!tabla) return;

    const usuarios = [
      { id: 1, nombre: "Jose Pérez", correo: "joseperez@mail.com", rol: "Ciudadano" },
      { id: 2, nombre: "Ana Torres", correo: "ana.torres@mail.com", rol: "Administrador" },
      { id: 3, nombre: "Luis Gómez", correo: "luis.gomez@mail.com", rol: "Ciudadano" },
      { id: 4, nombre: "María Vargas", correo: "maria.vargas@mail.com", rol: "Moderador" }
    ];

    function renderUsuarios() {
      tabla.innerHTML = "";
      usuarios.forEach(user => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td style="padding:10px; border-bottom:1px solid #eee;">${user.id}</td>
          <td style="padding:10px; border-bottom:1px solid #eee;">${user.nombre}</td>
          <td style="padding:10px; border-bottom:1px solid #eee;">${user.correo}</td>
          <td style="padding:10px; border-bottom:1px solid #eee;">${user.rol}</td>
          <td style="padding:10px; border-bottom:1px solid #eee;">
            <button class="btn btn-editar" data-id="${user.id}" style="margin-right:8px; background-color:#004aad;">Editar</button>
            <button class="btn btn-eliminar" data-id="${user.id}" style="background-color:#8b0000;">Eliminar</button>
          </td>
        `;
        tabla.appendChild(fila);
      });
      asignarEventos();
    }

    function asignarEventos() {
      document.querySelectorAll(".btn-editar").forEach(btn => {
        btn.addEventListener("click", e => {
          const id = e.target.dataset.id;
          const user = usuarios.find(u => u.id == id);
          const nuevoNombre = prompt("Editar nombre:", user.nombre);
          const nuevoRol = prompt("Editar rol:", user.rol);
          if (nuevoNombre && nuevoRol) {
            user.nombre = nuevoNombre;
            user.rol = nuevoRol;
            alert("Usuario actualizado correctamente.");
            renderUsuarios();
          }
        });
      });

      document.querySelectorAll(".btn-eliminar").forEach(btn => {
        btn.addEventListener("click", e => {
          const id = e.target.dataset.id;
          if (confirm("¿Seguro que deseas eliminar este usuario?")) {
            const index = usuarios.findIndex(u => u.id == id);
            usuarios.splice(index, 1);
            alert("🗑️ Usuario eliminado.");
            renderUsuarios();
          }
        });
      });
    }

    renderUsuarios();
  },

  // NOTIFICACIONES
  initNotificaciones() {
    console.log('🔔 Inicializando notificaciones...');
    
    // Agregar event listeners a los botones de marcar como leído
    document.querySelectorAll('.btn-mark-read').forEach(button => {
      button.addEventListener('click', function() {
        const notificationItem = this.closest('.notification-item');
        this.markAsRead(notificationItem);
      });
    });
    
    // Agregar métodos al contexto
    this.markAsRead = function(notificationItem) {
      notificationItem.classList.add('read');
      const actions = notificationItem.querySelector('.notification-actions');
      if (actions) {
        actions.innerHTML = '<span class="read-status">Leída</span>';
      }
      this.updateNotificationCount();
    };
    
    this.updateNotificationCount = function() {
      const unreadCount = document.querySelectorAll('.notification-item:not(.read)').length;
      console.log('Notificaciones no leídas:', unreadCount);
    };
  },

  // PANEL ADMIN
  initPanel() {
    console.log('⚙️ Inicializando panel...');
    // Código específico para panel.html
  },

  // GENERAL (para todas las páginas)
  initGeneral() {
    console.log('🌐 Inicializando funcionalidades generales...');
    
    // Cerrar sesión (si existe el botón)
    const logoutBtn = document.querySelector(".logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        alert("Sesión cerrada correctamente.");
        window.location.href = "/";
      });
    }
    
    // Navegación suave para enlaces internos (#)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }
};

// ========== INICIALIZACIÓN SEGURA ==========
document.addEventListener("DOMContentLoaded", () => {
  try {
    PAGE_CONFIG.initPage();
  } catch (error) {
    console.error("❌ Error al inicializar página:", error);
  }
});

// ========== FUNCIONES GLOBALES ÚTILES ==========

// Función para verificar si estamos en mobile
function isMobile() {
  return window.innerWidth <= 768;
}

// Función para formatear fecha
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Función para mostrar mensajes
function showMessage(message, type = 'info') {
  const colors = {
    success: '#4CAF50',
    error: '#f44336',
    info: '#2196F3',
    warning: '#ff9800'
  };
  
  // Crear elemento de mensaje
  const messageDiv = document.createElement('div');
  messageDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background: ${colors[type] || colors.info};
    color: white;
    border-radius: 5px;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    animation: slideIn 0.3s ease;
  `;
  
  messageDiv.textContent = message;
  document.body.appendChild(messageDiv);
  
  // Remover después de 5 segundos
  setTimeout(() => {
    messageDiv.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => messageDiv.remove(), 300);
  }, 5000);
}

// Estilos CSS para animaciones
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);

// Exportar funciones útiles para uso en otros scripts
if (typeof window !== 'undefined') {
  window.CuscoReporta = {
    formatDate,
    showMessage,
    isMobile,
    getCurrentPage: PAGE_CONFIG.getCurrentPage.bind(PAGE_CONFIG)
  };
}
