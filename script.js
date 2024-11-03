// Get character, block, score, and countdown elements
var character = document.getElementById("character");
var block = document.getElementById("block");
var scoreDisplay = document.getElementById("score");
var countdownDisplay = document.getElementById("countdown");

// Initialize variables
var score = 0;
var gameSpeed = 1.5;
var isPaused = false;
var jumpCount = 0;
var scoreInterval;
var checkCollision;

// Double Jump Function (triggers only when clicking the game area)
document.getElementById("game").onclick = function() { jump(); };

function jump() {
    if (jumpCount < 2) {
        character.classList.add("animate");
        jumpCount++;
        setTimeout(function() {
            character.classList.remove("animate");
            if (character.getBoundingClientRect().bottom >= document.getElementById("game").getBoundingClientRect().bottom) {
                jumpCount = 0;
            }
        }, 500);
    }
}

// Countdown function before game starts
function startCountdown(callback) {
    countdownDisplay.style.display = "block";
    let countdown = 3;
    countdownDisplay.textContent = countdown;
    
    let countdownInterval = setInterval(function() {
        countdown--;
        countdownDisplay.textContent = countdown;
        
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            countdownDisplay.style.display = "none";
            callback(); // Start the game after countdown finishes
        }
    }, 1000);
}

// Update score every second
function updateScore() {
    score++;
    scoreDisplay.textContent = "Score: " + score;
}

// Randomize obstacle speed function
function randomizeSpeed() {
    gameSpeed = Math.random() * (2 - 1) + 1;
    block.style.animation = `block ${gameSpeed}s linear infinite`;
}

// Collision detection function
function startCollisionCheck() {
    checkCollision = setInterval(function() {
        var characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("bottom"));
        var blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));

        if (blockLeft < 80 && blockLeft > 50 && characterTop < 50) {
            block.style.animation = "none";
            block.style.display = "none";
            alert("Game Over! Final Score: " + score);
            clearInterval(checkCollision);
            clearInterval(scoreInterval);
        }
    }, 10);
}

// Start updating the score and randomizing speeds
function startGame() {
    score = 0;
    scoreDisplay.textContent = "Score: 0";
    block.style.display = "block";
    block.style.animation = `block ${gameSpeed}s linear infinite`;
    scoreInterval = setInterval(updateScore, 1000); // Update score every second
    startCollisionCheck();
}

// Pause and Restart functions
function pauseGame() {
    if (!isPaused) {
        clearInterval(checkCollision);
        clearInterval(scoreInterval);
        block.style.animationPlayState = 'paused';
        isPaused = true;
    } else {
        startCollisionCheck();
        scoreInterval = setInterval(updateScore, 1000); // Resume score updates
        block.style.animationPlayState = 'running';
        isPaused = false;
    }
}

function restartGame() {
    clearInterval(checkCollision);
    clearInterval(scoreInterval);
    score = 0;
    jumpCount = 0;
    block.style.animation = "none";
    setTimeout(() => {
        randomizeSpeed();
        startCountdown(startGame); // Start game after countdown
    }, 100); // Small delay to restart the block animation smoothly
}

// Start game with countdown on page load
startCountdown(startGame);

// Randomize the obstacle speed each time it resets
