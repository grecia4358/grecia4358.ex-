# 🎮 Tutorial Completo: Juego de la Serpiente (Snake Game)

## 📚 Introducción

¡Bienvenido a este tutorial completo! En esta guía aprenderás paso a paso cómo crear el clásico juego de la serpiente usando HTML, CSS y JavaScript puro. No necesitas experiencia previa en programación, aunque es útil tener conocimientos básicos.

### ¿Qué aprenderás?
- ✅ Manipular el DOM (Document Object Model)
- ✅ Trabajar con el elemento Canvas para dibujar gráficos
- ✅ Manejar eventos del teclado
- ✅ Implementar lógica de juegos (colisiones, movimiento)
- ✅ Usar estructuras de datos (arrays, objetos)
- ✅ Entender el concepto de game loop (bucle del juego)

---

## 🛠️ Paso 1: Estructura del Proyecto

Crea una carpeta para tu proyecto con esta estructura:

```
mi-proyecto-snake/
├── index.html    ← Estructura de la página web
├── style.css     ← Estilos visuales
└── script.js     ← Toda la lógica del juego
```

### ¿Por qué separamos en 3 archivos?
- **HTML**: Estructura y contenido
- **CSS**: Presentación y estilos
- **JavaScript**: Comportamiento y lógica

---

## 📄 Paso 2: Crear el HTML (index.html)

El archivo HTML define la estructura de nuestra página. Aquí creamos el "lienzo" donde se dibujará el juego.

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Juego de la Serpiente</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="game-container">
        <h1>🐍 Juego de la Serpiente</h1>
        <div id="score">Puntuación: 0</div>
        <canvas id="game-canvas" width="400" height="400"></canvas>
        <button id="start-button">Iniciar Juego</button>
    </div>
    <script src="script.js"></script>
</body>
</html>
```

### Explicación línea por línea:

| Etiqueta | Propósito |
|----------|-----------|
| `<!DOCTYPE html>` | Indica que es HTML5 |
| `<canvas>` | Elemento para dibujar gráficos 2D |
| `width="400"` | Ancho del área de juego |
| `height="400"` | Alto del área de juego |
| `<script src="script.js">` | Enlace al archivo JavaScript |

---

## 🎨 Paso 3: Crear los Estilos (style.css)

Los estilos CSS hacen que nuestro juego se vea profesional y atractivo.

```css
/* Reset básico */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* Estilos del cuerpo */
body {
    font-family: Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0;
    background-color: #1a1a2e;
}

/* Contenedor del juego */
#game-container {
    text-align: center;
    background-color: #16213e;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

/* Título */
h1 {
    color: #4ade80;
    margin-bottom: 15px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

/* Puntuación */
#score {
    font-size: 24px;
    color: #fbbf24;
    margin-bottom: 15px;
    font-weight: bold;
}

/* Lienzo del juego */
#game-canvas {
    border: 4px solid #4ade80;
    border-radius: 10px;
    background-color: #000;
    box-shadow: 0 0 20px rgba(74, 222, 128, 0.3);
}

/* Botón */
button {
    padding: 15px 30px;
    font-size: 18px;
    background-color: #4ade80;
    color: #1a1a2e;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 20px;
    font-weight: bold;
    transition: all 0.3s ease;
}

button:hover {
    background-color: #22c55e;
    transform: scale(1.05);
}
```

---

## 💻 Paso 4: La Lógica en JavaScript (script.js)

Ahora viene la parte más importante. Vamos a construir el juego paso a paso.

---

### 4.1 Configuración Inicial

Primero, obtenemos referencias a los elementos HTML y definimos constantes:

```javascript
// Obtener elementos del HTML
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');  // Contexto 2D para dibujar
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('start-button');

// Tamaño de cada celda en píxeles
const gridSize = 20;

// Número de celdas (400 / 20 = 20 celdas)
const tileCount = canvas.width / gridSize;

// Velocidad del juego (milisegundos entre cada movimiento)
const gameSpeed = 100;
```

### 📖 Concepto clave: Canvas
El `<canvas>` es como un lienzo en blanco donde podemos dibujar usando JavaScript. Usamos `getContext('2d')` para obtener las herramientas de dibujo.

---

### 4.2 Variables del Juego

```javascript
// La serpiente es un array de segmentos
// Cada segmento tiene coordenadas {x, y}
let snake = [
    {x: 10, y: 10}  // Solo la cabeza al inicio
];

// Posición de la comida
let food = {};

// Dirección actual de la serpiente
// dx = movimiento horizontal (-1 izq, 1 der, 0 quieto)
// dy = movimiento vertical (-1 arriba, 1 abajo, 0 quieto)
let dx = 0;
let dy = 0;

// Puntuación del jugador
let score = 0;

// ¿El juego está activo?
let gameRunning = false;

// Referencia al intervalo del juego
let gameInterval;
```

### 📖 Concepto clave: Sistema de coordenadas
```
(0,0) ──────────────→ X
  │
  │  ┌────────────────────┐
  │  │  (0,0) a (19,19)   │
  │  │  Área de juego     │
  ▼  │  20x20 celdas      │
  Y  └────────────────────┘
