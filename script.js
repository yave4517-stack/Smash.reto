// --- 1. DATOS DE PERSONAJES (Mantenemos la lista) ---
const todosLosPersonajes = [
    // ... (Tu lista de personajes de Smash Bros Ultimate) ...
    "Mario", "Donkey Kong", "Link", "Samus", "Dark Samus", "Yoshi", "Kirby", "Fox", "Pikachu", "Luigi", 
    "Captain Falcon", "Jigglypuff", "Peach", "Daisy", "Bowser", "Ice Climbers", "Sheik", "Zelda", 
    "Dr. Mario", "Pichu", "Falco", "Marth", "Lucina", "Young Link", "Ganondorf", "Mewtwo", "Roy", 
    "Chrom", "Mr. Game & Watch", "Meta Knight", "Pit", "Dark Pit", "Zero Suit Samus", "Wario", 
    "Snake", "Ike", "Pokémon Trainer", "Diddy Kong", "Lucas", "Sonic", "King Dedede", "Olimar", 
    "Lucario", "R.O.B.", "Toon Link", "Wolf", "Villager", "Mega Man", "Wii Fit Trainer", "Rosalina & Luma", 
    "Little Mac", "Greninja", "Palutena", "Pac-Man", "Robin", "Shulk", "Bowser Jr.", "Duck Hunt", 
    "Ryu", "Ken", "Cloud", "Corrin", "Bayonetta", 
    // DLC
    "Piranha Plant", "Joker", "Hero", "Banjo & Kazooie", "Terry", "Byleth", "Min Min", "Steve", 
    "Sephiroth", "Pyra/Mythra", "Kazuya", "Sora"
];


// --- 2. VARIABLES DE ESTADO DEL JUEGO ---
let personajesDisponibles = [...todosLosPersonajes];
let jugadoresRachas = {}; // Objeto para almacenar nombres y rachas { "NombreJugador": 0 }
let jugadorActivo = null;
let rachaMaxima = 0;
let numJugadores = 1;

// Referencias del DOM
const $numPlayersSelect = document.getElementById('num-players');
const $playerNameInputsContainer = document.getElementById('player-name-inputs');
const $startGameBtn = document.getElementById('start-game-btn');
const $playerSwitchButtons = document.getElementById('player-switch-buttons');

const $currentPlayerDisplay = document.getElementById('current-player-display');
const $characterWheel = document.getElementById('character-wheel');
const $currentStreak = document.getElementById('current-streak');
const $currentRank = document.getElementById('current-rank');
const $newChallengeBtn = document.getElementById('new-challenge-btn');
const $winBtn = document.getElementById('win-btn');
const $loseBtn = document.getElementById('lose-btn');

// Nuevas referencias para ocultar/mostrar secciones
const $gameStatsSection = document.getElementById('game-stats');
const $challengeSection = document.getElementById('challenge-section');
const $resultActionsSection = document.getElementById('result-actions');
const $gameHr = document.getElementById('game-hr');


// --- 3. FUNCIONES DE LÓGICA (Se mantienen obtenerRango, registrarVictoria, registrarDerrota, seleccionarPersonajeAleatorio) ---

/**
 * 3.1. Rango: Determina el rango basado en la racha
 */
function obtenerRango(racha) {
    // ... (función igual a la anterior) ...
    if (racha >= 21) return { name: "LEYENDA", class: "rank-legend" };
    if (racha >= 11) return { name: "ÉLITE", class: "rank-elite" };
    if (racha >= 6) return { name: "VETERANO", class: "rank-veteran" };
    if (racha >= 1) return { name: "LUCHADOR", class: "rank-fighter" };
    return { name: "NOVATO", class: "rank-newcomer" };
}

/**
 * 3.2. Render: Actualiza la interfaz del jugador activo
 */
function actualizarInterfaz() {
    if (!jugadorActivo) return;

    const racha = jugadoresRachas[jugadorActivo] || 0;
    const rango = obtenerRango(racha);

    $currentPlayerDisplay.innerHTML = `Jugador Activo: **${jugadorActivo}**`;
    $currentStreak.textContent = racha;
    
    // Actualizar Rango
    $currentRank.textContent = rango.name;
    $currentRank.className = `stat-value ${rango.class}`;

    // Deshabilitar/Habilitar botones
    const desafioIniciado = $characterWheel.querySelector('.character-name');
    $winBtn.disabled = !desafioIniciado;
    $loseBtn.disabled = !desafioIniciado;
    
    if (personajesDisponibles.length === 0 && !desafioIniciado) {
        $newChallengeBtn.textContent = '¡RETO COMPLETADO! (Reiniciar)';
        $newChallengeBtn.disabled = false;
    } else {
        $newChallengeBtn.textContent = '✨ Nuevo Reto ✨';
    }

    // Actualizar botones de cambio de jugador
    document.querySelectorAll('.player-switch-btn').forEach(btn => {
        if (btn.dataset.player === jugadorActivo) {
            btn.classList.add('active-player');
        } else {
            btn.classList.remove('active-player');
        }
    });
}

/**
 * 3.3. Ruleta/Selección: Muestra el efecto de selección y elige un personaje
 */
