import { supabase } from './supabase.js'
import { verificarAutenticacion } from './auth.js'

// Variables globales del módulo
let mapa = null
let marcador = null
let coordenadasSeleccionadas = null

// Inicializar formulario
export async function inicializarFormularioDenuncia() {
  console.log('📋 Inicializando formulario de denuncia')
  
  // Verificar autenticación
  const usuario = await verificarAutenticacion()
  if (!usuario) return
  
  // Configurar fecha actual
  const fechaInput = document.getElementById('fecha')
  if (fechaInput) {
    fechaInput.value = new Date().toISOString().split('T')[0]
  }
  
  // Inicializar mapa
  inicializarMapa()
  
  // Configurar eventos
  configurarEventosFormulario()
  
  // Configurar eventos de modales
  configurarModales()
  
  // Mostrar nombre del usuario
  actualizarSidebarUsuario(usuario)
}

// Inicializar mapa
function inicializarMapa() {
  const mapContainer = document.getElementById('mapContainer')
  if (!mapContainer) {
    console.warn('❌ No se encontró el contenedor del mapa')
    return
  }
  
  mapa = L.map('mapContainer').setView([-13.5171, -71.9784], 15)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(mapa)
  
  mapa.on('click', function(e) {
    if (marcador) mapa.removeLayer(marcador)
    
    marcador = L.marker(e.latlng).addTo(mapa)
      .bindPopup(`📍 Ubicación seleccionada<br>Lat: ${e.latlng.lat.toFixed(5)}<br>Lng: ${e.latlng.lng.toFixed(5)}`)
      .openPopup()
    
    coordenadasSeleccionadas = {
      latitud: e.latlng.lat,
      longitud: e.latlng.lng
    }
  })
}

// Configurar eventos del formulario
function configurarEventosFormulario() {
  const formDenuncia = document.getElementById('formDenuncia')
  if (!formDenuncia) return
  
  formDenuncia.addEventListener('submit', manejarSubmitFormulario)
  
  // Campo "Otro" para tipo de incidente
  const tipoSelect = document.getElementById('tipo_incidente')
  const otroInput = document.getElementById('otro_incidente')
  
  if (tipoSelect && otroInput) {
    tipoSelect.addEventListener('change', function() {
      otroInput.style.display = this.value === 'otro' ? 'block' : 'none'
      if (this.value !== 'otro') otroInput.value = ''
    })
  }
}

// Manejar envío del formulario
async function manejarSubmitFormulario(e) {
  e.preventDefault()
  
  if (!coordenadasSeleccionadas) {
    alert('⚠️ Por favor, selecciona una ubicación en el mapa')
    return
  }
  
  const datos = obtenerDatosFormulario()
  if (!validarDatos(datos)) return
  
  await enviarDenuncia(datos)
}

// Obtener datos del formulario
function obtenerDatosFormulario() {
  return {
    fecha_incidente: document.getElementById('fecha').value,
    departamento: document.getElementById('departamento').value,
    provincia: document.getElementById('provincia').value,
    distrito: document.getElementById('distrito').value,
    referencia: document.getElementById('referencia').value,
    tipo_incidente: obtenerTipoIncidente(),
    descripcion_hechos: document.getElementById('hechos').value,
    latitud: coordenadasSeleccionadas.latitud,
    longitud: coordenadasSeleccionadas.longitud,
    victima_nombre: '',
    victima_dni: '',
    victima_telefono: '',
    denunciado_nombre: '',
    denunciado_dni: '',
    denunciado_telefono: ''
  }
}

function obtenerTipoIncidente() {
  const select = document.getElementById('tipo_incidente')
  const otroInput = document.getElementById('otro_incidente')
  
  if (select.value === 'otro' && otroInput.value.trim()) {
    return otroInput.value.trim()
  }
  return select.value
}

function validarDatos(datos) {
  const camposRequeridos = [
    'fecha_incidente', 'departamento', 'provincia', 
    'distrito', 'tipo_incidente', 'descripcion_hechos'
  ]
  
  for (const campo of camposRequeridos) {
    if (!datos[campo] || datos[campo] === 'Seleccione') {
      alert(`⚠️ Por favor, completa el campo: ${campo}`)
      return false
    }
  }
  
  if (datos.descripcion_hechos.length < 10) {
    alert('⚠️ La descripción debe tener al menos 10 caracteres')
    return false
  }
  
  return true
}

async function enviarDenuncia(datos) {
  try {
    const usuario = await verificarAutenticacion(false)
    if (!usuario) {
      alert('❌ Debes iniciar sesión')
      window.location.href = '/iniciar-sesion'
      return
    }
    
    // Mostrar loading
    const btnSubmit = document.querySelector('#formDenuncia .btn-principal')
    const textoOriginal = btnSubmit.textContent
    btnSubmit.textContent = 'Enviando denuncia...'
    btnSubmit.disabled = true
    
    // Agregar usuario_id
    datos.usuario_id = usuario.id
    
    // Insertar en Supabase
    const { data, error } = await supabase
      .from('denuncias')
      .insert([datos])
      .select()
    
    if (error) throw error
    
    // Éxito
    alert(`✅ Denuncia registrada exitosamente\nID: ${data[0].id.substring(0, 8)}`)
    
    // Limpiar formulario
    document.getElementById('formDenuncia').reset()
    if (marcador) mapa.removeLayer(marcador)
    coordenadasSeleccionadas = null
    
    // Redirigir después de 2 segundos
    setTimeout(() => {
      window.location.href = '/lista_incidencias'
    }, 2000)
    
  } catch (error) {
    console.error('❌ Error al enviar denuncia:', error)
    alert(`❌ Error: ${error.message}`)
  } finally {
    // Restaurar botón
    const btnSubmit = document.querySelector('#formDenuncia .btn-principal')
    if (btnSubmit) {
      btnSubmit.textContent = 'Aceptar'
      btnSubmit.disabled = false
    }
  }
}

// Configurar modales
function configurarModales() {
  const modalVictima = document.getElementById('modalVictima')
  const modalDenunciado = document.getElementById('modalDenunciado')
  
  if (!modalVictima || !modalDenunciado) return
  
  document.getElementById('btnVictima').onclick = () => modalVictima.style.display = 'flex'
  document.getElementById('btnDenunciado').onclick = () => modalDenunciado.style.display = 'flex'
  
  document.getElementById('closeVictima').onclick = () => modalVictima.style.display = 'none'
  document.getElementById('closeDenunciado').onclick = () => modalDenunciado.style.display = 'none'
  
  window.onclick = (e) => {
    if (e.target === modalVictima) modalVictima.style.display = 'none'
    if (e.target === modalDenunciado) modalDenunciado.style.display = 'none'
  }
}

// Actualizar sidebar con info del usuario
function actualizarSidebarUsuario(usuario) {
  const nombreElement = document.querySelector('.sidebar__info h3')
  if (nombreElement && usuario.user_metadata?.nombre_completo) {
    nombreElement.textContent = usuario.user_metadata.nombre_completo
  }
}
