// fix-paths.js
const fs = require('fs');
const path = require('path');

// Lista todos los archivos .html dentro de la carpeta /html/
const htmlDir = './html';
const htmlFiles = fs.readdirSync(htmlDir).filter(file => file.endsWith('.html'));

htmlFiles.forEach(fileName => {
    const filePath = path.join(htmlDir, fileName);
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Corregir rutas de CSS (href="css/...")
    content = content.replace(/href="css\//g, 'href="../css/');

    // 2. Corregir rutas de JS (src="js/...")
    content = content.replace(/src="js\//g, 'src="../js/');

    // 3. Corregir rutas de ASSETS (src="assets/...")
    // Esto cubre tanto /assets/ como /assets/images/
    content = content.replace(/src="assets\//g, 'src="../assets/');
    content = content.replace(/href="assets\//g, 'href="../assets/'); // Por si acaso

    // 4. (Opcional pero recomendado) Enlaces entre páginas HTML para Vercel
    // Cambia "pagina.html" por "/pagina" para URLs más limpias
    content = content.replace(/href="([^"#]+?)\.html"/g, 'href="/$1"');

    // Guarda los cambios en el archivo
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Corregido: ${fileName}`);
});

console.log('\n🎉 ¡Todos los archivos HTML han sido actualizados!');
console.log('Ahora ejecuta: git add html/ && git commit -m "Corregir rutas" && git push');
