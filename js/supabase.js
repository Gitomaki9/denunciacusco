// En /js/supabase.js - VERSIÓN CORREGIDA
const SUPABASE_URL = 'https://grchvnewfkakaqfkgbzy.supabase.co';  // CON COMILLAS
const SUPABASE_KEY = 'sb_publishable_bQZ1guTH9D2ByDwgMYGLfQ_g7bIsktc';  // CON COMILLAS

// Crear cliente de Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Exportar para usar en otros archivos
window.supabaseClient = supabase;

console.log('✅ Supabase configurado correctamente');
console.log('URL:', SUPABASE_URL);
