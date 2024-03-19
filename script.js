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
function addSquareEventListener() {
  squares.forEach((square) => {
    square.addEventListener('click', handleSquareClick);
  });
}

/*----- functions -----*/
init();

function init() {
  renderPieces();
  currentPlayer = 1;
  updatePlayerDisplay();
  addSquareEventListener();
}

function renderBoard() {}

function renderPieces() {
  //removing pieces to render
  document
    .querySelectorAll('.square.black > div')
    .forEach((div) => div.remove());
  board.forEach((row, rowIdx) => {
    row.forEach((cell, cellIdx) => {
      // calculating square index based on row and column
      const squareIdx = rowIdx * 8 + cellIdx;
      //get square element from node list (cached above)
      const square = squares[squareIdx];

      if (cell !== null) {
        //create element for piece image
        const pieceElement = document.createElement('div');
        let pieceType;
        let imageFile;

        // Determine the piece type and corresponding image file based on the cell's value.
        switch (cell) {
          case 1:
            pieceType = 'light';
            imageFile = 'light-piece.png';
            break;
          case 2:
            pieceType = 'dark';
            imageFile = 'dark-piece.png';
            break;
          case 3: // kinged
            pieceType = 'light king';
            imageFile = 'king-light.png';
            break;
          case 4: // kinged
            pieceType = 'dark king';
            imageFile = 'king-dark.png';
            break;
        }

        // Set the class of the piece element to include both 'piece' and its specific type ('light', 'dark', 'light king', 'dark king').
        pieceElement.className = `piece ${pieceType}`;
        pieceElement.innerHTML = `<img src="images/${imageFile}" alt="piece">`;
        //Append the piece element to the square, placing it visually on the board.
        square.appendChild(pieceElement);
      }
    });
  });
}

function handleSquareClick(e) {
  const clickedSquare = e.target.closest('.square');
  if (!clickedSquare) return; // Exit if no square was clicked.

  const squareIndex = Array.from(squares).indexOf(clickedSquare);
  const row = Math.floor(squareIndex / 8);
  const col = squareIndex % 8;

  if (board[row][col] === currentPlayer) {
    // Highlight the square to show it's selected.
    highlightSquare(clickedSquare);
    // Calculate and highlight possible moves.
    showPossibleMoves(row, col);
  }
}

function highlightSquare(square) {
  // Remove existing highlights
  squares.forEach((square) => {
    square.classList.remove('highlighted');
  });

  // Highlight the current square
  square.classList.add('highlighted');
}

function showPossibleMoves(row, col) {}

// function to update display to say its ...player ... 's turn
function updatePlayerDisplay() {
  playerDisplay.textContent = currentPlayer === 1 ? 'Player 1' : 'Player 2';
  // playerDisplay.style.color = PLAYER_COLORS[`player${currentPlayer}`];
}
