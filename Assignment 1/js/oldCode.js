////////////
// Variables

let experimentActive = false;
let testActive = false;
let reactionTimes = new Array();
let lastTimeColorChanged;

////////////
// Constants

const h1_indicator = document.getElementById("indicator");
const h2_instruction = document.getElementById("instruction");
const p_time = document.getElementById("time");
const p_count = document.getElementById("count");
const p_mean = document.getElementById("mean");
const p_sd = document.getElementById("sd");

///////////////
// Main Methods

function startExperiment() {
    experimentActive = true;
    h2_instruction.innerHTML = "Press SPACE when color changes! Press 'a' for results!";
    p_time.innerHTML = "";
    p_count.innerHTML = "";
    p_mean.innerHTML = "";
    p_sd.innerHTML = "";
    startTest();
}

function stopExperiment() {
    window.setTimeout("showStimulus()", 0);
    testActive = false;

    let meanDeltaTime = 0.0;
    for (let i = 0; i < reactionTimes.length; i++) {
        meanDeltaTime += reactionTimes[i];
    }
    meanDeltaTime = Math.round(meanDeltaTime / reactionTimes.length);

    let standardDeviation = 0.0;
    for (let i = 0; i < reactionTimes.length; i++) {
        let diff = (reactionTimes[i] - meanDeltaTime);
        standardDeviation += diff * diff;
    }
    standardDeviation = Math.round(Math.sqrt(standardDeviation / reactionTimes.length));

    p_count.innerHTML = "Count: " + reactionTimes.length;
    p_mean.innerHTML = "Mean: " + meanDeltaTime + "ms";
    p_sd.innerHTML = "SD: " + standardDeviation + "ms";

    h2_instruction.innerHTML = "Press SPACE to start!";
    reactionTimes = [];
    experimentActive = false;
}

function startTest() {
    changeTextColor("black");
    timeInSeconds = Math.random() * 4 + 2; // 2 - 6s
    window.setTimeout("showStimulus()", timeInSeconds * 1000);
}

function stopTest() {
    let currTime = new Date().getTime();
    let deltaTime = currTime - lastTimeColorChanged;
    reactionTimes.push(deltaTime);
    p_time.innerHTML = "Last test: " + deltaTime + "ms";

    testActive = false;
    startTest();
}

function showStimulus() {
    testActive = true;
    changeTextColor("red");
}

/////////////////
// Helper Methods

function changeTextColor(newColor) {
    h1_indicator.style.color = newColor;
    h1_indicator.style.backgroundColor = newColor;
    lastTimeColorChanged = new Date().getTime();
}

/////////////////
// EventListeners

document.onkeydown = onKey;

function onKey(e) {
    if (e == null) {
        e = window.event;
    }
    switch (e.which || e.charCode || e.keyCode) {
        case 32:
            // space
            if (!experimentActive) {
                startExperiment();
            } else if (testActive) {
                stopTest();
            }
            break;
        case 65:
            // a
            if (experimentActive) {
                stopExperiment();
            }
            break;
        case 66:
            // b
            // here you can extend... alert("pressed the b key"); break;
    }
}
