// Game module
const ticTacToe = (function() {

    // Cache DOM
    const content = document.querySelector(".content");
    const p1Div = document.querySelector("#p1 > div");
    const p2Div = document.querySelector("#p2 > div");
    const img1 = document.querySelector("#p1 > img");
    const img2 = document.querySelector("#p2 > img");
    const grid = document.querySelector(".grid");

    const newGameDialog = document.querySelector("#new-game");
    const resultDialog = document.querySelector("#result");
    const result = resultDialog.querySelector("#display");

    const replayBtn = document.querySelector("#reset");
    const rematchBtn = document.querySelector("#rematch");
    const newGameBtn = document.querySelector("#new-game");

    // Game object
    const game = {
        gridSize: 9,
        newGame: 1,
        moves: 0,
        end: 0,
        updateMoves: function() {
            this.moves += 1;
        },
        endGame: function() {
            this.end = 1;
        },
        reset: function() {
            this.moves = 0;
            this.end = 0;
        }
    }

    // Initialize variables
    let players;
    let turn;
    let player;
    let board;
    let boxes;

    // Functions
    function init() {
        const welcome = document.querySelector(".welcome");
        const p1Name = document.querySelector("#p1-name");
        const p2Name = document.querySelector("#p2-name");

        const startBtn = document.querySelector("#start");
        const cancelBtn = document.querySelector("#cancel");
        const confirmBtn = document.querySelector("#confirm");

        startBtn.onclick = () => {
            newGameDialog.showModal();
        }

        cancelBtn.onclick = () => {
            p1Name.value = "";
            p2Name.value = "";
            newGameDialog.close();
        }

        confirmBtn.onclick = () => {
            welcome.style.display = "none";
            content.style.removeProperty("display");
            _createGame(p1Name.value, p2Name.value);
        }
    }

    function _createGame(name1, name2) {
        players = _createGetPlayers(name1, name2);
        p1Div.textContent = players[0].name;
        p2Div.textContent = players[1].name;
        
        img1.src = players[0].img;
        img2.src = players[1].img;

        turn = Math.floor(Math.random() * players.length);
        player = players[turn];

        if (game.newGame === 1) {
            _emptyBoard();
            boxes = _createGetBoxes();

            //Events
            _addBoxListener();
            replayBtn.onclick = _resetGame;
            rematchBtn.onclick = () => {
                _resetGame();
                resultDialog.close();
            }
            newGameBtn.onclick = () => {
                resultDialog.close();
                newGameDialog.showModal();
                game.newGame = 0;
            }
        } else _resetGame();
    }

    function _createGetPlayers(name1, name2) {
        const player1 = new _Player(name1, 0, "images/o.png");
        const player2 = new _Player(name2, 1, "images/close.png");

        return [player1, player2];
    }

    function _Player(name, mark, img) {
        this.name = name;
        this.mark = mark;
        this.img = img;
        this.placeMark = function(target) {
            const img = document.createElement("img");
            img.src = this.img;
            target.append(img);
        }
    }
    
    function _createGetBoxes() {
        for (let i = 0; i < game.gridSize; i++) {
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

        player.placeMark(target);
        _updateBoard(target.id);
        game.updateMoves();
        _checkWinner();
        _updatePlayer();
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

        board[row][column] = player.mark;
    }

    function _checkWinner() {
        _checkHorizontal();
        _checkVertical();
        _checkDiagonal();

        if (game.moves === game.gridSize) _endGame(0);
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

    function _updatePlayer() {
        turn = +!turn;
        player = players[turn];
    }

    function _endGame(n) {
        if (n === 1) {
            game.endGame();
            _displayResult(`${player.name} wins!`);
        }
        else if (game.end === 0) _displayResult("Draw!");

        _removeBoxListener();
    }

    function _displayResult(text) {
        result.textContent = text;
        resultDialog.showModal();
    }

    function _resetGame() {
        _removeMarks();
        _emptyBoard();
        _removeBoxListener();
        _addBoxListener();
        game.reset();
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

    return { init };
})()

// Create game
ticTacToe.init();
