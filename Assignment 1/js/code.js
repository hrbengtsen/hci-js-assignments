// Define grid & elements
const gridSize = 6;
const gridElement = document.getElementById("grid");
const subTitleElement = document.getElementById("subtitle");
const resultsElement = document.getElementById("results");

// Define test
let testActive = false;
const amountOfTrials = 10;
let trialsLeft = amountOfTrials;

// Define performance
let reactionTimes = [];
let lastTimeGridWasShown;

let bestOverallTime = JSON.parse(localStorage.getItem("best-overall-time"));
let bestOverallMean = JSON.parse(localStorage.getItem("best-overall-mean"));

// Set best-overall-time
if (bestOverallTime < 100000 && bestOverallTime !== null) {
    document.getElementById("best-overall-time").innerText = bestOverallTime + "ms";
}
else {
    bestOverallTime = 100000;
    localStorage.setItem("best-overall-time", JSON.stringify(bestOverallTime));
    document.getElementById("best-overall-time").innerText = "none";
}

// Set best-overall-mean
if (bestOverallMean < 100000 && bestOverallMean !== null) {
    document.getElementById("best-overall-mean").innerText = bestOverallMean + "ms";
}
else {
    bestOverallMean = 100000;
    localStorage.setItem("best-overall-mean", JSON.stringify(bestOverallMean));
    document.getElementById("best-overall-mean").innerText = "none";
}

function oddClicked() {
    // Set random delay between 1000-3000 ms before creating new grid
    let randomDelay = Math.floor(2e3 * Math.random() + 1e3);

    // Calculate reaction time if test is active, otherwise begin test
    if (testActive) {
        let currentTime = new Date().getTime();
        let deltaTime = currentTime - lastTimeGridWasShown;
        reactionTimes.push(deltaTime);

        trialsLeft--;
    }
    else {
        // Test started
        testActive = true;
        trialsLeft = amountOfTrials;
        reactionTimes = [];
    }

    removePreviousGrid(gridSize, gridSize);
    subTitleElement.innerText = "Test in progress... " + trialsLeft + " remaining";

    // Create new grid after delay if there are more trials left, otherwise end test
    if (trialsLeft > 0) {
        setTimeout(() => createRandomGrid(gridSize, gridSize), randomDelay);
    }
    else {
        // Test finished
        testActive = false;
        subTitleElement.innerText = "Test finished!";
        calculateAndShowResults();
    }
}

