// Game Management System
let currentGame = null;
let gameInstances = {};

function openGame(gameName) {
    const modal = document.getElementById('gameModal');
    const gameArea = document.getElementById('gameArea');
    
    gameArea.innerHTML = '';
    currentGame = gameName;
    
    switch(gameName) {
        case 'snake':
            initSnakeGame(gameArea);
            break;
        case 'flappybird':
            initFlappyBird(gameArea);
            break;
        case 'pong':
            initPong(gameArea);
            break;
        case 'tetris':
            initTetris(gameArea);
            break;
        case 'breakout':
            initBreakout(gameArea);
            break;
        case '2048':
            init2048(gameArea);
            break;
    }
    
    modal.style.display = 'block';
}

function closeGame() {
    document.getElementById('gameModal').style.display = 'none';
    if (gameInstances[currentGame] && gameInstances[currentGame].stop) {
        gameInstances[currentGame].stop();
    }
    currentGame = null;
}

window.onclick = function(event) {
    const modal = document.getElementById('gameModal');
    if (event.target === modal) {
        closeGame();
    }
}

// ==================== SNAKE GAME ====================
function initSnakeGame(container) {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    
    const scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'score-display';
    scoreDisplay.textContent = 'Score: 0';
    
    const instructions = document.createElement('div');
    instructions.className = 'instructions';
    instructions.textContent = 'Use Arrow Keys to move the snake. Eat red squares to grow!';
    
    container.appendChild(instructions);
    container.appendChild(canvas);
    container.appendChild(scoreDisplay);
    
    const ctx = canvas.getContext('2d');
    let snake = [{x: 200, y: 200}];
    let food = {x: Math.random() * 400, y: Math.random() * 400};
    let dx = 10;
    let dy = 0;
    let score = 0;
    let gameActive = true;
    
    const keyHandler = (e) => {
        switch(e.key) {
            case 'ArrowUp':
                if (dy === 0) { dx = 0; dy = -10; }
                break;
            case 'ArrowDown':
                if (dy === 0) { dx = 0; dy = 10; }
                break;
            case 'ArrowLeft':
                if (dx === 0) { dx = -10; dy = 0; }
                break;
            case 'ArrowRight':
                if (dx === 0) { dx = 10; dy = 0; }
                break;
        }
    };
    
    document.addEventListener('keydown', keyHandler);
    
    const update = () => {
        if (!gameActive) return;
        
        const head = {x: snake[0].x + dx, y: snake[0].y + dy};
        
        if (head.x < 0 || head.x >= 400 || head.y < 0 || head.y >= 400) {
            gameActive = false;
            alert(`Game Over! Final Score: ${score}`);
            document.removeEventListener('keydown', keyHandler);
            return;
        }
        
        for (let segment of snake) {
            if (head.x === segment.x && head.y === segment.y) {
                gameActive = false;
                alert(`Game Over! Final Score: ${score}`);
                document.removeEventListener('keydown', keyHandler);
                return;
            }
        }
        
        snake.unshift(head);
        
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            scoreDisplay.textContent = `Score: ${score}`;
            food = {x: Math.round(Math.random() * 39) * 10, y: Math.round(Math.random() * 39) * 10};
        } else {
            snake.pop();
        }
        
        ctx.fillStyle = '#0f0f1e';
        ctx.fillRect(0, 0, 400, 400);
        
        ctx.fillStyle = '#667eea';
        snake.forEach(segment => {
            ctx.fillRect(segment.x, segment.y, 10, 10);
        });
        
        ctx.fillStyle = '#f093fb';
        ctx.fillRect(food.x, food.y, 10, 10);
        
        setTimeout(update, 100);
    };
    
    gameInstances['snake'] = {
        stop: () => document.removeEventListener('keydown', keyHandler)
    };
    
    update();
}

