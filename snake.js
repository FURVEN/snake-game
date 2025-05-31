const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const box = 20;
let snake, direction, food, score, gameInterval, started;

function resetGame() {
    snake = [{ x: 9 * box, y: 10 * box }];
    direction = 'RIGHT';
    food = spawnFood();
    score = 0;
    started = false;
    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? '#0f0' : '#fff';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }
    ctx.fillStyle = '#f00';
    ctx.fillRect(food.x, food.y, box, box);
    document.getElementById('score').innerText = 'Score: ' + score;
}

function update() {
    let head = { x: snake[0].x, y: snake[0].y };
    if (direction === 'LEFT') head.x -= box;
    if (direction === 'UP') head.y -= box;
    if (direction === 'RIGHT') head.x += box;
    if (direction === 'DOWN') head.y += box;

    // Game over
    if (
        head.x < 0 || head.x >= canvas.width ||
        head.y < 0 || head.y >= canvas.height ||
        collision(head, snake)
    ) {
        clearInterval(gameInterval);
        alert('Game Over! Your score: ' + score);
        resetGame();
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
    // snake.length가 1일 때는 충돌 체크 X
    if (array.length === 1) return false;
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
    } while (snake && snake.some(segment => segment.x === x && segment.y === y));
    return { x, y };
}

// 이벤트 리스너 한 번만 등록
// (중복 방지 위해 익명함수 대신 명시적 함수명 사용)
document.addEventListener('keydown', function handleKey(e) {
    if (!started && ['ArrowLeft','ArrowUp','ArrowRight','ArrowDown'].includes(e.key)) {
        started = true;
        gameInterval = setInterval(update, 120);
    }
    if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    else if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    else if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
    else if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
});

resetGame();
