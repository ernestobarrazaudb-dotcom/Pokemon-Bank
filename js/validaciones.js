// VALIDACIONES DEL SISTEMA POKEMON BANK
// Uso de ValidateJS para validar montos y entradas numéricas

function validarMonto(monto) {
    const constraints = {
        monto: {
            presence: {
                allowEmpty: false,
                message: "no puede estar vacío"
            },
            numericality: {
                greaterThan: 0,
                message: "debe ser un número mayor a cero tona y no contener letras"
            },
            numericality: {
                lessThanOrEqualTo: 10000,
                message: "no puede ser mayor a $10,000"
            }
        }
    };

    return validate({ monto: monto }, constraints);
}

function montoEsValido(monto) {
    const errores = validarMonto(monto);

    if (errores) {
        swal({
            title: "Monto inválido",
            text: errores.monto[0],
            icon: "error",
            button: "Corregir"
        });
        return false;
    }
    return true;
}