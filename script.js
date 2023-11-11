// Game module
const game = (function() {

    // Cache DOM
    const grid = document.querySelector(".grid");
    const resetBtn = document.querySelector("#reset");

    // Initialize variables
    const GRID_SIZE = 9;

    let players;
    let turn;
    let board;
    let boxes;
    let moves = 0;
    let end = 0;

    // Functions
    function createGame(name1, name2) {
        const player1 = new _Player(name1, 0, "images/o.png");
        const player2 = new _Player(name2, 1, "images/close.png");
        players = [player1, player2];
        turn = Math.floor(Math.random() * players.length);

        _emptyBoard();
        boxes = _createGetBoxes();
        _addBoxListener();
        _addResetListener();
    }

    function _Player(name, mark, img) {
        this.name = name;
        this.mark = mark;
        this.img = img;
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
        _updateBoard(target.id);
        moves += 1;
        _checkWinner();
        turn = +!turn;
    }

    function _placePlayerMark(target) {
        const img = document.createElement("img");
    
        img.src = players[turn].img;
        target.append(img);
    }

    function _updateBoard(id) {
        const num = id / board.length;
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

        board[row][column] = players[turn].mark;
    }

    function _checkWinner() {
        _checkHorizontal();
        _checkVertical();
        _checkDiagonal();

        if (moves === GRID_SIZE) _endGame(0);
    }

    function _checkHorizontal() {
        for (let i = 0; i < 3; i++) {
            _checkArray(board[i]);
        }
    }

    function _checkVertical() {
        const boardT = _getTranspose(board);
        const len = boardT.length;
        
        for (let i = 0; i < len; i++) {
            _checkArray(boardT[i]);
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
        const arr1 = [board[0][0], board[1][1], board[2][2]];
        const arr2 = [board[2][0], board[1][1], board[0][2]];

        _checkArray(arr1);
        _checkArray(arr2);
    }

    function _checkArray(arr) {
        if (arr.every(el => el === turn)) _endGame(1)
    }

    function _endGame(n) {
        if (n === 1) {
            end = 1;
            console.log(`${players[turn].name} wins!`)
        }
        else if (end === 0) console.log("Draw!");

        _removeBoxListener();
    }

    function _addResetListener() {
        resetBtn.addEventListener("click", () => {
            _removeMarks();
            _emptyBoard();
            _removeBoxListener();
            _addBoxListener();
            moves = 0;
            end = 0;
        });
    }

    function _removeMarks() {
        boxes.forEach(box => {
            while (box.children.length > 0) box.removeChild(box.lastChild);
        })
    }

    function _emptyBoard() {
        board = [["", "", ""],
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
