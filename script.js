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
// let possibleMoves = [];

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
gameBoard.addEventListener('dragstart', handleDragStart, false);
gameBoard.addEventListener('dragover', handleDragOver, false);
gameBoard.addEventListener('drop', handleDrop, false);
gameBoard.addEventListener('dragend', handleDragEnd, false);

function addSquareEventListener() {
  squares.forEach((square) => {
    square.addEventListener('click', handleSquareClick);
  });
}

/*----- functions -----*/
init();

function init() {
  resetBoard();
  renderPieces();
  currentPlayer = 1;
  updatePlayerDisplay();
  // addSquareEventListener();
}

function resetBoard() {
  // Resets the game board to its initial state
  board = [
    [null, 1, null, 1, null, 1, null, 1],
    [1, null, 1, null, 1, null, 1, null],
    [null, 1, null, 1, null, 1, null, 1],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [2, null, 2, null, 2, null, 2, null],
    [null, 2, null, 2, null, 2, null, 2],
    [2, null, 2, null, 2, null, 2, null],
  ];
}

function renderPieces() {
  const allPieces = document.querySelectorAll('.piece');
  allPieces.forEach((piece) => piece.remove);

  // Loops through the board array to place pieces according to the game state
  board.forEach((row, rowIdx) => {
    row.forEach((cell, cellIdx) => {
      if (cell !== null) {
        // calculating square index based on row and column
        const squareIdx = rowIdx * 8 + cellIdx;
        //get square element from node list (cached above)
        const square = squares[squareIdx];
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
        //indicate player 1 or 2
        pieceElement.setAttribute('data-piece', cell);
        pieceElement.setAttribute('data-position', `${rowIdx},${cellIdx}`);
        //Append the piece element to the square, placing it visually on the board.
        square.appendChild(pieceElement);
      }
    });
  });
}

function handleDragStart(e) {
  if (!e.target.className.includes('piece')) return;
  e.dataTransfer.setData('text/plain', e.target.dataset.position);
  setTimeout(() => (e.target.style.opacity = '0.4'), 0);
}

function handleDragOver(e) {
  e.preventDefault(); // Necessary to allow dropping / prevents default behavior
}

function handleDrop(e) {
  e.preventDefault();
  const fromPosition = e.dataTransfer
    .getData('text/plain')
    .split(',')
    .map(Number);
  const toSquare = e.target.closest('.square');
  const toIndex = Array.from(squares).indexOf(toSquare);
  const toPosition = [Math.floor(toIndex / 8), toIndex % 8];

  executeMove(fromPosition[0], fromPosition[1], toPosition[0], toPosition[1]);
}

function handleDragEnd(e) {
  e.target.style.opacity = '1';
  renderPieces();
}

function executeMove(fromRow, fromCol, toRow, toCol) {
  const piece = board[fromRow][fromCol];
  const isCaptureMove = Math.abs(fromRow - toRow) === 2;

  // Validate move
  if (!isValidMove(fromRow, fromCol, toRow, toCol, piece, isCaptureMove)) {
    console.log('Invalid move');
    return; // Early return if the move is invalid
  }

  // Execute move
  board[toRow][toCol] = board[fromRow][fromCol]; // Move the piece
  board[fromRow][fromCol] = null; // Clear the original square

  // Handle capture
  if (isCaptureMove) {
    const middleRow = (fromRow + toRow) / 2;
    const middleCol = (fromCol + toCol) / 2;
    board[middleRow][middleCol] = null; // Remove the captured piece
  }

  // Kinging
  kingPieces(toRow, toCol);

  // Switch players
  currentPlayer = currentPlayer === 1 ? 2 : 1;

  // Update the board and player display
  renderPieces();
  updatePlayerDisplay();
  clearHighlights(); // Function to remove move highlights, if implemented
}

function isValidMove(fromRow, fromCol, toRow, toCol, piece, isCaptureMove) {
  // Check if moving on a diagonal
  if (Math.abs(fromRow - toRow) !== Math.abs(fromCol - toCol)) return false;

  // Check if destination square is empty
  if (board[toRow][toCol] !== null) return false;

  // Check if it's a simple move (not a capture)
  if (!isCaptureMove && Math.abs(fromRow - toRow) === 1) {
    return true; // For now, allow all single-step moves. Further validation may be needed based on game rules.
  }

  // For capture moves, check that the jumped square contains an opponent's piece
  if (isCaptureMove) {
    const middleRow = (fromRow + toRow) / 2;
    const middleCol = (fromCol + toCol) / 2;
    if (!isOpponent(middleRow, middleCol, currentPlayer)) return false;
  }

  // Add additional validation as necessary, e.g., checking for backward moves if not a king
  // For simplicity, these checks are omitted here but can be added based on game rules

  return true;
}

