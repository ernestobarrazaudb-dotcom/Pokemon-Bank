/**
 * Lógica de inicialización de gráfico
 */
(function() {
    const renderChart = () => {
        const ctx = document.getElementById('graficaGastos');
        
        if (!ctx) {
            console.error("Error: No se encontró el canvas con ID 'graficaGastos'");
            return;
        }

        
        let chartStatus = Chart.getChart("graficaGastos");
        if (chartStatus !== undefined) {
            chartStatus.destroy();
        }

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Depósitos', 'Retiros', 'Electricidad', 'Agua Potable', 'Internet', 'Telefonía'],
                datasets: [{
                    label: 'Monto Mensual en USD ($)',
                    data: [500, 150, 65, 25, 40, 15],
                    backgroundColor: [
                        'rgba(59, 76, 202, 0.8)', // Azul
                        'rgba(204, 0, 0, 0.8)',   // Rojo
                        'rgba(255, 203, 5, 0.8)',  // Dorado
                        'rgba(42, 117, 187, 0.8)', 
                        'rgba(60, 90, 166, 0.8)',
                        'rgba(255, 222, 0, 0.8)'
                    ],
                    borderColor: '#000',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Dólares ($)' }
                    }
                }
            }
        });
    };

    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'complete') {
        renderChart();
    } else {
        window.addEventListener('load', renderChart);
    }
})();