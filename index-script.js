// --- 1. VARIABLES DE ESTADO DEL FORMULARIO ---
let numJugadores = 1;

// --- 2. REFERENCIAS DEL DOM ---
const $numPlayersSelect = document.getElementById('num-players');
const $playerNameInputsContainer = document.getElementById('player-name-inputs');
const $confirmNamesBtn = document.getElementById('confirm-names-btn'); 

// --- 3. LÓGICA DE CONFIGURACIÓN ---

function generarCamposDeNombre() {
    numJugadores = parseInt($numPlayersSelect.value) || 1;
    $playerNameInputsContainer.innerHTML = '';

    for (let i = 1; i <= numJugadores; i++) {
        const div = document.createElement('div');
        div.classList.add('input-group');
        div.innerHTML = `
            <label for="player-name-${i}">Nombre del Jugador ${i}:</label>
            <input type="text" id="player-name-${i}" class="smash-input" placeholder="Tu nombre o alias">
        `; 
        $playerNameInputsContainer.appendChild(div);
    }
}

/**
 * Valida los nombres, los guarda en LocalStorage y luego redirige a game.html
 */
function iniciarJuegoYGuardar() {
    const jugadoresRachas = {};
    let firstPlayer = null;
    let allNamesValid = true;

    // 1. Validar y leer los nombres
    for (let i = 1; i <= numJugadores; i++) {
        const input = document.getElementById(`player-name-${i}`);
        const nombre = input.value.trim(); 
        
        // Limpiamos los estilos de error anteriores
        input.style.border = '2px solid var(--smash-yellow)'; 
        
        if (nombre === "") {
            allNamesValid = false;
            // Destacar campo vacío
            input.style.border = '2px solid red'; 
        } else {
            jugadoresRachas[nombre] = 0; // Inicializamos racha en 0
            if (i === 1) {
                firstPlayer = nombre;
            }
        }
    }

    // Si algún nombre está vacío, mostramos la alerta y SALIMOS de la función.
    if (!allNamesValid) {
        alert("¡No puedes iniciar el reto! Por favor, ingresa el nombre de todos los jugadores.");
        return; 
    }
    
    // --- Si llegamos aquí, la validación fue exitosa ---

    // 2. GUARDAR DATOS EN LOCALSTORAGE
    localStorage.setItem('jugadoresRachas', JSON.stringify(jugadoresRachas));
    localStorage.setItem('jugadorActivo', firstPlayer);
    
    // 3. REDIRIGIR AL JUEGO
    // NOTA: Asegúrate de que 'game.html' exista en el mismo directorio.
    window.location.href = 'game.html'; 
}


// --- 4. INICIALIZACIÓN Y EVENT LISTENERS ---

document.addEventListener('DOMContentLoaded', () => {
    // Es buena práctica inicializar la variable CSS si no está definida en el script.
    // Aunque deberías tenerla en style.css, la definimos aquí para el caso de error.
    const rootStyle = document.documentElement.style;
    if (!rootStyle.getPropertyValue('--smash-yellow')) {
        rootStyle.setProperty('--smash-yellow', '#f1c40f');
    }
    
    generarCamposDeNombre();
    $numPlayersSelect.addEventListener('change', generarCamposDeNombre);
    
    if ($confirmNamesBtn) {
        $confirmNamesBtn.addEventListener('click', iniciarJuegoYGuardar);
    }
});