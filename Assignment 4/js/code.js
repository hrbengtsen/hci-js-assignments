// Define elements
const gameWindowElement = document.getElementById("game-window");
const greenButtonElement = document.getElementById("green-button");
const scoreElement = document.getElementById("score");
const roundsElement = document.getElementById("rounds");
const resultsElement = document.getElementById("results");

// Define rounds & score
const amountOfRounds = 60;
let roundsLeft = amountOfRounds;
let score = 0;
scoreElement.innerText = score;
roundsElement.innerText = amountOfRounds;

let targetTimer;

function greenButtonClicked() {
    // Random delay until target is shown (1000-2000ms)
    let randomDelay = Math.floor(1e3 * Math.random() + 1e3);

    showGreenButton(false);
    setTimeout(() => createTarget(), randomDelay);
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
    score++;
    roundsLeft--;
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
    roundsElement.innerText = roundsLeft;
}

function createTarget() {
    let size = chooseRandomSize(10, 30, 50);
    const targetElement = document.createElement("div");
    targetElement.id = "target";
    targetElement.onclick = targetClicked;
    targetElement.style.width = `${size}px`;
    targetElement.style.height = `${size}px`;
    targetElement.className = "target-button fadeIn";

    let posX = (Math.random() * (gameWindowElement.offsetWidth - size) + gameWindowElement.getBoundingClientRect().left).toFixed();
    let posY = (Math.random() * (gameWindowElement.offsetHeight - size) + gameWindowElement.getBoundingClientRect().top).toFixed();

    targetElement.style.left = `${posX}px`;
    targetElement.style.top = `${posY}px`;

    gameWindowElement.appendChild(targetElement);

    // Random delay until target dissappears (2000-3000ms)
    let randomDelay = Math.floor(1e3 * Math.random() + 2e3);
    targetTimer = setTimeout(() => targetMissed(), randomDelay);
}

function removeTarget(e) {
    clearTimeout(targetTimer);
    e.remove();

    if (roundsLeft > 0) {
        showGreenButton(true);
    }
    else {
        let retryButtonElement = document.createElement("button");
        retryButtonElement.className = "retryButton fadeIn";
        resultsElement.appendChild(retryButtonElement).innerText = "Play again";
        retryButtonElement.onclick = restartGame;
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