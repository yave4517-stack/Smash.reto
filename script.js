// --- 1. DATOS DE PERSONAJES ---
const todosLosPersonajes = [
    "Mario", "Donkey Kong", "Link", "Samus", "Dark Samus", "Yoshi", "Kirby", "Fox", "Pikachu", "Luigi", 
    "Captain Falcon", "Jigglypuff", "Peach", "Daisy", "Bowser", "Ice Climbers", "Sheik", "Zelda", 
    "Dr. Mario", "Pichu", "Falco", "Marth", "Lucina", "Young Link", "Ganondorf", "Mewtwo", "Roy", 
    "Chrom", "Mr. Game & Watch", "Meta Knight", "Pit", "Dark Pit", "Zero Suit Samus", "Wario", 
    "Snake", "Ike", "Pokémon Trainer", "Diddy Kong", "Lucas", "Sonic", "King Dedede", "Olimar", 
    "Lucario", "R.O.B.", "Toon Link", "Wolf", "Villager", "Mega Man", "Wii Fit Trainer", "Rosalina & Luma", 
    "Little Mac", "Greninja", "Palutena", "Pac-Man", "Robin", "Shulk", "Bowser Jr.", "Duck Hunt", 
    "Ryu", "Ken", "Cloud", "Corrin", "Bayonetta", 
    "Piranha Plant", "Joker", "Hero", "Banjo & Kazooie", "Terry", "Byleth", "Min Min", "Steve", 
    "Sephiroth", "Pyra/Mythra", "Kazuya", "Sora"
];

// --- 2. VARIABLES DE ESTADO DEL JUEGO ---
let personajesDisponibles = [...todosLosPersonajes];
let jugadoresRachas = {}; 
let jugadorActivo = null;
let numJugadores = 1;

// --- 3. REFERENCIAS DEL DOM ---

// FASE DE CONFIGURACIÓN
const $setupSection = document.getElementById('setup-section');
const $numPlayersSelect = document.getElementById('num-players');
const $playerNameInputsContainer = document.getElementById('player-name-inputs');
const $confirmNamesBtn = document.getElementById('confirm-names-btn'); 
// NUEVA REFERENCIA
const $backToSetupBtn = document.getElementById('back-to-setup-btn');

// FASE DE JUEGO
const $playerSwitchButtons = document.getElementById('player-switch-buttons');
const $currentPlayerDisplay = document.getElementById('current-player-display');
const $characterWheel = document.getElementById('character-wheel');
const $currentStreak = document.getElementById('current-streak');
const $currentRank = document.getElementById('current-rank');
const $newChallengeBtn = document.getElementById('new-challenge-btn');
const $winBtn = document.getElementById('win-btn');
const $loseBtn = document.getElementById('lose-btn');
const $gameStatsSection = document.getElementById('game-stats');
const $challengeSection = document.getElementById('challenge-section');
const $resultActionsSection = document.getElementById('result-actions');
const $gameHrTop = document.getElementById('game-hr-top');
const $gameHrBottom = document.getElementById('game-hr-bottom');

// --- 4. LÓGICA DE CONFIGURACIÓN Y FLUJO ---

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

function iniciarJuego() {
    jugadoresRachas = {};
    let firstPlayer = null;
    let allNamesValid = true;

    // 1. Validar y leer los nombres
    for (let i = 1; i <= numJugadores; i++) {
        const input = document.getElementById(`player-name-${i}`);
        const nombre = input.value.trim(); 
        
        if (nombre === "") {
            allNamesValid = false;
            input.style.border = '2px solid var(--smash-red)'; 
        } else {
            jugadoresRachas[nombre] = 0;
            if (i === 1) {
                firstPlayer = nombre;
            }
            input.style.border = '2px solid var(--smash-yellow)'; 
        }
    }

    if (!allNamesValid) {
        alert("¡No puedes iniciar el reto! Por favor, ingresa el nombre de todos los jugadores.");
        return; 
    }
    
    // --- Ocultar la FASE DE CONFIGURACIÓN ---
    document.querySelector('.player-selection h2').style.display = 'none';
    $numPlayersSelect.closest('.input-group').style.display = 'none'; 
    $playerNameInputsContainer.style.display = 'none';
    $confirmNamesBtn.style.display = 'none'; 
    
    // --- Mostrar la FASE DE JUEGO ---
    $gameStatsSection.style.display = 'flex';
    $challengeSection.style.display = 'block';
    $resultActionsSection.style.display = 'flex';
    $gameHrTop.style.display = 'block';
    $gameHrBottom.style.display = 'block';
    $currentPlayerDisplay.style.display = 'block';
    
    // MOSTRAR BOTÓN DE REGRESAR
    $backToSetupBtn.style.display = 'block'; 

    // 4. Configurar jugador activo
    jugadorActivo = firstPlayer;
    
    // 5. Si es multijugador, generar botones de cambio
    if (numJugadores > 1) {
        generarBotonesCambioJugador();
        $playerSwitchButtons.style.display = 'flex';
    } else {
        $playerSwitchButtons.style.display = 'none';
    }

    actualizarInterfaz();
}

