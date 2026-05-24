// Manejo de persistencia en LocalStorage para Pokémon Bank
// Universidad Don Bosco 

// Inicializa al usuario oficial si la base de datos está vacía (¡YA NO BORRA LOS DATOS!)
function inicializarBaseDatos() {
    if (!localStorage.getItem('pokemon_bank_user')) {
        const usuarioOficial = {
            nombre: "Ash Ketchum",
            pin: "1234",
            cuenta: "0987654321",
            saldo: 500.00,
            historial: [] 
        };
        localStorage.setItem('pokemon_bank_user', JSON.stringify(usuarioOficial));
    }
}

// Guarda los datos actualizados del usuario en el LocalStorage
function guardarUsuario(usuario) {
    localStorage.setItem('pokemon_bank_user', JSON.stringify(usuario));
}

// Recupera el objeto del usuario actual mapeado desde LocalStorage
function obtenerUsuario() {
    inicializarBaseDatos(); 
    const usuarioJSON = localStorage.getItem('pokemon_bank_user');
    return usuarioJSON ? JSON.parse(usuarioJSON) : null;
}

// Ejecutar inicialización automática al cargar el script sin resetear
inicializarBaseDatos();