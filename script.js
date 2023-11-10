// Run after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {

    // Game module
    const game = (function() {

        // Cache DOM
        const grid = document.querySelector(".grid");
        const resetBtn = document.querySelector("#reset");

        // Initialize variables
        const GRID_SIZE = 9;
        const mark1 = 0;
        const mark2 = 1;
        let players;
        let turn;
        let gameBoard = [["", "", ""],
                         ["", "", ""],
                         ["", "", ""]]

        // Functions
        function createGame(name1, name2) {
            const player1 = new Player(name1, mark1);
            const player2 = new Player(name2, mark2);
            players = [player1, player2];

            // Determine player to start
            turn = Math.floor(Math.random() * players.length);
            
            const boxes = createBoxes();

            // Event Listeners
            addBoxListener(boxes);
            addResetListener(resetBtn, boxes);
        }

        function Player(name, mark) {
            this.name = name;
            this.mark = mark;
        }

        function updateTurn() {
            turn = +!turn;
        }
        
        function createBoxes() {
            for (let i = 0; i < GRID_SIZE; i++) {
                const box = document.createElement("div");
                box.classList.add("box");
                box.id = i + 1;
                grid.append(box);
            }
        
            return grid.querySelectorAll(".box");
        }

        function addBoxListener(boxes) {
            boxes.forEach(box => {
                box.addEventListener("click", placePlayerMark, { once:true });
            })
        }

        function addResetListener(btn, boxes) {
            btn.addEventListener("click", () => {
                boxes.forEach(box => {
                    while (box.children.length > 0) box.removeChild(box.lastChild);
                    box.removeEventListener("click", placePlayerMark);
                })

                addBoxListener(boxes);
            });
        }
        
        function placePlayerMark(e) {
            const target = e.target;
            const player = players[turn];
            const img = document.createElement("img");
        
            if (player.mark === mark1) {
                img.src = "images/o.png";
            }
            else if (player.mark === mark2) {
                img.src = "images/close.png";
            }
        
            target.append(img);
            updateGameBoard(target.id);
            updateTurn();
        }

        function updateGameBoard(id) {
            const result = id / gameBoard.length;
            let row;
            let column;

            if (id % 3 === 0) {
                row = result - 1;
                column = 2;
            } else {
                row = Math.floor(result);

                const decimal0 = +result.toString().split(".")[1][0];
                if (decimal0 === 3) {
                    column = 0;
                } else {
                    column = 1;
                }
            }

            gameBoard[row][column] = players[turn].mark;
            console.log(gameBoard)
        }

        return { createGame };
    })()

    // Create game
    const playerName1 = "Player 1";
    const playerName2 = "Player 2";
    game.createGame(playerName1, playerName2);
})
