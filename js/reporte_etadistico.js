// Scripts extraídos de reporte_etadistico.html
// Requires Chart.js (already included via CDN in the HTML)

// Gráfico de Barras
const barCtx = document.getElementById('barChart')?.getContext('2d');
if (barCtx) {
  const barChart = new Chart(barCtx, {
    type: 'bar',
    data: {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      datasets: [{
        label: 'Reportes Mensuales',
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: 'rgba(148, 42, 42, 0.7)',
        borderColor: 'rgba(148, 42, 42, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Mapa de Calor (simulado con gráfico de área)
const heatmapCtx = document.getElementById('heatmap')?.getContext('2d');
if (heatmapCtx) {
  const gradient = heatmapCtx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, 'rgba(148, 42, 42, 0.8)');
  gradient.addColorStop(0.5, 'rgba(200, 100, 100, 0.6)');
  gradient.addColorStop(1, 'rgba(255, 200, 200, 0.4)');

  const heatmap = new Chart(heatmapCtx, {
    type: 'line',
    data: {
      labels: ['Centro', 'San Blas', 'Wanchaq', 'Santiago', 'San Sebastián', 'Magisterio'],
      datasets: [{
        label: 'Concentración de Reportes',
        data: [85, 70, 60, 45, 30, 25],
        backgroundColor: gradient,
        borderColor: 'rgba(148, 42, 42, 1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Descargar PDF
document.getElementById("downloadPdf")?.addEventListener("click", function() {
  alert("Generando reporte en PDF...");
});

// Cerrar sesión
document.getElementById("logoutBtn")?.addEventListener("click", function() {
  if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
    alert("Sesión cerrada correctamente.");
    window.location.href = "../index.html";
  }
});
