// Define elements
const gameWindowElement = document.getElementById("game-window");
const greenButtonElement = document.getElementById("green-button");
const scoreElement = document.getElementById("score");

const roundsContainerElement = document.getElementById("rounds-container");
let roundsElement = document.getElementById("rounds");

const resultsElement = document.getElementById("results");
const infoElement = document.getElementById("info");

// Define rounds & score
const amountOfRounds = 60;
let roundsLeft = amountOfRounds;
let score = 0;
scoreElement.innerText = score;

// Define times & timers
let targetTimer;
let isCalibrated = false;
const amountOfCalibrationRounds = 6;
let calibrationRoundsLeft = amountOfCalibrationRounds;
roundsElement.innerText = amountOfCalibrationRounds;
let tps = [];
let tp;
let lastTimeTargetWasShown;
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
        let currentTime = new Date().getTime();
        let mt = (currentTime - lastTimeTargetWasShown) / 1000;

        let xx = Math.abs(posX - greenButtonPosX);
        let yy = Math.abs(posY - greenButtonPosY);

        let dist = Math.sqrt(xx * xx + yy * yy);

        let id = Math.log2(dist / size) + 1;
        console.log("DISTANCE: " + dist);
        console.log("MT: " + mt);
        console.log("ID: " + id);
        console.log("ID/MT: " + id / mt);
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
    scoreElement.innerText = score;

    if (isCalibrated) {
        roundsElement.innerText = roundsLeft;
    }
    else {
        roundsElement.innerText = calibrationRoundsLeft;
    }
}

function createTarget() {
    size = chooseRandomSize(10, 30, 50);
    const targetElement = document.createElement("div");
    targetElement.id = "target";
    targetElement.onclick = targetClicked;
    targetElement.style.width = `${size}px`;
    targetElement.style.height = `${size}px`;
    targetElement.className = "target-button fadeIn";

    posX = (Math.random() * (gameWindowElement.offsetWidth - size) + gameWindowElement.getBoundingClientRect().left).toFixed();
    posY = (Math.random() * (gameWindowElement.offsetHeight - size) + gameWindowElement.getBoundingClientRect().top).toFixed();

    targetElement.style.left = `${posX}px`;
    targetElement.style.top = `${posY}px`;

    gameWindowElement.appendChild(targetElement);

    // Calculate delay before target dissappears, determined by id / tp (tp is avg throughput of calibration)
    let xx = Math.abs(posX - greenButtonPosX);
    let yy = Math.abs(posY - greenButtonPosY);

    let dist = Math.sqrt(xx * xx + yy * yy);

    let id = Math.log2(dist / size) + 1;

    console.log("id in game: " + id);
    console.log("avg tp: " + tp);
    let delay = (id / tp) * 1000;
    console.log("Delay: " + delay);

    targetTimer = setTimeout(() => targetMissed(), delay);
}

function createCalibrationTarget() {
    let xList, yList;

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

    const targetElement = document.createElement("div");
    targetElement.id = "target";
    targetElement.onclick = targetClicked;
    targetElement.style.width = `${size}px`;
    targetElement.style.height = `${size}px`;
    targetElement.className = "target-button fadeIn";

    posX = (xList[Math.floor(Math.random() * xList.length)] - size + gameWindowElement.getBoundingClientRect().left).toFixed();
    posY = (yList[Math.floor(Math.random() * yList.length)] - size + gameWindowElement.getBoundingClientRect().top).toFixed();

    targetElement.style.left = `${posX}px`;
    targetElement.style.top = `${posY}px`;
    gameWindowElement.appendChild(targetElement);

    lastTimeTargetWasShown = new Date().getTime();
}

function removeTarget(e) {
    clearTimeout(targetTimer);
    e.remove();

    if (calibrationRoundsLeft === 0) {
        isCalibrated = true;
        infoElement.innerText = "Calibration finished. Click to begin game";
        roundsContainerElement.innerHTML = `Rounds left: <span id="rounds">${roundsLeft}</span>`;
        showGreenButton(true);
        calibrationRoundsLeft = amountOfCalibrationRounds;
        roundsElement = roundsContainerElement.firstElementChild;

        let sumOfTps = 0;
        for (let i = 0; i < tps.length; i++) {
            sumOfTps += tps[i];
        }
        tp = sumOfTps / tps.length;
    }
    else if (roundsLeft > 0) {
        showGreenButton(true);
        infoElement.innerText = "Click the green circle to continue";
    }
    else {
        let retryButtonElement = document.createElement("button");
        retryButtonElement.className = "retryButton fadeIn";
        resultsElement.appendChild(retryButtonElement).innerText = "Play again";
        retryButtonElement.onclick = restartGame;
        infoElement.innerText = "Click the green circle to start";
    }
}

function restartGame() {
    showGreenButton(true);
    roundsLeft = amountOfRounds;
    score = 0;
    updateRoundsAndScore();

    // Remove retryButton
    while (resultsElement.lastElementChild) {
        resultsElement.removeChild(resultsElement.lastElementChild);
    }
}

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