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
const blackSquares = document.querySelectorAll('.black');
const playerDisplay = document.getElementById('player');
const resetButton = document.getElementById('reset');
const squares = document.querySelectorAll('.square');

/*----- event listeners -----*/
resetButton.addEventListener('click', init);

// add even listeners to every square
function addSquareEventListener() {
  squares.forEach((square, index) => {
    square.addEventListener('click', function () {
      handleSquareClick(index);
    });
  });
}

/*----- functions -----*/

function init() {
  /* 
  to do:
  - reset board to initial state 
  - render pieces based on current state of board 
  - set player to player one 
  - add click event listeners to every square on the board 
  */
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

  // Directional movement check for non-king pieces
  if (piece === 1) {
    // Player 1's non-king piece
    if (toRow > fromRow) return false; // Cannot move downwards
  } else if (piece === 2) {
    // Player 2's non-king piece
    if (toRow < fromRow) return false; // Cannot move upwards
  }

  // For capture moves, check if the square is occupied by an opponent
  if (isCaptureMove) {
    const middleRow = (fromRow + toRow) / 2;
    const middleCol = (fromCol + toCol) / 2;
    if (!isOpponent(middleRow, middleCol, currentPlayer)) return false;
    // Additional check: ensure the capture move is exactly 2 squares away
    if (Math.abs(fromRow - toRow) !== 2) return false;
  } else {
    // Check if it's a simple move (not a capture)
    if (Math.abs(fromRow - toRow) > 1) return false; // Simple move can only be 1 square away
  }

  return true;
}

function highlightSelectedPiece(row, col, addHighlight) {
  //calculate the index of the square in the squares list based on its row and column
  // convert 2d position into 1d
  const index = row * 8 + col;
  //access the squre element using calculation
  const square = squares[index];
  //find piece within square
  const piece = square.querySelector('.piece');
  //check if piece exists or if square is empty
  if (piece) {
    // add hilight gets applied if there is a piece so if it isnt there no piece
    if (addHighlight) {
      piece.classList.add('selected-piece');
    } else {
      piece.classList.remove('selected-piece');
    }
  }
}

function highlightSquare(row, col, isMoveIndicator = false) {
  const index = row * 8 + col;
  const square = squares[index];
  if (isMoveIndicator) {
    const moveIndicator = document.createElement('div');
    moveIndicator.className = 'possible-move';
    square.appendChild(moveIndicator);
  } else {
    square.classList.add('highlighted');
  }
}

function clearHighlights() {
  squares.forEach((square) => {
    square.classList.remove('highlighted');
    const moveIndicators = square.querySelectorAll('.possible-move');
    moveIndicators.forEach((indicator) => square.removeChild(indicator));
  });
  // Remove selection highlight
  const selectedPieces = document.querySelectorAll('.selected-piece');
  selectedPieces.forEach((piece) => piece.classList.remove('selected-piece'));
}

function showPossibleMoves(row, col) {
  const piece = board[row][col];
  const directions = getMoveDirections(piece);

  clearHighlights(); // Clears previous highlights and move indicators

  directions.forEach((dir) => {
    checkSimpleMove(row, col, dir, true); // true = checking for a possible move
    checkCapturingMove(row, col, dir, true); // Same here
  });

  // Highlight the selected piece
  highlightSelectedPiece(row, col, true);
}

// getting move direction
function getMoveDirections(piece) {
  switch (piece) {
    case 1: // Normal piece for Player 1 (Moving Up)
      // Player 1's normal pieces move up on the board. The return value is an array of two objects,
      // each representing a direction in which the piece can move: diagonally left up and diagonally right up.
      return [
        { row: -1, col: -1 },
        { row: -1, col: 1 },
      ];
    case 2: // Normal piece for Player 2 (Moving Down)
      // Player 2's normal pieces move down. Similar to 1, but opposite.
      // The directions are diagonally left down and diagonally right down.
      return [
        { row: 1, col: -1 },
        { row: 1, col: 1 },
      ];
    case 3: // Kinged piece for Player 1 (Up and Down)
    case 4: // Kinged piece for Player 2 (Moving up and down)
      //King pieces move both up and a down so it has 4 possible moves
      return [
        { row: -1, col: -1 }, //left up
        { row: -1, col: 1 }, //right up
        { row: 1, col: -1 }, //left down
        { row: 1, col: 1 }, //right down
      ];
    default:
      return [];
  }
}

function handleSquareClick(index) {
  // Calculate the row of the clicked square by dividing the index by 8 (the width of the board)
  // and taking the floor of the result to get a whole number.
  const row = Math.floor(index / 8);
  // Calculate the column of the clicked square by getting the remainder of the index divided by 8,
  // which gives the column position within the row.
  const col = index % 8;
  // Retrieve the piece type (if any) at the clicked square's row and column from the board array.
  const piece = board[row][col];

  // Deselect if the same piece is clicked again
  if (
    selectedPiece.isSelected &&
    selectedPiece.row === row &&
    selectedPiece.col === col
  ) {
    clearHighlights();
    selectedPiece = { isSelected: false, row: null, col: null };
    return;
  }

  // If no piece is currently selected and the clicked square contains a piece that belongs to the current player,
  // select the piece. This involves setting the selectedPiece object and showing possible moves.
  if (
    (!selectedPiece.isSelected &&
      piece &&
      (piece === 1 || piece === 3) && // Check if the piece is player 1's (normal or kin
      currentPlayer === 1) ||
    ((piece === 2 || piece === 4) && currentPlayer === 2) // Or if the piece is player 2's (normal or king)
  ) {
    selectedPiece = { isSelected: true, row, col };
    showPossibleMoves(row, col); // Display legal moves for the selected piece
    return;
  }

  // If a piece is already selected and the player attempts to move it,
  // check if the attempted move is valid.
  if (selectedPiece.isSelected) {
    if (
      isValidMove(
        selectedPiece.row,
        selectedPiece.col,
        row,
        col,
        board[selectedPiece.row][selectedPiece.col], // Pass the type of the selected piece
        Math.abs(selectedPiece.row - row) === 2 // Check if the move is a capturing move by seeing if the row difference is 2 **
      )
    ) {
      // Execute the move if it's valid, clear highlights, and reset the selected piece.
      executeMove(selectedPiece.row, selectedPiece.col, row, col);
      // If the move is invalid, clear the current selection and highlights,
      // then check if another piece of the current player was clicked. If so, select it and show possible moves.
      clearHighlights();
      selectedPiece = { isSelected: false, row: null, col: null };
    } else {
      // Invalid move, so clear selection and highlights, allowing a new selection
      clearHighlights();
      selectedPiece = { isSelected: false, row: null, col: null };
      if (
        (piece && (piece === 1 || piece === 3) && currentPlayer === 1) ||
        ((piece === 2 || piece === 4) && currentPlayer === 2)
      ) {
        // If the clicked square has a piece belonging to the current player,
        // select this new piece and show its possible moves.
        selectedPiece = { isSelected: true, row, col };
        showPossibleMoves(row, col);
      }
    }
  }
}