// ==================== FLAPPY BIRD ====================
function initFlappyBird(container) {
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 480;
    
    const scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'score-display';
    scoreDisplay.textContent = 'Score: 0';
    
    const instructions = document.createElement('div');
    instructions.className = 'instructions';
    instructions.textContent = 'Click or Press SPACE to make the bird fly. Avoid the pipes!';
    
    container.appendChild(instructions);
    container.appendChild(canvas);
    container.appendChild(scoreDisplay);
    
    const ctx = canvas.getContext('2d');
    
    let bird = {x: 50, y: 150, width: 30, height: 30, velocity: 0};
    let gravity = 0.4;
    let pipes = [];
    let score = 0;
    let gameActive = true;
    let pipeCounter = 0;
    
    const flap = () => {
        if (gameActive) bird.velocity = -8;
    };
    
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') flap();
    });
    canvas.addEventListener('click', flap);
    
    const update = () => {
        if (!gameActive) return;
        
        bird.velocity += gravity;
        bird.y += bird.velocity;
        
        if (bird.y + bird.height > 480 || bird.y < 0) {
            gameActive = false;
            alert(`Game Over! Final Score: ${score}`);
            return;
        }
        
        pipeCounter++;
        if (pipeCounter > 100) {
            const gapSize = 120;
            const gapPos = Math.random() * (480 - gapSize);
            pipes.push({
                x: 320,
                top: gapPos,
                bottom: gapPos + gapSize,
                width: 60,
                passed: false
            });
            pipeCounter = 0;
        }
        
        pipes = pipes.filter(pipe => pipe.x > -60);
        
        pipes.forEach(pipe => {
            if (!pipe.passed && pipe.x < bird.x) {
                pipe.passed = true;
                score++;
                scoreDisplay.textContent = `Score: ${score}`;
            }
            
            if (bird.x < pipe.x + pipe.width &&
                bird.x + bird.width > pipe.x &&
                (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)) {
                gameActive = false;
                alert(`Game Over! Final Score: ${score}`);
            }
            
            pipe.x -= 3;
        });
        
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, 320, 480);
        
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
        
        ctx.fillStyle = '#228B22';
        pipes.forEach(pipe => {
            ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
            ctx.fillRect(pipe.x, pipe.bottom, pipe.width, 480 - pipe.bottom);
        });
        
        requestAnimationFrame(update);
    };
    
    gameInstances['flappybird'] = {
        stop: () => {
            document.removeEventListener('keydown', flap);
            canvas.removeEventListener('click', flap);
        }
    };
    
    update();
}