```

---

### 4.3 Generar Comida Aleatoria

```javascript
// Genera un número aleatorio entre 0 y 19
function randomTile() {
    return Math.floor(Math.random() * tileCount);
}

// Genera nueva comida en posición aleatoria
function generateFood() {
    food = {
        x: randomTile(),
        y: randomTile()
    };
    
    // Verificar que la comida no esté en la serpiente
    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            generateFood();  // Regenerar si coincide
            return;
        }
    }
}
```

### 📖 Concepto clave: Recursión
Cuando la comida coincide con la serpiente, llamamos a la misma función para generar otra posición. Esto se llama **recursión**.

---

### 4.4 Dibujar el Juego

```javascript
function drawGame() {
    // 1. Limpiar el canvas (fondo negro)
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 2. Dibujar la serpiente (segmentos verdes)
    ctx.fillStyle = 'lime';
    
    for (let segment of snake) {
        ctx.fillRect(
            segment.x * gridSize,  // Posición X
            segment.y * gridSize,  // Posición Y
            gridSize - 2,          // Ancho (con margen)
            gridSize - 2           // Alto (con margen)
        );
    }
    
    // 3. Dibujar la comida (cuadrado rojo)
    ctx.fillStyle = 'red';
    ctx.fillRect(
        food.x * gridSize,
        food.y * gridSize,
        gridSize - 2,
        gridSize - 2
    );
}
```

### 📖 Concepto clave: El Bucle For
```javascript
// El bucle "for...of" recorre cada elemento del array
for (let segment of snake) {
    // 'segment' toma el valor de cada elemento
    console.log(segment.x, segment.y);
}
```

---

### 4.5 Mover la Serpiente

Esta es la función más importante del juego:

```javascript
function moveSnake() {
    // 1. Crear nueva cabeza en la dirección actual
    const head = {
        x: snake[0].x + dx,  // Mover en X según dx
        y: snake[0].y + dy   // Mover en Y según dy
    };
    
    // 2. DETECCIÓN DE COLISIONES
    
    // ¿Chocó con las paredes?
    if (head.x < 0 || head.x >= tileCount || 
        head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }
    
    // ¿Chocó consigo misma?
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            gameOver();
            return;
        }
    }
    
    // 3. Agregar nueva cabeza al array
    snake.unshift(head);  // .unshift() agrega al inicio
    
    // 4. ¿Comió la comida?
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = `Puntuación: ${score}`;
        generateFood();
        // NOTA: No usamos .pop() → la serpiente crece
    } else {
        snake.pop();  // Eliminar cola para no crecer
    }
}
```

### 📖 Concepto clave: Arrays y Métodos

```javascript
// snake = [{x:10, y:10}]

snake.unshift({x:11, y:10});  
// snake = [{x:11, y:10}, {x:10, y:10}]

snake.pop();
// snake = [{x:11, y:10}]
```

---

### 4.6 Game Over

```javascript
function gameOver() {
    // Detener el juego
    gameRunning = false;
    clearInterval(gameInterval);  // Limpiar el bucle
    
    // Mostrar resultado
    alert(`¡Juego Terminado!\nPuntuación Final: ${score}`);
    
    // Mostrar botón de reiniciar
    startButton.textContent = 'Reiniciar Juego';
    startButton.style.display = 'block';
}
```

### 📖 Concepto clave: setInterval y clearInterval

```javascript
// setInterval(ejecutarEsto, cadaCuantosMs)
// Llama a gameLoop() cada 100 milisegundos

gameInterval = setInterval(gameLoop, 100);

// clearInterval detiene el intervalo
clearInterval(gameInterval);
```

---

### 4.7 El Bucle Principal del Juego

```javascript
function gameLoop() {
    if (!gameRunning) return;
    
    moveSnake();  // Mover serpiente
    drawGame();   // Dibujar todo
}
```

### 📖 Concepto clave: Game Loop
```
┌─────────────────────────┐
│      gameLoop()          │
├─────────────────────────┤
│  1. ¿Juego activo?      │→ No → Salir
│         ↓ Sí            │
│  2. Mover serpiente     │
│         ↓               │
│  3. Detectar colisiones │
│         ↓               │
│  4. ¿Comió? → Crecer    │
│         ↓               │
│  5. Dibujar en pantalla │
│         ↓               │
│  6. Repetir (cada 100ms)│
└─────────────────────────┘
```

---

### 4.8 Iniciar el Juego

```javascript
function startGame() {
    // Reiniciar todo
    snake = [{x: 10, y: 10}];
    dx = 0;
    dy = 0;
    score = 0;
    
    scoreElement.textContent = 'Puntuación: 0';
    generateFood();
    
    // Activar juego
    gameRunning = true;
    startButton.style.display = 'none';
    
    // Iniciar bucle
    gameInterval = setInterval(gameLoop, gameSpeed);
}
```

---

### 4.9 Control con Teclado

```javascript
document.addEventListener('keydown', function(e) {
    if (!gameRunning) return;
    
    // Códigos de teclas
    const LEFT  = 37;
    const RIGHT = 39;
    const UP    = 38;
    const DOWN  = 40;
    
    // Dirección actual
    const goingUp    = dy === -1;
    const goingDown  = dy === 1;
    const goingLeft  = dx === -1;
    const goingRight = dx === 1;
    
    // Cambiar dirección (¡sin giros de 180°!)
    if (e.keyCode === LEFT && !goingRight) {
        dx = -1; dy = 0;
    }
    if (e.keyCode === UP && !goingDown) {
        dx = 0; dy = -1;
    }
    if (e.keyCode === RIGHT && !goingLeft) {
        dx = 1; dy = 0;
    }
    if (e.keyCode === DOWN && !goingUp) {
        dx = 0; dy = 1;
    }
});

