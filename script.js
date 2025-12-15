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
let jugadorActivo = "Jugador 1"; // Nombre predeterminado
let rachaActual = 0;

// --- 3. REFERENCIAS DEL DOM ---
// CONTENEDORES
const $setupContainer = document.getElementById('setup-container');
const $gameContainer = document.getElementById('game-container');

// FASE DE CONFIGURACIÓN
const $playerNameInput = document.getElementById('player-name-input');
const $confirmNameBtn = document.getElementById('confirm-name-btn'); 

// FASE DE JUEGO
const $backToSetupBtn = document.getElementById('back-to-setup-btn');
const $currentPlayerDisplay = document.getElementById('current-player-display');
const $characterWheel = document.getElementById('character-wheel');
const $currentStreak = document.getElementById('current-streak');
const $currentRank = document.getElementById('current-rank');
const $newChallengeBtn = document.getElementById('new-challenge-btn');
const $winBtn = document.getElementById('win-btn');
const $loseBtn = document.getElementById('lose-btn');


// --- 4. LÓGICA DE TRANSICIÓN Y JUEGO ---

/**
 * Función que se ejecuta al presionar ACEPTAR.
 */
function iniciarJuego() {
    const nombre = $playerNameInput.value.trim();
    
    if (nombre === "") {
        alert("¡Por favor, ingresa tu nombre o alias para empezar el reto!");
        $playerNameInput.style.border = '2px solid var(--smash-red)';
        return; 
    }
    
    // 1. Guardar el nombre y resetear la racha
    jugadorActivo = nombre;
    rachaActual = 0;
    personajesDisponibles = [...todosLosPersonajes]; // Reiniciar personajes

    // 2. Transición de formularios (¡El botón de inicio funciona aquí!)
    $setupContainer.style.display = 'none'; // Oculta el formulario de configuración
    $gameContainer.style.display = 'block'; // Muestra la interfaz de juego

    // 3. Actualizar la interfaz
    actualizarInterfaz();
}

/**
 * Función para volver a la configuración (botón de Regresar).
 */
function regresarAConfiguracion() {
    // 1. Transición de formularios
    $setupContainer.style.display = 'block'; // Muestra el formulario de configuración
    $gameContainer.style.display = 'none'; // Oculta la interfaz de juego
    
    // 2. Limpiar la ruleta
    $characterWheel.innerHTML = '<p class="initial-message">Presiona el botón para empezar</p>';
    $playerNameInput.style.border = '2px solid var(--smash-yellow)'; // Quitar borde rojo
}

// --- 5. FUNCIONES DE JUEGO AUXILIARES ---

function obtenerRango(racha) {
    if (racha >= 21) return { name: "LEYENDA", class: "rank-legend" };
    if (racha >= 11) return { name: "ÉLITE", class: "rank-elite" };
    if (racha >= 6) return { name: "VETERANO", class: "rank-veteran" };
    if (racha >= 1) return { name: "LUCHADOR", class: "rank-fighter" };
    return { name: "NOVATO", class: "rank-newcomer" };
}

function actualizarInterfaz() {
    const racha = rachaActual;
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
    } else {
        $newChallengeBtn.textContent = 'DAR NUEVO PERSONAJE';
    }
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
    
    rachaActual += 1;
    
    $characterWheel.innerHTML = '<p class="initial-message">¡Ganaste! Presiona "DAR NUEVO PERSONAJE" para seguir la racha.</p>';
    
    actualizarInterfaz();
}

function registrarDerrota() {
    if (!$characterWheel.querySelector('.character-name')) return;

    rachaActual = 0;
    personajesDisponibles = [...todosLosPersonajes];
    
    $characterWheel.innerHTML = '<p class="initial-message">¡Derrota! Racha Reiniciada. Presiona "DAR NUEVO PERSONAJE" para volver a empezar.</p>';
    
    actualizarInterfaz();
}


// --- 6. INICIALIZACIÓN Y EVENT LISTENERS ---

document.addEventListener('DOMContentLoaded', () => {
    // Evento para iniciar el juego (Transición del formulario)
    if ($confirmNameBtn) {
        $confirmNameBtn.addEventListener('click', iniciarJuego);
    }
    
    // Evento para regresar a la configuración
    if ($backToSetupBtn) {
        $backToSetupBtn.addEventListener('click', regresarAConfiguracion);
    }

    // Eventos del juego
    $newChallengeBtn.addEventListener('click', seleccionarPersonajeAleatorio);
    $winBtn.addEventListener('click', registrarVictoria);
    $loseBtn.addEventListener('click', registrarDerrota);
});