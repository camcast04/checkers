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
  renderBoard();
  renderPieces();
  currentPlayer = 1;
  updatePlayerDisplay();
}

function renderBoard() {}
function renderPieces() {
  lightPieces.forEach((piece) => piece.remove);
  darkPieces.forEach((piece) => piece.remove);
}

function updatePlayerDisplay() {
  playerDisplay.textContent = currentPlayer === 1 ? 'Player 1' : 'Player 2';
}
