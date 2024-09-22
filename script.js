const canvas = document.getElementById("snakeGame");
const ctx = canvas.getContext("2d");

const box = 10;
let snake = []; // Start with an empty snake
let direction = "RIGHT";
let food = {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box,
};
let foodCount = 0;
let isPaused = false;
let isGameOver = false;
let speed = 200; // Initial speed in milliseconds

function initializeGame() {
    snake = []; // Reset snake to empty
    direction = "RIGHT";
    food = {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box,
    };
    foodCount = 0;
    isPaused = false;
    isGameOver = false;
    document.getElementById("foodCount").innerText = "Score: " + foodCount;
    document.getElementById("pausedScreen").style.display = "none";
    document.getElementById("gameOverScreen").style.display = "none";
}

// Initialize the game
initializeGame();

document.addEventListener("keydown", directionControl);

// Button controls for mobile
document.getElementById("left").addEventListener("click", () => {
    if (direction !== "RIGHT") direction = "LEFT";
});
document.getElementById("up").addEventListener("click", () => {
    if (direction !== "DOWN") direction = "UP";
});
document.getElementById("right").addEventListener("click", () => {
    if (direction !== "LEFT") direction = "RIGHT";
});
document.getElementById("down").addEventListener("click", () => {
    if (direction !== "UP") direction = "DOWN";
});

// Pause functionality
document.getElementById("pause").addEventListener("click", () => {
    isPaused = !isPaused;
    document.getElementById("pausedScreen").style.display = isPaused ? "flex" : "none"; // Show or hide paused screen
});

// Try Again functionality
document.getElementById("tryAgain").addEventListener("click", () => {
    initializeGame();
    speed = 200; // Reset speed to initial value
    game = setInterval(draw, speed); // Restart the game loop
});

function directionControl(event) {
    if (event.keyCode === 37 && direction !== "RIGHT") {
        direction = "LEFT";
    } else if (event.keyCode === 38 && direction !== "DOWN") {
        direction = "UP";
    } else if (event.keyCode === 39 && direction !== "LEFT") {
        direction = "RIGHT";
    } else if (event.keyCode === 40 && direction !== "UP") {
        direction = "DOWN";
    } else if (event.keyCode === 80) { // 'P' key for pause
        isPaused = !isPaused;
        document.getElementById("pausedScreen").style.display = isPaused ? "flex" : "none"; // Show or hide paused screen
    }
}

function draw() {
    if (isPaused || isGameOver) {
        return; // Stop drawing if paused or game over
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // Draw snake
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? "green" : "lightgreen";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = "white";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // Update food count display
    document.getElementById("foodCount").innerText = "Score: " + foodCount;

    // Old head position
    let snakeX = snake.length > 0 ? snake[0].x : 9 * box; // Start at the center if snake is empty
    let snakeY = snake.length > 0 ? snake[0].y : 9 * box; // Start at the center if snake is empty

    // Move the snake
    if (direction === "LEFT") snakeX -= box;
    if (direction === "UP") snakeY -= box;
    if (direction === "RIGHT") snakeX += box;
    if (direction === "DOWN") snakeY += box;

    // Check if the snake eats the food
    if (snakeX === food.x && snakeY === food.y) {
        food = {
            x: Math.floor(Math.random() * (canvas.width / box)) * box,
            y: Math.floor(Math.random() * (canvas.height / box)) * box,
        };
        foodCount++; // Increment food count

        // Increase speed every 5 food items
        if (foodCount % 5 === 0) {
            speed = Math.max(50, speed - 20); // Decrease interval to increase speed, minimum 50ms
            clearInterval(game);
            game = setInterval(draw, speed); // Restart the game loop with new speed
        }
    } else {
        // Remove the tail
        snake.pop();
    }

    // Add new head
    const newHead = { x: snakeX, y: snakeY };

    // Game over conditions
    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
        isGameOver = true;
        clearInterval(game);
        document.getElementById("gameOverScreen").style.display = "flex"; // Show game over screen
    }

    snake.unshift(newHead);
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

// Call draw function every 200 ms (initial speed)
let game = setInterval(draw, speed);