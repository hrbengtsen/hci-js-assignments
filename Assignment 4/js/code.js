// Define elements
const gameWindowElement = document.getElementById("game-window");
const greenButtonElement = document.getElementById("green-button");
const scoreElement = document.getElementById("score");
const resultsElement = document.getElementById("results");
const infoElement = document.getElementById("info");
const roundsContainerElement = document.getElementById("rounds-container");
let roundsElement = document.getElementById("rounds");

// Define game rounds and score
const amountOfRounds = 60;
let roundsLeft = amountOfRounds;
let score = 0;
scoreElement.innerText = score;

// Define calibration variables
let isCalibrated = false;
const amountOfCalibrationRounds = 6;
let calibrationRoundsLeft = amountOfCalibrationRounds;
roundsElement.innerText = amountOfCalibrationRounds;
let tps = []; // Array of throughputs
let tp; // Average throughput
let lastTimeTargetWasShown;

// Define other globals
let targetTimer;
let posX, posY, size;
const greenButtonPosX = greenButtonElement.getBoundingClientRect().left;
const greenButtonPosY = greenButtonElement.getBoundingClientRect().top;

function greenButtonClicked() {
    // Random delay until target is shown (1000-2000ms)
    let randomDelay = Math.floor(1e3 * Math.random() + 1e3);

    showGreenButton(false);

    if (isCalibrated) {
        infoElement.innerText = "Game in progress...";
        setTimeout(() => createTarget(), randomDelay);
    }
    else {
        infoElement.innerText = "Calibration round...";
        setTimeout(() => createCalibrationTarget(), randomDelay);
    }
}

function showGreenButton(bool) {
    if (bool) {
        greenButtonElement.style.display = "block";
    }
    else {
        greenButtonElement.style.display = "none";
    }
}

function targetClicked() {
    if (isCalibrated) {
        score++;
        roundsLeft--;
    }
    else {
        calibrationRoundsLeft--;

        // Calculate movement time in seconds
        let currentTime = new Date().getTime();
        let mt = (currentTime - lastTimeTargetWasShown) / 1000;

        // Subcalculations for index of difficulty
        let xx = Math.abs(posX - greenButtonPosX);
        let yy = Math.abs(posY - greenButtonPosY);
        let dist = Math.sqrt(xx * xx + yy * yy);

        // Calculate ID
        let id = Math.log2(dist / size) + 1;

        // Add round's throughput to array
        tps.push(id / mt);
    }
    removeTarget(document.getElementById("target"));
    updateRoundsAndScore();
}

function targetMissed() {
    roundsLeft--;
    removeTarget(document.getElementById("target"));
    updateRoundsAndScore();
}

function updateRoundsAndScore() {
    // Update score
    let prevScore = scoreElement.innerText;
    scoreElement.innerText = score;

    // Animate score if user got a point
    if (score > prevScore) {
        scoreElement.animate([
            // Keyframes
            { transform: 'translateY(0px)' }, 
            { transform: 'translateY(-10px)' },
            { transform: 'translateY(0px)' }
        ], { 
            // Timing options
            duration: 300
        });
    }

    // Update rounds
    if (isCalibrated) {
        roundsElement.innerText = roundsLeft;
    }
    else {
        roundsElement.innerText = calibrationRoundsLeft;
    }
}

function createTarget() {
    // Get random size (10, 30 or 50)
    size = chooseRandomSize(10, 30, 50);

    const targetElement = createTargetElement();

    // Calculate random position within game window
    posX = (Math.random() * (gameWindowElement.offsetWidth - size) + gameWindowElement.getBoundingClientRect().left).toFixed();
    posY = (Math.random() * (gameWindowElement.offsetHeight - size) + gameWindowElement.getBoundingClientRect().top).toFixed();

    // Set target's position
    targetElement.style.left = `${posX}px`;
    targetElement.style.top = `${posY}px`;

    gameWindowElement.appendChild(targetElement);

    // Subcalculations for index of difficulty    
    let xx = Math.abs(posX - greenButtonPosX);
    let yy = Math.abs(posY - greenButtonPosY);
    let dist = Math.sqrt(xx * xx + yy * yy);

    // Calculate ID
    let id = Math.log2(dist / size) + 1;

    // Calculate delay (in ms) before target dissappears, determined by id / tp (tp is avg throughput of calibration) + 50 ms to make times slightly easier
    let delay = (id / tp) * 1000 + 50;

    targetTimer = setTimeout(() => targetMissed(), delay);
}

