// --- 1. DATOS DE PERSONAJES ---
const todosLosPersonajes = [
    // La lista completa de personajes se mantiene aquí
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
// NUEVO BOTÓN
const $confirmNamesBtn = document.getElementById('confirm-names-btn'); 

// FASE DE JUEGO (Mantenidas)
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
        `; // El campo empieza vacío para forzar la entrada del nombre.
        $playerNameInputsContainer.appendChild(div);
    }
}

/**
 * Función central para iniciar el juego, ahora con VALIDACIÓN.
 */
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
            // Destacar el campo vacío
            input.style.border = '2px solid var(--smash-red)'; 
        } else {
            jugadoresRachas[nombre] = 0;
            if (i === 1) {
                firstPlayer = nombre;
            }
            input.style.border = '2px solid var(--smash-yellow)'; // Restablecer borde
        }
    }

    // Si algún nombre está vacío, se detiene el juego y se alerta al usuario.
    if (!allNamesValid) {
        alert("¡No puedes iniciar el reto! Por favor, ingresa el nombre de todos los jugadores.");
        return; 
    }
    
    // --- Si llegamos aquí, la validación fue exitosa ---

    // 2. Ocultar la FASE DE CONFIGURACIÓN
    document.querySelector('.player-selection h2').style.display = 'none';
    $numPlayersSelect.closest('.input-group').style.display = 'none'; 
    $playerNameInputsContainer.style.display = 'none';
    $confirmNamesBtn.style.display = 'none'; // Ocultar el nuevo botón
    
    // 3. Mostrar la FASE DE JUEGO
    $gameStatsSection.style.display = 'flex';
    $challengeSection.style.display = 'block';
    $resultActionsSection.style.display = 'flex';
    $gameHrTop.style.display = 'block';
    $gameHrBottom.style.display = 'block';
    $currentPlayerDisplay.style.display = 'block';

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


// --- 5. FUNCIONES DE JUEGO (Mantenidas) ---

function obtenerRango(racha) {
    if (racha >= 21) return { name: "LEYENDA", class: "rank-legend" };
    if (racha >= 11) return { name: "ÉLITE", class: "rank-elite" };
    if (racha >= 6) return { name: "VETERANO", class: "rank-veteran" };
    if (racha >= 1) return { name: "LUCHADOR", class: "rank-fighter" };
    return { name: "NOVATO", class: "rank-newcomer" };
}

function actualizarInterfaz() {
    if (!jugadorActivo) return;

    const racha = jugadoresRachas[jugadorActivo] || 0;
    const rango = obtenerRango(racha);

    $currentPlayerDisplay.innerHTML = `Jugador Activo: **${jugadorActivo}**`;
    $currentStreak.textContent = racha;
    
    $currentRank.textContent = rango.name;
    $currentRank.className = `stat-value ${rango.class}`;

    const desafioIniciado = $characterWheel.querySelector('.character-name');
    $winBtn.disabled = !desafioIniciado;
    $loseBtn.disabled = !desafioIniciado;
    
    if (personajesDisponibles.length === 0 && !desafioIniciado) {
        $newChallengeBtn.textContent = '¡RETO COMPLETADO! (Reiniciar)';
        $newChallengeBtn.disabled = false;
    } else {
        $newChallengeBtn.textContent = '✨ Nuevo Reto ✨';
    }

    document.querySelectorAll('.player-switch-btn').forEach(btn => {
        if (btn.dataset.player === jugadorActivo) {
            btn.classList.add('active-player');
        } else {
            btn.classList.remove('active-player');
        }
    });
}

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
            
            personajesDisponibles.splice(indiceFinal, 1); 

            $characterWheel.innerHTML = `<p class="character-name">${personajeFinal}</p>`;

            $newChallengeBtn.disabled = false;
            $winBtn.disabled = false;
            $loseBtn.disabled = false;
        }
    }, duracionRuleta / pasos);
}

function registrarVictoria() {
    if (!$characterWheel.querySelector('.character-name')) return;
    
    jugadoresRachas[jugadorActivo] = (jugadoresRachas[jugadorActivo] || 0) + 1;
    
    $characterWheel.innerHTML = '<p class="initial-message">¡Ganaste! Presiona "Nuevo Reto" para seguir la racha.</p>';
    
    actualizarInterfaz();
}

function registrarDerrota() {
    if (!$characterWheel.querySelector('.character-name')) return;

    jugadoresRachas[jugadorActivo] = 0;
    personajesDisponibles = [...todosLosPersonajes];
    
    $characterWheel.innerHTML = '<p class="initial-message">¡Derrota! Racha Reiniciada. Presiona "Nuevo Reto" para volver a empezar.</p>';
    
    actualizarInterfaz();
}


// --- 6. INICIALIZACIÓN Y EVENT LISTENERS ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar campos de nombre al cargar
    generarCamposDeNombre();

    // 2. Evento para cambiar el número de campos de nombre
    $numPlayersSelect.addEventListener('change', generarCamposDeNombre);

    // 3. Evento para iniciar el juego (¡Ahora con el nuevo botón de confirmación!)
    if ($confirmNamesBtn) {
        $confirmNamesBtn.addEventListener('click', iniciarJuego);
    }

    // 4. Eventos del juego
    $newChallengeBtn.addEventListener('click', seleccionarPersonajeAleatorio);
    $winBtn.addEventListener('click', registrarVictoria);
    $loseBtn.addEventListener('click', registrarDerrota);
});