/*----- constants -----*/
const PLAYER_COLORS = {
  player1: '#f4f7fa',
  player2: '#34354e',
};

/*----- state variables -----*/
let board = [
  [null, 1, null, 1, null, 1, null, 1],
  [1, null, 1, null, 1, null, 1, null],
  [null, 1, null, 1, null, 1, null, 1],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [2, null, 2, null, 2, null, 2, null],
  [null, 2, null, 2, null, 2, null, 2],
  [2, null, 2, null, 2, null, 2, null],
];

// Switch players
let currentPlayer = 1;
let selectedPiece = { isSelected: false, row: null, col: null };

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
  squares.forEach((square, index) => {
    square.addEventListener('click', function () {
      handleSquareClick(index);
    });
  });
}

/*----- functions -----*/

function init() {
  resetBoard();
  renderPieces();
  currentPlayer = 1;
  updatePlayerDisplay();
  addSquareEventListener();
}

document.addEventListener('DOMContentLoaded', init);

function resetBoard() {
  board = [
    [null, 2, null, 2, null, 2, null, 2],
    [2, null, 2, null, 2, null, 2, null],
    [null, 2, null, 2, null, 2, null, 2],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [1, null, 1, null, 1, null, 1, null],
    [null, 1, null, 1, null, 1, null, 1],
    [1, null, 1, null, 1, null, 1, null],
  ];
}

function renderPieces() {
  squares.forEach((square) => {
    while (square.firstChild) square.removeChild(square.firstChild);
  });

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
            imageFile = 'images/light-piece.png'; // Ensure path is correct
            break;
          case 2:
            pieceType = 'dark';
            imageFile = 'images/dark-piece.png'; // Ensure path is correct
            break;
          case 3: // kinged
            pieceType = 'light king';
            imageFile = 'images/king-light.png'; // Ensure path is correct
            break;
          case 4: // kinged
            pieceType = 'dark king';
            imageFile = 'images/king-dark.png'; // Ensure path is correct
            break;
        }

        // Set the class of the piece element to include both 'piece' and its specific type ('light', 'dark', 'light king', 'dark king').
        pieceElement.className = `piece ${pieceType}`;
        pieceElement.innerHTML = `<img src="${imageFile}" alt="pieceType">`;
        //indicate player 1 or 2
        pieceElement.setAttribute('data-piece', cell);
        pieceElement.setAttribute('data-position', `${rowIdx},${cellIdx}`);
        //Append the piece element to the square, placing it visually on the board.
        square.appendChild(pieceElement);
      }
    });
  });
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

  clearHighlights(); // Correct function name

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

function handleSquareClick(index) {
  const row = Math.floor(index / 8);
  const col = index % 8;
  const piece = board[row][col];

  // Check if a piece is currently selected
  if (!selectedPiece.isSelected) {
    // If the clicked square contains the current player's piece, select it
    if (
      (piece === 1 && currentPlayer === 1) ||
      (piece === 2 && currentPlayer === 2)
    ) {
      selectedPiece = { isSelected: true, row, col };
      highlightSquare(row, col); // Optional: visually indicate the selected piece
    }
  } else {
    // If a piece is already selected, attempt to move it to the clicked square
    if (
      isValidMove(
        selectedPiece.row,
        selectedPiece.col,
        row,
        col,
        board[selectedPiece.row][selectedPiece.col],
        false
      )
    ) {
      executeMove(selectedPiece.row, selectedPiece.col, row, col);
      clearHighlights(); // Clear any highlights
    }
    selectedPiece = { isSelected: false, row: null, col: null }; // Reset selectedPiece
  }

  renderPieces(); // Re-render pieces to reflect any changes
  updatePlayerDisplay(); // Update the display to show whose turn it is
}

function executeMove(fromRow, fromCol, toRow, toCol) {
  // Move the piece in the board array
  const movingPiece = board[fromRow][fromCol];
  board[toRow][toCol] = movingPiece;
  board[fromRow][fromCol] = null;

  // Handle capture
  if (Math.abs(fromRow - toRow) === 2) {
    const middleRow = (fromRow + toRow) / 2;
    const middleCol = (fromCol + toCol) / 2;
    board[middleRow][middleCol] = null; // Remove the captured piece
  }

  // Check for and handle king-ing
  // For Player 1, check if a piece has reached the top row
  if (movingPiece === 1 && toRow === 0) {
    board[toRow][toCol] = 3; // King the piece for Player 1
  }
  // For Player 2, check if a piece has reached the bottom row
  if (movingPiece === 2 && toRow === 7) {
    board[toRow][toCol] = 4; // King the piece for Player 2
  }

  // Switch players
  currentPlayer = currentPlayer === 1 ? 2 : 1;

  // Update the board and player display
  updatePlayerDisplay();
  renderPieces();
}

function clearPieces() {
  // Iterate over all squares and remove child nodes that are pieces
  squares.forEach((square) => {
    while (square.firstChild) {
      square.removeChild(square.firstChild);
    }
  });
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
  playerDisplay.textContent = `Player ${currentPlayer}`;
}