function executeMove(fromRow, fromCol, toRow, toCol) {
  // Retrieve the piece from its original position on the board and store it in a variable.
  const movingPiece = board[fromRow][fromCol];
  // Place the piece at its new position on the board.
  board[toRow][toCol] = movingPiece;
  // Clear the piece's original position on the board.
  board[fromRow][fromCol] = null;

  // Handle capture
  if (Math.abs(fromRow - toRow) === 2) {
    // Calculate the row and column of the jumped piece by averaging the start and end positions.
    const middleRow = (fromRow + toRow) / 2;
    const middleCol = (fromCol + toCol) / 2;
    // Remove the captured piece
    board[middleRow][middleCol] = null;
  }

  // Check if a piece should be "kinged". If a player 1 piece reaches the far end (row 0), it becomes a king (represented by 3).
  if (movingPiece === 1 && toRow === 0) {
    board[toRow][toCol] = 3; // King the piece for Player 1
    // If a player 2 piece reaches the far end (row 7), it becomes a king (represented by 4).
  } else if (movingPiece === 2 && toRow === 7) {
    board[toRow][toCol] = 4; // King the piece for Player 2
  }

  renderPieces();

  // Check for win condition after the move
  if (!checkForWin()) {
    // Switch players only if there's no winner
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updatePlayerDisplay();
  }
}

function clearPieces() {
  // Loop over all squares and remove child nodes that are pieces
  squares.forEach((square) => {
    // For each square, check if it has a piece (which is the child) and remove it.
    while (square.firstChild) {
      square.removeChild(square.firstChild);
    }
  });
}

function checkSimpleMove(row, col, dir, showIndicator = false) {
  const newRow = row + dir.row;
  const newCol = col + dir.col;
  if (inBoundry(newRow, newCol) && isEmpty(newRow, newCol)) {
    if (showIndicator) {
      highlightSquare(newRow, newCol, true); // True for showing move indicator
    }
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
  const cell = board[row][col];
  if (currentPlayer === 1) {
    return cell === 2 || cell === 4; // 2 is player 2 & 4 is player 2 kinged
  } else {
    return cell === 1 || cell === 3;
  }
}

function checkCapturingMove(row, col, dir) {
  // Move two squares in the direction to check for a capture move (calc two squares away)
  const captureRow = row + dir.row * 2;
  const captureCol = col + dir.col * 2;
  const opponentRow = row + dir.row;
  const opponentCol = col + dir.col;
  /*
    in order to capture: 
  1. The position must be within the boundaries of the board - use inBoundry.
  2. The capture position must be empty use isEmpty.
  3. The square directly between the starting position and the capture position must contain
     an opponent's piece (duh).
*/
  if (
    inBoundry(captureRow, captureCol) &&
    isEmpty(captureRow, captureCol) &&
    isOpponent(opponentRow, opponentCol, currentPlayer)
  ) {
    if (showIndicator) {
      highlightSquare(captureRow, captureCol, true); // True for showing move indicator
    }
  }
}

function kingPieces(row, col) {
  // If a piece reaches the opposite end of the board, it becomes a king
  if (
    (currentPlayer === 1 && row === 7) ||
    (currentPlayer === 2 && row === 0)
  ) {
    board[row][col] = currentPlayer === 1 ? 3 : 4; // 3 and 4 represent kings for players 1 and 2, respectively
  }
}

function checkForWin() {
  let player1Pieces = 0;
  let player2Pieces = 0;

  // Loop through the board to count pieces for each player
  board.forEach((row) => {
    row.forEach((cell) => {
      if (cell === 1 || cell === 3) player1Pieces++; // Assuming 1 and 3 represent Player 1's pieces and kings
      if (cell === 2 || cell === 4) player2Pieces++; // Assuming 2 and 4 represent Player 2's pieces and kings
    });
  });

  // Check win conditions
  if (player1Pieces === 0) {
    updateWinDisplay(2); // Player 2 wins
    return true;
  } else if (player2Pieces === 0) {
    updateWinDisplay(1); // Player 1 wins
    return true;
  }
  return false; // No winner yet
}

function updateWinDisplay(winner) {
  playerDisplay.textContent = `Player ${winner} won! 🎉`; // Update display message
  resetButton.textContent = 'Play Again'; // Change reset button text
}

// function to update display message to say its ...player ... 's turn
function updatePlayerDisplay() {
  playerDisplay.textContent = `It's Player ${currentPlayer}'s Turn`;
}