function createCalibrationTarget() {
    // Arrays for procedural target positions
    let xList, yList;

    /*
        Swap between calibration round with (3 target conditions):
        - Large target large distance
        - Medium target medium distance 
        - Small target small distance 
    */
    switch (calibrationRoundsLeft % 3) {
        case 0:
            size = 50;
            xList = [100, 924];
            yList = [100, 668];
            break;

        case 1:
            size = 30;
            xList = [228, 796];
            yList = [228, 572];
            break;

        case 2:
            size = 10;
            xList = [356, 668];
            yList = [356, 476];
            break;
    }

    const targetElement = createTargetElement();

    // Calculate procedural position within game window
    posX = (xList[Math.floor(Math.random() * xList.length)] - size + gameWindowElement.getBoundingClientRect().left).toFixed();
    posY = (yList[Math.floor(Math.random() * yList.length)] - size + gameWindowElement.getBoundingClientRect().top).toFixed();

    // Set target's position
    targetElement.style.left = `${posX}px`;
    targetElement.style.top = `${posY}px`;

    gameWindowElement.appendChild(targetElement);

    // Remember time when the target was shown
    lastTimeTargetWasShown = new Date().getTime();
}

function removeTarget(e) {
    // Clear timer and remove target element
    clearTimeout(targetTimer);
    e.remove();

    if (calibrationRoundsLeft === 0) {
        // Calibration is over
        isCalibrated = true;

        // Update elements
        infoElement.innerText = "Calibration finished. Click to begin game";
        roundsContainerElement.innerHTML = `Rounds left: <span id="rounds">${roundsLeft}</span>`;
        roundsElement = roundsContainerElement.firstElementChild;
        greenButtonElement.className = "green-button fadeIn";
        showGreenButton(true);

        // Reset calibration rounds
        calibrationRoundsLeft = amountOfCalibrationRounds;

        // Calculate average throughput from calibration (tp)
        let sumOfTps = 0;
        for (let i = 0; i < tps.length; i++) {
            sumOfTps += tps[i];
        }
        tp = sumOfTps / tps.length;
    }
    else if (roundsLeft > 0) {
        // Calibration or game in progress
        showGreenButton(true);
        infoElement.innerText = "Click the circle to continue";
    }
    else {
        // Game finished
        let retryButtonElement = document.createElement("button");
        retryButtonElement.className = "retryButton fadeIn";
        resultsElement.appendChild(retryButtonElement).innerText = "Play again";
        retryButtonElement.onclick = restartGame;

        infoElement.innerText = "Click button to play again";
    }
}

function restartGame() {
    // Reset elements
    greenButtonElement.className = "green-button fadeIn calib";
    infoElement.innerText = "Click the circle to start calibration";
    roundsContainerElement.innerHTML = `Calibration rounds left: <span id="rounds">${calibrationRoundsLeft}</span>`;
    roundsElement = roundsContainerElement.firstElementChild;
    showGreenButton(true);

    // Reset variables
    isCalibrated = false;
    roundsLeft = amountOfRounds;
    score = 0;
    updateRoundsAndScore();

    // Remove retryButton
    while (resultsElement.lastElementChild) {
        resultsElement.removeChild(resultsElement.lastElementChild);
    }
}

function createTargetElement() {
    // Create target and set properties
    const targetElement = document.createElement("div");
    targetElement.id = "target";
    targetElement.onclick = targetClicked;
    targetElement.style.width = `${size}px`;
    targetElement.style.height = `${size}px`;
    targetElement.className = "target-button fadeIn";
    return targetElement;
}

// Utility function to choose a random size between 3 values
function chooseRandomSize(v1, v2, v3) {
    let random = Math.random();

    if (random < .33) {
        return v1;
    }
    else if (random > .33 && random < .66) {
        return v2;
    }
    else {
        return v3;
    }
}