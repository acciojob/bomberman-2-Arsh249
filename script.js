 const grid = document.getElementById('grid');
  const result = document.getElementById('result');
  const flagsLeft = document.getElementById('flagsLeft');
  let bombCount = 10;
  let flagsUsed = 0;
  let checkedCells = 0;

  // Create the grid and place bombs
  function createGrid() {
    for (let i = 0; i < 100; i++) {
      const cell = document.createElement('div');
      cell.id = i;
      cell.className = 'valid';
      cell.addEventListener('click', revealCell);
      cell.addEventListener('contextmenu', flagCell);
      grid.appendChild(cell);
    }
    placeBombs();
  }

  // Place bombs randomly
  function placeBombs() {
    let bombArray = Array(bombCount).fill('bomb');
    let emptyArray = Array(100 - bombCount).fill('valid');
    let gameArray = emptyArray.concat(bombArray).sort(() => Math.random() - 0.5);

    // Assign bombs and data attributes to cells
    gameArray.forEach((cellType, index) => {
      let cell = document.getElementById(index);
      cell.classList.add(cellType);
      let bombsAround = countBombs(index);
      cell.setAttribute('data', bombsAround);
    });
  }

  // Count bombs around a cell
  function countBombs(index) {
    // Logic to count bombs around the cell
    const width = 10; // Assuming a 10x10 grid
  const row = Math.floor(index / width);
  const col = index % width;
  let bombCount = 0;

  // Define surrounding positions
  const positions = [
    { row: row - 1, col: col - 1 }, // Northwest
    { row: row - 1, col: col },     // North
    { row: row - 1, col: col + 1 }, // Northeast
    { row: row, col: col - 1 },     // West
    { row: row, col: col + 1 },     // East
    { row: row + 1, col: col - 1 }, // Southwest
    { row: row + 1, col: col },     // South
    { row: row + 1, col: col + 1 }  // Southeast
  ];

  positions.forEach(pos => {
    // Check if position is within bounds
    if (pos.row >= 0 && pos.row < width && pos.col >= 0 && pos.col < width) {
      const neighborIndex = pos.row * width + pos.col;
      const neighborCell = document.getElementById(`${neighborIndex}`);
      if (neighborCell && neighborCell.classList.contains('bomb')) {
        bombCount++;
      }
    }
  });

  return bombCount;
  }

  // Reveal a cell on left-click
  function revealCell(e) {
    const cell = e.target;
    if (cell.classList.contains('flag')) return;

    cell.classList.add('checked');
    let bombsAround = cell.getAttribute('data');
    cell.textContent = bombsAround;

    if (cell.classList.contains('bomb')) {
      revealAllBombs();
      result.textContent = 'YOU LOSE!';
    } else {
      checkedCells++;
      checkWinCondition();
    }
  }

  // Flag or unflag a cell on right-click
  function flagCell(e) {
    e.preventDefault();
    const cell = e.target;
    if (!cell.classList.contains('checked') && flagsUsed < bombCount) {
      if (cell.classList.contains('flag')) {
        cell.classList.remove('flag');
        cell.textContent = '';
        flagsUsed--;
      } else {
        cell.classList.add('flag');
        cell.textContent = '🚩';
        flagsUsed++;
      }
      flagsLeft.textContent = bombCount - flagsUsed;
      checkWinCondition();
    }
  }

  // Check if the user has won
  function checkWinCondition() {
    if (flagsUsed === bombCount && checkedCells + bombCount === 100) {
      result.textContent = 'YOU WIN!';
    }
  }

  // Reveal all bombs at the end of the game
  function revealAllBombs() {
    document.querySelectorAll('.bomb').forEach(cell => {
      cell.classList.add('checked');
      cell.textContent = '💣';
    });
  }
function setCellDataAttributes() {
  const width = 10; // Assuming a 10x10 grid

  for (let i = 0; i < width * width; i++) {
    const cell = document.getElementById(`${i}`);
    if (cell) {
      const bombCount = countBombs(i);
      cell.setAttribute('data', bombCount);
    }
  }
}

// Call this function when initializing or resetting the game
setCellDataAttributes();

  createGrid();