// ==================== PONG GAME ====================
function initPong(container) {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 400;
    
    const scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'score-display';
    scoreDisplay.textContent = 'Player 1: 0  |  Player 2: 0';
    
    const instructions = document.createElement('div');
    instructions.className = 'instructions';
    instructions.textContent = 'Player 1: W/S keys | Player 2: Arrow Up/Down | First to 5 wins!';
    
    container.appendChild(instructions);
    container.appendChild(canvas);
    container.appendChild(scoreDisplay);
    
    const ctx = canvas.getContext('2d');
    
    let paddle1 = {x: 10, y: 150, width: 10, height: 100, dy: 0, score: 0};
    let paddle2 = {x: 780, y: 150, width: 10, height: 100, dy: 0, score: 0};
    let ball = {x: 400, y: 200, radius: 8, dx: 4, dy: 4};
    
    const keys = {};
    document.addEventListener('keydown', (e) => keys[e.key] = true);
    document.addEventListener('keyup', (e) => keys[e.key] = false);
    
    const update = () => {
        if (keys['w'] && paddle1.y > 0) paddle1.y -= 5;
        if (keys['s'] && paddle1.y < 300) paddle1.y += 5;
        if (keys['ArrowUp'] && paddle2.y > 0) paddle2.y -= 5;
        if (keys['ArrowDown'] && paddle2.y < 300) paddle2.y += 5;
        
        ball.x += ball.dx;
        ball.y += ball.dy;
        
        if (ball.y - ball.radius < 0 || ball.y + ball.radius > 400) {
            ball.dy = -ball.dy;
        }
        
        if (ball.x - ball.radius < paddle1.x + paddle1.width &&
            ball.y > paddle1.y && ball.y < paddle1.y + paddle1.height) {
            ball.dx = -ball.dx;
            ball.x = paddle1.x + paddle1.width;
        }
        
        if (ball.x + ball.radius > paddle2.x &&
            ball.y > paddle2.y && ball.y < paddle2.y + paddle2.height) {
            ball.dx = -ball.dx;
            ball.x = paddle2.x - ball.radius;
        }
        
        if (ball.x < 0) {
            paddle2.score++;
            ball = {x: 400, y: 200, radius: 8, dx: 4, dy: 4};
        } else if (ball.x > 800) {
            paddle1.score++;
            ball = {x: 400, y: 200, radius: 8, dx: 4, dy: 4};
        }
        
        scoreDisplay.textContent = `Player 1: ${paddle1.score}  |  Player 2: ${paddle2.score}`;
        
        if (paddle1.score >= 5 || paddle2.score >= 5) {
            alert(`${paddle1.score >= 5 ? 'Player 1' : 'Player 2'} Wins!`);
            return;
        }
        
        ctx.fillStyle = '#0f0f1e';
        ctx.fillRect(0, 0, 800, 400);
        
        ctx.fillStyle = '#667eea';
        ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
        ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
        
        ctx.fillStyle = '#f093fb';
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();
        
        requestAnimationFrame(update);
    };
    
    gameInstances['pong'] = {stop: () => {}};
    update();
}

