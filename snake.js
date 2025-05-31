const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const box = 20;
let snake = [{ x: 9 * box, y: 10 * box }];
let direction = 'RIGHT';
let food = spawnFood();
let score = 0;
let gameInterval;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw snake
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? '#0f0' : '#fff';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }
    // Draw food
    ctx.fillStyle = '#f00';
    ctx.fillRect(food.x, food.y, box, box);
    // Draw score
    document.getElementById('score').innerText = 'Score: ' + score;
}

function update() {
    let head = { x: snake[0].x, y: snake[0].y };
    if (direction === 'LEFT') head.x -= box;
    if (direction === 'UP') head.y -= box;
    if (direction === 'RIGHT') head.x += box;
    if (direction === 'DOWN') head.y += box;

    // Game over conditions
    if (
        head.x < 0 || head.x >= canvas.width ||
        head.y < 0 || head.y >= canvas.height ||
        collision(head, snake)
    ) {
        clearInterval(gameInterval);
        alert('Game Over! Your score: ' + score);
        document.location.reload();
        return;
    }

    // Eat food
    if (head.x === food.x && head.y === food.y) {
        score++;
        food = spawnFood();
    } else {
        snake.pop();
    }
    snake.unshift(head);
    draw();
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) return true;
    }
    return false;
}

function spawnFood() {
    let x, y;
    do {
        x = Math.floor(Math.random() * (canvas.width / box)) * box;
        y = Math.floor(Math.random() * (canvas.height / box)) * box;
    } while (snake.some(segment => segment.x === x && segment.y === y));
    return { x, y };
}

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    else if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    else if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
    else if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
});

draw();
gameInterval = setInterval(update, 120);
