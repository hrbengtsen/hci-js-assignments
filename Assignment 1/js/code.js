const gridSize = 5;
let gridElement = document.getElementById("grid");

function clicked() {
    alert("found me");
}

function createInitialGrid(row, col) {
    let oddObject = [Math.floor(row * Math.random()), Math.floor(col * Math.random())];

    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            let cell = document.createElement("div");
            cell.innerText = "O";
            gridElement.appendChild(cell).className = "grid-item";

            if (i === oddObject[0] && j === oddObject[1]) {
                cell.innerText = "X";
                cell.onclick = clicked;
            }
        }
    }

    let numberOfObjectsToHide = Math.floor(row * Math.random());
    // TODO: remove numberOfObjectsToHide from grid
}

window.onload = () => createInitialGrid(gridSize, gridSize);