// ==================== TETRIS GAME ====================
function initTetris(container) {
    const canvas = document.createElement('canvas');
    canvas.width = 240;
    canvas.height = 400;
    
    const scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'score-display';
    scoreDisplay.textContent = 'Score: 0 | Level: 1';
    
    const instructions = document.createElement('div');
    instructions.className = 'instructions';
    instructions.textContent = 'Arrow Keys to move, UP to rotate. Drop pieces and clear lines!';
    
    container.appendChild(instructions);
    container.appendChild(canvas);
    container.appendChild(scoreDisplay);
    
    const ctx = canvas.getContext('2d');
    const gridWidth = 10;
    const gridHeight = 20;
    const blockSize = 24;
    
    let grid = Array(gridHeight).fill(null).map(() => Array(gridWidth).fill(0));
    let score = 0;
    let level = 1;
    let gameActive = true;
    
    const tetrominos = [
        {shape: [[1,1,1,1]], color: '#667eea'},
        {shape: [[1,1],[1,1]], color: '#f093fb'},
        {shape: [[0,1,0],[1,1,1]], color: '#764ba2'},
        {shape: [[1,0,0],[1,1,1]], color: '#00d4ff'},
        {shape: [[0,0,1],[1,1,1]], color: '#00ff88'},
        {shape: [[1,1,0],[0,1,1]], color: '#ffaa00'},
        {shape: [[0,1,1],[1,1,0]], color: '#ff5500'}
    ];
    
    let currentPiece = {
        shape: tetrominos[0].shape,
        color: tetrominos[0].color,
        x: 3,
        y: 0
    };
    
    const canPlacePiece = (piece, offsetX = 0, offsetY = 0) => {
        for (let row = 0; row < piece.shape.length; row++) {
            for (let col = 0; col < piece.shape[row].length; col++) {
                if (piece.shape[row][col]) {
                    const newX = piece.x + col + offsetX;
                    const newY = piece.y + row + offsetY;
                    
                    if (newX < 0 || newX >= gridWidth || newY >= gridHeight) return false;
                    if (newY >= 0 && grid[newY][newX]) return false;
                }
            }
        }
        return true;
    };
    
    const placePiece = () => {
        for (let row = 0; row < currentPiece.shape.length; row++) {
            for (let col = 0; col < currentPiece.shape[row].length; col++) {
                if (currentPiece.shape[row][col]) {
                    const y = currentPiece.y + row;
                    const x = currentPiece.x + col;
                    if (y >= 0 && y < gridHeight && x >= 0 && x < gridWidth) {
                        grid[y][x] = currentPiece.color;
                    }
                }
            }
        }
    };
    
    const clearLines = () => {
        let linesCleared = 0;
        for (let row = gridHeight - 1; row >= 0; row--) {
            if (grid[row].every(cell => cell !== 0)) {
                grid.splice(row, 1);
                grid.unshift(Array(gridWidth).fill(0));
                linesCleared++;
            }
        }
        if (linesCleared > 0) {
            score += linesCleared * 100;
            level = Math.floor(score / 500) + 1;
            scoreDisplay.textContent = `Score: ${score} | Level: ${level}`;
        }
    };
    
    const spawnNewPiece = () => {
        const randomTetromino = tetrominos[Math.floor(Math.random() * tetrominos.length)];
        currentPiece = {
            shape: randomTetromino.shape,
            color: randomTetromino.color,
            x: 3,
            y: 0
        };
        if (!canPlacePiece(currentPiece)) {
            gameActive = false;
            alert(`Game Over! Final Score: ${score}`);
        }
    };
    
    document.addEventListener('keydown', (e) => {
        if (!gameActive) return;
        switch(e.key) {
            case 'ArrowLeft':
                if (canPlacePiece(currentPiece, -1, 0)) currentPiece.x--;
                break;
            case 'ArrowRight':
                if (canPlacePiece(currentPiece, 1, 0)) currentPiece.x++;
                break;
            case 'ArrowDown':
                if (canPlacePiece(currentPiece, 0, 1)) currentPiece.y++;
                break;
            case 'ArrowUp':
                const rotated = currentPiece.shape[0].map((_, colIndex) =>
                    currentPiece.shape.map(row => row[colIndex]).reverse()
                );
                const temp = currentPiece.shape;
                currentPiece.shape = rotated;
                if (!canPlacePiece(currentPiece)) currentPiece.shape = temp;
                break;
        }
    });
    
    spawnNewPiece();
    
    const update = () => {
        if (!gameActive) return;
        
        if (canPlacePiece(currentPiece, 0, 1)) {
            currentPiece.y++;
        } else {
            placePiece();
            clearLines();
            spawnNewPiece();
        }
        
        ctx.fillStyle = '#0f0f1e';
        ctx.fillRect(0, 0, 240, 400);
        
        ctx.strokeStyle = '#333';
        for (let row = 0; row < gridHeight; row++) {
            for (let col = 0; col < gridWidth; col++) {
                ctx.strokeRect(col * blockSize, row * blockSize, blockSize, blockSize);
                if (grid[row][col]) {
                    ctx.fillStyle = grid[row][col];
                    ctx.fillRect(col * blockSize + 1, row * blockSize + 1, blockSize - 2, blockSize - 2);
                }
            }
        }
        
        for (let row = 0; row < currentPiece.shape.length; row++) {
            for (let col = 0; col < currentPiece.shape[row].length; col++) {
                if (currentPiece.shape[row][col]) {
                    const x = (currentPiece.x + col) * blockSize;
                    const y = (currentPiece.y + row) * blockSize;
                    ctx.fillStyle = currentPiece.color;
                    ctx.fillRect(x + 1, y + 1, blockSize - 2, blockSize - 2);
                }
            }
        }
        
        setTimeout(update, 500 - (level * 50));
    };
    
    gameInstances['tetris'] = {stop: () => {}};
    update();
}

