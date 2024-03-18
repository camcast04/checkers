/*----- constants -----*/
const PLAYER_COLORS = {
  player1: '#f4f7fa',
  player2: '#34354e',
};
/*----- state variables -----*/
const board = [
  [0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [2, 0, 2, 0, 2, 0, 2, 0],
  [0, 2, 0, 2, 0, 2, 0, 2],
  [2, 0, 2, 0, 2, 0, 2, 0],
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

      if (cell !== 0) {
        // If the cell is not empty
        const pieceElement = document.createElement('div');
        pieceElement.className = 'piece ' + (cell === 1 ? 'light' : 'dark'); // Add both 'piece' and 'light' or 'dark'
        pieceElement.innerHTML = `<img src="images/${
          cell === 1 ? 'light' : 'dark'
        }-piece.png" alt="piece">`;
        square.appendChild(pieceElement); // Append the new piece to the square
      }
    });
  });
}

// update display to say its ...player ... 's turn
function updatePlayerDisplay() {
  playerDisplay.textContent = currentPlayer === 1 ? 'Player 1' : 'Player 2';
  // playerDisplay.style.color = PLAYER_COLORS[`player${currentPlayer}`];
}
