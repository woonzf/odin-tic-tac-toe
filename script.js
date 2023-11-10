// Run after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    // Cache DOM
    const grid = document.querySelector(".grid");
    const resetBtn = document.querySelector("#reset");

    initializeGrid(grid, 9);

    resetBtn.addEventListener("click", () => {
        while (grid.children.length > 0) grid.removeChild(grid.lastChild);
        initializeGrid(grid, 9);
    })
})

function initializeGrid(grid, number) {
    const boxes = createBoxes(grid, number);
    addBoxListener(boxes, "x");
}

function createBoxes(grid, number) {
    for (let i = 0; i < number; i++) {
        const box = document.createElement("div");
        box.classList.add("box");
        grid.append(box);
    }

    return grid.querySelectorAll(".box");
}

function addBoxListener(boxes, mark) {
    boxes.forEach(box => {
        box.addEventListener("click", () => {
            placeMark(box, mark);
        }, {
            once: true
        })
    })
}

function placeMark(box, mark) {
    const img = document.createElement("img");

    if (mark === "x") {
        img.src = "images/close.png";
    }
    else if (mark === "o") {
        img.src = "images/o.png";
    }

    box.append(img);
}