// Botón de iniciar
startButton.addEventListener('click', startGame);
```

### 📖 Concepto clave: Prevenir Giros de 180°
```
❌ NO permitimos:       ✅ Permitido:
← ────────── →         ← ──┐
(giro instantáneo)       │ ↓
                         └─┐
                           │
```

---

## 🚀 Paso 5: Ejecutar el Juego

1. Abre `index.html` en tu navegador (doble clic en el archivo)
2. Haz clic en **"Iniciar Juego"**
3. Usa las **flechas del teclado** para mover la serpiente
4. Come la **comida roja** para ganar puntos
5. ¡Evita chocar con las **paredes** y **contigo mismo**!

---

## 🎯 Ejercicios de Práctica

Después de completar el tutorial, intenta hacer estas mejoras:

### Nivel Fácil:
1. Cambiar los colores de la serpiente y comida
2. Modificar la velocidad del juego
3. Cambiar el tamaño del canvas

### Nivel Intermedio:
1. Agregar un **segundo jugador** (controles con WASD)
2. Implementar **múltiples comidas** a la vez
3. Añadir **obstáculos** en el campo de juego

### Nivel Avanzado:
1. Guardar la **mejor puntuación** usando localStorage
2. Agregar **efectos de sonido**
3. Implementar **niveles de dificultad** que aumenten la velocidad
4. Añadir **pausa del juego** con la barra espaciadora

---

## 🔧 Solución de Problemas Comunes

### El juego no inicia
- Verifica que los archivos estén en la misma carpeta
- Comprueba que no haya errores en la consola del navegador (F12)

### La serpiente no responde
- Verifica que `gameRunning === true`
- Revisa que los eventos del teclado estén configurados

### Errores de "undefined"
- Asegúrate que `food` tenga valores antes de usarla
- Verifica que todos los elementos HTML existan

---

## 📊 Diagrama del Flujo Completo

```
┌─────────────────────────────────────────────────────────┐
│                    INICIO DEL JUEGO                     │
│                   (Click en botón)                      │
└─────────────────────────┬───────────────────────────────┘
                          ↓
┌────────────────────────────────────────────────────────┐
│                    startGame()                         │
│  • Reiniciar serpiente                                 │
│  • Generar comida                                      │
│  • gameRunning = true                                  │
│  • Iniciar setInterval(gameLoop, 100)                  │
└─────────────────────────┬──────────────────────────────┘
                          ↓
┌────────────────────────────────────────────────────────┐
│               GAME LOOP (cada 100ms)                   │
├────────────────────────────────────────────────────────┤
│ 1. moveSnake()                                         │
│    • Calcular nueva posición de cabeza                 │
│    • Detectar colisiones (paredes, cuerpo)             │
│    • Si come → score++, generar nueva comida           │
│    • Si no come → snake.pop()                          │
├────────────────────────────────────────────────────────┤
│ 2. drawGame()                                          │
│    • Limpiar canvas                                    │
│    • Dibujar serpiente                                 │
│    • Dibujar comida                                    │
└─────────────────────────┬──────────────────────────────┘
                          ↓
          ┌───────────────┴───────────────┐
          ↓                               ↓
   ¿Game Over?                      ¿gameRunning?
          ↓                               ↓
     gameOver()                    Repetir loop
     • clearInterval
     • Mostrar alerta
     • Mostrar botón
```

---

## 🎓 Resumen de Conceptos Aprendidos

| Concepto | Descripción | Ejemplo |
|----------|-------------|---------|
| DOM | Modelo de objetos del documento | `document.getElementById()` |
| Canvas | Elemento para gráficos 2D | `canvas.getContext('2d')` |
| Array | Lista de elementos | `snake = [{x:10, y:10}]` |
| Objeto | Estructura con propiedades | `{x: 10, y: 10}` |
| Event Listener | Detecta acciones del usuario | `addEventListener('click')` |
| setInterval | Ejecuta código repetidamente | `setInterval(fn, 100)` |
| Condicionales | Ejecut
