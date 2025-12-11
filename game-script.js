// --- 1. DATOS DE PERSONAJES (Se mantiene la lista) ---
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

// --- 2. VARIABLES DE ESTADO DEL JUEGO (Se cargarán desde LocalStorage) ---
let personajesDisponibles = [...todosLosPersonajes];
let jugadoresRachas = {}; 
let jugadorActivo = null;
let numJugadores = 1;

// --- 3. REFERENCIAS DEL DOM ---
const $backToSetupBtn = document.getElementById('back-to-setup-btn');
const $playerSwitchButtons = document.getElementById('player-switch-buttons');
const $currentPlayerDisplay = document.getElementById('current-player-display');
const $characterWheel = document.getElementById('character-wheel');
const $currentStreak = document.getElementById('current-streak');
const $currentRank = document.getElementById('current-rank');
const $newChallengeBtn = document.getElementById('new-challenge-btn');
const $winBtn = document.getElementById('win-btn');
const $loseBtn = document.getElementById('lose-btn');


// --- 4. LÓGICA DE CARGA Y GUARDADO ---

function cargarDatosDesdeLocalStorage() {
    const rachaData = localStorage.getItem('jugadoresRachas');
    const activoData = localStorage.getItem('jugadorActivo');

    if (rachaData && activoData) {
        jugadoresRachas = JSON.parse(rachaData);
        jugadorActivo = activoData;
        numJugadores = Object.keys(jugadoresRachas).length;
        
        // Si es multijugador, genera los botones y muestra el contenedor
        if (numJugadores > 1) {
            generarBotonesCambioJugador();
            $playerSwitchButtons.style.display = 'flex';
        } else {
            $playerSwitchButtons.style.display = 'none';
        }
        
        actualizarInterfaz();
        return true;
    } else {
        // Si no hay datos, regresa a la configuración
        alert("Error al cargar los datos. Regresando a la configuración.");
        window.location.href = 'index.html'; 
        return false;
    }
}

function guardarDatosEnLocalStorage() {
    localStorage.setItem('jugadoresRachas', JSON.stringify(jugadoresRachas));
    localStorage.setItem('jugadorActivo', jugadorActivo);
}

// --- 5. FUNCIONES DE JUEGO (Modificadas para guardar datos) ---

function generarBotonesCambioJugador() {
    $playerSwitchButtons.innerHTML = '';
    Object.keys(jugadoresRachas).forEach(nombre => {
        const btn = document.createElement('button');
        btn.textContent = nombre;
        btn.classList.add('smash-btn', 'player-switch-btn');
        btn.dataset.player = nombre;
        
        btn.addEventListener('click', () => {
            jugadorActivo = nombre;
            guardarDatosEnLocalStorage(); // Guarda el jugador activo
            actualizarInterfaz();
            $characterWheel.innerHTML = '<p class="initial-message">¡Nuevo jugador! Presiona "Nuevo Reto".</p>';
        });
        $playerSwitchButtons.appendChild(btn);
    });
}

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
    
    // ... (Lógica de botones y personajes disponibles) ...

    document.querySelectorAll('.player-switch-btn').forEach(btn => {
        if (btn.dataset.player === jugadorActivo) {
            btn.classList.add('active-player');
        } else {
            btn.classList.remove('active-player');
        }
    });
}

function seleccionarPersonajeAleatorio() {
    // ... (Lógica de la ruleta) ...
    // Después de la selección final:
    // ...
    // personajesDisponibles.splice(indiceFinal, 1); 
    // $characterWheel.innerHTML = `<p class="character-name">${personajeFinal}</p>`;
}

function registrarVictoria() {
    if (!$characterWheel.querySelector('.character-name')) return;
    
    jugadoresRachas[jugadorActivo] = (jugadoresRachas[jugadorActivo] || 0) + 1;
    guardarDatosEnLocalStorage(); // ¡GUARDAR!
    
    $characterWheel.innerHTML = '<p class="initial-message">¡Ganaste! Presiona "Nuevo Reto" para seguir la racha.</p>';
    
    actualizarInterfaz();
}

function registrarDerrota() {
    if (!$characterWheel.querySelector('.character-name')) return;

    jugadoresRachas[jugadorActivo] = 0;
    personajesDisponibles = [...todosLosPersonajes];
    guardarDatosEnLocalStorage(); // ¡GUARDAR!
    
    $characterWheel.innerHTML = '<p class="initial-message">¡Derrota! Racha Reiniciada. Presiona "Nuevo Reto" para volver a empezar.</p>';
    
    actualizarInterfaz();
}


// --- 6. INICIALIZACIÓN Y EVENT LISTENERS ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Cargar datos al iniciar game.html
    if (cargarDatosDesdeLocalStorage()) {
        // 2. Evento para REGRESAR A CONFIGURACIÓN
        $backToSetupBtn.addEventListener('click', () => {
            // Limpia los datos de LocalStorage para forzar una nueva configuración
            localStorage.clear();
            window.location.href = 'index.html'; 
        });

        // 3. Eventos del juego
        $newChallengeBtn.addEventListener('click', seleccionarPersonajeAleatorio);
        $winBtn.addEventListener('click', registrarVictoria);
        $loseBtn.addEventListener('click', registrarDerrota);
        
        // La actualización de interfaz ocurre dentro de cargarDatosDesdeLocalStorage
    }
});