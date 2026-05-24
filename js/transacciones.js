/**
 * Motor Operativo de Transacciones Financieras y Comprobantes PDF
 * Pokémon Bank - Cátedra DAW901
 */

function realizarDeposito() {
    swal({
        title: "Depositar Fondos",
        text: "Ingrese la cantidad de dinero en USD ($) a abonar:",
        content: {
            element: "input",
            attributes: {
                placeholder: "Ej: 500.00",
                type: "number",
                step: "0.01"
            },
        },
        button: { text: "Confirmar Abono", closeModal: false }
    }).then(monto => {
        if (monto === null) return; 

        if (!montoEsValido(monto)) return;

        let cantidad = parseFloat(monto);
        let usuario = obtenerUsuario();

        usuario.saldo += cantidad;
        const nuevaTransaccion = {
            fecha: new Date().toLocaleString(),
            tipo: "Deposito",
            monto: cantidad,
            estado: "Exitoso"
        };
        usuario.historial.push(nuevaTransaccion);
        guardarUsuario(usuario);

        swal({
            title: "¡Depósito Exitoso!",
            text: `Se han depositado $${cantidad.toFixed(2)} a la cuenta.\nNuevo saldo: $${usuario.saldo.toFixed(2)}`,
            icon: "success",
            buttons: {
                cancel: "Cerrar",
                confirm: { text: "Imprimir PDF", value: "pdf" }
            }
        }).then((value) => {
            if (value === "pdf") {
                generarComprobantePDF(nuevaTransaccion, usuario.saldo);
            }
        });
    });
}

function realizarRetiro() {
    swal({
        title: "Retirar Fondos",
        text: "Ingrese el monto en USD ($) que desea retirar:",
        content: {
            element: "input",
            attributes: {
                placeholder: "Ej: 200.00",
                type: "number",
                step: "0.01"
            },
        },
        button: { text: "Confirmar Débito", closeModal: false }
    }).then(monto => {
        if (monto === null) return;

        if (!montoEsValido(monto)) return;

        let cantidad = parseFloat(monto);
        let usuario = obtenerUsuario();

        if (cantidad > usuario.saldo) {
            mostrarAlertaError("Fondos Insuficientes", `No puedes retirar $${cantidad.toFixed(2)}. Tu saldo actual es de $${usuario.saldo.toFixed(2)}.`);
            return;
        }

        usuario.saldo -= cantidad;
        const nuevaTransaccion = {
            fecha: new Date().toLocaleString(),
            tipo: "Retiro",
            monto: cantidad,
            estado: "Exitoso"
        };
        usuario.historial.push(nuevaTransaccion);
        guardarUsuario(usuario);

        swal({
            title: "¡Retiro Exitoso!",
            text: `Retiro procesado por $${cantidad.toFixed(2)}.\nSaldo restante: $${usuario.saldo.toFixed(2)}`,
            icon: "success",
            buttons: {
                cancel: "Cerrar",
                confirm: { text: "Imprimir PDF", value: "pdf" }
            }
        }).then((value) => {
            if (value === "pdf") {
                generarComprobantePDF(nuevaTransaccion, usuario.saldo);
            }
        });
    });
}

function consultarSaldo() {
    const usuario = obtenerUsuario();
    if (!usuario) return;

    swal({
        title: "Consulta de Saldo",
        text: `Estimado cliente: ${usuario.nombre}\n\nN° de Cuenta: ${usuario.cuenta}\nSaldo Disponible: $${usuario.saldo.toFixed(2)}`,
        icon: "info",
        button: "Entendido"
    });
}

/**
 * NUEVO: Módulo de Pago de Servicios Integrado Real (Fase III Unificada)
 */