function highlightSquare(row, col) {
  const index = row * 8 + col;
  squares[index].classList.add('highlighted');
}

function clearHighlights() {
  squares.forEach((square) => {
    square.classList.remove('highlighted');
  });
}

function showPossibleMoves(row, col) {
  const piece = board[row][col];
  const directions = getMoveDirections(piece);

  //clearing highlighted squares
  clearHighlightSquare();

  //checking move directions
  directions.forEach((dir) => {
    checkSimpleMove(row, col, dir);
    checkCapturingMove(row, col, dir);
  });
}

// getting move direction
function getMoveDirections(piece) {
  // returning all the possible move directios maybe figure out how to make this not be a mess
  if (piece === 1 || piece === 3) {
    return piece === 1
      ? [
          { row: 1, col: -1 },
          { row: 1, col: 1 },
        ]
      : [
          { row: -1, col: -1 },
          { row: -1, col: 1 },
          { row: 1, col: -1 },
          { row: 1, col: 1 },
        ];
  } else {
    return piece === 2
      ? [
          { row: -1, col: -1 },
          { row: -1, col: 1 },
        ]
      : [
          { row: -1, col: -1 },
          { row: -1, col: 1 },
          { row: 1, col: -1 },
          { row: 1, col: 1 },
        ];
  }
}

function executeMove(fromRow, fromCol, toRow, toCol) {
  // Move the piece
  board[toRow][toCol] = board[fromRow][fromCol];
  board[fromRow][fromCol] = null;

  // Handle capture
  if (Math.abs(fromRow - toRow) === 2) {
    const middleRow = (fromRow + toRow) / 2;
    const middleCol = (fromCol + toCol) / 2;
    board[middleRow][middleCol] = null; // Remove the captured piece
  }

  // Check for and handle kinging
  kingPieces(toRow, toCol);

  // Switch players
  currentPlayer = currentPlayer === 1 ? 2 : 1;

  // Update the board and player display
  renderPieces();
  updatePlayerDisplay();
  clearHighlights(); // remove move highlights
}

function checkSimpleMove(row, col, dir) {
  const newRow = row + dir.row;
  const newCol = col + dir.col;
  if (inBoundry(newRow, newCol) && isEmpty(newRow, newCol)) {
    highlightSquare(newRow, newCol);
  }
}

//checking if position is witrhin the boards boundaries
function inBoundry(row, col) {
  let isInBoundry = row >= 0 && row < 8 && col >= 0 && col < 8;
  return isInBoundry;
}

//checking if squares are empty
function isEmpty(row, col) {
  return board[row][col] === null;
}

// check if square contains opponents piece
function isOpponent(row, col, currentPlayer) {
  if (currentPlayer === 1) {
    return board[row][col] === 2; // 2 is player 2
  } else {
    return board[row][col] === 1;
  }
}

function checkCapturingMove(row, col, dir) {
  // Move two squares in the direction to check for a capture move
  const captureRow = row + dir.row * 2;
  const captureCol = col + dir.col * 2;
  const opponentRow = row + dir.row;
  const opponentCol = col + dir.col;

  if (
    inBoundry(captureRow, captureCol) &&
    isEmpty(captureRow, captureCol) &&
    isOpponent(opponentRow, opponentCol, currentPlayer)
  ) {
    highlightSquare(captureRow, captureCol);
  }
}

function kingPieces(row, col) {
  // If a piece reaches the opposite end of the board, it becomes a king
  if (
    (currentPlayer === 1 && row === 7) ||
    (currentPlayer === 2 && row === 0)
  ) {
    board[row][col] = currentPlayer === 1 ? 3 : 4; // Assuming 3 and 4 represent kings for players 1 and 2, respectively
  }
}

// function to update display message to say its ...player ... 's turn
function updatePlayerDisplay() {
  playerDisplay.textContent = currentPlayer === 1 ? 'Player 1' : 'Player 2';
  // playerDisplay.style.color = PLAYER_COLORS[`player${currentPlayer}`];
}
