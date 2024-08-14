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
    const row = Math.floor(index / 10);
  const col = index % 10;

  let bombCount = 0;

  // Check all 8 surrounding cells
  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      // Ensure the cell is within bounds and not the cell itself
      if (r >= 0 && r < 10 && c >= 0 && c < 10 && !(r === row && c === col)) {
        const neighborIndex = r * 10 + c;
        const neighborCell = document.getElementById(neighborIndex);
        if (neighborCell && neighborCell.classList.contains('bomb')) {
          bombCount++;
        }
      }
    }
  }

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

  createGrid();