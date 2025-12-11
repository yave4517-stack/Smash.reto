// --- 1. DATOS DE PERSONAJES (¡LISTA COMPLETA DE SSBU + DLC!) ---
const todosLosPersonajes = [
    // Personajes Base
    "Mario", "Donkey Kong", "Link", "Samus", "Dark Samus", "Yoshi", "Kirby", "Fox", "Pikachu", "Luigi", 
    "Captain Falcon", "Jigglypuff", "Peach", "Daisy", "Bowser", "Ice Climbers", "Sheik", "Zelda", 
    "Dr. Mario", "Pichu", "Falco", "Marth", "Lucina", "Young Link", "Ganondorf", "Mewtwo", "Roy", 
    "Chrom", "Mr. Game & Watch", "Meta Knight", "Pit", "Dark Pit", "Zero Suit Samus", "Wario", 
    "Snake", "Ike", "Pokémon Trainer", "Diddy Kong", "Lucas", "Sonic", "King Dedede", "Olimar", 
    "Lucario", "R.O.B.", "Toon Link", "Wolf", "Villager", "Mega Man", "Wii Fit Trainer", "Rosalina & Luma", 
    "Little Mac", "Greninja", "Palutena", "Pac-Man", "Robin", "Shulk", "Bowser Jr.", "Duck Hunt", 
    "Ryu", "Ken", "Cloud", "Corrin", "Bayonetta", 
    // Luchadores de Eco (ya incluidos arriba, pero se listan para ser explícitos)
    
    // Personajes DLC
    "Piranha Plant",
    // Fighters Pass Vol. 1
    "Joker", "Hero", "Banjo & Kazooie", "Terry", "Byleth",
    // Fighters Pass Vol. 2
    "Min Min", "Steve", "Sephiroth", "Pyra/Mythra", "Kazuya", "Sora"
];

// --- 2. VARIABLES DE ESTADO DEL JUEGO ---
let personajesDisponibles = [...todosLosPersonajes]; // Usamos una copia para eliminar
let personajesActuales = todosLosPersonajes.length;

let jugadoresRachas = { "Jugador 1": 0 }; // Objeto para rachas por jugador
let jugadorActivo = "Jugador 1";
let rachaMaxima = 0;

// Referencias del DOM
const $playerButtons = document.getElementById('player-buttons');
const $currentPlayerDisplay = document.getElementById('current-player-display');
const $characterWheel = document.getElementById('character-wheel');
const $currentStreak = document.getElementById('current-streak');
const $currentRank = document.getElementById('current-rank');
const $newChallengeBtn = document.getElementById('new-challenge-btn');
const $winBtn = document.getElementById('win-btn');
const $loseBtn = document.getElementById('lose-btn');


// --- 3. FUNCIONES DE LÓGICA ---

/**
 * 3.1. Rango: Determina el rango basado en la racha
 */
function obtenerRango(racha) {
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
    const racha = jugadoresRachas[jugadorActivo] || 0;
    const rango = obtenerRango(racha);

    $currentPlayerDisplay.innerHTML = `Jugador Activo: **${jugadorActivo}**`;
    $currentStreak.textContent = racha;
    
    // Actualizar Rango
    $currentRank.textContent = rango.name;
    $currentRank.className = `stat-value ${rango.class}`;

    // Deshabilitar botones si no hay personaje o personajes disponibles
    const desafioIniciado = $characterWheel.querySelector('.character-name');
    $winBtn.disabled = !desafioIniciado;
    $loseBtn.disabled = !desafioIniciado;
    $newChallengeBtn.disabled = personajesDisponibles.length === 0 && !desafioIniciado;

    if (personajesDisponibles.length === 0) {
        $newChallengeBtn.textContent = '¡RETO COMPLETADO! (Reiniciar)';
    } else {
        $newChallengeBtn.textContent = '✨ Nuevo Reto ✨';
    }
}

/**
 * 3.3. Ruleta/Selección: Muestra el efecto de selección y elige un personaje
 */
