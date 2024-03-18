/*----- constants -----*/
const PLAYER_COLORS = {
  player1: '#f4f7fa',
  player2: '#34354e',
};
/*----- state variables -----*/
const board = [
  [null, 1, null, 1, null, 1, null, 1],
  [1, null, 1, null, 1, null, 1, null],
  [null, 1, null, 1, null, 1, null, 1],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [2, null, 2, null, 2, null, 2, null],
  [null, 2, null, 2, null, 2, null, 2],
  [2, null, 2, null, 2, null, 2, null],
];

let currentPlayer = 1;
let possibleMoves = [];

/*----- cached elements  -----*/
const lightPieces = document.querySelectorAll('.light');
const darkPieces = document.querySelectorAll('.dark');
const blackSquares = document.querySelectorAll('.black');
const gameBoard = document.getElementById('gameboard');
const playerDisplay = document.getElementById('player');
const infoDisplay = document.getElementById('info-display');
const resetButton = document.getElementById('reset');
const squares = document.querySelectorAll('.square');
/*----- event listeners -----*/
resetButton.addEventListener('click', init);
/*----- functions -----*/
init();

function init() {
  renderPieces();
  currentPlayer = 1;
  updatePlayerDisplay();
}

function renderBoard() {}
function renderPieces() {
  //clearing existing pieces to set the board
  document
    .querySelectorAll('.square.black > div')
    .forEach((div) => div.remove());
  board.forEach((row, rowIdx) => {
    row.forEach((cell, cellIdx) => {
      const squareIdx = rowIdx * 8 + cellIdx;
      const square = squares[squareIdx];

      // checking if cell is empty
      if (cell !== null) {
        // creating new div element that will represent a piece on board
        const pieceElement = document.createElement('div');
        //setting class for player 1 or player 2  (player1 will be light and 2 dark)
        pieceElement.className = 'piece ' + (cell === 1 ? 'light' : 'dark'); // Add both 'piece' and 'light' or 'dark'
        //adding image of pice
        pieceElement.innerHTML = `<img src="images/${
          cell === 1 ? 'light' : 'dark'
        }-piece.png" alt="piece">`;
        // adding the new element to the square on the board
        square.appendChild(pieceElement);
      }
    });
  });
}

// update display to say its ...player ... 's turn
function updatePlayerDisplay() {
  playerDisplay.textContent = currentPlayer === 1 ? 'Player 1' : 'Player 2';
  // playerDisplay.style.color = PLAYER_COLORS[`player${currentPlayer}`];
}
