/**
 * Controlador Dinámico para el Historial de Transacciones
 * Pokémon Bank 
 */

function cargarHistorialTabla() {
    const cuerpoTabla = document.querySelector("table tbody");
    if (!cuerpoTabla) return; 

    // 💡 CIENCIA EMPÍRICA: Jalamos directamente el usuario real con su historial mapeado
    const datosUsuario = JSON.parse(localStorage.getItem('pokemon_bank_user'));

    // Si la base de datos local está limpia o el historial no tiene nada, tira la pokebola gris
    if (!datosUsuario || !datosUsuario.historial || datosUsuario.historial.length === 0) {
        cuerpoTabla.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-muted py-4">
                    <br>
                    <img src="img/pokebola-gris.png" style="width: 40px; opacity: 0.5;">
                    <p class="mt-2">No se registran movimientos recientes en su cuenta.</p>
                </td>
            </tr>`;
        return;
    }

    // Limpiar por completo el contenedor antes de inyectar las filas reales
    cuerpoTabla.innerHTML = "";

    // Mapear e inyectar cada fila en orden inverso (la transacción más nueva se va para arriba)
    datosUsuario.historial.slice().reverse().forEach(movimiento => {
        const row = document.createElement("tr");
        
        // Control de colores y signos de pisto según la operación
        let colorMonto = "text-dark";
        let signo = "";
        const tipoNormalizado = movimiento.tipo.toLowerCase();

        if (tipoNormalizado === "deposito") {
            colorMonto = "text-success";
            signo = "+";
        } else if (tipoNormalizado === "retiro" || tipoNormalizado === "pago servicio") {
            colorMonto = "text-danger";
            signo = "-";
        }

        row.innerHTML = `
            <td class="align-middle">${movimiento.fecha}</td>
            <td class="font-weight-bold align-middle">
                ${movimiento.tipo} 
                <br><small class="text-muted font-weight-normal">${movimiento.estado}</small>
            </td>
            <td class="${colorMonto} font-weight-bold align-middle">${signo} $${parseFloat(movimiento.monto).toFixed(2)}</td>
            <td class="align-middle"><span class="badge badge-success px-3 py-2">Exitoso</span></td>
        `;
        cuerpoTabla.appendChild(row);
    });
}

// Escuchador oficial para pintar la tabla en cuanto cargue el documento
document.addEventListener("DOMContentLoaded", () => {
    cargarHistorialTabla();
});