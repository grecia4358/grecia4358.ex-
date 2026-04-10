const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

// Configuración
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
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar cuadrícula
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 0.5;
    for (let i = 0; i < canvas.width; i += box) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += box) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }

    // Dibujar serpiente
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == 0) ? "#4ade80" : "#22c55e"; // Cabeza más clara
        ctx.fillRect(snake[i].x, snake[i].y, box, box);

        // Borde con sombra
        ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.strokeStyle = "#14532d";
        ctx.lineWidth = 2;
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
        
        // Reset sombra
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Ojos en la cabeza
        if (i == 0) {
            ctx.fillStyle = "white";
            let eyeSize = 4;
            let eyeOffsetX = 4;
            let eyeOffsetY = 4;
            
            // Posición de ojos según dirección
            if (d == "LEFT" || d == "RIGHT") {
                ctx.fillRect(snake[i].x + eyeOffsetX, snake[i].y + eyeOffsetY, eyeSize, eyeSize);
                ctx.fillRect(snake[i].x + eyeOffsetX, snake[i].y + box - eyeOffsetY - eyeSize, eyeSize, eyeSize);
            } else {
                ctx.fillRect(snake[i].x + eyeOffsetX, snake[i].y + eyeOffsetY, eyeSize, eyeSize);
                ctx.fillRect(snake[i].x + box - eyeOffsetX - eyeSize, snake[i].y + eyeOffsetY, eyeSize, eyeSize);
            }
        }
    }

    // Dibujar comida (con efecto de brillo)
    ctx.shadowColor = "#ef4444";
    ctx.shadowBlur = 10;
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(food.x, food.y, box, box);
    
    // Reset sombra
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;

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
        
        // Fondo semitransparente
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Texto Game Over
        ctx.fillStyle = "#ff6b6b";
        ctx.font = "bold 40px 'Segoe UI'";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", canvas.width/2, canvas.height/2 - 20);
        
        // Puntuación final
        ctx.fillStyle = "#ffd700";
        ctx.font = "24px 'Segoe UI'";
        ctx.fillText(`Puntuación: ${score}`, canvas.width/2, canvas.height/2 + 30);
        
        return; // Detiene el dibujo
    }

    snake.unshift(newHead); // Añade nueva cabeza al inicio
}

// Llamar a draw() cada 100 milisegundos
let game = setInterval(draw, 100);
