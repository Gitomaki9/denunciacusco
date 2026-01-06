# CUSCO_REPORTA
Sistema de Información Web para Reporte y Seguimiento de Incidencias de Tránsito Vehicular en Cusco

---
## Estructura del proyecto

<br> Cusco Reporta/ <br> ├── assets/ <br> │ └── images/ <br> ├── js/ <br> ├── css/ <br> └── html/ <br>

### Detalle

- **`assets/`**  
  Carpeta donde se almacenan recursos estáticos que no son código, como imágenes, iconos y otros archivos multimedia.  
  - **`images/`**: Aquí se guardan todas las imágenes del proyecto, como logos, fotos, iconos, etc.

- **`js/`**  
  Carpeta destinada a todos los archivos JavaScript. Aquí va el código que agrega funcionalidad e interactividad a las páginas web.

- **`css/`**  
  Carpeta para los archivos de estilos CSS. Aquí se definen los estilos visuales de la página, como colores, tipografías, tamaños, diseño y responsividad.

- **`html/`**  
  Carpeta que contiene todos los archivos HTML, que representan la estructura y contenido de las páginas web del proyecto.

## Cómo ejecutar el proyecto

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Alacops/CUSCO_REPORTA.git
   cd CUSCO_REPORTA/Frontend
2. Abrir en VS Code
Menú → File → Open Folder… → selecciona CUSCO_REPORTA.

3. Instalar Live Server (una sola vez)
En VS Code, abre la pestaña de Extensiones (Ctrl+Shift+X).
Busca e instala: Live Server – Ritwick Dey.

4. Ejecutar
Abre html/index.html.
Clic derecho → Open with Live Server.
Se abrirá en el navegador:

Colaboración (flujo de trabajo)

a.-Actualizar antes de trabajar

git pull origin main

b.-Crear una rama personal

git checkout -b feature/nombre-del-avance

c.-Subir tus cambios

git add .
git commit -m "feat: descripción breve del avance"
git push -u origin feature/nombre-del-avance

d.-Crear un Pull Request en GitHub

Ir a la pestaña Pull requests → New pull request
Comparar tu rama con main
Agregar descripción breve y enviar para revisión
