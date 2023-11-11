// Game module
const game = (function() {

    // Cache DOM
    const grid = document.querySelector(".grid");
    const resetBtn = document.querySelector("#reset");

    // Initialize variables
    const GRID_SIZE = 9;
    const MARK_1 = 0;
    const MARK_2 = 1;
    let players;
    let turn;
    let gameBoard;
    let boxes;

    // Functions
    function createGame(name1, name2) {
        const player1 = new _Player(name1, MARK_1);
        const player2 = new _Player(name2, MARK_2);
        players = [player1, player2];
        turn = Math.floor(Math.random() * players.length);

        _emptyGameBoard();
        boxes = _createGetBoxes();
        _addBoxListener();
        _addResetListener();
    }

    function _Player(name, mark) {
        this.name = name;
        this.mark = mark;
    }
    
    function _createGetBoxes() {
        for (let i = 0; i < GRID_SIZE; i++) {
            const box = document.createElement("div");
            box.classList.add("box");
            box.id = i + 1;
            grid.append(box);
        }
    
        return grid.querySelectorAll(".box");
    }

    function _addBoxListener() {
        boxes.forEach(box => {
            box.addEventListener("click", _updateGame, { once:true });
        })
    }
    
    function _updateGame(e) {
        const target = e.target;

        _placePlayerMark(target);
        _updateGameBoard(target.id);
        _checkWinner();
        turn = +!turn; // Update turn
    }

    function _placePlayerMark(target) {
        const player = players[turn];
        const img = document.createElement("img");
    
        if (player.mark === MARK_1) img.src = "images/o.png";
        else if (player.mark === MARK_2) img.src = "images/close.png";
    
        target.append(img);
    }

    function _updateGameBoard(id) {
        const num = id / gameBoard.length;
        let row;
        let column;

        if (id % 3 === 0) {
            row = num - 1;
            column = 2;
        } else {
            row = Math.floor(num);
            const decimal0 = +num.toString().split(".")[1][0];

            if (decimal0 === 3) column = 0;
            else column = 1;
        }

        gameBoard[row][column] = players[turn].mark;
    }

    function _checkWinner() {
        _checkHorizontal();
        _checkVertical();
        _checkDiagonal();
    }

    function _checkHorizontal() {
        for (let i = 0; i < 3; i++) {
            _checkArray(gameBoard[i]);
        }
    }

    function _checkVertical() {
        const gameBoardT = _getTranspose(gameBoard);
        const len = gameBoardT.length;
        
        for (let i = 0; i < len; i++) {
            _checkArray(gameBoardT[i]);
        }
    }

    function _getTranspose(matrix) {
        // My way
        const lenI = matrix.length;
        let newMatrix = [[], [], []];

        for (let i = 0; i < lenI; i++) {
            const lenJ = matrix[i].length;

            for (let j = 0; j < lenJ; j++) {
                newMatrix[i].push(matrix[j][i]);
            }
        }

        return newMatrix;

        // Transpose from https://stackoverflow.com/a/17428705
        // return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
    }

    function _checkDiagonal() {
        const arr1 = [gameBoard[0][0], gameBoard[1][1], gameBoard[2][2]];
        const arr2 = [gameBoard[2][0], gameBoard[1][1], gameBoard[0][2]];

        _checkArray(arr1);
        _checkArray(arr2);
    }

    function _checkArray(arr) {
        if (arr.every(el => el === turn)) _endGame(1)
    }

    function _endGame(n) {
        if (n) console.log(`${players[turn].name} wins!`)
        else console.log("Draw!");
    }

    function _addResetListener() {
        resetBtn.addEventListener("click", () => {
            _removeMarks();
            _emptyGameBoard();
            _removeBoxListener();
            _addBoxListener();
        });
    }

    function _removeMarks() {
        boxes.forEach(box => {
            while (box.children.length > 0) box.removeChild(box.lastChild);
        })
    }

    function _emptyGameBoard() {
        gameBoard = [["", "", ""],
                     ["", "", ""],
                     ["", "", ""]]
    }

    function _removeBoxListener() {
        boxes.forEach(box => {
            box.removeEventListener("click", _updateGame);
        })
    }

    return { createGame };
})()

// Create game
const playerName1 = "Player 1";
const playerName2 = "Player 2";
game.createGame(playerName1, playerName2);