function calculateAndShowResults() {
    // Calculate best & worst
    let bestTime = Math.min(...reactionTimes);
    let worstTime = Math.max(...reactionTimes);

    // Update best-overall-time
    if (bestTime < bestOverallTime) {
        bestOverallTime = bestTime;
        localStorage.setItem("best-overall-time", JSON.stringify(bestOverallTime));
        document.getElementById("best-overall-time").innerText = bestOverallTime + "ms";
    }

    // Calculate mean
    let meanDeltaTime = 0.0;
    for (let i = 0; i < reactionTimes.length; i++) {
        meanDeltaTime += reactionTimes[i];
    }
    meanDeltaTime = Math.round(meanDeltaTime / reactionTimes.length);

    // Update best-overall-mean
    if (meanDeltaTime < bestOverallMean) {
        bestOverallMean = meanDeltaTime;
        localStorage.setItem("best-overall-mean", JSON.stringify(bestOverallMean));
        document.getElementById("best-overall-mean").innerText = bestOverallMean + "ms";
    }

    // Calculate standard deviation
    let standardDeviation = 0.0;
    for (let i = 0; i < reactionTimes.length; i++) {
        let diff = reactionTimes[i] - meanDeltaTime;
        standardDeviation += diff * diff;
    }
    standardDeviation = Math.round(Math.sqrt(standardDeviation / reactionTimes.length));

    // Show results
    let bestElement = document.createElement("p");
    let worstElement = document.createElement("p");
    let meanElement = document.createElement("p");
    let sdElement = document.createElement("p");

    bestElement.id = "best";
    worstElement.id = "worst";
    meanElement.id = "mean";
    sdElement.id = "sd";

    // Set fade-in animation
    bestElement.className = "fadeInLeft";
    worstElement.className = "fadeInLeft";
    meanElement.className = "fadeInLeft";
    sdElement.className = "fadeInLeft";

    // Add resultsTitle
    let resultsTitleElement = document.createElement("p");
    resultsTitleElement.className = "resultsTitle";
    resultsElement.appendChild(resultsTitleElement).innerText = "Results";

    // Add all times
    let allTimesWrapper = document.createElement("div");
    resultsElement.appendChild(allTimesWrapper).id = "all-times-wrapper";

    for (let i = 0; i < reactionTimes.length; i++) {
        let time = document.createElement("p");
        allTimesWrapper.appendChild(time).innerText = (i + 1) + ": " + reactionTimes[i] + "ms";
    }

    // Add calculated times
    resultsElement.appendChild(bestElement).innerText = "Best: " + bestTime + "ms";
    resultsElement.appendChild(worstElement).innerText = "Worst: " + worstTime + "ms";
    console.log(reactionTimes);
    resultsElement.appendChild(meanElement).innerText = "Mean: " + meanDeltaTime + "ms";
    resultsElement.appendChild(sdElement).innerText = "Standard Deviation: " + standardDeviation + "ms";

    // Create retry button
    setTimeout(() => createRetryButton(), 1100);

    function createRetryButton() {
        let retryButtonElement = document.createElement("button");
        retryButtonElement.className = "retryButton";
        resultsElement.appendChild(retryButtonElement).innerText = "Retry test";
        retryButtonElement.onclick = restartTest;
    }
}

function restartTest() {
    // Remove results
    while (resultsElement.lastElementChild) {
        resultsElement.removeChild(resultsElement.lastElementChild);
    }

    // Reset subtitle
    subTitleElement.innerText = "Click the odd item to start";

    // Create new initial grid
    createRandomGrid(gridSize, gridSize);
}

function removePreviousGrid(row, col) {
    for (let i = 0; i < row * col; i++) {
        let item = document.getElementById("item-" + i);
        gridElement.removeChild(item);
    }
}

function createRandomGrid(row, col) {
    // The odd object to identify
    let oddItemIndex = Math.floor((row * col) * Math.random());

    // Get random item type
    let randomItemType = Math.floor(3 * Math.random()) + 1;

    for (let i = 0; i < row * col; i++) {
        // Create grid item
        let item = document.createElement("div");
        gridElement.appendChild(item);
        item.className = "grid-item";
        item.id = "item-" + i;

        // Create grid items content
        let itemContent = document.createElement("div");
        item.appendChild(itemContent);
        itemContent.className = "grid-item-content-" + randomItemType;

        // Mark the odd item
        if (i === oddItemIndex) {
            item.onclick = oddClicked;
            item.className = "odd-item";
            itemContent.className += " odd-item-content-" + randomItemType;
        }
    }

    // Hide random items for more random "grid"
    let itemsToHide = [];
    const numberOfItemsToHide = 8;

    while (itemsToHide.length < numberOfItemsToHide) {
        let randomIndex = Math.floor((row * col) * Math.random());

        // Only hide if it isn't already and isn't the odd item
        if (itemsToHide.indexOf(randomIndex) === -1 && randomIndex !== oddItemIndex) {
            itemsToHide.push(randomIndex);
            document.getElementById("item-" + randomIndex).style.visibility = "hidden";
        }
    }

    // Remember when grid was shown
    lastTimeGridWasShown = new Date().getTime();

    // Update subtitle text
    if (testActive) {
        subTitleElement.innerText = "Find and click the odd item!";
    }
}

// Create grid onload
window.onload = () => createRandomGrid(gridSize, gridSize);