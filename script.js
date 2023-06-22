const modal = document.getElementById('myModal');
const winMessage = document.querySelector('#winMessage');
const cells = document.querySelectorAll('.cell');
const newGame = document.querySelector('#newGame');
const quit = document.querySelector('#quit');
const playerx = document.querySelector('#playerx');
const playero = document.querySelector('#playero');
const tiebutton = document.querySelector('#tie');

const gameBoard = (function(){

    let boardArray = new Array(9).fill(null);
    let tie = 0;
    let gameWin  = false;

    let winCombo = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [6, 4, 2]
    ];

    function colorWiningCells(hole){
        hole.forEach((elem) => {
            cells[elem].style.background = "white";
            cells[elem].style.color = '#003366';
        });
    }

    function resetGameWin() {
        gameWin = false;
    }

    function resetTie() {
        tie = 0;
    }

    function checkWinner(player) {
        for(let [index, win] of winCombo.entries()){

            if(win.every((elem) => (player.moves).indexOf(elem) > -1)){
                // console.log(`${player.symbol} has won`, win);
                gameWin = true;
                winMessage.innerHTML = `Congratulations player ${player.symbol} has won the game`;
                player.numOfWin += 1;
                modal.style.display = "block";
                colorWiningCells(win);
                break;
            }
        }
        
    }

    function checkDraw() {
        if(boardArray.every(elem => (elem != null)) && (gameWin == false)){
            // console.log("its a tie");
            winMessage.innerHTML = "Oops It's a tie";
            modal.style.display = "block";
            tie += 1;
        }
    }

    return {boardArray: function(){
        return boardArray;
    },
    checkWinner,
    checkDraw,
    resetTie,
    tie : function() {
        return tie;
    },
    resetGameWin
};


})();


const Player = function(name, symbol, turn) {
    let moves = []
    let numOfWin = 0;
    return {name, symbol, turn, moves, numOfWin};
}

let playerX = Player('Chijiuba', 'X', true);
let playerO = Player('Computer', 'O', false);


const displayController = (function() {

    let resetButton = document.querySelector('#reset');
    let turnTeller = document.querySelector('#turnTeller');

    function startNewGame() {
        // console.clear();
        playerX.turn = true;
        playerO.turn = false;
        gameBoard.resetGameWin();
        turnTeller.innerHTML = "X turn";
        playerO.moves = [];
        playerX.moves = [];
        cells.forEach((element, index) => {
            element.innerHTML = "";
            gameBoard.boardArray()[index] = null;
        })
    }

    resetButton.onclick = function() {
        startNewGame();
        playero.innerHTML = "Player O => 0";
        playerx.innerHTML = "Player X => 0";
        tiebutton.innerHTML = "Ties => 0";
        playerX.numOfWin = 0;
        playerO.numOfWin = 0;
        gameBoard.resetTie();
    }

    newGame.onclick = function(){
        startNewGame();
        modal.style.display = 'none';
        cells.forEach((elem) => {
            elem.style.background = '#003366';
            elem.style.color = 'white';
        });
    }

    function playTurn(){
        cells.forEach((element, index) => {
            element.onclick = () => {
                if(!gameBoard.boardArray()[index]){
                    if(playerX.turn){
                        turnTeller.innerHTML = 'O turn';
                        gameBoard.boardArray()[index] = playerX.symbol;
                        playerX.moves.push(index)
                        // console.log(playerX.moves);
                        gameBoard.checkWinner(playerX)
                        playerx.innerHTML = `Player X => ${playerX.numOfWin}`;
                        gameBoard.checkDraw()
                    }
                    else{
                        turnTeller.innerHTML = 'X turn';
                        gameBoard.boardArray()[index] = playerO.symbol;
                        playerO.moves.push(index)
                        // console.log(playerO.moves);
                        gameBoard.checkWinner(playerO)
                        playero.innerHTML = `Player O => ${playerO.numOfWin}`;
                        gameBoard.checkDraw()
                    }
                    tiebutton.innerHTML = `Ties => ${gameBoard.tie()}`;
                    // console.log(gameBoard.boardArray());
                    showGameBoardArray()
                    playerX.turn = !playerX.turn;
                    playerO.turn = !playerO.turn;
                }
            }
        });
    }

    function showGameBoardArray() {
        cells.forEach((element, index) => {
            if(gameBoard.boardArray()[index]){
                element.innerHTML = gameBoard.boardArray()[index];
            }
        })
    }
    return {playTurn};

})();

displayController.playTurn();
