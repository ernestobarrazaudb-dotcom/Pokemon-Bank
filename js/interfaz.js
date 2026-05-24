/**
 * Módulo de Interfaz UI/UX - Pokémon Bank
 * Desarrollado por el Integrante 4 (Especialista en Interfaces e Interactividad)
 */

// Variable global para controlar la instancia del gráfico y evitar solapamientos
let graficoTransacciones = null;

/**
 * Reemplaza los alerts nativos con un diálogo estético de SweetAlert para operaciones exitosas.
 */
function mostrarAlertaExito(titulo, mensaje) {
    swal({
        title: titulo,
        text: mensaje,
        icon: "success",
        button: {
            text: "Entendido",
            value: true,
            visible: true,
            className: "btn-success-alert",
            closeModal: true,
        }
    });
}

/**
 * Reemplaza los alerts nativos con un diálogo estético de SweetAlert para errores o denegaciones.
 */
function mostrarAlertaError(titulo, mensaje) {
    swal({
        title: titulo,
        text: mensaje,
        icon: "error",
        button: {
            text: "Corregir",
            value: true,
            visible: true,
            className: "btn-error-alert",
            closeModal: true,
        }
    });
}

/**
 * Inicializa o actualiza el gráfico de barras utilizando Chart.js mapeando el LocalStorage.
 */
function renderizarGraficoTransacciones() {
    const ctx = document.getElementById('canvasGraficoTransacciones');
    if (!ctx) return; // Aborta si no está en la página de la gráfica

    // Recuperar el objeto de usuario de LocalStorage
    const datosUsuario = JSON.parse(localStorage.getItem('pokemon_bank_user'));
    
    // Cambiado de "conteo" a acumulación de dólares reales ($)
    let totalDepositos = 0;
    let totalRetiros = 0;
    let totalServicios = 0;

    // Sumar los montos de dinero reales guardados en el historial
    if (datosUsuario && datosUsuario.historial) {
        datosUsuario.historial.forEach(transaccion => {
            let monto = parseFloat(transaccion.monto) || 0;
            if (transaccion.tipo.toLowerCase() === 'deposito') {
                totalDepositos += monto;
            } else if (transaccion.tipo.toLowerCase() === 'retiro') {
                totalRetiros += monto;
            } else if (transaccion.tipo.toLowerCase() === 'pago servicio') {
                totalServicios += monto;
            }
        });
    }

    // Si ya existe un gráfico previo, se destruye para limpiar el lienzo
    if (graficoTransacciones !== null) {
        graficoTransacciones.destroy();
    }

    // Configuración y renderizado del nuevo gráfico mostrando Montos en USD
    graficoTransacciones = new Chart(ctx, {
        type: 'bar', 
        data: {
            labels: ['Depósitos ($)', 'Retiros ($)', 'Servicios ($)'],
            datasets: [{
                label: 'Monto Total Acumulado en USD ($)',
                data: [totalDepositos, totalRetiros, totalServicios],
                backgroundColor: [
                    'rgba(59, 76, 202, 0.7)',  // Azul Pokémon
                    'rgba(204, 0, 0, 0.7)',     // Rojo Pokémon
                    'rgba(255, 203, 5, 0.7)'    // Amarillo/Dorado Pokémon para Servicios
                ],
                borderColor: [
                    'rgba(59, 76, 202, 1)',
                    'rgba(204, 0, 0, 1)',
                    'rgba(255, 203, 5, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Dólares ($)'
                    }
                }
            }
        }
    });
}

// Disparar la carga del gráfico analítico una vez el DOM esté completamente listo
document.addEventListener('DOMContentLoaded', () => {
    renderizarGraficoTransacciones();
});