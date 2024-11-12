//toggle darkmode atau lightmode
function toggleTheme() {
    const body = document.body;
    const isDarkMode = body.classList.toggle("dark-mode");
    body.classList.toggle("light-mode", !isDarkMode);
  }
  
  window.onload = () => {
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.body.classList.add(prefersDarkMode ? "dark-mode" : "light-mode");
    document.getElementById("theme-toggle").checked = prefersDarkMode;
  };

  let currentPlayer = "X";
  let board = ["", "", "", "", "", "", "", "", ""];
  let gameActive = true;
  let mode = document.getElementById("mode").value;
  
  const statusDisplay = document.getElementById("status");
  const cells = document.querySelectorAll(".cell");
  
  // Update turn pemain
  function updateStatus() {
    statusDisplay.textContent = gameActive
      ? `Player ${currentPlayer}'s turn`
      : `Game over. ${statusDisplay.textContent}`;
  }
  
  // Check winning condition
  function checkWinner() {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
  
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        statusDisplay.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        return true;
      }
    }
    return false;
  }
  
  // Check draw condition
  function checkDraw() {
    if (!board.includes("")) {
      statusDisplay.textContent = "It's a draw!";
      gameActive = false;
      return true;
    }
    return false;
  }
  
  // Handling click pada cell tictactoe
  function cellClick(event) {
    const cell = event.target;
    const index = cell.getAttribute("data-index");
  
    // Lakukan kalau cell kosong
    if (board[index] || !gameActive) return;
  
    // Update status board dan content cell
    board[index] = currentPlayer;
  
    // Set image instead of text content
    if (currentPlayer === "X") {
      cell.innerHTML = "<img src='x.png' alt='X' width='80' height='80'>";
    } else {
      cell.innerHTML = "<img src='o.png' alt='O' width='80' height='80'>";
    }
  
    // Check menang atau draw
    if (checkWinner()) {
      updateStatus();
    } else if (checkDraw()) {
      updateStatus();
    } else {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      updateStatus();
  
      // kalau vs. bot, turn = o maka giliran bot bermain
      if (mode === "bot" && currentPlayer === "O" && gameActive) {
        setTimeout(botMove, 500);
      }
    }
  }
  
  // Bot logic
  function botMove() {
    let emptyCells = [];
    board.forEach((cell, index) => {
      if (cell === "") emptyCells.push(index);
    });
  
    // Memilih cell random
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[randomIndex] = "O";
    cells[randomIndex].innerHTML = "<img src='o.png' alt='O' width='80' height='80'>";
  
    // Check menang atau draw
    if (checkWinner()) {
      updateStatus();
    } else if (checkDraw()) {
      updateStatus();
    } else {
      currentPlayer = "X";
      updateStatus();
    }
  }
  
  // Game reset
  function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    mode = document.getElementById("mode").value; 
    cells.forEach(cell => (cell.innerHTML = "")); 
    updateStatus();
  }
  
  // Add event listeners to each cell
  cells.forEach(cell => cell.addEventListener("click", cellClick));
  updateStatus();
  
