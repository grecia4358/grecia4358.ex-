// ============================================
// JUEGO DE LA SERPIENTE - CÓDIGO COMPLETO
// ============================================

// PASO 1: OBTENER REFERENCIAS DEL DOM
// ============================================
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('start-button');

// ============================================
// PASO 2: CONSTANTES DEL JUEGO
// ============================================
// Tamaño de cada celda en píxeles
const gridSize = 20;
// Número de celdas en cada dirección (400 / 20 = 20 celdas)
const tileCount = canvas.width / gridSize;

// ============================================
// PASO 3: VARIABLES DEL JUEGO
// ============================================
// La serpiente es un array de segmentos {x, y}
// Cada segmento representa una celda en la cuadrícula
let snake = [
    {x: 10, y: 10}  // Solo la cabeza al inicio
];

// Posición de la comida {x, y}
let food = {};

// Dirección actual de la serpiente
// dx = dirección horizontal (-1 izquierda, 1 derecha, 0 nada)
// dy = dirección vertical (-1 arriba, 1 abajo, 0 nada)
let dx = 0;
let dy = 0;

// Puntuación del jugador
let score = 0;

// Estado del juego (si está corriendo o no)
let gameRunning = false;

// Velocidad del juego en milisegundos (100ms = 10 movimientos por segundo)
const gameSpeed = 100;

// Variable para guardar el intervalo del juego
let gameInterval;

// ============================================
// PASO 4: FUNCIÓN PARA GENERAR POSICIÓN ALEATORIA
// ============================================
function randomTile() {
    // Math.random() genera número entre 0 y 1
    // Multiplicamos por tileCount y redondeamos hacia abajo
    // Esto nos da un número entre 0 y 19 (para tileCount = 20)
    return Math.floor(Math.random() * tileCount);
}

// ============================================
// PASO 5: FUNCIÓN PARA GENERAR COMIDA
// ============================================
function generateFood() {
    // Generar posición aleatoria para la comida
    food = {
        x: randomTile(),
        y: randomTile()
    };
    
    // Asegurarse de que la comida no aparezca en la serpiente
    // Recorremos todos los segmentos de la serpiente
    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            // Si coincide, generamos otra posición
            generateFood();
            return;
        }
    }
}

// ============================================
// PASO 6: FUNCIÓN PARA DIBUJAR EL JUEGO
// ============================================
function drawGame() {
    // Limpiar el canvas (borrar todo lo anterior)
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar la serpiente
    ctx.fillStyle = 'lime';  // Color verde lima
    
    // Recorrer cada segmento de la serpiente
    for (let segment of snake) {
        // fillRect(x, y, ancho, alto)
        // Multiplicamos por gridSize para convertir coordenadas de celda a píxeles
        // Restamos 2 para dejar un pequeño margen entre segmentos
        ctx.fillRect(
            segment.x * gridSize,      // Posición X en píxeles
            segment.y * gridSize,      // Posición Y en píxeles
            gridSize - 2,              // Ancho del segmento
            gridSize - 2               // Alto del segmento
        );
    }
    
    // Dibujar la comida
    ctx.fillStyle = 'red';  // Color rojo
    ctx.fillRect(
        food.x * gridSize,
        food.y * gridSize,
        gridSize - 2,
        gridSize - 2
    );
}