function seleccionarPersonajeAleatorio() {
    if (personajesDisponibles.length === 0) {
        // Reiniciar personajes si el reto está completo
        personajesDisponibles = [...todosLosPersonajes];
        personajesActuales = todosLosPersonajes.length;
    }

    $newChallengeBtn.disabled = true;
    $winBtn.disabled = true;
    $loseBtn.disabled = true;

    const duracionRuleta = 2000; // 2 segundos
    const pasos = 15;
    let contador = 0;
    
    // Función para mostrar un personaje aleatorio temporal
    const ruletaInterval = setInterval(() => {
        const tempIndex = Math.floor(Math.random() * personajesDisponibles.length);
        const tempCharacter = personajesDisponibles[tempIndex];
        $characterWheel.innerHTML = `<p class="character-name" style="font-size: 2em; color: #fff;">${tempCharacter}</p>`;
        
        contador++;
        if (contador >= pasos) {
            clearInterval(ruletaInterval);
            
            // Lógica final de selección
            const indiceFinal = Math.floor(Math.random() * personajesDisponibles.length);
            const personajeFinal = personajesDisponibles[indiceFinal];
            
            // Eliminar de la lista de disponibles
            personajesDisponibles.splice(indiceFinal, 1);

            // Mostrar resultado final
            $characterWheel.innerHTML = `<p class="character-name">${personajeFinal}</p>`;

            // Habilitar botones de resultado
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
    if (!$characterWheel.querySelector('.character-name')) return; // No hay reto activo

    jugadoresRachas[jugadorActivo] = (jugadoresRachas[jugadorActivo] || 0) + 1;
    
    // Limpiar el personaje de la pantalla
    $characterWheel.innerHTML = '<p class="initial-message">¡Ganaste! Presiona "Nuevo Reto" para seguir la racha.</p>';
    
    actualizarInterfaz();
}

/**
 * 3.5. Resultado: Maneja la derrota (reinicia racha y personajes disponibles)
 */
function registrarDerrota() {
    if (!$characterWheel.querySelector('.character-name')) return; // No hay reto activo

    // 1. Reinicia la racha del jugador activo
    const rachaAntes = jugadoresRachas[jugadorActivo];
    if (rachaAntes > rachaMaxima) {
        rachaMaxima = rachaAntes;
        alert(`¡Racha Máxima! ${jugadorActivo} alcanzó ${rachaAntes} Wins.`);
    }

    jugadoresRachas[jugadorActivo] = 0;

    // 2. Reinicia la lista completa de personajes disponibles
    personajesDisponibles = [...todosLosPersonajes];
    
    // 3. Limpiar el personaje de la pantalla
    $characterWheel.innerHTML = '<p class="initial-message">¡Derrota! Racha Reiniciada. Presiona "Nuevo Reto" para volver a empezar.</p>';
    
    actualizarInterfaz();
}


// --- 4. LÓGICA MULTIJUGADOR ---

/**
 * 4.1. Genera botones de 1 a 8 jugadores
 */
function generarBotonesJugadores() {
    $playerButtons.innerHTML = '';
    for (let i = 1; i <= 8; i++) {
        const btn = document.createElement('button');
        const nombreJugador = `Jugador ${i}`;
        btn.textContent = `${i}P`;
        btn.dataset.player = nombreJugador;

        // Inicializa rachas si aún no existe
        if (!jugadoresRachas[nombreJugador]) {
            jugadoresRachas[nombreJugador] = 0;
        }

        btn.addEventListener('click', () => {
            // Cambiar jugador activo
            jugadorActivo = nombreJugador;
            // Actualizar apariencia de botones
            document.querySelectorAll('.btn-group button').forEach(b => b.classList.remove('active-player'));
            btn.classList.add('active-player');
            // Actualizar display
            actualizarInterfaz();
        });
        $playerButtons.appendChild(btn);
    }
    // Establecer el Jugador 1 como activo por defecto
    $playerButtons.querySelector('button').classList.add('active-player');
}


// --- 5. INICIALIZACIÓN Y EVENT LISTENERS ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar botones de jugador
    generarBotonesJugadores();

    // 2. Establecer el estado inicial
    actualizarInterfaz();

    // 3. Asignar eventos a los botones de acción
    $newChallengeBtn.addEventListener('click', seleccionarPersonajeAleatorio);
    $winBtn.addEventListener('click', registrarVictoria);
    $loseBtn.addEventListener('click', registrarDerrota);
});