// ==================== BREAKOUT GAME ====================
function initBreakout(container) {
    const canvas = document.createElement('canvas');
    canvas.width = 480;
    canvas.height = 400;
    
    const scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'score-display';
    scoreDisplay.textContent = 'Score: 0';
    
    const instructions = document.createElement('div');
    instructions.className = 'instructions';
    instructions.textContent = 'Use Arrow Keys or Mouse to move the paddle. Break all the bricks!';
    
    container.appendChild(instructions);
    container.appendChild(canvas);
    container.appendChild(scoreDisplay);
    
    const ctx = canvas.getContext('2d');
    
    let paddle = {x: 190, y: 370, width: 100, height: 15, dx: 0};
    let ball = {x: 240, y: 350, radius: 6, dx: 3, dy: -3};
    let bricks = [];
    let score = 0;
    let gameActive = true;
    
    const brickRows = 3;
    const brickCols = 6;
    const brickWidth = 70;
    const brickHeight = 15;
    const brickPadding = 10;
    
    for (let row = 0; row < brickRows; row++) {
        for (let col = 0; col < brickCols; col++) {
            bricks.push({
                x: col * (brickWidth + brickPadding) + 15,
                y: row * (brickHeight + brickPadding) + 20,
                width: brickWidth,
                height: brickHeight,
                active: true
            });
        }
    }
    
    const keys = {};
    document.addEventListener('keydown', (e) => keys[e.key] = true);
    document.addEventListener('keyup', (e) => keys[e.key] = false);
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        paddle.x = Math.max(0, Math.min(mouseX - paddle.width / 2, canvas.width - paddle.width));
    });
    
    const update = () => {
        if (!gameActive) return;
        
        if (keys['ArrowLeft'] && paddle.x > 0) paddle.x -= 6;
        if (keys['ArrowRight'] && paddle.x < 380) paddle.x += 6;
        
        ball.x += ball.dx;
        ball.y += ball.dy;
        
        if (ball.x - ball.radius < 0 || ball.x + ball.radius > 480) ball.dx = -ball.dx;
        if (ball.y - ball.radius < 0) ball.dy = -ball.dy;
        
        if (ball.x > paddle.x && ball.x < paddle.x + paddle.width &&
            ball.y + ball.radius > paddle.y && ball.y + ball.radius < paddle.y + paddle.height) {
            ball.dy = -ball.dy;
        }
        
        if (ball.y > 400) {
            gameActive = false;
            alert(`Game Over! Final Score: ${score}`);
        }
        
        bricks.forEach(brick => {
            if (brick.active &&
                ball.x > brick.x && ball.x < brick.x + brick.width &&
                ball.y > brick.y && ball.y < brick.y + brick.height) {
                brick.active = false;
                ball.dy = -ball.dy;
                score += 10;
                scoreDisplay.textContent = `Score: ${score}`;
            }
        });
        
        if (bricks.every(b => !b.active)) {
            alert(`You Won! Final Score: ${score}`);
            gameActive = false;
        }
        
        ctx.fillStyle = '#0f0f1e';
        ctx.fillRect(0, 0, 480, 400);
        
        ctx.fillStyle = '#667eea';
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
        
        ctx.fillStyle = '#f093fb';
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();
        
        bricks.forEach(brick => {
            if (brick.active) {
                ctx.fillStyle = '#00ff88';
                ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
            }
        });
        
        requestAnimationFrame(update);
    };
    
    gameInstances['breakout'] = {stop: () => {}};
    update();
}

