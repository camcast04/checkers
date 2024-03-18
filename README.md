1. Define required constants:
   1.1) Define a PLAYER_COLORS object to associate 'player1' and 'player2' with their respective
   colors. Include 'null' for empty squares.
   1.2) Define a DIRECTION object to specify the move direction for each player, considering
   normal pieces and king pieces (e.g., player1 moves up, player2 moves down, but kings can move
   both ways).
   1.3) Define the BOARD_SIZE as 8 for an 8x8 board.
2. Define required variables used to track the state of the game:
   2.1) board: An 8x8 array representing the game board tracking each cell’s state each cell contains
   'null', track Curren players (‘player1', ‘player2’), —> potential ( 'player1King', ‘player2King’).
   2.2) currentPlayer: Tracks whose turn it is ('player1' or 'player2').
   2.3) selectedPiece: Holds the currently selected piece's position and type, if any.
   2.4) possibleMoves: An array of objects w/ the possible moves for th`e selected piece.
   Each object includes the destination cell and whether the move is a capture.
   // possibleMoves = [
   { toRow: 5, toCol: 2, capture: false },
   { toRow: 5, toCol: 4, capture: true, capturedPiece: {row: 4, col: 3} }
   ];
3. Store frequently accessed elements:
   3.1) Cache the board container element to append square elements to the DOM.
   3.2) Cache the game status message element to display messages about the game status.
4. initialize —>
   4.1) Initialize the state variables:
   • 4.1.1) Populate the board array with initial positions of 'player1' and 'player2' pieces,
   leaving the middle rows empty.
   • 4.1.2) Set currentPlayer to 'player1' to start the game.
   • 4.1.3) Set selectedPiece to null, as no piece is selected initially.
   • 4.1.4) Clear possibleMoves.
   4.2) Render the initial game state:
   • 4.2.1) For each cell in the board array, create a square element with appropriate classes
   for styling (player color, king status).
   • 4.2.2) Display the current player's turn in the game status message.
   4.3) Add an event listener to the board container for click events. Use event delegation to handle
   clicks on individual squares.
5. Handling clicks on squares:
   5.1) Determine the clicked square's row and column based on its position in the DOM.
   5.2) If the clicked square is occupied by the current player's piece:
   • 5.2.1) Update selectedPiece with the clicked piece's information.
   • 5.2.2) Calculate possibleMoves for the selected piece, considering both simple moves and
   captures.
   5.3) If a piece is selected and the clicked square is a valid destination (present in possibleMoves):
   • 5.3.1) Move the selected piece to the clicked square. This includes updating the board
   array and possibly removing a captured piece.
   • 5.3.2) Check if the move results in a piece being kinged and update the board
   accordingly.
   • 5.3.3) Switch currentPlayer.
   5.4) Render the updated game state to the page.
6. Handling the replay button click:
   6.1) Reset the game state:
   • 6.1.1) Reinitialize all state variables (board, currentPlayer, selectedPiece,
   possibleMoves).
   6.2) Rerender the board and update the game status message to reflect the reset state.
   7 / Additional Game Logic (Nice to haves / if I have time):
   ——-> forced captures, multi-jump moves, etc.
