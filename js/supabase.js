// js/supabase.js - Configuración con TUS credenciales
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// TUS CREDENCIALES
const supabaseUrl = 'https://mjxpehxsvfqjhbcyjxfz.supabase.co'
const supabaseAnonKey = 'sb_publishable_duVjfb3TokLpuSoP2gto4Q_tkUpDoc_'

// Crear cliente Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Exportaciones
export { supabase }
export default supabase

// Funciones útiles
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}