function realizarPagoServicios() {
    // Selección del servicio a pagar
    swal({
        title: "Pago de Servicios Públicos",
        text: "Seleccione el servicio que desea cancelar:",
        content: {
            element: "select",
            attributes: {
                innerHTML: `
                    <option value="CAESS / DELSUR (Luz)">CAESS / DELSUR (Luz)</option>
                    <option value="ANDA (Agua)">ANDA (Agua Potable)</option>
                    <option value="Claro / Tigo (Internet)">Claro / Tigo (Internet)</option>
                `,
                className: "form-control"
            }
        },
        buttons: {
            cancel: "Cancelar",
            confirm: "Siguiente"
        }
    }).then(servicioSeleccionado => {
        if (!servicioSeleccionado) return;

        // Ingreso del monto de la factura
        swal({
            title: `Cobro de ${servicioSeleccionado}`,
            text: "Ingrese el monto exacto de la factura a pagar ($):",
            content: {
                element: "input",
                attributes: {
                    placeholder: "Ej: 35.50",
                    type: "number",
                    step: "0.01"
                }
            },
            button: "Proceder al Pago"
        }).then(monto => {
            if (monto === null) return;

            if (!montoEsValido(monto)) return;

            let cantidad = parseFloat(monto);
            let usuario = obtenerUsuario();

            // Validar si el saldo alcanza para pagar la factura
            if (cantidad > usuario.saldo) {
                mostrarAlertaError("Fondos Insuficientes", `Tu saldo de $${usuario.saldo.toFixed(2)} no alcanza para pagar la factura de $${cantidad.toFixed(2)}.`);
                return;
            }

            // Aplicar cobro real y guardar historial
            usuario.saldo -= cantidad;
            const nuevaTransaccion = {
                fecha: new Date().toLocaleString(),
                tipo: "Pago Servicio",
                monto: cantidad,
                estado: `Pago de ${servicioSeleccionado}`
            };
            usuario.historial.push(nuevaTransaccion);
            guardarUsuario(usuario);

            // Alerta de éxito con descarga de comprobante
            swal({
                title: "¡Pago Procesado!",
                text: `${servicioSeleccionado} cancelado con éxito.\nMonto cobrado: $${cantidad.toFixed(2)}\nSaldo actual: $${usuario.saldo.toFixed(2)}`,
                icon: "success",
                buttons: {
                    cancel: "Cerrar",
                    confirm: { text: "Imprimir Ticket PDF", value: "pdf" }
                }
            }).then((value) => {
                if (value === "pdf") {
                    generarComprobantePDF(nuevaTransaccion, usuario.saldo);
                }
            });
        });
    });
}

/**
 * Genera un comprobante oficial en formato PDF usando la librería jsPDF
 */
function generarComprobantePDF(transaccion, saldoActual) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFont("headline", "bold");
    doc.setFontSize(22);
    doc.setTextColor(59, 76, 202); 
    doc.text("POKÉMON BANK ATM", 105, 25, null, null, "center");

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("Comprobante de Transacción Electrónica", 105, 33, null, null, "center");
    doc.text("-------------------------------------------------------------------------", 105, 40, null, null, "center");

    doc.setFont("normal", "normal");
    doc.setTextColor(0);
    doc.setFontSize(14);
    
    doc.text(`Fecha: ${transaccion.fecha}`, 20, 55);
    doc.text(`Cliente: Ash Ketchum`, 20, 65);
    doc.text(`N° de Cuenta: 0987654321`, 20, 75);
    doc.text(`Operación: ${transaccion.tipo}`, 20, 85);
    doc.text(`Monto: $${transaccion.monto.toFixed(2)}`, 20, 95);
    doc.text(`Detalle: ${transaccion.estado}`, 20, 105);
    
    doc.text("-------------------------------------------------------------------------", 105, 115, null, null, "center");
    doc.setFont("headline", "bold");
    doc.text(`Saldo Disponible Actual: $${saldoActual.toFixed(2)}`, 20, 125);

    doc.setFont("normal", "italic");
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text("Gracias por utilizar nuestros servicios financieros.", 105, 145, null, null, "center");

    doc.save(`ticket-${transaccion.tipo.toLowerCase().replace(" ", "-")}-${Date.now()}.pdf`);
}