/**
 * NUEVA FUNCIÓN: Devuelve la interfaz a la configuración inicial.
 */
function regresarAConfiguracion() {
    // 1. Mostrar la FASE DE CONFIGURACIÓN
    document.querySelector('.player-selection h2').style.display = 'block';
    $numPlayersSelect.closest('.input-group').style.display = 'block'; 
    $playerNameInputsContainer.style.display = 'block';
    $confirmNamesBtn.style.display = 'block'; 
    
    // 2. Ocultar la FASE DE JUEGO
    $gameStatsSection.style.display = 'none';
    $challengeSection.style.display = 'none';
    $resultActionsSection.style.display = 'none';
    $gameHrTop.style.display = 'none';
    $gameHrBottom.style.display = 'none';
    $currentPlayerDisplay.style.display = 'none';
    $playerSwitchButtons.style.display = 'none';
    
    // OCULTAR BOTÓN DE REGRESAR
    $backToSetupBtn.style.display = 'none';

    // 3. Limpiar la ruleta
    $characterWheel.innerHTML = '<p class="initial-message">Presiona "Nuevo Reto" para empezar</p>';
    
    // 4. Resetear el estado del juego para un nuevo inicio
    jugadorActivo = null;
    jugadoresRachas = {};
    personajesDisponibles = [...todosLosPersonajes];
    
    // 5. Regenerar campos de nombre (con el número actual de jugadores)
    generarCamposDeNombre();
}

function generarBotonesCambioJugador() {
    $playerSwitchButtons.innerHTML = '';
    Object.keys(jugadoresRachas).forEach(nombre => {
        const btn = document.createElement('button');
        btn.textContent = nombre;
        btn.classList.add('smash-btn', 'player-switch-btn');
        btn.dataset.player = nombre;
        
        btn.addEventListener('click', () => {
            jugadorActivo = nombre;
            actualizarInterfaz();
            $characterWheel.innerHTML = '<p class="initial-message">¡Nuevo jugador! Presiona "Nuevo Reto".</p>';
        });
        $playerSwitchButtons.appendChild(btn);
    });
}

// --- El resto de las funciones (obtenerRango, actualizarInterfaz, seleccionarPersonajeAleatorio, registrarVictoria, registrarDerrota) se mantienen igual ---
// ... (código no modificado) ...
function obtenerRango(racha) { /* ... */ }
function actualizarInterfaz() { /* ... */ }
function seleccionarPersonajeAleatorio() { /* ... */ }
function registrarVictoria() { /* ... */ }
function registrarDerrota() { /* ... */ }
// ...

// --- 6. INICIALIZACIÓN Y EVENT LISTENERS ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar campos de nombre al cargar
    generarCamposDeNombre();

    // 2. Evento para cambiar el número de campos de nombre
    $numPlayersSelect.addEventListener('change', generarCamposDeNombre);

    // 3. Evento para iniciar el juego
    if ($confirmNamesBtn) {
        $confirmNamesBtn.addEventListener('click', iniciarJuego);
    }
    
    // 4. NUEVO EVENTO PARA REGRESAR
    if ($backToSetupBtn) {
        $backToSetupBtn.addEventListener('click', regresarAConfiguracion);
    }

    // 5. Eventos del juego
    $newChallengeBtn.addEventListener('click', seleccionarPersonajeAleatorio);
    $winBtn.addEventListener('click', registrarVictoria);
    $loseBtn.addEventListener('click', registrarDerrota);
});