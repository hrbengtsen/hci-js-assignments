// Define grid & elements
const gridSize = 6;
const gridElement = document.getElementById("grid");
const subTitleElement = document.getElementById("subtitle");

// Define test
let testActive = false;
const amountOfTrials = 10;
let trialsLeft = amountOfTrials;

// Define performance
let reactionTimes = [];
let lastTimeGridWasShown;


function oddClicked() {
    // Set random delay between 1000-3000 ms before creating new grid
    let randomDelay = Math.floor(2e3 * Math.random() + 1e3);

    removePreviousGrid(gridSize, gridSize);
    subTitleElement.innerText = "Test in progress...";

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
    }

    // Create new grid after delay if there are more trials left, otherwise end test
    if (trialsLeft > 0) {
        setTimeout(() => createRandomGrid(gridSize, gridSize), randomDelay);
    }
    else {
        // Test finished
        testActive = false;
        subTitleElement.innerText = "Test finished!";
    }
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

    for (let i = 0; i < row * col; i++) {
        // Create grid item
        let item = document.createElement("div");
        gridElement.appendChild(item);
        item.className = "grid-item";
        item.id = "item-" + i;

        // Create grid items content
        let itemContent = document.createElement("div");
        item.appendChild(itemContent);
        itemContent.className = "grid-item-content";

        // Mark the odd item
        if (i === oddItemIndex) {
            itemContent.className += " odd-item-content";
            item.className += " odd-item";
            item.onclick = oddClicked;
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
        subTitleElement.innerText = "Find the odd item!";
    }
}

// Create grid onload
window.onload = () => createRandomGrid(gridSize, gridSize);