// ==================== 2048 GAME ====================
function init2048(container) {
    const scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'score-display';
    scoreDisplay.textContent = 'Score: 0';
    
    const instructions = document.createElement('div');
    instructions.className = 'instructions';
    instructions.textContent = 'Use Arrow Keys to move tiles. Combine tiles with the same number to reach 2048!';
    
    const gameBoard = document.createElement('div');
    gameBoard.style.display = 'grid';
    gameBoard.style.gridTemplateColumns = 'repeat(4, 1fr)';
    gameBoard.style.gap = '10px';
    gameBoard.style.marginTop = '1rem';
    gameBoard.style.marginBottom = '1rem';
    gameBoard.style.padding = '10px';
    gameBoard.style.backgroundColor = '#2a2a3e';
    gameBoard.style.borderRadius = '10px';
    gameBoard.style.width = '320px';
    gameBoard.style.height = '320px';
    gameBoard.style.margin = '1rem auto';
    
    const resetBtn = document.createElement('button');
    resetBtn.className = 'game-btn';
    resetBtn.textContent = 'New Game';
    resetBtn.style.display = 'block';
    resetBtn.style.margin = '1rem auto';
    
    container.appendChild(instructions);
    container.appendChild(scoreDisplay);
    container.appendChild(gameBoard);
    container.appendChild(resetBtn);
    
    let board = [];
    let score = 0;
    let gameActive = true;
    
    const createBoard = () => {
        board = Array(4).fill(null).map(() => Array(4).fill(0));
        addNewTile();
        addNewTile();
        renderBoard();
    };
    
    const addNewTile = () => {
        let empty = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (board[i][j] === 0) empty.push({i, j});
            }
        }
        if (empty.length > 0) {
            const {i, j} = empty[Math.floor(Math.random() * empty.length)];
            board[i][j] = Math.random() < 0.9 ? 2 : 4;
        }
    };
    
    const renderBoard = () => {
        gameBoard.innerHTML = '';
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const tile = document.createElement('div');
                const value = board[i][j];
                tile.textContent = value || '';
                tile.style.display = 'flex';
                tile.style.alignItems = 'center';
                tile.style.justifyContent = 'center';
                tile.style.fontSize = '2rem';
                tile.style.fontWeight = 'bold';
                tile.style.borderRadius = '8px';
                tile.style.backgroundColor = value ? '#667eea' : '#1a1a2e';
                tile.style.color = value ? '#fff' : '#333';
                gameBoard.appendChild(tile);
            }
        }
        scoreDisplay.textContent = `Score: ${score}`;
    };
    
    const move = (direction) => {
        let moved = false;
        let newBoard = board.map(row => [...row]);
        
        const slideAndMerge = (arr) => {
            arr = arr.filter(val => val !== 0);
            for (let i = 0; i < arr.length - 1; i++) {
                if (arr[i] === arr[i + 1]) {
                    arr[i] *= 2;
                    score += arr[i];
                    arr.splice(i + 1, 1);
                }
            }
            while (arr.length < 4) arr.push(0);
            return arr;
        };
        
        if (direction === 'left' || direction === 'right') {
            for (let i = 0; i < 4; i++) {
                const old = newBoard[i].join('');
                newBoard[i] = direction === 'left' ? slideAndMerge(newBoard[i]) : slideAndMerge(newBoard[i].reverse()).reverse();
                if (newBoard[i].join('') !== old) moved = true;
            }
        } else {
            for (let j = 0; j < 4; j++) {
                let col = [newBoard[0][j], newBoard[1][j], newBoard[2][j], newBoard[3][j]];
                const old = col.join('');
                col = direction === 'up' ? slideAndMerge(col) : slideAndMerge(col.reverse()).reverse();
                if (col.join('') !== old) moved = true;
                for (let i = 0; i < 4; i++) newBoard[i][j] = col[i];
            }
        }
        
        if (moved) {
            board = newBoard;
            addNewTile();
            renderBoard();
            
            if (board.flat().some(val => val === 2048)) {
                alert('You reached 2048! Well done!');
            }
        }
    };
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') move('left');
        if (e.key === 'ArrowRight') move('right');
        if (e.key === 'ArrowUp') move('up');
        if (e.key === 'ArrowDown') move('down');
    });
    
    resetBtn.addEventListener('click', () => {
        score = 0;
        createBoard();
    });
    
    createBoard();
}

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({behavior: 'smooth'});
            document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        }
    });
});