// ============================================
// PASO 7: FUNCIÓN PARA MOVER LA SERPIENTE
// ============================================
function moveSnake() {
    // Crear nueva cabeza en la dirección actual
    const head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    };
    
    // ---- DETECCIÓN DE COLISIONES ----
    
    // 1. Colisión con las paredes
    // Si la cabeza sale del canvas, el juego termina
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }
    
    // 2. Colisión con sí misma
    // Verificar si la cabeza choca con algún segmento del cuerpo
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            gameOver();
            return;
        }
    }
    
    // ---- ACTUALIZAR POSICIÓN DE LA SERPIENTE ----
    
    // Agregar la nueva cabeza al inicio del array
    snake.unshift(head);
    
    // Verificar si la serpiente ha comido la comida
    if (head.x === food.x && head.y === food.y) {
        // Aumentar puntuación
        score += 10;
        scoreElement.textContent = `Puntuación: ${score}`;
        
        // Generar nueva comida
        generateFood();
        
        // NOTA: No eliminamos el último segmento (snake.pop())
        // para que la serpiente crezca
    } else {
        // Si no ha comido, eliminar el último segmento
        // para que la serpiente no crezca
        snake.pop();
    }
}

// ============================================
// PASO 8: FUNCIÓN DE GAME OVER
// ============================================
function gameOver() {
    // Detener el juego
    gameRunning = false;
    clearInterval(gameInterval);
    
    // Mostrar mensaje al jugador
    alert(`¡Juego Terminado!\nPuntuación Final: ${score}`);
    
    // Mostrar el botón de reiniciar
    startButton.textContent = 'Reiniciar Juego';
    startButton.style.display = 'block';
}

// ============================================
// PASO 9: BUCLE PRINCIPAL DEL JUEGO
// ============================================
function gameLoop() {
    // Si el juego no está corriendo, salir de la función
    if (!gameRunning) return;
    
    // Mover la serpiente (actualizar posiciones)
    moveSnake();
    
    // Dibujar todo en pantalla
    drawGame();
}

// ============================================
// PASO 10: FUNCIÓN PARA INICIAR EL JUEGO
// ============================================
function startGame() {
    // Reiniciar todas las variables
    snake = [{x: 10, y: 10}];  // Serpiente inicial de 1 segmento
    dx = 0;                     // Sin movimiento horizontal
    dy = 0;                     // Sin movimiento vertical
    score = 0;                  // Puntuación a 0
    
    // Actualizar la interfaz
    scoreElement.textContent = 'Puntuación: 0';
    
    // Generar la primera comida
    generateFood();
    
    // Indicar que el juego está corriendo
    gameRunning = true;
    
    // Ocultar el botón de iniciar
    startButton.style.display = 'none';
    
    // Iniciar el bucle del juego
    gameInterval = setInterval(gameLoop, gameSpeed);
}

// ============================================
// PASO 11: MANEJO DEL TECLADO
// ============================================
document.addEventListener('keydown', function(e) {
    // Si el juego no está corriendo, ignorar las teclas
    if (!gameRunning) return;
    
    // Códigos de las teclas de dirección
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    
    // Determinar la dirección actual
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;
    
    // IMPEDIR GIROS DE 180 GRADOS
    // La serpiente no puede ir directamente en sentido contrario
    // (ejemplo: no puede pasar de ir a la derecha a ir a la izquierda)
    
    // Tecla izquierda
    if (e.keyCode === LEFT_KEY && !goingRight) {
        dx = -1;  // Ir a la izquierda
        dy = 0;   // No hay movimiento vertical
    }
    
    // Tecla arriba
    if (e.keyCode === UP_KEY && !goingDown) {
        dx = 0;   // No hay movimiento horizontal
        dy = -1;  // Ir hacia arriba
    }
    
    // Tecla derecha
    if (e.keyCode === RIGHT_KEY && !goingLeft) {
        dx = 1;   // Ir a la derecha
        dy = 0;   // No hay movimiento vertical
    }
    
    // Tecla abajo
    if (e.keyCode === DOWN_KEY && !goingUp) {
        dx = 0;   // No hay movimiento horizontal
        dy = 1;   // Ir hacia abajo
    }
});

// ============================================
// PASO 12: EVENTO DEL BOTÓN DE INICIAR
// ============================================
startButton.addEventListener('click', startGame);

// ============================================
// PASO 13: DIBUJAR ESTADO INICIAL
// ============================================
// Dibujar el canvas vacío al cargar la página
drawGame();
