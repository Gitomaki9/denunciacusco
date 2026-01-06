import { supabase } from './supabase.js'

// Verificar autenticación (se usa en TODAS las páginas)
export async function verificarAutenticacion(redirigirSiNoAuth = true) {
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    if (redirigirSiNoAuth) {
      window.location.href = '/iniciar-sesion'
    }
    return null
  }
  
  return user
}

// Cerrar sesión
export async function cerrarSesion() {
  const { error } = await supabase.auth.signOut()
  if (!error) window.location.href = '/'
}

// Obtener perfil del usuario
export async function obtenerPerfilUsuario() {
  const user = await verificarAutenticacion(false)
  if (!user) return null
  
  const { data, error } = await supabase
    .from('perfiles')
    .select('*')
    .eq('id', user.id)
    .single()
    
  return error ? null : data
}
