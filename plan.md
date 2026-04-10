# plan: tutorial completo "juego snake" paso a paso

## objetivo
crar una pagina web interactiva con el clasico "juego de la serpiente " (snake) utilizadando HTML5 (canvas), css3 para el diseño y vanilla javascript para la logica del juego.

## Archivos clave 
* 'index.html' : Estructura de la pagina web (canvas y contenedor).
* 'style.css'  : diseño, colores y disposicion  de los elementos.
* 'script.js'  : toda la logica del juego ( movimiento, collisiones, puntunacion, controles).

## pasos de implemenetacion

### paso 1: estructura html ('index.html')
crearemos la estructura basica del documento html. incluiremos un elemento '<canvas> que sera el tablero de juego y un elemento para mostrar la puntuacion 

'''HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8>
    <meta name="viewport" content="width=device-width, initiañ-scale=1.0">
    <title>Juego snake</title>
    <link rel="stylesheet" href="style.css">
# Plan: Tutorial Completo "Juego Snake" Paso a Paso

## Objetivo
Crear una página web interactiva con el clásico "Juego de la Serpiente" (Snake) utilizando HTML5 (Canvas), CSS3 para el diseño y Vanilla JavaScript para la lógica del juego.

## Archivos Clave
*   `index.html`: Estructura de la página web (Canvas y contenedor).
*   `style.css`: Diseño, colores y disposición de los elementos.
*   `script.js`: Toda la lógica del juego (movimiento, colisiones, puntuación, controles).

## Pasos de Implementación

### Paso 1: Estructura HTML (`index.html`)
Crearemos la estructura básica del documento HTML. Incluiremos un elemento `<canvas>` que será el tablero de juego y un elemento para mostrar la puntuación.

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Juego Snake</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="game-container">
        <h1>Snake Game</h1>
        <div class="score-board">Puntuación: <span id="score">0</span></div>
        <canvas id="gameCanvas" width="400" height="400"></canvas>
    </div>
    <script src="script.js"></script>
</body>
</html>
```

### Paso 2: Estilos CSS (`style.css`)
Daremos estilo a la página para centrar el juego, dar un fondo al tablero y hacer que se vea atractivo.

```css
body {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    background-color: #2c3e50;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: white;
}

.game-container {
    text-align: center;
}

h1 {
    margin-bottom: 10px;
    color: #ecf0f1;
}

.score-board {
    font-size: 20px;
    margin-bottom: 15px;
    font-weight: bold;
    color: #f1c40f;
}

canvas {
    background-color: #34495e;
    border: 4px solid #bdc3c7;
    border-radius: 5px;
    box-shadow: 0 0 20px rgba(0,0,0,0.5);
}
```

### Paso 3: Lógica JavaScript (`script.js`)
Aquí es donde ocurre la magia. Dividiremos el código JS en varias partes lógicas:

1.  **Configuración Inicial:** Obtener el canvas, el contexto 2D y definir variables básicas (tamaño del bloque, variables de la serpiente, comida, puntuación, dirección).
2.  **Bucle del Juego (Game Loop):** Una función que se ejecuta repetidamente (usaremos `setTimeout` o `setInterval`) para actualizar el estado del juego y redibujarlo.
3.  **Dibujar:** Funciones para dibujar el fondo, la serpiente y la comida en el canvas.
4.  **Movimiento:** Actualizar la posición de la cabeza de la serpiente en función de la dirección actual.
5.  **Controles:** Escuchar los eventos del teclado (flechas) para cambiar la dirección.
6.  **Colisiones y Comer:** Comprobar si la serpiente choca contra las paredes, contra su propio cuerpo, o si se come la manzana (comida).

```javascript
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

// Configuracion
const box = 20; // Tamaño de cada "cuadrado"
let score = 0;
let d; // Dirección

// La Serpiente (un array de coordenadas)
let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };

// La Comida (posición aleatoria)
let food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
};

// Controles del teclado
document.addEventListener("keydown", direction);

function direction(event) {
    if (event.keyCode == 37 && d != "RIGHT") {
        d = "LEFT";
    } else if (event.keyCode == 38 && d != "DOWN") {
        d = "UP";
    } else if (event.keyCode == 39 && d != "LEFT") {
        d = "RIGHT";
    } else if (event.keyCode == 40 && d != "UP") {
        d = "DOWN";
    }
}

// Función para comprobar colisiones
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

// Dibujar todo en el canvas
function draw() {
    // Fondo
    ctx.fillStyle = "#34495e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar serpiente
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == 0) ? "#2ecc71" : "#27ae60"; // Cabeza más clara
        ctx.fillRect(snake[i].x, snake[i].y, box, box);

        ctx.strokeStyle = "#2c3e50";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // Dibujar comida
    ctx.fillStyle = "#e74c3c";
    ctx.fillRect(food.x, food.y, box, box);

    // Posición previa de la cabeza
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // Dirección
    if (d == "LEFT") snakeX -= box;
    if (d == "UP") snakeY -= box;
    if (d == "RIGHT") snakeX += box;
    if (d == "DOWN") snakeY += box;

    // Si come la comida
    if (snakeX == food.x && snakeY == food.y) {
        score++;
        scoreElement.innerHTML = score;
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
    } else {
        // Eliminar la cola si no come
        snake.pop();
    }

    // Nueva cabeza
    let newHead = { x: snakeX, y: snakeY };

    // Game Over (choca bordes o sí misma)
    if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(game);
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.fillRect(0,0, canvas.width, canvas.height);
        ctx.fillStyle = "#c0392b";
        ctx.font = "40px 'Segoe UI'";
        ctx.fillText("Game Over", 100, canvas.height/2);
        return; // Detiene el dibujo
    }

    snake.unshift(newHead); // Añade nueva cabeza al inicio
}

// Llamar a draw() cada 100 milisegundos
let game = setInterval(draw, 100);
```

## Verificación
1.  Crear los tres archivos (`index.html`, `style.css`, `script.js`) en la misma carpeta.
2.  Pegar el código correspondiente en cada archivo.
3.  Abrir el archivo `index.html` en cualquier navegador web moderno (Chrome, Firefox, Edge, Safari).
4.  El juego debería comenzar automáticamente. Usa las flechas del teclado para mover la serpiente, comer los bloques rojos y ver cómo aumenta tu puntuación.