function seleccionarPersonajeAleatorio() {
    if (personajesDisponibles.length === 0) {
        personajesDisponibles = [...todosLosPersonajes];
        alert("¡Todos los personajes han sido jugados! Reiniciando la lista de luchadores.");
    }

    $newChallengeBtn.disabled = true;
    $winBtn.disabled = true;
    $loseBtn.disabled = true;

    const duracionRuleta = 2000;
    const pasos = 15;
    let contador = 0;
    
    const ruletaInterval = setInterval(() => {
        const tempIndex = Math.floor(Math.random() * personajesDisponibles.length);
        const tempCharacter = personajesDisponibles[tempIndex];
        $characterWheel.innerHTML = `<p class="character-name" style="font-size: 2em; color: #fff;">${tempCharacter}</p>`;
        
        contador++;
        if (contador >= pasos) {
            clearInterval(ruletaInterval);
            
            const indiceFinal = Math.floor(Math.random() * personajesDisponibles.length);
            const personajeFinal = personajesDisponibles[indiceFinal];
            
            personajesDisponibles.splice(indiceFinal, 1); // Eliminar para no repetir

            $characterWheel.innerHTML = `<p class="character-name">${personajeFinal}</p>`;

            $newChallengeBtn.disabled = false;
            $winBtn.disabled = false;
            $loseBtn.disabled = false;
        }
    }, duracionRuleta / pasos);
}

/**
 * 3.4. Resultado: Maneja la victoria (aumenta racha)
 */
function registrarVictoria() {
    if (!$characterWheel.querySelector('.character-name')) return;
    
    jugadoresRachas[jugadorActivo] = (jugadoresRachas[jugadorActivo] || 0) + 1;
    
    $characterWheel.innerHTML = '<p class="initial-message">¡Ganaste! Presiona "Nuevo Reto" para seguir la racha.</p>';
    
    actualizarInterfaz();
}

/**
 * 3.5. Resultado: Maneja la derrota (reinicia racha y personajes disponibles)
 */
function registrarDerrota() {
    if (!$characterWheel.querySelector('.character-name')) return;

    // Registrar racha máxima (opcional)
    const rachaAntes = jugadoresRachas[jugadorActivo];
    if (rachaAntes > rachaMaxima) {
        rachaMaxima = rachaAntes;
    }

    // Reinicia la racha del jugador activo
    jugadoresRachas[jugadorActivo] = 0;

    // Reinicia la lista de personajes
    personajesDisponibles = [...todosLosPersonajes];
    
    $characterWheel.innerHTML = '<p class="initial-message">¡Derrota! Racha Reiniciada. Presiona "Nuevo Reto" para volver a empezar.</p>';
    
    actualizarInterfaz();
}

// --- 4. LÓGICA DE NOMBRES Y MULTIJUGADOR ---

/**
 * 4.1. Genera los campos de entrada de nombre basados en la selección de jugadores.
 */
function generarCamposDeNombre() {
    numJugadores = parseInt($numPlayersSelect.value);
    $playerNameInputsContainer.innerHTML = '';

    for (let i = 1; i <= numJugadores; i++) {
        const div = document.createElement('div');
        div.classList.add('input-group');
        div.innerHTML = `
            <label for="player-name-${i}">Nombre del Jugador ${i}:</label>
            <input type="text" id="player-name-${i}" class="smash-input" placeholder="Ej: MarioPlayer" value="Jugador ${i}">
        `;
        $playerNameInputsContainer.appendChild(div);
    }
}

/**
 * 4.2. Inicia el juego, lee los nombres y configura el estado.
 */
function iniciarJuego() {
    jugadoresRachas = {};
    let firstPlayer = null;
    
    // 1. Leer los nombres y configurar rachas
    for (let i = 1; i <= numJugadores; i++) {
        const input = document.getElementById(`player-name-${i}`);
        const nombre = input.value.trim() || `Jugador ${i}`; // Usa nombre por defecto si está vacío
        jugadoresRachas[nombre] = 0;
        if (i === 1) {
            firstPlayer = nombre;
        }
    }

    // 2. Ocultar configuración y mostrar juego
    document.querySelector('.player-selection h2').style.display = 'none';
    $numPlayersSelect.style.display = 'none';
    $playerNameInputsContainer.style.display = 'none';
    $startGameBtn.style.display = 'none';
    
    $gameStatsSection.style.display = 'flex';
    $challengeSection.style.display = 'block';
    $resultActionsSection.style.display = 'flex';
    $gameHr.style.display = 'block';
    $currentPlayerDisplay.style.display = 'block';

    // 3. Configurar jugador activo inicial
    jugadorActivo = firstPlayer;
    
    // 4. Si hay más de un jugador, mostrar botones de cambio
    if (numJugadores > 1) {
        generarBotonesCambioJugador();
        $playerSwitchButtons.style.display = 'flex';
    } else {
        $playerSwitchButtons.style.display = 'none';
    }

    actualizarInterfaz();
}

/**
 * 4.3. Genera los botones para cambiar el jugador activo.
 */
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
            // Limpiar la ruleta al cambiar de jugador para evitar trampas
            $characterWheel.innerHTML = '<p class="initial-message">¡Nuevo jugador! Presiona "Nuevo Reto".</p>';
        });
        $playerSwitchButtons.appendChild(btn);
    });
}


// --- 5. INICIALIZACIÓN Y EVENT LISTENERS ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar campos de nombre al cargar
    generarCamposDeNombre();

    // 2. Evento para cambiar el número de campos de nombre
    $numPlayersSelect.addEventListener('change', generarCamposDeNombre);

    // 3. Evento para iniciar el juego
    $startGameBtn.addEventListener('click', iniciarJuego);

    // 4. Asignar eventos a los botones de acción del juego
    $newChallengeBtn.addEventListener('click', seleccionarPersonajeAleatorio);
    $winBtn.addEventListener('click', registrarVictoria);
    $loseBtn.addEventListener('click', registrarDerrota);
});